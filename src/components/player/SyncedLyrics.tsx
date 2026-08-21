import React, { useEffect, useRef } from 'react';
import { useMusic } from '../../context/MusicPlayerContext';
import { Music, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const SyncedLyrics: React.FC = () => {
  const { currentSong, currentTime, seekTo, accentTheme } = useMusic();
  const activeLineRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const lyrics = currentSong?.lyrics || [];

  // Find index of current lyric line based on currentTime
  let activeIndex = -1;
  for (let i = 0; i < lyrics.length; i++) {
    if (currentTime >= lyrics[i].time) {
      activeIndex = i;
    } else {
      break;
    }
  }

  // Smooth auto-scroll to active lyric line
  useEffect(() => {
    if (activeLineRef.current && containerRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeIndex]);

  if (!lyrics || lyrics.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-zinc-500">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
          <Music className="w-8 h-8 opacity-40" />
        </div>
        <p className="text-sm font-semibold text-zinc-400">Chưa có lời bài hát đồng bộ</p>
        <p className="text-xs text-zinc-500 mt-1 max-w-xs">
          Lời bài hát cho bài này đang được cập nhật từ đội ngũ BOXMUSIC.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-6 py-8 space-y-6 text-center no-scrollbar relative select-none"
    >
      <div className="sticky top-0 pb-2 z-10 flex items-center justify-center gap-1.5 text-xs text-zinc-400 font-medium">
        <Sparkles className="w-3.5 h-3.5" style={{ color: accentTheme.color }} />
        <span>Chạm vào câu hát bất kỳ để phát đoạn đó</span>
      </div>

      <div className="py-12 space-y-7">
        {lyrics.map((line, index) => {
          const isActive = index === activeIndex;
          const isPassed = index < activeIndex;

          return (
            <motion.div
              key={index}
              ref={isActive ? activeLineRef : null}
              onClick={() => seekTo(line.time)}
              initial={false}
              animate={{
                scale: isActive ? 1.06 : 0.98,
                opacity: isActive ? 1 : isPassed ? 0.45 : 0.25,
              }}
              transition={{ duration: 0.25 }}
              className={`cursor-pointer transition-all duration-300 py-1.5 px-3 rounded-xl ${
                isActive
                  ? 'font-bold text-white tracking-wide text-lg sm:text-xl'
                  : 'font-semibold text-zinc-400 text-base sm:text-lg hover:text-zinc-200'
              }`}
              style={{
                color: isActive ? accentTheme.color : undefined,
                textShadow: isActive ? `0 0 16px ${accentTheme.glow}` : undefined,
              }}
            >
              {line.text}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
