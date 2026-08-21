export interface LyricLine {
  time: number; // in seconds
  text: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  artistId?: string;
  album: string;
  coverUrl: string;
  duration: number; // in seconds
  audioUrl: string;
  lyrics?: LyricLine[];
  genre: string;
  mood?: string[];
  isLiked?: boolean;
  plays?: number;
  releaseYear?: number;
  accentColor?: string;
  isCustomUpload?: boolean;
  fileSize?: number;
  uploadedAt?: string;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  gradient?: string;
  trackCount: number;
  songIds: string[];
  isPersonal?: boolean;
  author?: string;
  updatedAt?: string;
}

export interface Artist {
  id: string;
  name: string;
  avatarUrl: string;
  bannerUrl?: string;
  monthlyListeners: string;
  followers?: string;
  bio?: string;
  genre: string;
  isVerified?: boolean;
  topTrackIds: string[];
}

export interface GenreCategory {
  id: string;
  name: string;
  gradient: string;
  coverUrl: string;
  songCount: number;
}

export type RepeatMode = 'off' | 'all' | 'one';

export type MainTab = 'home' | 'search' | 'library';

export type PlayerSubTab = 'player' | 'lyrics' | 'queue';

export type DesktopRightPanelTab = 'nowPlaying' | 'lyrics' | 'queue';

export type AudioQuality = 'lossless' | 'hires' | 'standard';

export interface AccentTheme {
  id: string;
  name: string;
  color: string; // e.g. '#10B981'
  glow: string;  // rgba
  tailwind: string;
}
