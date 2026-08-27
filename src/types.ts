export type NavigationTab = 'home' | 'explore' | 'library' | 'settings';

export interface LyricLine {
  time: number; // in seconds
  text: string;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  album: string;
  albumArt: string;
  duration: number; // in seconds
  audioUrl?: string;
  genre: string;
  bpm: number;
  dominantColor: string; // hex or rgb for dynamic theming
  accentColor: string;
  lyrics: LyricLine[];
  waveformData: number[]; // 40-50 normalized amplitude points [0..1]
  isLiked?: boolean;
  isDownloaded?: boolean;
  plays: number;
  releaseYear: number;
  hiResAvailable?: boolean;
  synthPreset?: {
    baseFreq: number;
    type: OscillatorType;
    tempo: number;
  };
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  coverArt: string;
  category: 'daily' | 'genre_mood' | 'user_utility' | 'custom';
  tag?: string;
  tracks: Track[];
  isPinned?: boolean;
  isPublic?: boolean;
  createdBy: string;
  updatedAt: string;
}

export interface Artist {
  id: string;
  name: string;
  avatar: string;
  banner: string;
  monthlyListeners: number;
  bio: string;
  topTracks: Track[];
  genres: string[];
}

export interface EqualizerBand {
  frequency: number; // Hz (60, 230, 910, 3600, 14000)
  label: string;
  gain: number; // -12dB to +12dB
}

export type EQPresetName = 'Flat' | 'Bass Boost' | 'Electronic' | 'Acoustic' | 'Vocal' | 'Hip-Hop' | 'Deep Focus';

export interface AudioSettings {
  streamingQuality: 'Normal (96kbps)' | 'High (160kbps)' | 'Very High (320kbps)' | 'Hi-Res Lossless (24-bit/192kHz)';
  downloadQuality: 'High (160kbps)' | 'Hi-Res Lossless (24-bit/192kHz)';
  crossfadeDuration: number; // 1 to 12 seconds
  gaplessPlayback: boolean;
  volumeNormalization: boolean;
  equalizerEnabled: boolean;
  currentPreset: EQPresetName;
  eqBands: EqualizerBand[];
  offlineOnlyMode: boolean;
  dataSaver: boolean;
}

export interface OutputDevice {
  id: string;
  name: string;
  type: 'local' | 'bluetooth' | 'airplay' | 'cast';
  iconName: string;
  batteryLevel?: number;
  isActive: boolean;
  details?: string;
}

export interface ListeningRoomParticipant {
  id: string;
  name: string;
  avatar: string;
  isHost?: boolean;
  isSynced: boolean;
}

export interface ListeningRoomMessage {
  id: string;
  userName: string;
  text: string;
  timestamp: string;
  avatar: string;
}

export interface ListeningRoom {
  id: string;
  name: string;
  hostName: string;
  currentTrackId: string;
  participants: ListeningRoomParticipant[];
  messages: ListeningRoomMessage[];
  reactions: Array<{ id: string; emoji: string; x: number }>;
}
