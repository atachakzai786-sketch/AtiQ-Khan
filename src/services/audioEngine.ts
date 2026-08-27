import { Track, EqualizerBand } from '../types';

class SmartAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private currentTrack: Track | null = null;
  private currentTime: number = 0;
  private duration: number = 200;
  private timerId: number | null = null;
  private volume: number = 0.8;
  private masterGain: GainNode | null = null;
  private eqFilters: BiquadFilterNode[] = [];
  private currentOsc: OscillatorNode | null = null;
  private lfoNode: OscillatorNode | null = null;
  private lfoGain: GainNode | null = null;
  private chordOscs: OscillatorNode[] = [];
  private timeListeners: Set<(currentTime: number, duration: number) => void> = new Set();
  private stateListeners: Set<(isPlaying: boolean) => void> = new Set();
  private endListeners: Set<() => void> = new Set();

  public crossfadeDuration: number = 3; // in seconds
  public isVolumeNormalized: boolean = true;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

      // Create 5-band EQ
      // 60Hz (Lowshelf), 230Hz (Peaking), 910Hz (Peaking), 3600Hz (Peaking), 14000Hz (Highshelf)
      const freqs = [60, 230, 910, 3600, 14000];
      const types: BiquadFilterType[] = ['lowshelf', 'peaking', 'peaking', 'peaking', 'highshelf'];

      this.eqFilters = freqs.map((freq, idx) => {
        const filter = this.ctx!.createBiquadFilter();
        filter.type = types[idx];
        filter.frequency.setValueAtTime(freq, this.ctx!.currentTime);
        filter.gain.setValueAtTime(0, this.ctx!.currentTime);
        if (filter.type === 'peaking') {
          filter.Q.setValueAtTime(1.0, this.ctx!.currentTime);
        }
        return filter;
      });

      // Chain EQ filters: filter[0] -> filter[1] -> ... -> masterGain -> destination
      for (let i = 0; i < this.eqFilters.length - 1; i++) {
        this.eqFilters[i].connect(this.eqFilters[i + 1]);
      }
      this.eqFilters[this.eqFilters.length - 1].connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setTrack(track: Track, autoPlay: boolean = true) {
    if (this.isPlaying && this.currentTrack?.id !== track.id) {
      // Perform crossfade
      this.stopSynthesizer();
    }

    this.currentTrack = track;
    this.duration = track.duration;
    this.currentTime = 0;

    this.notifyTime();

    if (autoPlay) {
      this.play();
    }
  }

  public play() {
    this.initContext();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isPlaying = true;
    this.startSynthesizer();

    if (this.timerId !== null) {
      clearInterval(this.timerId);
    }

    this.timerId = window.setInterval(() => {
      this.currentTime += 0.2;
      if (this.currentTime >= this.duration) {
        this.handleTrackEnded();
      } else {
        this.notifyTime();
      }
    }, 200);

    this.notifyState();
  }

  public pause() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this.stopSynthesizer();
    this.notifyState();
  }

  public togglePlayPause() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  public seek(seconds: number) {
    this.currentTime = Math.max(0, Math.min(seconds, this.duration));
    this.notifyTime();

    // Modulate synth tone briefly on seek
    if (this.isPlaying && this.currentOsc && this.ctx) {
      const now = this.ctx.currentTime;
      const baseFreq = this.currentTrack?.synthPreset?.baseFreq || 220;
      this.currentOsc.frequency.setValueAtTime(baseFreq * 1.5, now);
      this.currentOsc.frequency.exponentialRampToValueAtTime(baseFreq, now + 0.3);
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public updateEqualizer(bands: EqualizerBand[]) {
    this.initContext();
    if (!this.ctx) return;

    bands.forEach((band, idx) => {
      if (this.eqFilters[idx]) {
        this.eqFilters[idx].gain.setValueAtTime(band.gain, this.ctx!.currentTime);
      }
    });
  }

  private startSynthesizer() {
    if (!this.ctx || !this.eqFilters[0]) return;
    this.stopSynthesizer();

    try {
      const now = this.ctx.currentTime;
      const preset = this.currentTrack?.synthPreset || { baseFreq: 220, type: 'triangle' as OscillatorType, tempo: 100 };

      // Gentle sub-bass / root oscillator
      this.currentOsc = this.ctx.createOscillator();
      this.currentOsc.type = preset.type;
      this.currentOsc.frequency.setValueAtTime(preset.baseFreq, now);

      // Subtle LFO vibrato
      this.lfoNode = this.ctx.createOscillator();
      this.lfoNode.frequency.setValueAtTime(3.5, now);
      this.lfoGain = this.ctx.createGain();
      this.lfoGain.gain.setValueAtTime(2.0, now);
      this.lfoNode.connect(this.lfoGain);
      this.lfoGain.connect(this.currentOsc.frequency);
      this.lfoNode.start(now);

      // Tone envelope gain node
      const toneGain = this.ctx.createGain();
      toneGain.gain.setValueAtTime(0.001, now);
      toneGain.gain.exponentialRampToValueAtTime(0.08, now + 0.4); // soft pleasant volume

      this.currentOsc.connect(toneGain);
      toneGain.connect(this.eqFilters[0]);
      this.currentOsc.start(now);

      // Chord harmonies (Major 3rd / Minor 3rd and 5th for melodic ambience)
      const chordOffsets = [1.25, 1.5, 2.0];
      this.chordOscs = chordOffsets.map((multiplier) => {
        const osc = this.ctx!.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(preset.baseFreq * multiplier, now);

        const chordGain = this.ctx!.createGain();
        chordGain.gain.setValueAtTime(0.001, now);
        chordGain.gain.exponentialRampToValueAtTime(0.03, now + 0.6);

        osc.connect(chordGain);
        chordGain.connect(this.eqFilters[0]);
        osc.start(now);
        return osc;
      });
    } catch {
      // Graceful fallback if audio context fails
    }
  }

  private stopSynthesizer() {
    try {
      if (this.currentOsc) {
        this.currentOsc.stop();
        this.currentOsc.disconnect();
        this.currentOsc = null;
      }
      if (this.lfoNode) {
        this.lfoNode.stop();
        this.lfoNode.disconnect();
        this.lfoNode = null;
      }
      this.chordOscs.forEach((osc) => {
        osc.stop();
        osc.disconnect();
      });
      this.chordOscs = [];
    } catch {
      // Ignored
    }
  }

  private handleTrackEnded() {
    this.currentTime = 0;
    this.endListeners.forEach((listener) => listener());
  }

  public onTimeUpdate(callback: (currentTime: number, duration: number) => void) {
    this.timeListeners.add(callback);
    return () => this.timeListeners.delete(callback);
  }

  public onStateChange(callback: (isPlaying: boolean) => void) {
    this.stateListeners.add(callback);
    return () => this.stateListeners.delete(callback);
  }

  public onTrackEnd(callback: () => void) {
    this.endListeners.add(callback);
    return () => this.endListeners.delete(callback);
  }

  private notifyTime() {
    this.timeListeners.forEach((listener) => listener(this.currentTime, this.duration));
  }

  private notifyState() {
    this.stateListeners.forEach((listener) => listener(this.isPlaying));
  }

  public getCurrentTime(): number {
    return this.currentTime;
  }

  public getDuration(): number {
    return this.duration;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const audioEngine = new SmartAudioEngine();
