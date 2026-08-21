import React from 'react';
import type { Artist } from '../../types/music';
import { useMusic } from '../../context/MusicPlayerContext';
import { Flame } from 'lucide-react';
import { motion } from 'framer-motion';

interface TopArtistsProps {
  artists: Artist[];
  onSelectArtist: (artist: Artist) => void;
}

export const TopArtists: React.FC<TopArtistsProps> = ({
  artists,
  onSelectArtist,
}) => {
  const { accentTheme } = useMusic();

  return (
    <div className="space-y-3 select-none text-left">
      <div className="px-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-400">
            <Flame className="w-3.5 h-3.5 text-rose-500" />
            <span>Đang thịnh hành</span>
          </div>
          <h2 className="text-base font-extrabold text-white tracking-tight mt-0.5">
            Nghệ Sĩ Dành Cho Bạn
          </h2>
        </div>
      </div>

      {/* Horizontal Artist Avatars */}
      <div className="flex items-center gap-4 overflow-x-auto no-scrollbar px-4 pb-2">
        {artists.map((artist) => (
          <motion.div
            key={artist.id}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectArtist(artist)}
            className="flex flex-col items-center flex-shrink-0 cursor-pointer group w-20 text-center"
          >
            {/* Avatar with dynamic glowing gradient border */}
            <div
              className="w-18 h-18 rounded-full p-0.5 transition-all duration-300 group-hover:scale-105 shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${accentTheme.color}, #6366F1)`,
                boxShadow: `0 4px 16px -4px ${accentTheme.glow}`,
              }}
            >
              <div className="w-full h-full rounded-full overflow-hidden bg-zinc-800">
                <img
                  src={artist.avatarUrl}
                  alt={artist.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Name */}
            <p className="text-xs font-bold text-zinc-200 group-hover:text-white truncate w-full mt-2">
              {artist.name}
            </p>
            <p className="text-[10px] text-zinc-500 truncate w-full">
              Nghệ sĩ
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
