import React from 'react';
import { Play, Pause, SkipForward, Heart } from 'lucide-react';
import { useMusic } from '../../context/MusicPlayerContext';
import { motion } from 'framer-motion';

export const MiniPlayer: React.FC = () => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    nextSong,
    toggleLike,
    likedSongIds,
    setIsFullScreen,
    accentTheme,
  } = useMusic();

  if (!currentSong) return null;

  const isLiked = likedSongIds.has(currentSong.id);
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      className="fixed bottom-[74px] left-0 right-0 z-30 max-w-md mx-auto px-3 pointer-events-auto"
    >
      <div
        onClick={() => setIsFullScreen(true)}
        className="relative rounded-2xl glass-player p-2 flex items-center justify-between shadow-xl shadow-black/60 border border-white/10 cursor-pointer overflow-hidden group hover:border-white/20 transition-all"
        style={{
          boxShadow: isPlaying ? `0 8px 24px -6px ${accentTheme.glow}` : undefined,
        }}
      >
        {/* Top Mini Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-white/10 overflow-hidden">
          <div
            className="h-full transition-all duration-300 ease-linear rounded-r-full"
            style={{
              width: `${progressPercent}%`,
              backgroundColor: accentTheme.color,
              boxShadow: `0 0 6px ${accentTheme.color}`,
            }}
          />
        </div>

        {/* Left Side: Thumbnail & Title */}
        <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
          {/* Thumbnail with playing pulse animation */}
          <div className="relative w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 bg-zinc-800 shadow-md">
            <img
              src={currentSong.coverUrl}
              alt={currentSong.title}
              className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                isPlaying ? 'scale-100' : 'scale-95 opacity-90'
              }`}
            />
            {isPlaying && (
              <div className="absolute inset-0 bg-black/25 flex items-center justify-center gap-0.5">
                <span className="w-0.5 h-3.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-0.5 h-4 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-0.5 h-2.5 bg-white rounded-full animate-bounce" />
              </div>
            )}
          </div>

          {/* Song Info */}
          <div className="min-w-0 flex-1 text-left">
            <div className="overflow-hidden whitespace-nowrap">
              <p className="text-xs font-bold text-white truncate tracking-tight">
                {currentSong.title}
              </p>
            </div>
            <p className="text-[11px] text-zinc-400 truncate mt-0.5 font-medium">
              {currentSong.artist}
            </p>
          </div>
        </div>

        {/* Right Side: Quick Action Controls */}
        <div
          className="flex items-center gap-1 flex-shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Like Button */}
          <button
            onClick={(e) => toggleLike(currentSong.id, e)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-white transition-transform active:scale-80 cursor-pointer"
            title="Yêu thích"
          >
            <Heart
              className={`w-4 h-4 transition-colors duration-200 ${
                isLiked ? 'text-rose-500 fill-rose-500' : 'hover:text-zinc-200'
              }`}
            />
          </button>

          {/* Play/Pause Button */}
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={togglePlay}
            className="w-9 h-9 rounded-full flex items-center justify-center text-black font-bold shadow-md cursor-pointer transition-transform"
            style={{
              backgroundColor: accentTheme.color,
              boxShadow: `0 0 14px ${accentTheme.glow}`,
            }}
            title={isPlaying ? 'Tạm dừng' : 'Phát'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-black text-black" />
            ) : (
              <Play className="w-4 h-4 fill-black text-black ml-0.5" />
            )}
          </motion.button>

          {/* Next Button */}
          <button
            onClick={nextSong}
            className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-white transition-transform active:scale-80 cursor-pointer"
            title="Bài tiếp theo"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
