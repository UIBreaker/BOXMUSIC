import type { Song, Playlist, Artist, GenreCategory, AccentTheme } from '../types/music';

// Theme Accent Palettes
export const ACCENT_THEMES: AccentTheme[] = [
  { id: 'emerald', name: 'Neon Emerald', color: '#10B981', glow: 'rgba(16, 185, 129, 0.4)', tailwind: 'emerald-500' },
  { id: 'cyan', name: 'Electric Cyan', color: '#06B6D4', glow: 'rgba(6, 182, 212, 0.4)', tailwind: 'cyan-500' },
  { id: 'purple', name: 'Cyber Purple', color: '#A855F7', glow: 'rgba(168, 85, 247, 0.4)', tailwind: 'purple-500' },
  { id: 'rose', name: 'Sunset Rose', color: '#F43F5E', glow: 'rgba(244, 63, 94, 0.4)', tailwind: 'rose-500' },
  { id: 'amber', name: 'Golden Amber', color: '#F59E0B', glow: 'rgba(245, 158, 11, 0.4)', tailwind: 'amber-500' },
];

// Clean empty default songs list (Pure user-uploaded music library)
export const MOCK_SONGS: Song[] = [];

// Mood Filter Tags
export const MOOD_TAGS = [
  'Tất cả',
  'Nhạc của tôi',
  'Chill & Thư giãn',
  'Tập trung làm việc',
  'Năng lượng Gym',
  'Acoustic',
  'Lo-fi',
];

// Clean initial Playlists
export const MOCK_PLAYLISTS: Playlist[] = [
  {
    id: 'p_my_favorite',
    title: 'Tuyển Tập Cá Nhân',
    description: 'Playlist chứa các bản nhạc bạn yêu thích nhất',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop',
    gradient: 'from-emerald-600 via-teal-900 to-slate-950',
    trackCount: 0,
    songIds: [],
    isPersonal: true,
    author: 'Bạn',
    updatedAt: 'Hôm nay',
  },
];

// Artists list for Discovery
export const MOCK_ARTISTS: Artist[] = [
  {
    id: 'a_user',
    name: 'Thư Viện Của Tôi',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop',
    monthlyListeners: 'Cá nhân',
    followers: 'VIP',
    bio: 'Không gian âm nhạc lưu trữ các bài hát MP3/MP4 do chính bạn tải lên và quản lý.',
    genre: 'Nhạc Cá Nhân',
    isVerified: true,
    topTrackIds: [],
  },
];

// Genre Categories for browsing
export const GENRE_CATEGORIES: GenreCategory[] = [
  {
    id: 'g1',
    name: 'Nhạc Của Tôi (MP3/MP4)',
    gradient: 'from-emerald-600 to-teal-950',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&auto=format&fit=crop',
    songCount: 0,
  },
  {
    id: 'g2',
    name: 'Acoustic & Chill',
    gradient: 'from-blue-600 to-slate-950',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400&auto=format&fit=crop',
    songCount: 0,
  },
  {
    id: 'g3',
    name: 'Lo-fi & Thư Giãn',
    gradient: 'from-purple-600 to-indigo-950',
    coverUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=400&auto=format&fit=crop',
    songCount: 0,
  },
  {
    id: 'g4',
    name: 'Năng Lượng & Tập Luyện',
    gradient: 'from-amber-600 to-zinc-950',
    coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=400&auto=format&fit=crop',
    songCount: 0,
  },
];

export const MOCK_GENRES = GENRE_CATEGORIES;
