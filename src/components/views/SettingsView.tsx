import { useState } from 'react';
import { AudioSettings, EQPresetName } from '../../types';
import { EQ_PRESETS } from '../../data/musicCatalog';
import { audioEngine } from '../../services/audioEngine';
import {
  Sliders,
  Sparkles,
  Shield,
  Radio,
  Download,
  Trash2,
  Check,
  Zap,
} from 'lucide-react';

interface SettingsViewProps {
  settings: AudioSettings;
  onUpdateSettings: (newSettings: AudioSettings) => void;
  onClearCache: () => void;
}

export function SettingsView({
  settings,
  onUpdateSettings,
  onClearCache,
}: SettingsViewProps) {
  const [cacheClearedToast, setCacheClearedToast] = useState(false);

  const handleQualityChange = (quality: AudioSettings['streamingQuality']) => {
    onUpdateSettings({
      ...settings,
      streamingQuality: quality,
    });
  };

  const handleCrossfadeChange = (seconds: number) => {
    audioEngine.crossfadeDuration = seconds;
    onUpdateSettings({
      ...settings,
      crossfadeDuration: seconds,
    });
  };

  const handlePresetSelect = (presetName: EQPresetName) => {
    const gains = EQ_PRESETS[presetName] || [0, 0, 0, 0, 0];
    const newBands = settings.eqBands.map((band, idx) => ({
      ...band,
      gain: gains[idx],
    }));

    audioEngine.updateEqualizer(newBands);
    onUpdateSettings({
      ...settings,
      currentPreset: presetName,
      eqBands: newBands,
    });
  };

  const handleBandGainChange = (bandIndex: number, gain: number) => {
    const newBands = [...settings.eqBands];
    newBands[bandIndex] = { ...newBands[bandIndex], gain };

    audioEngine.updateEqualizer(newBands);
    onUpdateSettings({
      ...settings,
      currentPreset: 'Flat' as EQPresetName,
      eqBands: newBands,
    });
  };

  const handleToggleNormalization = () => {
    const nextVal = !settings.volumeNormalization;
    audioEngine.isVolumeNormalized = nextVal;
    onUpdateSettings({
      ...settings,
      volumeNormalization: nextVal,
    });
  };

  const handleToggleOfflineOnly = () => {
    onUpdateSettings({
      ...settings,
      offlineOnlyMode: !settings.offlineOnlyMode,
    });
  };

  const handleClearCacheClick = () => {
    onClearCache();
    setCacheClearedToast(true);
    setTimeout(() => setCacheClearedToast(false), 2500);
  };

  const streamingQualities: Array<AudioSettings['streamingQuality']> = [
    'Normal (96kbps)',
    'High (160kbps)',
    'Very High (320kbps)',
    'Hi-Res Lossless (24-bit/192kHz)',
  ];

  const presets: EQPresetName[] = [
    'Flat',
    'Bass Boost',
    'Electronic',
    'Acoustic',
    'Vocal',
    'Hip-Hop',
    'Deep Focus',
  ];

  return (
    <div className="min-h-full pb-32 px-4 pt-5 select-none text-[#F5F5F5] space-y-6" id="settings-view">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F5F5F5]">
          Settings & Audio Engine
        </h1>
        <p className="text-xs text-[#A0A0A0] mt-0.5">
          Configure high-fidelity streaming, DSP equalizer, and crossfade
        </p>
      </div>

      {/* Account / Plan Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#1E120D] to-[#141414] border border-[#FF6B35]/35 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#FF6B35]/20 border border-[#FF6B35]/40 flex items-center justify-center text-[#FF6B35]">
            <Sparkles className="w-6 h-6 text-[#FF804D] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-[#F5F5F5]">Alex Mercer</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-[#FF6B35]/20 text-[#FF6B35] border border-[#FF6B35]/40 rounded-full">
                HI-FI PRO
              </span>
            </div>
            <p className="text-xs text-[#A0A0A0] mt-0.5">Master FLAC & Dolby Atmos Enabled</p>
          </div>
        </div>
        <button
          id="manage-plan-btn"
          className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#F5F5F5] border border-white/10 transition"
        >
          Manage
        </button>
      </div>

      {/* 5-Band Smart Equalizer Section */}
      <div className="p-5 rounded-2xl bg-[#0F0F0F] border border-[#1F1F1F] space-y-4" id="equalizer-section">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#FF6B35]" />
            <div>
              <h2 className="font-bold text-sm text-[#F5F5F5]">5-Band Parametric Equalizer</h2>
              <p className="text-xs text-[#A0A0A0]">Custom DSP frequency response filter</p>
            </div>
          </div>
          <span className="text-xs font-semibold font-mono text-[#FF6B35] bg-[#FF6B35]/15 px-2.5 py-0.5 rounded border border-[#FF6B35]/30">
            {settings.currentPreset}
          </span>
        </div>

        {/* EQ Presets Bar */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none" id="eq-presets-row">
          {presets.map((p) => {
            const isSelected = settings.currentPreset === p;
            return (
              <button
                key={p}
                id={`eq-preset-${p.toLowerCase().replace(' ', '-')}`}
                onClick={() => handlePresetSelect(p)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition active:scale-95 flex-shrink-0 ${
                  isSelected
                    ? 'bg-[#FF6B35] text-white shadow-md shadow-[#FF6B35]/25'
                    : 'bg-[#161616] hover:bg-[#202020] text-[#A0A0A0] hover:text-[#F5F5F5] border border-[#222222]'
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>

        {/* 5 Band Sliders */}
        <div className="grid grid-cols-5 gap-2 pt-2 bg-[#080808] p-4 rounded-xl border border-[#1F1F1F]">
          {settings.eqBands.map((band, idx) => (
            <div key={band.frequency} className="flex flex-col items-center gap-2">
              <span className="text-[11px] font-mono text-[#A0A0A0]">
                {band.gain > 0 ? `+${band.gain}` : band.gain}dB
              </span>

              <div className="h-32 flex items-center justify-center py-2">
                <input
                  type="range"
                  min="-12"
                  max="12"
                  step="1"
                  value={band.gain}
                  onChange={(e) => handleBandGainChange(idx, parseInt(e.target.value, 10))}
                  className="accent-[#FF6B35] cursor-pointer -rotate-90 w-24 h-1.5 bg-[#1F1F1F] rounded"
                  id={`eq-slider-${band.label.replace(' ', '')}`}
                />
              </div>

              <span className="text-[11px] font-semibold text-[#F5F5F5] font-mono">
                {band.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Audio Playback Engine & Crossfade */}
      <div className="p-5 rounded-2xl bg-[#0F0F0F] border border-[#1F1F1F] space-y-4" id="audio-engine-section">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-[#FF6B35]" />
          <h2 className="font-bold text-sm text-[#F5F5F5]">Smart Audio Engine</h2>
        </div>

        {/* Crossfade duration slider (1-12s) */}
        <div className="space-y-2 bg-[#080808] p-3.5 rounded-xl border border-[#1F1F1F]">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-[#F5F5F5]">Audio Crossfade</span>
            <span className="font-mono text-[#FF6B35] font-bold">
              {settings.crossfadeDuration} seconds
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="12"
            step="1"
            value={settings.crossfadeDuration}
            onChange={(e) => handleCrossfadeChange(parseInt(e.target.value, 10))}
            className="w-full accent-[#FF6B35] h-1.5 bg-[#1F1F1F] rounded-lg cursor-pointer"
            id="crossfade-slider"
          />
          <p className="text-[11px] text-[#A0A0A0]">
            Smoothly overlaps the fading outro of the current song with the incoming track.
          </p>
        </div>

        {/* Dynamic Volume Normalization Toggle */}
        <div className="flex items-center justify-between p-3.5 bg-[#080808] rounded-xl border border-[#1F1F1F]">
          <div>
            <p className="text-xs font-semibold text-[#F5F5F5]">Dynamic Volume Normalization</p>
            <p className="text-[11px] text-[#A0A0A0]">Balances loudness levels across different albums (EBU R128 standard)</p>
          </div>
          <button
            id="toggle-normalization-btn"
            onClick={handleToggleNormalization}
            className={`w-11 h-6 rounded-full transition duration-200 relative p-0.5 ${
              settings.volumeNormalization ? 'bg-[#FF6B35]' : 'bg-[#222222]'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                settings.volumeNormalization ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Gapless Playback Toggle */}
        <div className="flex items-center justify-between p-3.5 bg-[#080808] rounded-xl border border-[#1F1F1F]">
          <div>
            <p className="text-xs font-semibold text-[#F5F5F5]">Gapless Playback</p>
            <p className="text-[11px] text-[#A0A0A0]">Seamless transition between continuous concert or live tracks</p>
          </div>
          <button
            id="toggle-gapless-btn"
            onClick={() => onUpdateSettings({ ...settings, gaplessPlayback: !settings.gaplessPlayback })}
            className={`w-11 h-6 rounded-full transition duration-200 relative p-0.5 ${
              settings.gaplessPlayback ? 'bg-[#FF6B35]' : 'bg-[#222222]'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                settings.gaplessPlayback ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Streaming & Download Quality */}
      <div className="p-5 rounded-2xl bg-[#0F0F0F] border border-[#1F1F1F] space-y-3" id="quality-settings-section">
        <div className="flex items-center gap-2">
          <Radio className="w-5 h-5 text-[#FF6B35]" />
          <h2 className="font-bold text-sm text-[#F5F5F5]">Streaming Audio Quality</h2>
        </div>

        <div className="space-y-1.5">
          {streamingQualities.map((q) => {
            const isSelected = settings.streamingQuality === q;
            return (
              <button
                key={q}
                id={`quality-option-${q.split(' ')[0].toLowerCase()}`}
                onClick={() => handleQualityChange(q)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border transition text-left ${
                  isSelected
                    ? 'bg-[#FF6B35]/15 border-[#FF6B35]/50 text-[#F5F5F5]'
                    : 'bg-[#080808] border-[#1F1F1F] text-[#A0A0A0] hover:bg-[#161616] hover:text-[#F5F5F5]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-semibold">{q}</span>
                  {q.includes('Hi-Res') && (
                    <span className="text-[9px] font-bold font-mono bg-[#FF6B35]/20 text-[#FF6B35] px-1.5 py-0.5 rounded border border-[#FF6B35]/40">
                      FLAC
                    </span>
                  )}
                </div>
                {isSelected && <Check className="w-4 h-4 text-[#FF6B35] stroke-[3]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Offline Mode & Storage Management */}
      <div className="p-5 rounded-2xl bg-[#0F0F0F] border border-[#1F1F1F] space-y-3" id="offline-settings-section">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-400" />
          <h2 className="font-bold text-sm text-[#F5F5F5]">Offline Mode & Cache Storage</h2>
        </div>

        {/* Offline Only Switch */}
        <div className="flex items-center justify-between p-3.5 bg-[#080808] rounded-xl border border-[#1F1F1F]">
          <div>
            <p className="text-xs font-semibold text-[#F5F5F5]">Offline Only Mode</p>
            <p className="text-[11px] text-[#A0A0A0]">Only play downloaded, AES-256 encrypted tracks</p>
          </div>
          <button
            id="toggle-offline-only-btn"
            onClick={handleToggleOfflineOnly}
            className={`w-11 h-6 rounded-full transition duration-200 relative p-0.5 ${
              settings.offlineOnlyMode ? 'bg-emerald-600' : 'bg-[#222222]'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                settings.offlineOnlyMode ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Cache Storage Stats */}
        <div className="p-3.5 bg-[#080808] rounded-xl border border-[#1F1F1F] space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-[#A0A0A0]">Offline Encrypted Storage</span>
            <span className="font-mono text-[#F5F5F5] font-bold">1.4 GB / 64 GB</span>
          </div>
          <div className="w-full bg-[#1F1F1F] h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full w-[12%]" />
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-[11px] text-[#737373]">Audio Cache & Indexed DB</span>
            <button
              id="clear-cache-btn"
              onClick={handleClearCacheClick}
              className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-semibold px-2.5 py-1 rounded-lg hover:bg-rose-950/40 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Cache</span>
            </button>
          </div>

          {cacheClearedToast && (
            <p className="text-xs text-emerald-400 font-semibold text-center pt-1 animate-in fade-in">
              ✓ Cache cleared successfully (1.4 GB freed)
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
