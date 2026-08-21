import React from 'react';
import type { Playlist, Song } from '../../types/music';
import { useMusic } from '../../context/MusicPlayerContext';
import { MOCK_SONGS } from '../../data/mockData';
import { SongListItem } from '../common/SongListItem';
import { X, Play, Shuffle, Music2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PlaylistDetailModalProps {
  playlist: Playlist | null;
  onClose: () => void;
}

export const PlaylistDetailModal: React.FC<PlaylistDetailModalProps> = ({
  playlist,
  onClose,
}) => {
  const { playSong, toggleShuffle, accentTheme } = useMusic();

  if (!playlist) return null;

  const tracks: Song[] = MOCK_SONGS.filter((s) => playlist.songIds.includes(s.id));

  const totalDurationSecs = tracks.reduce((acc, curr) => acc + curr.duration, 0);
  const totalMins = Math.floor(totalDurationSecs / 60);

  const handlePlayAll = () => {
    if (tracks.length > 0) {
      playSong(tracks[0], tracks);
    }
  };

  const handleShuffleAll = () => {
    if (tracks.length > 0) {
      toggleShuffle();
      const randomIndex = Math.floor(Math.random() * tracks.length);
      playSong(tracks[randomIndex], tracks);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex flex-col justify-end max-w-md mx-auto">
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        />

        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          className="relative z-10 w-full max-h-[88vh] bg-[#0c0e17] rounded-t-[36px] border-t border-white/15 overflow-hidden flex flex-col shadow-2xl text-left"
        >
          {/* Top Playlist Header Banner */}
          <div className="relative p-5 pt-6 flex-shrink-0 border-b border-white/10 bg-gradient-to-b from-white/10 to-transparent">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full glass-card flex items-center justify-center text-zinc-300 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex gap-4 items-center">
              {/* Cover */}
              <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-2xl flex-shrink-0 bg-zinc-800 border border-white/10">
                <img
                  src={playlist.coverUrl}
                  alt={playlist.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Meta */}
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  {playlist.isPersonal ? 'Playlist Cá Nhân' : 'Tuyển Tập'}
                </span>
                <h2 className="text-base font-extrabold text-white leading-tight truncate mt-0.5">
                  {playlist.title}
                </h2>
                <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                  {playlist.description}
                </p>
                <div className="flex items-center gap-2 mt-1.5 text-[11px] text-zinc-500 font-medium">
                  <span>{playlist.author || 'BOXMUSIC'}</span>
                  <span>•</span>
                  <span>{tracks.length} bài ({totalMins} phút)</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={handlePlayAll}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-black shadow-xl flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer"
                style={{
                  backgroundColor: accentTheme.color,
                  boxShadow: `0 0 16px ${accentTheme.glow}`,
                }}
              >
                <Play className="w-4 h-4 fill-black text-black" />
                <span>Phát tất cả</span>
              </button>

              <button
                onClick={handleShuffleAll}
                className="w-10 h-10 rounded-xl glass-card flex items-center justify-center text-zinc-300 hover:text-white transition-colors cursor-pointer flex-shrink-0"
                title="Phát ngẫu nhiên"
              >
                <Shuffle className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Song Tracklist */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1 no-scrollbar pb-10">
            {tracks.length === 0 ? (
              <div className="py-12 text-center text-zinc-500">
                <Music2 className="w-8 h-8 mx-auto opacity-40 mb-2" />
                <p className="text-xs font-semibold">Playlist này chưa có bài hát nào</p>
                <p className="text-[11px] text-zinc-600 mt-0.5">
                  Hãy duyệt và thêm bài hát từ trang Khám phá!
                </p>
              </div>
            ) : (
              tracks.map((song, index) => (
                <SongListItem
                  key={song.id}
                  song={song}
                  index={index}
                  playlistContext={tracks}
                />
              ))
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
