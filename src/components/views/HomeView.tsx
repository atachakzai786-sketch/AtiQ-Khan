import { Playlist, Track } from '../../types';
import { Play, Sparkles, Flame, Clock, Radio, ShieldCheck } from 'lucide-react';

interface HomeViewProps {
  playlists: Playlist[];
  recentlyPlayed: Track[];
  onSelectPlaylist: (playlist: Playlist) => void;
  onPlayTrack: (track: Track) => void;
  isOfflineOnly: boolean;
}

export function HomeView({
  playlists,
  recentlyPlayed,
  onSelectPlaylist,
  onPlayTrack,
  isOfflineOnly,
}: HomeViewProps) {
  // Determine greeting based on current local time
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

  const dailyMixes = playlists.filter((p) => p.category === 'daily');
  const genreMoodPlaylists = playlists.filter((p) => p.category === 'genre_mood');
  const quickPlayItems = playlists.slice(0, 6);

  return (
    <div className="min-h-full pb-32 px-4 pt-5 select-none text-[#F5F5F5] space-y-7" id="home-view">
      {/* Offline Mode Banner if active */}
      {isOfflineOnly && (
        <div className="p-3 bg-[#1A1108] border border-[#FF6B35]/40 rounded-2xl flex items-center justify-between text-xs text-[#FFA07A]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#FF6B35]" />
            <span>Offline Mode active: Streaming disabled, cached music only</span>
          </div>
          <span className="font-mono text-[10px] bg-[#2A180E] px-2 py-0.5 rounded text-[#FF804D]">AES-256</span>
        </div>
      )}

      {/* Greeting Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#FF6B35] uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Aura Music Personalization</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F5F5F5]">
            {greeting}, Alex
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2.5 py-1 bg-[#FF6B35]/15 border border-[#FF6B35]/30 text-[#FF6B35] rounded-full flex items-center gap-1.5">
            <Radio className="w-3 h-3 animate-pulse text-[#FF6B35]" />
            Hi-Fi 192k
          </span>
        </div>
      </div>

      {/* Quick Play 6-Grid */}
      <div className="grid grid-cols-2 gap-2.5" id="quick-play-grid">
        {quickPlayItems.map((playlist) => (
          <button
            key={playlist.id}
            id={`quick-play-${playlist.id}`}
            onClick={() => onSelectPlaylist(playlist)}
            className="flex items-center gap-3 bg-[#0F0F0F] hover:bg-[#161616] p-2 rounded-xl border border-[#1F1F1F] transition duration-150 text-left group overflow-hidden"
          >
            <img
              src={playlist.coverArt}
              alt={playlist.title}
              className="w-12 h-12 rounded-lg object-cover flex-shrink-0 shadow"
            />
            <span className="text-xs font-semibold text-[#F5F5F5] truncate group-hover:text-[#FF804D] transition flex-1">
              {playlist.title}
            </span>
            <div className="w-7 h-7 rounded-full bg-[#FF6B35] opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition flex-shrink-0 mr-1 shadow-md shadow-[#FF6B35]/30">
              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
            </div>
          </button>
        ))}
      </div>

      {/* Section 1: Daily & Dynamic Mixes */}
      <div className="space-y-3" id="daily-mixes-section">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-[#F5F5F5] flex items-center gap-2">
              <span>Daily & Dynamic Mixes</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#FF6B35]/15 text-[#FF6B35] border border-[#FF6B35]/30">
                Tailored
              </span>
            </h2>
            <p className="text-xs text-[#A0A0A0]">Algorithmic soundscapes tuned to your daily routine</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {dailyMixes.map((playlist) => (
            <div
              key={playlist.id}
              id={`daily-mix-card-${playlist.id}`}
              onClick={() => onSelectPlaylist(playlist)}
              className="bg-[#0F0F0F] hover:bg-[#161616] p-3 rounded-2xl border border-[#1F1F1F] transition cursor-pointer group flex flex-col justify-between"
            >
              <div className="relative aspect-video rounded-xl overflow-hidden mb-2.5">
                <img
                  src={playlist.coverArt}
                  alt={playlist.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <span className="absolute top-2 left-2 text-[10px] font-bold bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-full text-[#E0E0E0]">
                  {playlist.tag}
                </span>
                <div className="absolute bottom-2 right-2 w-9 h-9 rounded-full bg-[#FF6B35] text-white flex items-center justify-center shadow-lg shadow-[#FF6B35]/40 opacity-0 group-hover:opacity-100 transition transform translate-y-2 group-hover:translate-y-0">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
              </div>

              <div>
                <h3 className="font-bold text-sm text-[#F5F5F5] group-hover:text-[#FF804D] transition">
                  {playlist.title}
                </h3>
                <p className="text-xs text-[#A0A0A0] line-clamp-2 mt-0.5">
                  {playlist.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Top Charts, Focus & Late Night */}
      <div className="space-y-3" id="genre-mood-section">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-[#F5F5F5] flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#FF6B35]" />
              <span>Top Charts & Mood Playlists</span>
            </h2>
            <p className="text-xs text-[#A0A0A0]">Global trending velocity and contextual focus soundscapes</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {genreMoodPlaylists.map((playlist) => (
            <div
              key={playlist.id}
              id={`genre-mood-card-${playlist.id}`}
              onClick={() => onSelectPlaylist(playlist)}
              className="bg-[#0F0F0F] hover:bg-[#161616] p-3 rounded-2xl border border-[#1F1F1F] transition cursor-pointer group"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden mb-2.5">
                <img
                  src={playlist.coverArt}
                  alt={playlist.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <span className="absolute top-2 left-2 text-[10px] font-bold bg-[#FF6B35]/20 border border-[#FF6B35]/35 text-[#FF6B35] px-2 py-0.5 rounded-full backdrop-blur-md">
                  {playlist.tag}
                </span>
                <div className="absolute bottom-2 right-2 w-9 h-9 rounded-full bg-[#FF6B35] text-white flex items-center justify-center shadow-lg shadow-[#FF6B35]/40 opacity-0 group-hover:opacity-100 transition">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
              </div>

              <h3 className="font-bold text-sm text-[#F5F5F5] group-hover:text-[#FF804D] transition">
                {playlist.title}
              </h3>
              <p className="text-xs text-[#A0A0A0] line-clamp-2 mt-0.5">
                {playlist.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Recently Played Tracks */}
      <div className="space-y-3" id="recently-played-section">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight text-[#F5F5F5] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#FF6B35]" />
            <span>Recently Played</span>
          </h2>
          <span className="text-xs text-[#A0A0A0]">Listening History</span>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 pr-4 scrollbar-none" id="recently-played-scroll">
          {recentlyPlayed.map((track) => (
            <div
              key={track.id}
              id={`recent-track-${track.id}`}
              onClick={() => onPlayTrack(track)}
              className="w-36 flex-shrink-0 bg-[#0F0F0F] hover:bg-[#161616] p-2.5 rounded-2xl border border-[#1F1F1F] transition cursor-pointer group"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden mb-2">
                <img
                  src={track.albumArt}
                  alt={track.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />
                <div className="absolute bottom-1.5 right-1.5 w-7 h-7 rounded-full bg-[#FF6B35] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow shadow-[#FF6B35]/30">
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                </div>
              </div>
              <p className="font-semibold text-xs text-[#F5F5F5] truncate group-hover:text-[#FF804D]">
                {track.title}
              </p>
              <p className="text-[11px] text-[#A0A0A0] truncate">{track.artist}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
