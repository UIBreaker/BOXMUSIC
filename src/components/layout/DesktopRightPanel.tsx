import React from 'react';
import {
  X,
  Disc3,
  Mic2,
  ListMusic,
  Heart,
  Sparkles,
  Users,
} from 'lucide-react';
import { useMusic } from '../../context/MusicPlayerContext';
import { SyncedLyrics } from '../player/SyncedLyrics';
import { QueueView } from '../player/QueueView';
import { Visualizer } from '../player/Visualizer';
import { MOCK_ARTISTS } from '../../data/mockData';
import { motion } from 'framer-motion';

export const DesktopRightPanel: React.FC = () => {
  const {
    currentSong,
    isPlaying,
    likedSongIds,
    toggleLike,
    desktopRightPanelTab,
    setDesktopRightPanelTab,
    isDesktopRightPanelOpen,
    setIsDesktopRightPanelOpen,
    turntableMode,
    toggleTurntableMode,
    setSelectedArtist,
  } = useMusic();

  if (!isDesktopRightPanelOpen || !currentSong) return null;

  const isLiked = likedSongIds.has(currentSong.id);
  const artistInfo = MOCK_ARTISTS.find(
    (a) => a.id === currentSong.artistId || a.name.includes(currentSong.artist)
  );

  return (
    <aside className="w-80 xl:w-96 h-screen flex flex-col bg-[#07090e]/95 border-l border-white/[0.08] select-none p-3.5 gap-3 z-30 flex-shrink-0">
      {/* Top Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5 bg-[#121622] p-1 rounded-xl border border-white/[0.06]">
          <button
            onClick={() => setDesktopRightPanelTab('nowPlaying')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              desktopRightPanelTab === 'nowPlaying'
                ? 'bg-white/20 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Disc3 className="w-3.5 h-3.5" />
            Đang phát
          </button>
          <button
            onClick={() => setDesktopRightPanelTab('lyrics')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              desktopRightPanelTab === 'lyrics'
                ? 'bg-white/20 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Mic2 className="w-3.5 h-3.5" />
            Lời bài hát
          </button>
          <button
            onClick={() => setDesktopRightPanelTab('queue')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              desktopRightPanelTab === 'queue'
                ? 'bg-white/20 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <ListMusic className="w-3.5 h-3.5" />
            Hàng đợi
          </button>
        </div>

        {/* Close / Collapse button */}
        <button
          onClick={() => setIsDesktopRightPanelOpen(false)}
          className="w-8 h-8 rounded-xl glass-card flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
          title="Đóng bảng bên phải"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Panel Content Area */}
      <div className="flex-1 overflow-y-auto glass-panel rounded-2xl p-4 border border-white/[0.06] flex flex-col no-scrollbar">
        {desktopRightPanelTab === 'nowPlaying' && (
          <div className="space-y-4 text-left">
            {/* Cover / Vinyl Stage */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-2xl bg-zinc-900 border border-white/10 flex items-center justify-center group">
              {turntableMode ? (
                <div
                  className={`w-4/5 h-4/5 rounded-full overflow-hidden border-4 border-zinc-800 shadow-2xl relative flex items-center justify-center ${
                    isPlaying ? 'animate-spin-slow' : 'animate-spin-slow-paused'
                  }`}
                >
                  <img
                    src={currentSong.coverUrl}
                    alt={currentSong.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute w-8 h-8 rounded-full bg-zinc-950 border-2 border-zinc-700 shadow" />
                </div>
              ) : (
                <img
                  src={currentSong.coverUrl}
                  alt={currentSong.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              )}

              {/* Mode toggle button */}
              <button
                onClick={toggleTurntableMode}
                className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full glass-panel text-[10px] font-bold text-zinc-200 border border-white/20 shadow-lg flex items-center gap-1 hover:text-white transition-all cursor-pointer"
              >
                <Disc3 className="w-3 h-3 text-amber-400" />
                <span>{turntableMode ? 'Ảnh vuông' : 'Đĩa than'}</span>
              </button>
            </div>

            {/* Song Info & Heart */}
            <div className="flex items-center justify-between pt-1">
              <div className="min-w-0 flex-1 pr-2">
                <h3 className="text-base font-extrabold text-white truncate tracking-tight">
                  {currentSong.title}
                </h3>
                <p className="text-xs font-semibold text-zinc-400 truncate mt-0.5">
                  {currentSong.artist} • {currentSong.album}
                </p>
              </div>

              <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={(e) => toggleLike(currentSong.id, e)}
                className="w-9 h-9 rounded-full glass-card flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer"
                title="Yêu thích"
              >
                <Heart
                  className={`w-5 h-5 transition-colors ${
                    isLiked ? 'text-rose-500 fill-rose-500' : 'text-zinc-400'
                  }`}
                />
              </motion.button>
            </div>

            {/* Visualizer Wave */}
            <div className="py-1">
              <Visualizer barCount={26} />
            </div>

            {/* About the Artist Card */}
            {artistInfo && (
              <div
                onClick={() => setSelectedArtist(artistInfo)}
                className="glass-card p-3.5 rounded-2xl border border-white/[0.06] hover:border-white/20 transition-all cursor-pointer group space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    Về nghệ sĩ
                  </span>
                  <Sparkles className="w-3 h-3 text-sky-400" />
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={artistInfo.avatarUrl}
                    alt={artistInfo.name}
                    className="w-12 h-12 rounded-xl object-cover shadow"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {artistInfo.name}
                    </p>
                    <p className="text-[11px] text-zinc-400 flex items-center gap-1 mt-0.5">
                      <Users className="w-3 h-3 text-zinc-500" />
                      {artistInfo.monthlyListeners} người nghe/tháng
                    </p>
                  </div>
                </div>

                {artistInfo.bio && (
                  <p className="text-[11px] text-zinc-400 line-clamp-3 leading-relaxed">
                    {artistInfo.bio}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {desktopRightPanelTab === 'lyrics' && <SyncedLyrics />}

        {desktopRightPanelTab === 'queue' && <QueueView />}
      </div>
    </aside>
  );
};
