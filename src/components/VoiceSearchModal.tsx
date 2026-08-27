import { useState, useEffect } from 'react';
import { Mic, X, Sparkles, Music2 } from 'lucide-react';
import { Track } from '../types';

interface VoiceSearchModalProps {
  onSelectTrack: (track: Track) => void;
  tracks: Track[];
  onClose: () => void;
}

export function VoiceSearchModal({
  onSelectTrack,
  tracks,
  onClose,
}: VoiceSearchModalProps) {
  const [transcript, setTranscript] = useState('Listening for song, artist, or vibe...');
  const [isListening, setIsListening] = useState(true);

  const sampleCommands = [
    'Play Midnight Reverie',
    'Play Lo-Fi Chill music',
    'Play Energy Booster',
    'Search Luna Solaris',
  ];

  useEffect(() => {
    // Simulate speech detection prompt cycle
    const timer = setTimeout(() => {
      setTranscript('“Play Midnight Reverie”');
      setIsListening(false);
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  const handleCommandClick = (cmd: string) => {
    setTranscript(`“${cmd}”`);
    setIsListening(false);

    setTimeout(() => {
      // Find matching track
      const found = tracks.find((t) =>
        cmd.toLowerCase().includes(t.title.toLowerCase()) ||
        cmd.toLowerCase().includes(t.artist.toLowerCase()) ||
        cmd.toLowerCase().includes(t.genre.toLowerCase())
      ) || tracks[0];

      onSelectTrack(found);
      onClose();
    }, 800);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 select-none"
      id="voice-search-modal"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-[#0F0F0F] border border-[#1F1F1F] rounded-3xl p-6 text-center text-[#F5F5F5] relative shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          id="voice-search-close-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#1A1A1A] text-[#A0A0A0] hover:text-[#F5F5F5]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mt-4 mb-8 relative flex items-center justify-center">
          {/* Pulsing frequency rings */}
          {isListening && (
            <>
              <span className="absolute w-28 h-28 rounded-full bg-[#FF6B35]/25 animate-ping" />
              <span className="absolute w-36 h-36 rounded-full bg-[#FF6B35]/15 animate-pulse" />
            </>
          )}

          <div className="relative z-10 w-20 h-20 rounded-full bg-gradient-to-tr from-[#FF6B35] to-[#E55A2B] flex items-center justify-center shadow-lg shadow-[#FF6B35]/30">
            <Mic className="w-9 h-9 text-white animate-pulse" />
          </div>
        </div>

        <h3 className="text-lg font-bold text-[#F5F5F5] mb-2">Voice Search Assistant</h3>
        <p className="text-sm font-mono text-[#FF804D] min-h-[40px] px-2">
          {transcript}
        </p>

        {/* Suggested Voice Prompts */}
        <div className="mt-6 pt-4 border-t border-[#1F1F1F] text-left">
          <p className="text-xs font-semibold text-[#A0A0A0] uppercase tracking-wider mb-2 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#FF6B35]" />
            Try saying:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {sampleCommands.map((cmd, i) => (
              <button
                key={i}
                onClick={() => handleCommandClick(cmd)}
                className="px-3 py-1.5 rounded-full bg-[#141414] hover:bg-[#1C1C1C] border border-[#222222] text-xs text-[#D4D4D4] transition active:scale-95 flex items-center gap-1"
              >
                <Music2 className="w-3 h-3 text-[#FF6B35]" />
                <span>{cmd}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
