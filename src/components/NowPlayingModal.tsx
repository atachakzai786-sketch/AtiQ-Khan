import { useState } from 'react';
import { Track } from '../types';
import { WaveformScrubber } from './WaveformScrubber';
import {
  ChevronDown,
  Heart,
  Shuffle,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Repeat,
  Radio,
  Share2,
  ListPlus,
  Mic2,
  Speaker,
  Sparkles,
  CheckCircle,
} from 'lucide-react';

interface NowPlayingModalProps {
  track: Track;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isShuffle: boolean;
  repeatMode: 'off' | 'all' | 'one';
  onTogglePlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSeek: (time: number) => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  onToggleLike: (trackId: string) => void;
  onOpenLyrics: () => void;
  onOpenOutputSwitcher: () => void;
  onOpenAddToPlaylist: () => void;
  onOpenListeningRoom: () => void;
  onClose: () => void;
}

export function NowPlayingModal({
  track,
  isPlaying,
  currentTime,
  duration,
  isShuffle,
  repeatMode,
  onTogglePlayPause,
  onNext,
  onPrev,
  onSeek,
  onToggleShuffle,
  onToggleRepeat,
  onToggleLike,
  onOpenLyrics,
  onOpenOutputSwitcher,
  onOpenAddToPlaylist,
  onOpenListeningRoom,
  onClose,
}: NowPlayingModalProps) {
  const [likeToast, setLikeToast] = useState(false);

  const handleLike = () => {
    onToggleLike(track.id);
    if (!track.isLiked) {
      setLikeToast(true);
      setTimeout(() => setLikeToast(false), 2000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-40 flex flex-col justify-between text-[#F5F5F5] overflow-hidden select-none animate-in fade-in zoom-in-95 duration-200"
      id="now-playing-fullscreen-modal"
      style={{
        backgroundColor: '#080808',
        backgroundImage: `radial-gradient(circle at 50% 25%, ${track.dominantColor}44 0%, #080808 80%)`,
      }}
    >
      {/* Dynamic ambient backdrop light */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30 blur-3xl"
        style={{
          background: `radial-gradient(circle at 50% 30%, ${track.dominantColor}, transparent 70%)`,
        }}
      />

      {/* Top Navigation Bar */}
      <div className="relative z-10 flex items-center justify-between px-6 pt-5 pb-2">
        <button
          id="now-playing-collapse-btn"
          onClick={onClose}
          className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 active:scale-95 transition text-[#A0A0A0] hover:text-[#F5F5F5] border border-white/5"
          aria-label="Collapse player"
        >
          <ChevronDown className="w-6 h-6" />
        </button>

        <div className="text-center px-4 overflow-hidden">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[#A0A0A0] flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: track.dominantColor }} />
            Playing from Library
          </p>
          <p className="text-xs font-semibold text-[#F5F5F5] truncate">{track.album}</p>
        </div>

        <button
          id="now-playing-room-btn"
          onClick={onOpenListeningRoom}
          className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 active:scale-95 transition text-[#FF6B35] flex items-center gap-1 border border-[#FF6B35]/20"
          title="Open Live Listening Room"
        >
          <Radio className="w-5 h-5 animate-pulse" />
        </button>
      </div>

      {/* Center Artwork Stage */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 my-auto">
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 max-w-full aspect-square group">
          {/* Subtle glowing halo behind album art */}
          <div
            className="absolute -inset-2 rounded-3xl opacity-65 blur-2xl transition-all duration-700"
            style={{
              backgroundColor: track.dominantColor,
              transform: isPlaying ? 'scale(1.04)' : 'scale(0.95)',
            }}
          />

          {/* High-res album art with vinyl sheen */}
          <img
            src={track.albumArt}
            alt={track.title}
            className={`w-full h-full object-cover rounded-3xl shadow-2xl relative z-10 border border-white/10 transition-transform duration-700 ${
              isPlaying ? 'scale-100' : 'scale-95'
            }`}
          />

          {/* Hi-Res Lossless Floating Badge */}
          {track.hiResAvailable && (
            <div className="absolute top-3 left-3 z-20 px-2.5 py-1 bg-black/70 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-wider text-[#FF804D] shadow-md">
              <Sparkles className="w-3 h-3 text-[#FF6B35]" />
              <span>HI-RES 24-BIT / 192KHZ</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Control Deck */}
      <div className="relative z-10 px-6 pb-8 pt-2 space-y-4 max-w-lg mx-auto w-full">
        {/* Track Title, Artist, & Actions */}
        <div className="flex items-center justify-between">
          <div className="overflow-hidden pr-3">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F5F5F5] truncate">
              {track.title}
            </h2>
            <p className="text-sm sm:text-base font-medium text-[#A0A0A0] truncate mt-0.5">
              {track.artist}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="now-playing-add-playlist-btn"
              onClick={onOpenAddToPlaylist}
              className="p-2.5 rounded-full hover:bg-white/10 text-[#A0A0A0] hover:text-[#F5F5F5] transition active:scale-95"
              title="Add to Playlist"
            >
              <ListPlus className="w-5 h-5" />
            </button>

            <button
              id="now-playing-like-btn"
              onClick={handleLike}
              className="p-2.5 rounded-full hover:bg-white/10 transition active:scale-125"
              title={track.isLiked ? 'Unlike' : 'Like'}
            >
              <Heart
                className={`w-6 h-6 transition-colors ${
                  track.isLiked
                    ? 'fill-[#FF6B35] text-[#FF6B35]'
                    : 'text-[#737373] hover:text-[#F5F5F5]'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Like confirmation pill */}
        {likeToast && (
          <div className="flex items-center justify-center gap-1.5 py-1 text-xs font-semibold text-[#FF804D] bg-[#FF6B35]/15 rounded-full border border-[#FF6B35]/30 animate-in fade-in duration-150">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Saved to Liked Songs</span>
          </div>
        )}

        {/* Interactive Waveform Progress Bar */}
        <WaveformScrubber
          waveformData={track.waveformData}
          currentTime={currentTime}
          duration={duration}
          dominantColor={track.dominantColor}
          onSeek={onSeek}
        />

        {/* Primary Playback Transport Controls */}
        <div className="flex items-center justify-between px-2 pt-1">
          {/* Shuffle Toggle */}
          <button
            id="now-playing-shuffle-btn"
            onClick={onToggleShuffle}
            className={`p-2.5 rounded-full transition active:scale-95 ${
              isShuffle ? 'text-[#FF6B35]' : 'text-[#737373] hover:text-[#A0A0A0]'
            }`}
            title={`Shuffle: ${isShuffle ? 'On' : 'Off'}`}
          >
            <Shuffle className="w-5 h-5" />
          </button>

          {/* Previous Track */}
          <button
            id="now-playing-prev-btn"
            onClick={onPrev}
            className="p-3 rounded-full text-[#F5F5F5] hover:bg-white/10 transition active:scale-95"
            title="Previous Track"
          >
            <SkipBack className="w-7 h-7 fill-current" />
          </button>

          {/* Play / Pause Main Spring Button */}
          <button
            id="now-playing-play-pause-btn"
            onClick={onTogglePlayPause}
            className="w-16 h-16 rounded-full flex items-center justify-center text-[#080808] shadow-xl hover:scale-105 active:scale-95 transition duration-150 bg-[#F5F5F5]"
            style={{
              boxShadow: `0 0 32px ${track.dominantColor}66`,
            }}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 fill-current text-[#080808]" />
            ) : (
              <Play className="w-8 h-8 fill-current text-[#080808] ml-1" />
            )}
          </button>

          {/* Next Track */}
          <button
            id="now-playing-next-btn"
            onClick={onNext}
            className="p-3 rounded-full text-[#F5F5F5] hover:bg-white/10 transition active:scale-95"
            title="Next Track"
          >
            <SkipForward className="w-7 h-7 fill-current" />
          </button>

          {/* Repeat Mode */}
          <button
            id="now-playing-repeat-btn"
            onClick={onToggleRepeat}
            className={`p-2.5 rounded-full transition active:scale-95 relative ${
              repeatMode !== 'off' ? 'text-[#FF6B35]' : 'text-[#737373] hover:text-[#A0A0A0]'
            }`}
            title={`Repeat: ${repeatMode}`}
          >
            <Repeat className="w-5 h-5" />
            {repeatMode === 'one' && (
              <span className="absolute top-1 right-1 text-[9px] font-bold bg-[#FF6B35] text-[#080808] rounded-full w-3.5 h-3.5 flex items-center justify-center">
                1
              </span>
            )}
          </button>
        </div>

        {/* Bottom Utility Bar: Audio Output & Synced Lyrics */}
        <div className="flex items-center justify-between pt-2 px-1 text-xs text-[#A0A0A0]">
          <button
            id="now-playing-output-btn"
            onClick={onOpenOutputSwitcher}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 transition active:scale-95 text-[#F5F5F5] border border-white/10"
          >
            <Speaker className="w-4 h-4 text-[#FF6B35]" />
            <span>AirPlay / Bluetooth</span>
          </button>

          <button
            id="now-playing-lyrics-btn"
            onClick={onOpenLyrics}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 transition active:scale-95 text-[#F5F5F5] border border-white/10"
          >
            <Mic2 className="w-4 h-4 text-emerald-400" />
            <span>Live Lyrics</span>
          </button>
        </div>
      </div>
    </div>
  );
}
