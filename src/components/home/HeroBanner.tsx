import React from 'react';
import { Play, Sparkles, Flame } from 'lucide-react';
import { useMusic } from '../../context/MusicPlayerContext';
import { MOCK_PLAYLISTS, MOCK_SONGS } from '../../data/mockData';
import { motion } from 'framer-motion';

export const HeroBanner: React.FC = () => {
  const { playSong, accentTheme, setSelectedPlaylist } = useMusic();

  const featuredPlaylist = MOCK_PLAYLISTS[0];

  const handlePlayFeatured = () => {
    const tracks = MOCK_SONGS.filter((s) => featuredPlaylist.songIds.includes(s.id));
    if (tracks.length > 0) {
      playSong(tracks[0], tracks);
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
              Nổi Bật Hôm Nay
            </span>
            <span className="text-xs text-zinc-400 font-semibold flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-rose-500" /> Thịnh hành #1
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            {featuredPlaylist.title}
          </h1>

          <p className="text-xs sm:text-sm text-zinc-300 line-clamp-2 leading-relaxed">
            {featuredPlaylist.description}
          </p>

          <div className="flex items-center gap-3 pt-2">
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

            <button
              onClick={() => setSelectedPlaylist(featuredPlaylist)}
              className="px-4 py-3 rounded-2xl glass-card border border-white/10 hover:border-white/20 text-xs sm:text-sm font-bold text-white transition-all cursor-pointer"
            >
              Xem Chi Tiết
            </button>
          </div>
        </div>

        {/* Right Artwork Display */}
        <div className="relative flex-shrink-0">
          <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10 relative group-hover:scale-105 transition-transform duration-500">
            <img
              src={featuredPlaylist.coverUrl}
              alt={featuredPlaylist.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[11px] font-bold">
              <span>{featuredPlaylist.trackCount} bài hát</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/80 text-black text-[9px]">
                HI-RES
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
