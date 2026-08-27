import { Track } from '../types';
import { Play, Pause, SkipForward, Heart } from 'lucide-react';

interface MiniPlayerProps {
  track: Track;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onExpand: () => void;
  onTogglePlayPause: () => void;
  onNext: () => void;
  onToggleLike: (trackId: string) => void;
}

export function MiniPlayer({
  track,
  isPlaying,
  currentTime,
  duration,
  onExpand,
  onTogglePlayPause,
  onNext,
  onToggleLike,
}: MiniPlayerProps) {
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      id="mini-player-container"
      onClick={onExpand}
      className="mx-3 mb-2 p-2 rounded-2xl bg-[#0F0F0F]/95 hover:bg-[#161616] backdrop-blur-xl border border-[#222222] shadow-2xl flex items-center justify-between cursor-pointer group transition select-none relative overflow-hidden"
      style={{
        boxShadow: `0 8px 24px -6px ${track.dominantColor}44`,
      }}
    >
      {/* Dynamic top edge progress bar */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] bg-[#1F1F1F]"
      >
        <div
          className="h-full transition-all duration-200"
          style={{
            width: `${progressPercent}%`,
            backgroundColor: track.dominantColor || '#FF6B35',
          }}
        />
      </div>

      {/* Track Art & Info */}
      <div className="flex items-center gap-3 overflow-hidden flex-1 pr-2">
        <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
          <img
            src={track.albumArt}
            alt={track.title}
            className={`w-full h-full object-cover transition-transform duration-500 ${
              isPlaying ? 'scale-105' : 'scale-100'
            }`}
          />
          {isPlaying && (
            <div
              className="absolute inset-0 bg-black/30 flex items-center justify-center gap-0.5"
            >
              <span className="w-1 h-3 bg-[#FF6B35] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1 h-4 bg-[#FF6B35] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1 h-2 bg-[#FF6B35] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          )}
        </div>

        <div className="overflow-hidden">
          <p className="text-sm font-semibold text-[#F5F5F5] truncate group-hover:text-[#FF804D] transition">
            {track.title}
          </p>
          <p className="text-xs text-[#A0A0A0] truncate flex items-center gap-1.5 mt-0.5">
            <span>{track.artist}</span>
            {track.hiResAvailable && (
              <span className="text-[9px] font-mono text-[#FF6B35] font-bold px-1 py-0.2 bg-[#FF6B35]/15 border border-[#FF6B35]/30 rounded">
                HI-RES
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
        <button
          id="mini-player-like-btn"
          onClick={() => onToggleLike(track.id)}
          className="p-2 rounded-full hover:bg-white/5 transition active:scale-125"
          title="Like"
        >
          <Heart
            className={`w-4 h-4 ${
              track.isLiked ? 'fill-[#FF6B35] text-[#FF6B35]' : 'text-[#8E8E8E] hover:text-[#F5F5F5]'
            }`}
          />
        </button>

        <button
          id="mini-player-play-btn"
          onClick={onTogglePlayPause}
          className="p-2.5 rounded-full bg-[#F5F5F5] text-[#080808] hover:bg-white hover:scale-105 active:scale-95 transition shadow-lg"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 fill-current" />
          ) : (
            <Play className="w-4 h-4 fill-current ml-0.5" />
          )}
        </button>

        <button
          id="mini-player-next-btn"
          onClick={onNext}
          className="p-2 rounded-full text-[#8E8E8E] hover:text-[#F5F5F5] hover:bg-white/5 transition active:scale-95"
          title="Next"
        >
          <SkipForward className="w-4 h-4 fill-current" />
        </button>
      </div>
    </div>
  );
}
