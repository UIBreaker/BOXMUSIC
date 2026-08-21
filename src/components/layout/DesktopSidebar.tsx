import React from 'react';
import {
  Home,
  Compass,
  Library,
  Heart,
  Plus,
  Radio,
  Sparkles,
  Palette,
  Disc,
} from 'lucide-react';
import { useMusic } from '../../context/MusicPlayerContext';
import { ACCENT_THEMES } from '../../data/mockData';
import type { MainTab, Playlist } from '../../types/music';

export const DesktopSidebar: React.FC = () => {
  const {
    mainTab,
    setMainTab,
    likedSongIds,
    userPlaylists,
    accentTheme,
    setAccentTheme,
    setSelectedPlaylist,
    setIsCreatePlaylistOpen,
    isPlaying,
  } = useMusic();

  const navItems: { id: MainTab; label: string; icon: React.ElementType }[] = [
    { id: 'home', label: 'Trang chủ', icon: Home },
    { id: 'search', label: 'Khám phá', icon: Compass },
    { id: 'library', label: 'Thư viện', icon: Library },
  ];

  return (
    <aside className="w-64 xl:w-72 h-screen flex flex-col bg-[#07090e]/95 border-r border-white/[0.08] select-none p-3.5 gap-3.5 z-30 flex-shrink-0">
      {/* Brand Header */}
      <div className="px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setMainTab('home')}>
          {/* Glowing Brand Icon */}
          <div
            className="w-9 h-9 rounded-2xl flex items-center justify-center text-black font-black shadow-lg transition-transform hover:scale-105"
            style={{
              backgroundColor: accentTheme.color,
              boxShadow: `0 0 18px ${accentTheme.glow}`,
            }}
          >
            <Radio className="w-5 h-5 fill-black text-black" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-extrabold text-white tracking-tight">BOXMUSIC</span>
              <span
                className="text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider"
                style={{
                  backgroundColor: `${accentTheme.color}25`,
                  color: accentTheme.color,
                  border: `1px solid ${accentTheme.color}40`,
                }}
              >
                PRO
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 font-medium">Hi-Res Audio Stream</p>
          </div>
        </div>

        {isPlaying && (
          <div className="flex items-end gap-0.5 h-3.5 pr-1">
            <span className="w-1 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="w-1 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="w-1 bg-emerald-400 rounded-full animate-bounce" />
          </div>
        )}
      </div>

      {/* Main Navigation Panel */}
      <div className="glass-panel p-2 rounded-2xl space-y-1 border border-white/[0.06]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = mainTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setMainTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
              }`}
              style={{
                color: isActive ? accentTheme.color : undefined,
              }}
            >
              <Icon
                className="w-4 h-4 transition-colors"
                style={{
                  color: isActive ? accentTheme.color : undefined,
                  filter: isActive ? `drop-shadow(0 0 6px ${accentTheme.glow})` : undefined,
                }}
              />
              <span className="flex-1 text-left">{item.label}</span>
              {isActive && (
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: accentTheme.color }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Quick Library & Liked Songs Section */}
      <div className="glass-panel p-3 rounded-2xl flex-1 flex flex-col min-h-0 border border-white/[0.06]">
        {/* Liked Songs Shortcut */}
        <button
          onClick={() => setMainTab('library')}
          className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-all text-left group cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Heart className="w-4 h-4 fill-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-white group-hover:text-rose-400 transition-colors">
                Bài hát đã thích
              </p>
              <p className="text-[10px] text-zinc-500">{likedSongIds.size} ca khúc</p>
            </div>
          </div>
          <Sparkles className="w-3.5 h-3.5 text-amber-400/70 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>

        {/* Playlists Header & Add Button */}
        <div className="flex items-center justify-between mt-3 mb-2 px-1 pt-2 border-t border-white/[0.06]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
            Danh sách phát ({userPlaylists.length})
          </span>
          <button
            onClick={() => setIsCreatePlaylistOpen(true)}
            className="w-6 h-6 rounded-lg glass-card flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Tạo playlist mới"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Scrollable User Playlists */}
        <div className="flex-1 overflow-y-auto space-y-1 no-scrollbar pr-0.5">
          {userPlaylists.map((playlist: Playlist) => (
            <button
              key={playlist.id}
              onClick={() => {
                setSelectedPlaylist(playlist);
              }}
              className="w-full flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-white/5 transition-all text-left group cursor-pointer"
            >
              <img
                src={playlist.coverUrl}
                alt={playlist.title}
                className="w-8 h-8 rounded-lg object-cover flex-shrink-0 shadow"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-zinc-300 group-hover:text-white truncate">
                  {playlist.title}
                </p>
                <p className="text-[10px] text-zinc-500 truncate">
                  {playlist.isPersonal ? 'Playlist của bạn' : 'Tuyển tập'}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Theme Accent Picker Bar */}
      <div className="glass-panel p-2.5 rounded-2xl border border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-semibold pl-1">
          <Palette className="w-3.5 h-3.5" style={{ color: accentTheme.color }} />
          <span className="text-[11px]">Chủ đề:</span>
        </div>
        <div className="flex items-center gap-1.5">
          {ACCENT_THEMES.map((theme) => (
            <button
              key={theme.id}
              onClick={() => setAccentTheme(theme)}
              className={`w-5 h-5 rounded-full transition-transform cursor-pointer ${
                accentTheme.id === theme.id ? 'scale-125 ring-2 ring-white shadow-lg' : 'opacity-70 hover:opacity-100'
              }`}
              style={{ backgroundColor: theme.color }}
              title={theme.name}
            />
          ))}
        </div>
      </div>

      {/* User Footer Profile */}
      <div className="glass-panel p-2.5 rounded-2xl border border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
              alt="Avatar"
              className="w-8 h-8 rounded-xl object-cover shadow"
            />
            <span
              className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-black"
              style={{ backgroundColor: accentTheme.color }}
            />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-white truncate">Nhật Nam</p>
            <p className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
              <Disc className="w-2.5 h-2.5 animate-spin" /> Lossless VIP
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
