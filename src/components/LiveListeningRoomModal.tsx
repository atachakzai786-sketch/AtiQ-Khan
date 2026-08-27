import { useState, FormEvent } from 'react';
import { Track, ListeningRoom } from '../types';
import { MOCK_LISTENING_ROOM } from '../data/musicCatalog';
import { X, Users, Send, Radio, Share2, Sparkles, Heart, Flame, Music, Smile } from 'lucide-react';

interface LiveListeningRoomModalProps {
  currentTrack: Track;
  isPlaying: boolean;
  onClose: () => void;
}

export function LiveListeningRoomModal({
  currentTrack,
  isPlaying,
  onClose,
}: LiveListeningRoomModalProps) {
  const [room, setRoom] = useState<ListeningRoom>(MOCK_LISTENING_ROOM);
  const [inputText, setInputText] = useState('');
  const [reactions, setReactions] = useState<Array<{ id: string; emoji: string; x: number }>>([]);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      userName: 'Alex Mercer (You)',
      text: inputText.trim(),
      timestamp: 'Just now',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    };

    setRoom((prev) => ({
      ...prev,
      messages: [...prev.messages, newMsg],
    }));
    setInputText('');
  };

  const triggerReaction = (emoji: string) => {
    const id = `react-${Date.now()}-${Math.random()}`;
    const x = 20 + Math.random() * 60; // percentage
    setReactions((prev) => [...prev, { id, emoji, x }]);

    setTimeout(() => {
      setReactions((prev) => prev.filter((r) => r.id !== id));
    }, 2000);
  };

  const handleShare = (platform: 'whatsapp' | 'instagram' | 'copy') => {
    const shareText = `Join my live listening room on Aura Music: "${room.name}" playing ${currentTrack.title}!`;
    if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
    } else {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(shareText);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-lg p-0 sm:p-4 select-none"
      id="live-listening-room-backdrop"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-lg bg-[#0F0F0F] border border-[#1F1F1F] rounded-t-3xl sm:rounded-3xl shadow-2xl text-[#F5F5F5] flex flex-col max-h-[85vh] sm:max-h-[80vh] overflow-hidden animate-in fade-in slide-in-from-bottom duration-200 relative"
        id="live-listening-room-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating reaction animations */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-40">
          {reactions.map((r) => (
            <div
              key={r.id}
              className="absolute bottom-24 text-3xl animate-bounce"
              style={{
                left: `${r.x}%`,
                animationDuration: '1.4s',
                animationFillMode: 'forwards',
              }}
            >
              {r.emoji}
            </div>
          ))}
        </div>

        {/* Room Header */}
        <div className="p-4 border-b border-[#1F1F1F] flex items-center justify-between bg-[#080808]/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF6B35]/20 border border-[#FF6B35]/30 flex items-center justify-center text-[#FF6B35]">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-[#F5F5F5]">{room.name}</h3>
                <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Live Sync
                </span>
              </div>
              <p className="text-xs text-[#A0A0A0]">
                Host: <span className="text-[#FF6B35] font-medium">{room.hostName}</span>
              </p>
            </div>
          </div>
          <button
            id="close-listening-room-btn"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#1A1A1A] text-[#A0A0A0] hover:text-[#F5F5F5] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active Track Banner in Room */}
        <div className="p-3 bg-[#080808]/50 border-b border-[#1F1F1F] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={currentTrack.albumArt}
              alt={currentTrack.title}
              className="w-11 h-11 rounded-lg object-cover border border-white/10 shadow-sm"
            />
            <div className="overflow-hidden">
              <div className="flex items-center gap-1.5 text-xs text-[#A0A0A0]">
                <Sparkles className="w-3.5 h-3.5 text-[#FF6B35]" />
                <span>Synchronized Audio Playback</span>
              </div>
              <p className="text-sm font-semibold text-[#F5F5F5] truncate">{currentTrack.title}</p>
              <p className="text-xs text-[#A0A0A0] truncate">{currentTrack.artist}</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-mono px-2 py-1 bg-[#FF6B35]/15 border border-[#FF6B35]/30 text-[#FF6B35] rounded-lg">
              {isPlaying ? '▶ In Sync' : '⏸ Paused'}
            </span>
          </div>
        </div>

        {/* Participants Row */}
        <div className="px-4 py-3 border-b border-[#1F1F1F] bg-[#0F0F0F]/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#A0A0A0] uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#A0A0A0]" />
              Listeners ({room.participants.length})
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleShare('whatsapp')}
                className="text-[11px] font-medium text-emerald-400 hover:underline flex items-center gap-1"
                title="Share on WhatsApp"
              >
                WhatsApp
              </button>
              <span className="text-[#333333]">·</span>
              <button
                onClick={() => handleShare('copy')}
                className="text-[11px] font-medium text-[#FF6B35] hover:underline flex items-center gap-1"
              >
                <Share2 className="w-3 h-3" />
                {copiedLink ? 'Copied Link!' : 'Invite Link'}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {room.participants.map((p) => (
              <div key={p.id} className="flex flex-col items-center flex-shrink-0" title={p.name}>
                <div className="relative">
                  <img
                    src={p.avatar}
                    alt={p.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-[#FF6B35]/60 shadow-md"
                  />
                  {p.isHost && (
                    <span className="absolute -bottom-1 -right-1 text-[9px] bg-[#FF6B35] text-[#080808] font-bold px-1 rounded-full border border-[#080808]">
                      HOST
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-[#A0A0A0] max-w-[50px] truncate mt-1">
                  {p.name.split(' ')[0]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Live Chat Log */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 min-h-[160px] bg-[#080808]/40" id="room-chat-box">
          {room.messages.map((m) => (
            <div key={m.id} className="flex items-start gap-2.5 text-xs">
              <img
                src={m.avatar}
                alt={m.userName}
                className="w-7 h-7 rounded-full object-cover flex-shrink-0 mt-0.5"
              />
              <div className="flex-1 bg-[#141414] p-2.5 rounded-2xl rounded-tl-none border border-[#1F1F1F]">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-[#F5F5F5]">{m.userName}</span>
                  <span className="text-[10px] text-[#737373] font-mono">{m.timestamp}</span>
                </div>
                <p className="text-[#D4D4D4] text-xs">{m.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Reactions Bar */}
        <div className="px-4 py-2 bg-[#080808]/70 border-t border-[#1F1F1F] flex items-center justify-around">
          <button
            onClick={() => triggerReaction('🔥')}
            className="p-2 rounded-xl hover:bg-[#1A1A1A] transition active:scale-125 flex items-center gap-1 text-sm"
          >
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-xs">Fire</span>
          </button>
          <button
            onClick={() => triggerReaction('❤️')}
            className="p-2 rounded-xl hover:bg-[#1A1A1A] transition active:scale-125 flex items-center gap-1 text-sm"
          >
            <Heart className="w-4 h-4 text-rose-400" />
            <span className="text-xs">Love</span>
          </button>
          <button
            onClick={() => triggerReaction('🎶')}
            className="p-2 rounded-xl hover:bg-[#1A1A1A] transition active:scale-125 flex items-center gap-1 text-sm"
          >
            <Music className="w-4 h-4 text-[#FF804D]" />
            <span className="text-xs">Vibe</span>
          </button>
          <button
            onClick={() => triggerReaction('✨')}
            className="p-2 rounded-xl hover:bg-[#1A1A1A] transition active:scale-125 flex items-center gap-1 text-sm"
          >
            <Smile className="w-4 h-4 text-amber-400" />
            <span className="text-xs">Joy</span>
          </button>
        </div>

        {/* Chat input form */}
        <form onSubmit={handleSendMessage} className="p-3 border-t border-[#1F1F1F] bg-[#0F0F0F] flex gap-2">
          <input
            type="text"
            placeholder="Send message to room..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-[#141414] border border-[#222222] rounded-xl text-sm focus:outline-none focus:border-[#FF6B35] text-[#F5F5F5] placeholder-[#737373]"
            id="room-chat-input"
          />
          <button
            type="submit"
            className="p-2.5 bg-[#FF6B35] hover:bg-[#FF804D] text-white rounded-xl transition active:scale-95 flex-shrink-0 shadow-md shadow-[#FF6B35]/25"
            id="room-chat-send-btn"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
