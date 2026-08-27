import { useState, useEffect } from 'react';
import {
  Track,
  Playlist,
  Artist,
  NavigationTab,
  AudioSettings,
} from './types';
import {
  INITIAL_TRACKS,
  INITIAL_PLAYLISTS,
  DEFAULT_EQUALIZER_BANDS,
} from './data/musicCatalog';
import { audioEngine } from './services/audioEngine';

// Components
import { BottomNav } from './components/BottomNav';
import { MiniPlayer } from './components/MiniPlayer';
import { NowPlayingModal } from './components/NowPlayingModal';
import { SyncedLyricsView } from './components/SyncedLyricsView';
import { OutputSwitcherModal } from './components/OutputSwitcherModal';
import { AddToPlaylistModal } from './components/AddToPlaylistModal';
import { LiveListeningRoomModal } from './components/LiveListeningRoomModal';
import { PlaylistDetailView } from './components/PlaylistDetailView';
import { VoiceSearchModal } from './components/VoiceSearchModal';

// Views
import { HomeView } from './components/views/HomeView';
import { ExploreView } from './components/views/ExploreView';
import { LibraryView } from './components/views/LibraryView';
import { SettingsView } from './components/views/SettingsView';
import { ArchitectureBlueprintView } from './components/blueprint/ArchitectureBlueprintView';

// Icons
import {
  Smartphone,
  Maximize2,
  Minimize2,
  FileText,
  Music,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export default function App() {
  // Mode switcher: 'app' (interactive mobile experience) vs 'blueprint' (Senior PM & Engineer specs)
  const [appMode, setAppMode] = useState<'app' | 'blueprint'>('app');
  const [deviceFrame, setDeviceFrame] = useState(true);

  // Core Music State
  const [tracks, setTracks] = useState<Track[]>(INITIAL_TRACKS);
  const [playlists, setPlaylists] = useState<Playlist[]>(INITIAL_PLAYLISTS);
  const [currentTrack, setCurrentTrack] = useState<Track>(INITIAL_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(INITIAL_TRACKS[0].duration);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off');
  const [currentVolume, setCurrentVolume] = useState(0.85);

  // Navigation & Sub-screens
  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);

  // Modals
  const [showNowPlaying, setShowNowPlaying] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [showOutputSwitcher, setShowOutputSwitcher] = useState(false);
  const [showAddToPlaylistTrack, setShowAddToPlaylistTrack] = useState<Track | null>(null);
  const [showListeningRoom, setShowListeningRoom] = useState(false);
  const [showVoiceSearch, setShowVoiceSearch] = useState(false);

  // Audio Engine Settings
  const [audioSettings, setAudioSettings] = useState<AudioSettings>({
    streamingQuality: 'Hi-Res Lossless (24-bit/192kHz)',
    downloadQuality: 'Hi-Res Lossless (24-bit/192kHz)',
    crossfadeDuration: 3,
    gaplessPlayback: true,
    volumeNormalization: true,
    equalizerEnabled: true,
    currentPreset: 'Flat',
    eqBands: DEFAULT_EQUALIZER_BANDS,
    offlineOnlyMode: false,
    dataSaver: false,
  });

  // Audio Engine Event Subscriptions
  useEffect(() => {
    const unsubTime = audioEngine.onTimeUpdate((time, dur) => {
      setCurrentTime(time);
      setDuration(dur);
    });

    const unsubState = audioEngine.onStateChange((playing) => {
      setIsPlaying(playing);
    });

    const unsubEnd = audioEngine.onTrackEnd(() => {
      handleNextTrack();
    });

    return () => {
      unsubTime();
      unsubState();
      unsubEnd();
    };
  }, [currentTrack, isShuffle, repeatMode, tracks]);

  // Track playback handlers
  const handlePlayTrack = (track: Track) => {
    // If in offline mode, verify track is downloaded
    if (audioSettings.offlineOnlyMode && !track.isDownloaded) {
      alert('Offline Only Mode: This track is not downloaded for offline playback.');
      return;
    }
    setCurrentTrack(track);
    audioEngine.setTrack(track, true);
  };

  const handleTogglePlayPause = () => {
    audioEngine.togglePlayPause();
  };

  const handleSeek = (time: number) => {
    audioEngine.seek(time);
  };

  const handleNextTrack = () => {
    if (repeatMode === 'one') {
      audioEngine.seek(0);
      audioEngine.play();
      return;
    }

    const availableTracks = audioSettings.offlineOnlyMode
      ? tracks.filter((t) => t.isDownloaded)
      : tracks;

    if (availableTracks.length === 0) return;

    if (isShuffle) {
      const randomIdx = Math.floor(Math.random() * availableTracks.length);
      handlePlayTrack(availableTracks[randomIdx]);
    } else {
      const currentIdx = availableTracks.findIndex((t) => t.id === currentTrack.id);
      const nextIdx = (currentIdx + 1) % availableTracks.length;
      handlePlayTrack(availableTracks[nextIdx]);
    }
  };

  const handlePrevTrack = () => {
    if (currentTime > 3) {
      audioEngine.seek(0);
      return;
    }

    const availableTracks = audioSettings.offlineOnlyMode
      ? tracks.filter((t) => t.isDownloaded)
      : tracks;

    const currentIdx = availableTracks.findIndex((t) => t.id === currentTrack.id);
    const prevIdx = (currentIdx - 1 + availableTracks.length) % availableTracks.length;
    handlePlayTrack(availableTracks[prevIdx]);
  };

  const handleToggleLike = (trackId: string) => {
    setTracks((prev) =>
      prev.map((t) => {
        if (t.id === trackId) {
          const updated = { ...t, isLiked: !t.isLiked };
          if (currentTrack.id === trackId) {
            setCurrentTrack(updated);
          }
          return updated;
        }
        return t;
      })
    );

    // Sync with Liked Songs playlist
    setPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id === 'playlist-liked-songs') {
          const trackToToggle = tracks.find((t) => t.id === trackId);
          if (!trackToToggle) return pl;

          const exists = pl.tracks.some((t) => t.id === trackId);
          const newTracks = exists
            ? pl.tracks.filter((t) => t.id !== trackId)
            : [...pl.tracks, { ...trackToToggle, isLiked: true }];

          return { ...pl, tracks: newTracks };
        }
        return pl;
      })
    );
  };

  const handleToggleDownload = (trackId: string) => {
    setTracks((prev) =>
      prev.map((t) => {
        if (t.id === trackId) {
          const updated = { ...t, isDownloaded: !t.isDownloaded };
          if (currentTrack.id === trackId) {
            setCurrentTrack(updated);
          }
          return updated;
        }
        return t;
      })
    );

    // Sync with Downloaded Music playlist
    setPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id === 'playlist-downloaded-music') {
          const trackToToggle = tracks.find((t) => t.id === trackId);
          if (!trackToToggle) return pl;

          const exists = pl.tracks.some((t) => t.id === trackId);
          const newTracks = exists
            ? pl.tracks.filter((t) => t.id !== trackId)
            : [...pl.tracks, { ...trackToToggle, isDownloaded: true }];

          return { ...pl, tracks: newTracks };
        }
        return pl;
      })
    );
  };

  const handleToggleTrackInPlaylist = (playlistId: string, track: Track) => {
    setPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id === playlistId) {
          const exists = pl.tracks.some((t) => t.id === track.id);
          const newTracks = exists
            ? pl.tracks.filter((t) => t.id !== track.id)
            : [...pl.tracks, track];
          return { ...pl, tracks: newTracks };
        }
        return pl;
      })
    );
  };

  const handleCreatePlaylist = (title: string) => {
    const newPlaylist: Playlist = {
      id: `playlist-custom-${Date.now()}`,
      title,
      description: 'Custom user collection created on Aura Music',
      coverArt: currentTrack.albumArt,
      category: 'custom',
      createdBy: 'Alex Mercer',
      updatedAt: 'Just now',
      tracks: [currentTrack],
      isPublic: true,
    };
    setPlaylists((prev) => [newPlaylist, ...prev]);
  };

  const handlePlayAllFromPlaylist = (playlistTracks: Track[], shuffle: boolean = false) => {
    if (playlistTracks.length === 0) return;
    if (shuffle) {
      const randomIdx = Math.floor(Math.random() * playlistTracks.length);
      setIsShuffle(true);
      handlePlayTrack(playlistTracks[randomIdx]);
    } else {
      setIsShuffle(false);
      handlePlayTrack(playlistTracks[0]);
    }
  };

  const handleClearCache = () => {
    // Simulated offline cache clearing
    setTracks((prev) =>
      prev.map((t) => ({ ...t, isDownloaded: false }))
    );
    setPlaylists((prev) =>
      prev.map((pl) => (pl.id === 'playlist-downloaded-music' ? { ...pl, tracks: [] } : pl))
    );
  };

  const likedTracks = tracks.filter((t) => t.isLiked);
  const downloadedTracks = tracks.filter((t) => t.isDownloaded);

  return (
    <div
      className="min-h-screen bg-[#080808] text-[#F5F5F5] flex flex-col font-sans antialiased selection:bg-[#FF6B35] selection:text-white"
      id="app-root-container"
    >
      {/* Top Application Header / Blueprint Switcher */}
      <header
        className="w-full bg-[#0F0F0F]/90 backdrop-blur-md border-b border-[#1F1F1F] px-4 py-2.5 flex items-center justify-between z-30 flex-shrink-0"
        id="app-top-header"
      >
        {/* Brand & Platform Badge */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF6B35] via-[#FF804D] to-[#FFA07A] flex items-center justify-center text-white shadow-lg shadow-[#FF6B35]/25">
            <Music className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm tracking-tight text-[#F5F5F5]">Aura Stream</span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 bg-[#FF6B35]/15 border border-[#FF6B35]/30 text-[#FF6B35] rounded">
                v2.4
              </span>
            </div>
            <p className="text-[10px] text-[#A0A0A0] hidden sm:block">
              Modern High-Performance Audio Streaming Platform
            </p>
          </div>
        </div>

        {/* Center / Right Mode Switcher */}
        <div className="flex items-center gap-2">
          {/* Switcher: Mobile App vs Blueprint */}
          <div className="flex bg-[#080808] p-1 rounded-xl border border-[#1F1F1F] text-xs font-semibold">
            <button
              id="mode-switch-app-btn"
              onClick={() => setAppMode('app')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition active:scale-95 ${
                appMode === 'app'
                  ? 'bg-[#FF6B35] text-white shadow-md shadow-[#FF6B35]/20'
                  : 'text-[#A0A0A0] hover:text-[#F5F5F5]'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile App</span>
            </button>

            <button
              id="mode-switch-blueprint-btn"
              onClick={() => setAppMode('blueprint')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition active:scale-95 ${
                appMode === 'blueprint'
                  ? 'bg-[#FF6B35] text-white shadow-md shadow-[#FF6B35]/20'
                  : 'text-[#A0A0A0] hover:text-[#F5F5F5]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Architectural Blueprint</span>
            </button>
          </div>

          {/* Device Frame Toggle (in app mode) */}
          {appMode === 'app' && (
            <button
              id="toggle-device-frame-btn"
              onClick={() => setDeviceFrame(!deviceFrame)}
              className="p-2 rounded-xl bg-[#161616] hover:bg-[#222222] border border-[#1F1F1F] text-[#A0A0A0] hover:text-[#F5F5F5] transition hidden md:flex items-center justify-center"
              title={deviceFrame ? 'Expand to Fluid Layout' : 'Enclose in Mobile Frame'}
            >
              {deviceFrame ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex justify-center items-start overflow-y-auto bg-[#080808] relative">
        {/* VIEW 1: SENIOR PM & ARCHITECTURAL BLUEPRINT */}
        {appMode === 'blueprint' && (
          <div className="w-full max-w-5xl py-4">
            <ArchitectureBlueprintView />
          </div>
        )}

        {/* VIEW 2: INTERACTIVE MOBILE APPLICATION */}
        {appMode === 'app' && (
          <div
            className={`w-full transition-all duration-300 relative flex flex-col ${
              deviceFrame
                ? 'max-w-[430px] my-4 sm:my-6 rounded-[44px] border-[8px] border-[#161616] shadow-2xl overflow-hidden bg-[#080808] min-h-[820px] ring-1 ring-white/10'
                : 'max-w-3xl min-h-screen bg-[#080808]'
            }`}
            id="mobile-app-viewport"
            style={{
              boxShadow: deviceFrame ? `0 25px 60px -15px ${currentTrack.dominantColor}33` : 'none',
            }}
          >
            {/* Dynamic Ambient Glow Behind App */}
            <div
              className="absolute -top-40 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-[100px] pointer-events-none opacity-25 transition-all duration-700"
              style={{ backgroundColor: currentTrack.dominantColor }}
            />

            {/* Mobile Dynamic Island / Speaker Notch (when device frame is active) */}
            {deviceFrame && (
              <div className="w-full pt-3 pb-1 px-7 flex items-center justify-between select-none z-20 text-[11px] font-semibold text-[#A0A0A0]">
                <span>9:41</span>
                {/* Dynamic Island Pill */}
                <div
                  id="mobile-dynamic-island"
                  onClick={() => setShowNowPlaying(true)}
                  className="w-28 h-6 bg-[#000000] rounded-full flex items-center justify-between px-2.5 cursor-pointer hover:scale-105 transition border border-white/10 shadow-inner"
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: currentTrack.dominantColor || '#FF6B35' }} />
                  <span className="text-[9px] text-[#D0D0D0] font-mono truncate max-w-[50px]">
                    {currentTrack.title}
                  </span>
                  <Sparkles className="w-2.5 h-2.5 text-[#FF6B35] animate-pulse" />
                </div>
                <div className="flex items-center gap-1.5 text-[#A0A0A0]">
                  <span className="text-[10px]">5G</span>
                  <span className="text-[10px]">100%</span>
                </div>
              </div>
            )}

            {/* Mobile Content Screen */}
            <div className="flex-1 overflow-y-auto relative z-10 scrollbar-none" id="mobile-screen-scroll">
              {/* If Playlist is selected, show PlaylistDetailView */}
              {selectedPlaylist ? (
                <PlaylistDetailView
                  playlist={selectedPlaylist}
                  currentTrack={currentTrack}
                  isPlaying={isPlaying}
                  onBack={() => setSelectedPlaylist(null)}
                  onPlayTrack={handlePlayTrack}
                  onPlayAll={handlePlayAllFromPlaylist}
                  onToggleLike={handleToggleLike}
                  onToggleDownload={handleToggleDownload}
                  onOpenAddToPlaylist={(track) => setShowAddToPlaylistTrack(track)}
                />
              ) : (
                <>
                  {currentTab === 'home' && (
                    <HomeView
                      playlists={playlists}
                      recentlyPlayed={tracks}
                      onSelectPlaylist={(pl) => setSelectedPlaylist(pl)}
                      onPlayTrack={handlePlayTrack}
                      isOfflineOnly={audioSettings.offlineOnlyMode}
                    />
                  )}

                  {currentTab === 'explore' && (
                    <ExploreView
                      tracks={tracks}
                      playlists={playlists}
                      onPlayTrack={handlePlayTrack}
                      onSelectPlaylist={(pl) => setSelectedPlaylist(pl)}
                      onOpenVoiceSearch={() => setShowVoiceSearch(true)}
                    />
                  )}

                  {currentTab === 'library' && (
                    <LibraryView
                      playlists={playlists}
                      likedTracks={likedTracks}
                      downloadedTracks={downloadedTracks}
                      onSelectPlaylist={(pl) => setSelectedPlaylist(pl)}
                      onOpenCreatePlaylist={() => setShowAddToPlaylistTrack(currentTrack)}
                      onSelectArtist={(artist) => {
                        // Open artist's first track
                        if (artist.topTracks.length > 0) {
                          handlePlayTrack(artist.topTracks[0]);
                        }
                      }}
                    />
                  )}

                  {currentTab === 'settings' && (
                    <SettingsView
                      settings={audioSettings}
                      onUpdateSettings={(newSettings) => setAudioSettings(newSettings)}
                      onClearCache={handleClearCache}
                    />
                  )}
                </>
              )}
            </div>

            {/* Floating Mini Player (Docked right above bottom navigation) */}
            <div className="sticky bottom-0 z-20">
              <MiniPlayer
                track={currentTrack}
                isPlaying={isPlaying}
                currentTime={currentTime}
                duration={duration}
                onExpand={() => setShowNowPlaying(true)}
                onTogglePlayPause={handleTogglePlayPause}
                onNext={handleNextTrack}
                onToggleLike={handleToggleLike}
              />

              {/* Bottom Tab Bar */}
              <BottomNav
                currentTab={currentTab}
                onSelectTab={(tab) => {
                  setSelectedPlaylist(null);
                  setCurrentTab(tab);
                }}
              />
            </div>
          </div>
        )}
      </main>

      {/* FULLSCREEN NOW PLAYING MODAL */}
      {showNowPlaying && (
        <NowPlayingModal
          track={currentTrack}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          isShuffle={isShuffle}
          repeatMode={repeatMode}
          onTogglePlayPause={handleTogglePlayPause}
          onNext={handleNextTrack}
          onPrev={handlePrevTrack}
          onSeek={handleSeek}
          onToggleShuffle={() => setIsShuffle(!isShuffle)}
          onToggleRepeat={() => {
            const modes: Array<'off' | 'all' | 'one'> = ['off', 'all', 'one'];
            const nextIdx = (modes.indexOf(repeatMode) + 1) % modes.length;
            setRepeatMode(modes[nextIdx]);
          }}
          onToggleLike={handleToggleLike}
          onOpenLyrics={() => setShowLyrics(true)}
          onOpenOutputSwitcher={() => setShowOutputSwitcher(true)}
          onOpenAddToPlaylist={() => setShowAddToPlaylistTrack(currentTrack)}
          onOpenListeningRoom={() => setShowListeningRoom(true)}
          onClose={() => setShowNowPlaying(false)}
        />
      )}

      {/* SYNCED LYRICS FULLSCREEN VIEW */}
      {showLyrics && (
        <SyncedLyricsView
          track={currentTrack}
          currentTime={currentTime}
          onSeek={handleSeek}
          onClose={() => setShowLyrics(false)}
        />
      )}

      {/* AUDIO OUTPUT SWITCHER MODAL */}
      {showOutputSwitcher && (
        <OutputSwitcherModal
          onClose={() => setShowOutputSwitcher(false)}
          currentVolume={currentVolume}
          onVolumeChange={(vol) => {
            setCurrentVolume(vol);
            audioEngine.setVolume(vol);
          }}
        />
      )}

      {/* ADD TO PLAYLIST MODAL */}
      {showAddToPlaylistTrack && (
        <AddToPlaylistModal
          track={showAddToPlaylistTrack}
          playlists={playlists}
          onToggleTrackInPlaylist={handleToggleTrackInPlaylist}
          onCreatePlaylist={handleCreatePlaylist}
          onClose={() => setShowAddToPlaylistTrack(null)}
        />
      )}

      {/* LIVE LISTENING ROOM MODAL */}
      {showListeningRoom && (
        <LiveListeningRoomModal
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          onClose={() => setShowListeningRoom(false)}
        />
      )}

      {/* VOICE SEARCH MODAL */}
      {showVoiceSearch && (
        <VoiceSearchModal
          tracks={tracks}
          onSelectTrack={handlePlayTrack}
          onClose={() => setShowVoiceSearch(false)}
        />
      )}
    </div>
  );
}
