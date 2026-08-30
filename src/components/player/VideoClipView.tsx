import React from 'react';
import { useMusic } from '../../context/MusicPlayerContext';
import { Play, Sparkles, ExternalLink, RefreshCw } from 'lucide-react';
import { YouTubeIcon } from '../common/YouTubeIcon';
import { motion } from 'framer-motion';

export const VideoClipView: React.FC = () => {
  const { currentSong, isPlaying, togglePlay, accentTheme } = useMusic();

  if (!currentSong) return null;

  const youtubeId = currentSong.youtubeId;
  const isYt = !!youtubeId || currentSong.isYoutube;

  if (isYt && youtubeId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-2 w-full max-w-lg mx-auto relative z-20">
        {/* Top Info Badge */}
        <div className="flex items-center justify-between w-full mb-3 px-1">
          <div className="flex items-center gap-2">
            <span
              className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md"
              style={{
                backgroundColor: `${accentTheme.color}25`,
                color: accentTheme.color,
                border: `1px solid ${accentTheme.color}50`,
              }}
            >
              <YouTubeIcon className="w-3.5 h-3.5 fill-current" />
              <span>Video Giới Thiệu HD</span>
            </span>
          </div>

          <a
            href={`https://www.youtube.com/watch?v=${youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-bold text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>Mở YouTube</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Video Frame */}
        <motion.div
          initial={{ scale: 0.94, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/15 bg-black"
        >
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=${isPlaying ? 1 : 0}&enablejsapi=1&rel=0&modestbranding=1&playsinline=1`}
            title={currentSong.title}
            className="w-full h-full object-cover border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </motion.div>

        {/* Teaser Intro Clip Controls */}
        <div className="w-full mt-4 p-3 rounded-2xl glass-card border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${accentTheme.color}25`, color: accentTheme.color }}
            >
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Đoạn Video Teaser Giới Thiệu</p>
              <p className="text-[10px] text-zinc-400">Hình nền thumbnail & âm thanh đồng bộ</p>
            </div>
          </div>

          <button
            onClick={() => togglePlay()}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-black flex items-center gap-1.5 shadow-md cursor-pointer transition-transform active:scale-95"
            style={{ backgroundColor: accentTheme.color }}
          >
            {isPlaying ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-black" />}
            <span>{isPlaying ? 'Đang phát' : 'Xem đoạn ngắn'}</span>
          </button>
        </div>
      </div>
    );
  }

  // Fallback for non-YouTube tracks (User uploaded MP3)
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-4 text-center max-w-sm mx-auto">
      <div className="relative w-48 h-48 rounded-3xl overflow-hidden shadow-2xl border border-white/15 mb-4 group">
        <img
          src={currentSong.coverUrl}
          alt={currentSong.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-xl">
            <YouTubeIcon className="w-6 h-6" />
          </div>
        </div>
      </div>

      <h4 className="text-sm font-bold text-white mb-1">{currentSong.title}</h4>
      <p className="text-xs text-zinc-400 mb-4">{currentSong.artist}</p>

      <a
        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${currentSong.artist} - ${currentSong.title}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2.5 rounded-2xl glass-panel border border-white/15 text-xs font-bold text-white hover:border-emerald-400 flex items-center gap-2 transition-all cursor-pointer shadow-lg"
      >
        <YouTubeIcon className="w-4 h-4 text-red-500 fill-red-500" />
        <span>Tìm Video Giới Thiệu Trên YouTube</span>
      </a>
    </div>
  );
};
