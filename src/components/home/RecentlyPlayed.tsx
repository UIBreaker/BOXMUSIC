import React from 'react';
import type { Song, Playlist } from '../../types/music';
import { useMusic } from '../../context/MusicPlayerContext';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';

interface RecentlyPlayedProps {
  items: (Song | Playlist)[];
  onSelectPlaylist: (playlist: Playlist) => void;
}

export const RecentlyPlayed: React.FC<RecentlyPlayedProps> = ({
  items,
  onSelectPlaylist,
}) => {
  const { currentSong, playSong, accentTheme } = useMusic();

  const handleItemClick = (item: Song | Playlist) => {
    if ('audioUrl' in item) {
      playSong(item as Song);
    } else {
      onSelectPlaylist(item as Playlist);
    }
  };

  const handlePlayDirect = (e: React.MouseEvent, item: Song | Playlist) => {
    e.stopPropagation();
    if ('audioUrl' in item) {
      playSong(item as Song);
    } else {
      onSelectPlaylist(item as Playlist);
    }
  };

  return (
    <div className="px-4 space-y-2 select-none text-left">
      <h2 className="text-sm font-bold text-white tracking-tight flex items-center justify-between">
        <span>Gần đây</span>
        <span className="text-[11px] text-zinc-500 font-medium">Tự động lưu</span>
      </h2>

      <div className="grid grid-cols-2 gap-2">
        {items.slice(0, 6).map((item) => {
          const isSong = 'audioUrl' in item;
          const isCurrentActive = isSong && currentSong?.id === item.id;
          const title = item.title;
          const cover = item.coverUrl;

          return (
            <motion.div
              key={item.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleItemClick(item)}
              className="group relative flex items-center rounded-xl glass-card overflow-hidden border border-white/5 hover:border-white/15 transition-all cursor-pointer p-1"
            >
              {/* Thumbnail */}
              <div className="w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-zinc-800 relative">
                <img
                  src={cover}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title */}
              <div className="flex-1 px-2.5 min-w-0">
                <p
                  className={`text-xs font-bold truncate leading-tight ${
                    isCurrentActive ? 'text-white' : 'text-zinc-200'
                  }`}
                  style={{ color: isCurrentActive ? accentTheme.color : undefined }}
                >
                  {title}
                </p>
                <p className="text-[10px] text-zinc-400 truncate mt-0.5">
                  {isSong ? (item as Song).artist : 'Playlist'}
                </p>
              </div>

              {/* Quick Play Button */}
              <button
                onClick={(e) => handlePlayDirect(e, item)}
                className="w-7 h-7 mr-1.5 rounded-full flex items-center justify-center text-black shadow-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex-shrink-0"
                style={{ backgroundColor: accentTheme.color }}
                title="Phát"
              >
                <Play className="w-3 h-3 fill-black text-black ml-0.5" />
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
