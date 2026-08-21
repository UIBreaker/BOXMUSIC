import React from 'react';
import type { GenreCategory } from '../../types/music';
import { MOCK_GENRES } from '../../data/mockData';
import { motion } from 'framer-motion';

interface GenreGridProps {
  onSelectGenre: (genreName: string) => void;
}

export const GenreGrid: React.FC<GenreGridProps> = ({ onSelectGenre }) => {
  return (
    <div className="space-y-4 px-4 select-none text-left pb-6">
      <div>
        <h2 className="text-base font-extrabold text-white tracking-tight">
          Khám Phá Tất Cả Thể Loại
        </h2>
        <p className="text-xs text-zinc-400 mt-0.5">
          Khám phá giai điệu phù hợp với tâm trạng của bạn
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {MOCK_GENRES.map((genre: GenreCategory) => (
          <motion.div
            key={genre.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelectGenre(genre.name)}
            className={`relative h-28 rounded-2xl p-3 overflow-hidden cursor-pointer shadow-lg bg-gradient-to-br ${genre.gradient} border border-white/10 flex flex-col justify-between group`}
          >
            {/* Title */}
            <h3 className="text-sm font-extrabold text-white tracking-tight z-10 drop-shadow-md">
              {genre.name}
            </h3>

            <span className="text-[10px] font-semibold text-white/70 z-10">
              {genre.songCount}+ ca khúc
            </span>

            {/* Rotated Thumbnail image on bottom-right corner */}
            <div className="absolute -bottom-2 -right-3 w-16 h-16 rounded-xl overflow-hidden shadow-2xl transform rotate-[22deg] group-hover:rotate-[15deg] group-hover:scale-110 transition-all duration-300">
              <img
                src={genre.coverUrl}
                alt={genre.name}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
