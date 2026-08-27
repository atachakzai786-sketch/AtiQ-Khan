import { useState, FormEvent } from 'react';
import { Track, Playlist } from '../types';
import { X, Plus, Check, ListMusic, CheckCircle2 } from 'lucide-react';

interface AddToPlaylistModalProps {
  track: Track;
  playlists: Playlist[];
  onToggleTrackInPlaylist: (playlistId: string, track: Track) => void;
  onCreatePlaylist: (title: string) => void;
  onClose: () => void;
}

export function AddToPlaylistModal({
  track,
  playlists,
  onToggleTrackInPlaylist,
  onCreatePlaylist,
  onClose,
}: AddToPlaylistModalProps) {
  const [newPlaylistTitle, setNewPlaylistTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleToggle = (playlist: Playlist) => {
    onToggleTrackInPlaylist(playlist.id, track);
    const exists = playlist.tracks.some((t) => t.id === track.id);
    const msg = exists
      ? `Removed from "${playlist.title}"`
      : `Added to "${playlist.title}"`;
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const handleCreateNew = (e: FormEvent) => {
    e.preventDefault();
    if (!newPlaylistTitle.trim()) return;
    onCreatePlaylist(newPlaylistTitle.trim());
    setToastMessage(`Created "${newPlaylistTitle}" and added track`);
    setNewPlaylistTitle('');
    setIsCreating(false);
    setTimeout(() => setToastMessage(null), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-md p-0 sm:p-4"
      id="add-to-playlist-modal-backdrop"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md bg-[#0F0F0F] border border-[#1F1F1F] rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl text-[#F5F5F5] overflow-hidden animate-in fade-in slide-in-from-bottom duration-200"
        id="add-to-playlist-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1F1F1F]">
          <div className="flex items-center gap-3">
            <img
              src={track.albumArt}
              alt={track.title}
              className="w-12 h-12 rounded-xl object-cover border border-white/10"
            />
            <div className="overflow-hidden">
              <h3 className="font-bold text-sm text-[#F5F5F5] truncate">{track.title}</h3>
              <p className="text-xs text-[#A0A0A0] truncate">{track.artist}</p>
            </div>
          </div>
          <button
            id="add-to-playlist-close-btn"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#1A1A1A] text-[#A0A0A0] hover:text-[#F5F5F5] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toast alert banner */}
        {toastMessage && (
          <div className="mt-3 p-2.5 bg-emerald-950/70 border border-emerald-800/60 rounded-xl flex items-center gap-2 text-xs font-semibold text-emerald-300 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Create New Playlist Toggle / Input */}
        <div className="mt-4">
          {!isCreating ? (
            <button
              id="show-create-playlist-btn"
              onClick={() => setIsCreating(true)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#FF6B35] hover:bg-[#FF804D] text-white font-semibold text-sm transition active:scale-98 shadow-md shadow-[#FF6B35]/25"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Create New Playlist</span>
            </button>
          ) : (
            <form onSubmit={handleCreateNew} className="flex gap-2">
              <input
                type="text"
                placeholder="Playlist name..."
                value={newPlaylistTitle}
                onChange={(e) => setNewPlaylistTitle(e.target.value)}
                autoFocus
                className="flex-1 px-4 py-2 bg-[#141414] border border-[#222222] rounded-xl text-sm focus:outline-none focus:border-[#FF6B35] text-[#F5F5F5] placeholder-[#737373]"
                id="new-playlist-title-input"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#FF6B35] hover:bg-[#FF804D] text-white rounded-xl text-sm font-semibold transition"
                id="save-new-playlist-btn"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-3 py-2 bg-[#1A1A1A] hover:bg-[#222222] text-[#A0A0A0] rounded-xl text-sm transition"
              >
                Cancel
              </button>
            </form>
          )}
        </div>

        {/* Playlists List */}
        <div className="mt-4 space-y-2 max-h-64 overflow-y-auto pr-1" id="playlists-list-container">
          <p className="text-xs font-semibold text-[#A0A0A0] uppercase tracking-wider px-1">
            Add To Existing Playlists
          </p>
          {playlists.map((playlist) => {
            const hasTrack = playlist.tracks.some((t) => t.id === track.id);
            return (
              <button
                key={playlist.id}
                id={`playlist-item-${playlist.id}`}
                onClick={() => handleToggle(playlist)}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-[#080808] hover:bg-[#141414] border border-[#1F1F1F] transition text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#161616] flex items-center justify-center text-[#A0A0A0] flex-shrink-0">
                    {playlist.coverArt ? (
                      <img
                        src={playlist.coverArt}
                        alt={playlist.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ListMusic className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#F5F5F5] group-hover:text-[#FF804D] truncate">
                      {playlist.title}
                    </p>
                    <p className="text-xs text-[#A0A0A0]">{playlist.tracks.length} tracks</p>
                  </div>
                </div>

                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center border transition ${
                    hasTrack
                      ? 'bg-[#FF6B35] border-[#FF6B35] text-[#080808]'
                      : 'border-[#333333] group-hover:border-[#555555]'
                  }`}
                >
                  {hasTrack && <Check className="w-4 h-4 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
