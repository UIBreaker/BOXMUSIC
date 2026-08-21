import React from 'react';
import { Play, Sparkles, UploadCloud, Plus } from 'lucide-react';
import { useMusic } from '../../context/MusicPlayerContext';
import { motion } from 'framer-motion';

export const HeroBanner: React.FC = () => {
  const { allSongs, playSong, accentTheme, setIsUploadModalOpen } = useMusic();

  const hasSongs = allSongs.length > 0;
  const topSong = hasSongs ? allSongs[0] : null;

  const handlePlayFeatured = () => {
    if (hasSongs && topSong) {
      playSong(topSong, allSongs);
    } else {
      setIsUploadModalOpen(true);
    }
  };

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/[0.08] p-6 sm:p-8 bg-gradient-to-r from-emerald-950/80 via-slate-900/90 to-zinc-950 text-left select-none group">
      {/* Ambient background glow */}
      <div
        className="absolute -top-12 -left-12 w-80 h-80 rounded-full blur-[100px] opacity-30 pointer-events-none transition-all duration-700"
        style={{ backgroundColor: accentTheme.color }}
      />
      <div className="absolute -bottom-10 right-10 w-80 h-80 rounded-full bg-purple-600/20 blur-[100px] pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Info */}
        <div className="space-y-3 max-w-xl">
          <div className="flex items-center gap-2">
            <span
              className="flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full border shadow-sm"
              style={{
                backgroundColor: `${accentTheme.color}25`,
                color: accentTheme.color,
                borderColor: `${accentTheme.color}50`,
              }}
            >
              <Sparkles className="w-3 h-3" />
              {hasSongs ? 'Không Gian Âm Nhạc Của Bạn' : 'Bắt Đầu Thưởng Thức'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            {hasSongs ? topSong?.title : 'Tải Lên Bài Hát Của Bạn'}
          </h1>

          <p className="text-xs sm:text-sm text-zinc-300 line-clamp-2 leading-relaxed">
            {hasSongs
              ? `Đang có ${allSongs.length} bài hát trong thư viện cá nhân của bạn. Phát chất lượng phòng thu Lossless Hi-Res.`
              : 'Thư viện đang trống. Hãy kéo thả hoặc chọn file MP3, MP4 từ máy tính hoặc điện thoại để bắt đầu nghe nhạc ngoại tuyến!'}
          </p>

          <div className="flex items-center gap-3 pt-2">
            {hasSongs ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePlayFeatured}
                className="px-6 py-3 rounded-2xl font-bold text-black text-xs sm:text-sm flex items-center gap-2 shadow-2xl transition-all cursor-pointer"
                style={{
                  backgroundColor: accentTheme.color,
                  boxShadow: `0 0 24px ${accentTheme.glow}`,
                }}
              >
                <Play className="w-4 h-4 fill-black text-black" />
                <span>Phát Ngay</span>
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsUploadModalOpen(true)}
                className="px-6 py-3 rounded-2xl font-bold text-black text-xs sm:text-sm flex items-center gap-2 shadow-2xl transition-all cursor-pointer"
                style={{
                  backgroundColor: accentTheme.color,
                  boxShadow: `0 0 24px ${accentTheme.glow}`,
                }}
              >
                <UploadCloud className="w-4 h-4" />
                <span>Tải Nhạc Lên Ngay (+ MP3/MP4)</span>
              </motion.button>
            )}

            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-4 py-3 rounded-2xl glass-card border border-white/10 hover:border-white/20 text-xs sm:text-sm font-bold text-white transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm bài mới</span>
            </button>
          </div>
        </div>

        {/* Right Artwork Display */}
        <div className="relative flex-shrink-0">
          <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10 relative group-hover:scale-105 transition-transform duration-500 bg-zinc-900 flex items-center justify-center">
            {hasSongs && topSong ? (
              <>
                <img
                  src={topSong.coverUrl}
                  alt={topSong.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[11px] font-bold">
                  <span>{topSong.artist}</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/80 text-black text-[9px]">
                    HI-RES
                  </span>
                </div>
              </>
            ) : (
              <div
                onClick={() => setIsUploadModalOpen(true)}
                className="text-center p-4 cursor-pointer"
              >
                <UploadCloud className="w-12 h-12 mx-auto text-zinc-500 group-hover:text-emerald-400 transition-colors mb-2" />
                <p className="text-xs font-bold text-zinc-300">Thêm bài hát</p>
                <p className="text-[10px] text-zinc-500">MP3 / MP4</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
