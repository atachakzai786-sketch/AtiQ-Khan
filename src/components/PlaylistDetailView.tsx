import { useState } from 'react';
import { Playlist, Track } from '../types';
import {
  ArrowLeft,
  Play,
  Shuffle,
  Download,
  CheckCircle2,
  Heart,
  MoreVertical,
  Clock,
  Sparkles,
} from 'lucide-react';

interface PlaylistDetailViewProps {
  playlist: Playlist;
  currentTrack: Track;
  isPlaying: boolean;
  onBack: () => void;
  onPlayTrack: (track: Track) => void;
  onPlayAll: (tracks: Track[], shuffle?: boolean) => void;
  onToggleLike: (trackId: string) => void;
  onToggleDownload: (trackId: string) => void;
  onOpenAddToPlaylist: (track: Track) => void;
}

export function PlaylistDetailView({
  playlist,
  currentTrack,
  isPlaying,
  onBack,
  onPlayTrack,
  onPlayAll,
  onToggleLike,
  onToggleDownload,
  onOpenAddToPlaylist,
}: PlaylistDetailViewProps) {
  const [downloadAllState, setDownloadAllState] = useState(false);

  const totalDuration = playlist.tracks.reduce((acc, t) => acc + t.duration, 0);
  const totalMinutes = Math.floor(totalDuration / 60);

  const handleDownloadAll = () => {
    setDownloadAllState(!downloadAllState);
    playlist.tracks.forEach((t) => {
      if (!t.isDownloaded && !downloadAllState) {
        onToggleDownload(t.id);
      }
    });
  };

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className="min-h-full pb-32 select-none text-[#F5F5F5] animate-in fade-in duration-150"
      id="playlist-detail-view"
    >
      {/* Top Header & Cover Backdrop */}
      <div className="relative pt-6 pb-8 px-5 bg-gradient-to-b from-[#1C120F]/70 via-[#0F0F0F] to-[#080808]">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between mb-6">
          <button
            id="playlist-back-btn"
            onClick={onBack}
            className="p-2.5 rounded-full bg-[#0F0F0F]/80 hover:bg-[#1A1A1A] text-[#F5F5F5] border border-[#1F1F1F] backdrop-blur-md transition active:scale-95"
            aria-label="Back to playlists"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <span className="text-xs font-semibold uppercase tracking-wider text-[#A0A0A0]">
            {playlist.tag || 'Curated Playlist'}
          </span>

          <div className="w-10" />
        </div>

        {/* Playlist Hero Info */}
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5">
          <img
            src={playlist.coverArt}
            alt={playlist.title}
            className="w-44 h-44 sm:w-52 sm:h-52 rounded-2xl object-cover shadow-2xl border border-white/10"
          />

          <div className="text-center sm:text-left space-y-2 flex-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FF6B35]/15 text-[#FF6B35] border border-[#FF6B35]/30">
              <Sparkles className="w-3 h-3" />
              {playlist.category.replace('_', ' ')}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F5F5F5]">
              {playlist.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#A0A0A0] line-clamp-2 max-w-md">
              {playlist.description}
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-[#737373] pt-1">
              <span>{playlist.createdBy}</span>
              <span>•</span>
              <span>{playlist.tracks.length} songs</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#FF6B35]" /> {totalMinutes} mins
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-[#1F1F1F] bg-[#080808]/60">
        <div className="flex items-center gap-3">
          <button
            id="playlist-play-all-btn"
            onClick={() => onPlayAll(playlist.tracks, false)}
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#FF6B35] hover:bg-[#FF804D] text-white font-bold text-sm shadow-lg shadow-[#FF6B35]/25 transition active:scale-95"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Play All</span>
          </button>

          <button
            id="playlist-shuffle-btn"
            onClick={() => onPlayAll(playlist.tracks, true)}
            className="p-3 rounded-full bg-[#141414] hover:bg-[#1C1C1C] border border-[#1F1F1F] text-[#F5F5F5] transition active:scale-95"
            title="Shuffle Play"
          >
            <Shuffle className="w-4 h-4" />
          </button>

          <button
            id="playlist-download-all-btn"
            onClick={handleDownloadAll}
            className={`p-3 rounded-full transition active:scale-95 ${
              downloadAllState
                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                : 'bg-[#141414] hover:bg-[#1C1C1C] border border-[#1F1F1F] text-[#A0A0A0] hover:text-[#F5F5F5]'
            }`}
            title="Download All for Offline Listening"
          >
            {downloadAllState ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <Download className="w-4 h-4" />
            )}
          </button>
        </div>

        <span className="text-xs text-[#737373] font-mono">
          FLAC 24-bit Lossless
        </span>
      </div>

      {/* Track List */}
      <div className="px-3 pt-2 divide-y divide-[#161616]" id="playlist-track-list">
        {playlist.tracks.map((track, idx) => {
          const isThisTrackPlaying = currentTrack.id === track.id && isPlaying;
          const isThisTrackActive = currentTrack.id === track.id;

          return (
            <div
              key={track.id}
              id={`playlist-track-row-${track.id}`}
              onClick={() => onPlayTrack(track)}
              className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition group ${
                isThisTrackActive
                  ? 'bg-[#1A1310] text-[#FF804D] border border-[#FF6B35]/25'
                  : 'hover:bg-[#0F0F0F] text-[#A0A0A0]'
              }`}
            >
              <div className="flex items-center gap-3.5 overflow-hidden flex-1 pr-2">
                <span className="w-5 text-center text-xs font-mono text-[#737373] group-hover:text-[#A0A0A0]">
                  {isThisTrackPlaying ? (
                    <span className="flex gap-0.5 justify-center items-end h-3">
                      <span className="w-0.5 h-3 bg-[#FF6B35] animate-bounce" />
                      <span className="w-0.5 h-2 bg-[#FF6B35] animate-bounce" style={{ animationDelay: '100ms' }} />
                      <span className="w-0.5 h-3.5 bg-[#FF6B35] animate-bounce" style={{ animationDelay: '200ms' }} />
                    </span>
                  ) : (
                    idx + 1
                  )}
                </span>

                <img
                  src={track.albumArt}
                  alt={track.title}
                  className="w-11 h-11 rounded-xl object-cover border border-white/10 flex-shrink-0"
                />

                <div className="overflow-hidden">
                  <p
                    className={`text-sm font-semibold truncate ${
                      isThisTrackActive ? 'text-[#FF804D]' : 'text-[#F5F5F5] group-hover:text-[#FF804D]'
                    }`}
                  >
                    {track.title}
                  </p>
                  <p className="text-xs text-[#737373] truncate flex items-center gap-1.5">
                    <span>{track.artist}</span>
                    {track.isDownloaded && (
                      <span className="text-[10px] text-emerald-400">● Offline</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Row Action buttons */}
              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => onToggleLike(track.id)}
                  className="p-2 rounded-full hover:bg-white/5 transition active:scale-125"
                  title="Like track"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      track.isLiked ? 'fill-[#FF6B35] text-[#FF6B35]' : 'text-[#737373] hover:text-[#F5F5F5]'
                    }`}
                  />
                </button>

                <span className="text-xs font-mono text-[#737373] w-10 text-right">
                  {formatDuration(track.duration)}
                </span>

                <button
                  onClick={() => onOpenAddToPlaylist(track)}
                  className="p-2 rounded-full hover:bg-white/5 text-[#737373] hover:text-[#F5F5F5] transition"
                  title="Track options"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
