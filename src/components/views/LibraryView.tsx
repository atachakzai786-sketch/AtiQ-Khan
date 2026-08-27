import { useState } from 'react';
import { Playlist, Track, Artist } from '../../types';
import { ARTISTS_CATALOG } from '../../data/musicCatalog';
import { Plus, Heart, Download, ListMusic, User, ArrowDownToLine, Sparkles } from 'lucide-react';

interface LibraryViewProps {
  playlists: Playlist[];
  likedTracks: Track[];
  downloadedTracks: Track[];
  onSelectPlaylist: (playlist: Playlist) => void;
  onOpenCreatePlaylist: () => void;
  onSelectArtist: (artist: Artist) => void;
}

export function LibraryView({
  playlists,
  likedTracks,
  downloadedTracks,
  onSelectPlaylist,
  onOpenCreatePlaylist,
  onSelectArtist,
}: LibraryViewProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'playlists' | 'liked' | 'downloaded' | 'artists'>('all');

  const filterTabs = [
    { id: 'all' as const, label: 'All' },
    { id: 'playlists' as const, label: 'Playlists' },
    { id: 'liked' as const, label: 'Liked Songs' },
    { id: 'downloaded' as const, label: 'Downloaded' },
    { id: 'artists' as const, label: 'Artists' },
  ];

  const likedSongsPlaylist = playlists.find((p) => p.id === 'playlist-liked-songs');
  const downloadedPlaylist = playlists.find((p) => p.id === 'playlist-downloaded-music');

  return (
    <div className="min-h-full pb-32 px-4 pt-5 select-none text-[#F5F5F5] space-y-6" id="library-view">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F5F5F5]">
            Your Library
          </h1>
          <p className="text-xs text-[#A0A0A0] mt-0.5">
            Your curated collection, offline vault, and favorite creators
          </p>
        </div>

        <button
          id="library-create-playlist-btn"
          onClick={onOpenCreatePlaylist}
          className="p-2.5 rounded-full bg-[#FF6B35] hover:bg-[#FF804D] text-white transition active:scale-95 shadow-md shadow-[#FF6B35]/30"
          title="Create Playlist"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none" id="library-filter-chips">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            id={`library-filter-${tab.id}`}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition active:scale-95 flex-shrink-0 ${
              activeFilter === tab.id
                ? 'bg-[#FF6B35] text-white shadow-md shadow-[#FF6B35]/25'
                : 'bg-[#0F0F0F] hover:bg-[#161616] text-[#A0A0A0] hover:text-[#F5F5F5] border border-[#1F1F1F]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Liked Songs & Downloaded Highlight Cards (when All or Liked or Downloaded is active) */}
      {(activeFilter === 'all' || activeFilter === 'liked' || activeFilter === 'downloaded') && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="library-highlights-grid">
          {/* Liked Songs Card */}
          {(activeFilter === 'all' || activeFilter === 'liked') && (
            <div
              id="library-liked-songs-card"
              onClick={() => likedSongsPlaylist && onSelectPlaylist(likedSongsPlaylist)}
              className="p-4 rounded-2xl bg-gradient-to-br from-[#1C1210] to-[#120F0F] border border-[#FF6B35]/25 hover:border-[#FF6B35]/45 transition cursor-pointer group shadow-lg flex items-center justify-between"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-[#FF6B35] to-[#FF8A50] flex items-center justify-center text-white shadow-md shadow-[#FF6B35]/30 flex-shrink-0">
                  <Heart className="w-7 h-7 fill-white" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#F5F5F5] group-hover:text-[#FF804D] transition">
                    Liked Songs
                  </h3>
                  <p className="text-xs text-[#FFB499]/80">{likedTracks.length} auto-saved tracks</p>
                </div>
              </div>
              <Sparkles className="w-4 h-4 text-[#FF804D]" />
            </div>
          )}

          {/* Downloaded Music Card */}
          {(activeFilter === 'all' || activeFilter === 'downloaded') && (
            <div
              id="library-downloaded-card"
              onClick={() => downloadedPlaylist && onSelectPlaylist(downloadedPlaylist)}
              className="p-4 rounded-2xl bg-gradient-to-br from-[#0F1714] to-[#0D1211] border border-emerald-500/25 hover:border-emerald-500/45 transition cursor-pointer group shadow-lg flex items-center justify-between"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/30 flex-shrink-0">
                  <ArrowDownToLine className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#F5F5F5] group-hover:text-emerald-300 transition">
                    Downloaded Music
                  </h3>
                  <p className="text-xs text-emerald-200/70">
                    {downloadedTracks.length} offline tracks (AES-256)
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 bg-emerald-950/80 rounded-full border border-emerald-800/60">
                Offline
              </span>
            </div>
          )}
        </div>
      )}

      {/* Favorite Artists Section */}
      {(activeFilter === 'all' || activeFilter === 'artists') && (
        <div className="space-y-3" id="library-artists-section">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold tracking-tight text-[#F5F5F5] flex items-center gap-2">
              <User className="w-4 h-4 text-[#FF6B35]" />
              <span>Favorite Artists</span>
            </h2>
            <span className="text-xs text-[#A0A0A0]">{ARTISTS_CATALOG.length} following</span>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none" id="library-artists-scroll">
            {ARTISTS_CATALOG.map((artist) => (
              <div
                key={artist.id}
                id={`artist-item-${artist.id}`}
                onClick={() => onSelectArtist(artist)}
                className="flex flex-col items-center flex-shrink-0 cursor-pointer group w-24"
              >
                <img
                  src={artist.avatar}
                  alt={artist.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-[#1F1F1F] group-hover:border-[#FF6B35] transition duration-300 shadow-md"
                />
                <span className="text-xs font-semibold text-[#F5F5F5] group-hover:text-[#FF804D] truncate w-full text-center mt-2">
                  {artist.name}
                </span>
                <span className="text-[10px] text-[#737373]">
                  {(artist.monthlyListeners / 1000000).toFixed(1)}M listeners
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Playlists List */}
      {(activeFilter === 'all' || activeFilter === 'playlists') && (
        <div className="space-y-3" id="library-playlists-section">
          <h2 className="text-base font-bold tracking-tight text-[#F5F5F5] flex items-center gap-2">
            <ListMusic className="w-4 h-4 text-[#FF6B35]" />
            <span>All Playlists & Mixes</span>
          </h2>

          <div className="space-y-2">
            {playlists.map((playlist) => (
              <div
                key={playlist.id}
                id={`library-playlist-${playlist.id}`}
                onClick={() => onSelectPlaylist(playlist)}
                className="flex items-center justify-between p-3 rounded-2xl bg-[#0F0F0F] hover:bg-[#161616] border border-[#1F1F1F] transition cursor-pointer group"
              >
                <div className="flex items-center gap-3.5 overflow-hidden">
                  <img
                    src={playlist.coverArt}
                    alt={playlist.title}
                    className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="overflow-hidden">
                    <h4 className="font-semibold text-sm text-[#F5F5F5] group-hover:text-[#FF804D] truncate">
                      {playlist.title}
                    </h4>
                    <p className="text-xs text-[#A0A0A0] truncate">
                      {playlist.createdBy} · {playlist.tracks.length} tracks
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[#737373]">
                  {playlist.isPinned && (
                    <span className="text-[10px] bg-[#FF6B35]/15 border border-[#FF6B35]/30 text-[#FF6B35] px-2 py-0.5 rounded-full font-medium">
                      Pinned
                    </span>
                  )}
                  {playlist.id === 'playlist-downloaded-music' && (
                    <Download className="w-4 h-4 text-emerald-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
