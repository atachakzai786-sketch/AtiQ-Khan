import { useState } from 'react';
import { Track, Playlist } from '../../types';
import { GENRES, MOOD_TAGS } from '../../data/musicCatalog';
import { Search, Mic, Flame, Play, Music, Sparkles, X } from 'lucide-react';

interface ExploreViewProps {
  tracks: Track[];
  playlists: Playlist[];
  onPlayTrack: (track: Track) => void;
  onSelectPlaylist: (playlist: Playlist) => void;
  onOpenVoiceSearch: () => void;
}

export function ExploreView({
  tracks,
  playlists,
  onPlayTrack,
  onSelectPlaylist,
  onOpenVoiceSearch,
}: ExploreViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  // Filter tracks and playlists based on query or mood tag
  const filteredTracks = tracks.filter((t) => {
    const matchesQuery =
      searchQuery.trim() === '' ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.album.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.genre.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesMood =
      !selectedMood ||
      t.genre.toLowerCase().includes(selectedMood.toLowerCase()) ||
      t.title.toLowerCase().includes(selectedMood.toLowerCase());

    return matchesQuery && matchesMood;
  });

  const filteredPlaylists = playlists.filter((p) => {
    if (!searchQuery.trim() && !selectedMood) return false;
    const q = (searchQuery || selectedMood || '').toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.tag && p.tag.toLowerCase().includes(q))
    );
  });

  const isSearching = searchQuery.trim().length > 0 || selectedMood !== null;

  return (
    <div className="min-h-full pb-32 px-4 pt-5 select-none text-[#F5F5F5] space-y-6" id="explore-view">
      {/* View Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F5F5F5]">
          Explore & Search
        </h1>
        <p className="text-xs text-[#A0A0A0] mt-0.5">
          Find your next obsession with voice search, genres, and mood collections
        </p>
      </div>

      {/* Interactive Search Bar & Voice Search Trigger */}
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1 flex items-center">
          <Search className="w-4 h-4 text-[#737373] absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            id="explore-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Songs, artists, genres, or albums..."
            className="w-full pl-10 pr-9 py-3 bg-[#0F0F0F] border border-[#1F1F1F] rounded-2xl text-sm focus:outline-none focus:border-[#FF6B35] text-[#F5F5F5] placeholder-[#737373] shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 p-1 rounded-full text-[#737373] hover:text-[#F5F5F5]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Voice Search Button */}
        <button
          id="explore-voice-search-btn"
          onClick={onOpenVoiceSearch}
          className="p-3 bg-[#FF6B35] hover:bg-[#FF804D] text-white rounded-2xl transition active:scale-95 shadow-md shadow-[#FF6B35]/30 flex-shrink-0"
          title="Voice Search"
        >
          <Mic className="w-5 h-5" />
        </button>
      </div>

      {/* Mood Tags Horizontal Scroller */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#A0A0A0] uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#FF6B35]" />
            Mood Filter
          </span>
          {selectedMood && (
            <button
              onClick={() => setSelectedMood(null)}
              className="text-xs text-[#FF6B35] hover:underline"
            >
              Clear mood
            </button>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none" id="mood-tags-container">
          {MOOD_TAGS.map((mood) => {
            const isSelected = selectedMood === mood;
            return (
              <button
                key={mood}
                id={`mood-tag-${mood.toLowerCase().replace(' ', '-')}`}
                onClick={() => setSelectedMood(isSelected ? null : mood)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition active:scale-95 flex-shrink-0 ${
                  isSelected
                    ? 'bg-[#FF6B35] text-white shadow-md shadow-[#FF6B35]/30'
                    : 'bg-[#0F0F0F] hover:bg-[#161616] text-[#A0A0A0] hover:text-[#F5F5F5] border border-[#1F1F1F]'
                }`}
              >
                {mood}
              </button>
            );
          })}
        </div>
      </div>

      {/* Live Search Results when active */}
      {isSearching && (
        <div className="space-y-4 pt-1" id="search-results-container">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#A0A0A0]">
            Search Matches ({filteredTracks.length} tracks, {filteredPlaylists.length} playlists)
          </h2>

          {filteredTracks.length === 0 && filteredPlaylists.length === 0 ? (
            <div className="p-8 text-center bg-[#0F0F0F] rounded-2xl border border-[#1F1F1F] text-[#A0A0A0]">
              <p className="text-sm font-medium">No results found for “{searchQuery || selectedMood}”</p>
              <p className="text-xs text-[#737373] mt-1">Try searching for synthwave, chill, or an artist name</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredTracks.map((track) => (
                <div
                  key={track.id}
                  id={`search-track-${track.id}`}
                  onClick={() => onPlayTrack(track)}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#0F0F0F] hover:bg-[#161616] border border-[#1F1F1F] transition cursor-pointer group"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <img
                      src={track.albumArt}
                      alt={track.title}
                      className="w-11 h-11 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="overflow-hidden">
                      <p className="text-sm font-semibold text-[#F5F5F5] truncate group-hover:text-[#FF804D]">
                        {track.title}
                      </p>
                      <p className="text-xs text-[#A0A0A0] truncate">
                        {track.artist} · {track.genre}
                      </p>
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-[#FF6B35] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow shadow-[#FF6B35]/30">
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  </div>
                </div>
              ))}

              {filteredPlaylists.map((pl) => (
                <div
                  key={pl.id}
                  onClick={() => onSelectPlaylist(pl)}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-[#0F0F0F] hover:bg-[#161616] border border-[#1F1F1F] transition cursor-pointer"
                >
                  <img src={pl.coverArt} alt={pl.title} className="w-11 h-11 rounded-xl object-cover" />
                  <div>
                    <p className="text-sm font-semibold text-[#F5F5F5]">{pl.title}</p>
                    <p className="text-xs text-[#FF6B35]">Playlist · {pl.tracks.length} tracks</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Genre Grid (shown by default) */}
      {!isSearching && (
        <>
          <div className="space-y-3" id="genre-grid-section">
            <h2 className="text-lg font-bold tracking-tight text-[#F5F5F5] flex items-center gap-2">
              <Music className="w-4 h-4 text-[#FF6B35]" />
              <span>Browse All Genres</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {GENRES.map((genre) => (
                <button
                  key={genre.name}
                  id={`genre-card-${genre.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  onClick={() => setSearchQuery(genre.name.split('&')[0].trim())}
                  className={`p-4 rounded-2xl bg-gradient-to-br ${genre.color} text-left transition transform hover:scale-[1.02] active:scale-98 shadow-lg min-h-[90px] flex flex-col justify-between overflow-hidden relative group`}
                >
                  <span className="font-bold text-sm sm:text-base text-white tracking-tight drop-shadow-md">
                    {genre.name}
                  </span>
                  <span className="text-xs text-white/80 font-medium">Explore &rarr;</span>
                </button>
              ))}
            </div>
          </div>

          {/* Trending Playlists carousel */}
          <div className="space-y-3 pt-2" id="trending-playlists-section">
            <h2 className="text-lg font-bold tracking-tight text-[#F5F5F5] flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#FF6B35]" />
              <span>Trending Worldwide</span>
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {playlists.slice(0, 4).map((pl) => (
                <div
                  key={pl.id}
                  id={`explore-trending-${pl.id}`}
                  onClick={() => onSelectPlaylist(pl)}
                  className="bg-[#0F0F0F] hover:bg-[#161616] p-3 rounded-2xl border border-[#1F1F1F] transition cursor-pointer group"
                >
                  <img
                    src={pl.coverArt}
                    alt={pl.title}
                    className="w-full aspect-square rounded-xl object-cover mb-2 group-hover:scale-105 transition"
                  />
                  <h4 className="font-semibold text-xs text-[#F5F5F5] truncate group-hover:text-[#FF804D]">
                    {pl.title}
                  </h4>
                  <p className="text-[11px] text-[#A0A0A0] truncate">{pl.tag || pl.createdBy}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
