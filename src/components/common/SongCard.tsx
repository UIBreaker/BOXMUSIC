import React from 'react';
import type { Playlist, Song } from '../../types/music';
import { Play } from 'lucide-react';
import { useMusic } from '../../context/MusicPlayerContext';
import { MOCK_SONGS } from '../../data/mockData';
import { motion } from 'framer-motion';

interface SongCardProps {
  playlist?: Playlist;
  song?: Song;
  onSelectPlaylist?: (playlist: Playlist) => void;
}

export const SongCard: React.FC<SongCardProps> = ({
  playlist,
  song,
  onSelectPlaylist,
}) => {
  const { playSong, accentTheme } = useMusic();

  const handlePlayQuick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (song) {
      playSong(song);
    } else if (playlist) {
      const playlistTracks = MOCK_SONGS.filter((s) => playlist.songIds.includes(s.id));
      if (playlistTracks.length > 0) {
        playSong(playlistTracks[0], playlistTracks);
      }
    }
  };

  const handleClick = () => {
    if (playlist && onSelectPlaylist) {
      onSelectPlaylist(playlist);
    } else if (song) {
      playSong(song);
    }
  };

  const title = playlist?.title || song?.title;
  const subtitle = playlist?.author || song?.artist;
  const cover = playlist?.coverUrl || song?.coverUrl;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.96 }}
      onClick={handleClick}
      className="group relative flex-shrink-0 w-36 sm:w-40 p-2.5 rounded-2xl glass-card border border-white/5 hover:border-white/15 transition-all cursor-pointer select-none text-left"
    >
      {/* Cover Image */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-2 bg-zinc-800 shadow-md">
        <img
          src={cover}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Quick Play Floating Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handlePlayQuick}
          className="absolute bottom-2 right-2 w-9 h-9 rounded-full flex items-center justify-center text-black shadow-xl opacity-90 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 cursor-pointer"
          style={{
            backgroundColor: accentTheme.color,
            boxShadow: `0 4px 14px ${accentTheme.glow}`,
          }}
          title="Phát ngay"
        >
          <Play className="w-4 h-4 fill-black text-black ml-0.5" />
        </motion.button>
      </div>

      {/* Info */}
      <h3 className="text-xs font-bold text-white truncate tracking-tight group-hover:text-zinc-100">
        {title}
      </h3>
      <p className="text-[11px] text-zinc-400 truncate mt-0.5 font-medium">
        {subtitle}
      </p>
    </motion.div>
  );
};
