import { useState } from 'react';

interface WaveformScrubberProps {
  waveformData: number[];
  currentTime: number;
  duration: number;
  dominantColor: string;
  onSeek: (time: number) => void;
}

export function WaveformScrubber({
  waveformData,
  currentTime,
  duration,
  dominantColor,
  onSeek,
}: WaveformScrubberProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressRatio = duration > 0 ? currentTime / duration : 0;
  const totalBars = waveformData.length || 40;
  const activeBarCount = Math.floor(progressRatio * totalBars);

  const handleBarClick = (idx: number) => {
    const targetRatio = (idx + 0.5) / totalBars;
    onSeek(targetRatio * duration);
  };

  return (
    <div className="w-full select-none" id="waveform-scrubber-container">
      {/* Waveform Bars Container */}
      <div 
        className="flex items-center justify-between gap-0.5 sm:gap-1 h-12 px-1 cursor-pointer group"
        id="waveform-bars"
      >
        {waveformData.map((amplitude, idx) => {
          const isPassed = idx <= activeBarCount;
          const isHovered = hoveredIdx !== null && idx <= hoveredIdx;
          const barHeight = Math.max(8, Math.round(amplitude * 44));

          return (
            <button
              key={idx}
              type="button"
              id={`waveform-bar-${idx}`}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              onClick={() => handleBarClick(idx)}
              className="flex-1 flex items-center justify-center h-full transition-all focus:outline-none"
              title={`Seek to ${formatTime((idx / totalBars) * duration)}`}
            >
              <div
                className="w-full rounded-full transition-all duration-100 group-hover:opacity-90"
                style={{
                  height: `${barHeight}px`,
                  backgroundColor: isPassed
                    ? dominantColor
                    : isHovered
                    ? 'rgba(255, 255, 255, 0.4)'
                    : 'rgba(255, 255, 255, 0.18)',
                  boxShadow: isPassed
                    ? `0 0 8px ${dominantColor}88`
                    : 'none',
                }}
              />
            </button>
          );
        })}
      </div>

      {/* Timestamp labels */}
      <div className="flex justify-between items-center text-xs font-mono text-[#A0A0A0] mt-1 px-1">
        <span>{formatTime(currentTime)}</span>
        <span className="text-[#737373]">-{formatTime(Math.max(0, duration - currentTime))}</span>
      </div>
    </div>
  );
}
