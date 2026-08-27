import { useEffect, useRef } from 'react';
import { Track } from '../types';
import { ChevronDown, Music2, Share2 } from 'lucide-react';

interface SyncedLyricsViewProps {
  track: Track;
  currentTime: number;
  onSeek: (time: number) => void;
  onClose: () => void;
}

export function SyncedLyricsView({
  track,
  currentTime,
  onSeek,
  onClose,
}: SyncedLyricsViewProps) {
  const activeLineRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Find active line index
  let activeIndex = 0;
  for (let i = 0; i < track.lyrics.length; i++) {
    if (currentTime >= track.lyrics[i].time) {
      activeIndex = i;
    } else {
      break;
    }
  }

  // Smoothly scroll active line to center of container
  useEffect(() => {
    if (activeLineRef.current && containerRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeIndex]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-[#080808]/95 backdrop-blur-2xl text-[#F5F5F5] transition-all select-none"
      id="synced-lyrics-view"
      style={{
        backgroundImage: `radial-gradient(circle at 50% 15%, ${track.dominantColor}35 0%, transparent 65%)`,
      }}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#1F1F1F]">
        <button
          id="lyrics-close-btn"
          onClick={onClose}
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition active:scale-95 text-[#A0A0A0] hover:text-[#F5F5F5] border border-white/5"
          aria-label="Close Lyrics"
        >
          <ChevronDown className="w-6 h-6" />
        </button>

        <div className="text-center px-4 overflow-hidden">
          <div className="flex items-center justify-center gap-1.5 text-xs tracking-wider uppercase font-semibold text-[#A0A0A0]">
            <Music2 className="w-3.5 h-3.5" style={{ color: track.dominantColor }} />
            <span>Synced Lyrics Engine</span>
          </div>
          <h3 className="text-sm font-semibold truncate text-[#F5F5F5]">{track.title}</h3>
        </div>

        <button
          id="lyrics-share-btn"
          onClick={() => {
            if (navigator.clipboard) {
              const currentLyric = track.lyrics[activeIndex]?.text || track.title;
              navigator.clipboard.writeText(`"${currentLyric}" — ${track.title} by ${track.artist}`);
            }
          }}
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition active:scale-95 text-[#A0A0A0] hover:text-[#F5F5F5] border border-white/5"
          title="Share lyric quote"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      {/* Lyrics Scrollable Area */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-6 py-20 space-y-7 scroll-smooth text-center"
        id="lyrics-scroll-container"
      >
        {track.lyrics.map((line, idx) => {
          const isActive = idx === activeIndex;
          const isPassed = idx < activeIndex;

          return (
            <div
              key={idx}
              ref={isActive ? activeLineRef : null}
              id={`lyric-line-${idx}`}
              onClick={() => onSeek(line.time)}
              className={`cursor-pointer transition-all duration-300 px-4 py-2 rounded-xl group ${
                isActive
                  ? 'text-2xl sm:text-3xl font-bold tracking-tight'
                  : isPassed
                  ? 'text-lg sm:text-xl font-medium text-[#737373] hover:text-[#A0A0A0]'
                  : 'text-lg sm:text-xl font-medium text-[#525252] hover:text-[#737373]'
              }`}
              style={{
                color: isActive ? '#F5F5F5' : undefined,
                textShadow: isActive ? `0 0 24px ${track.dominantColor}` : 'none',
                transform: isActive ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              <p className="inline-block transition-transform duration-200">
                {line.text}
              </p>
              {isActive && (
                <div
                  className="h-1 w-12 mx-auto rounded-full mt-2 transition-all"
                  style={{ backgroundColor: track.dominantColor }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Footer hint */}
      <div className="p-4 border-t border-[#1F1F1F] bg-[#080808]/80 backdrop-blur text-center text-xs text-[#A0A0A0] flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: track.dominantColor }} />
        <span>Tap any line to jump audio directly to that moment</span>
      </div>
    </div>
  );
}
