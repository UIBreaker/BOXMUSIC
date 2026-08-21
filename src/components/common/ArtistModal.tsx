import React from 'react';
import type { Artist, Song } from '../../types/music';
import { useMusic } from '../../context/MusicPlayerContext';
import { MOCK_SONGS } from '../../data/mockData';
import { SongListItem } from './SongListItem';
import { X, CheckCircle2, Play, Users, Disc } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ArtistModalProps {
  artist: Artist | null;
  onClose: () => void;
}

export const ArtistModal: React.FC<ArtistModalProps> = ({ artist, onClose }) => {
  const { playSong, accentTheme } = useMusic();

  if (!artist) return null;

  const topSongs: Song[] = MOCK_SONGS.filter(
    (s) => artist.topTrackIds.includes(s.id) || s.artist.includes(artist.name)
  );

  const handlePlayAll = () => {
    if (topSongs.length > 0) {
      playSong(topSongs[0], topSongs);
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
          className="relative z-10 w-full max-h-[85vh] bg-[#0c0e17] rounded-t-[36px] border-t border-white/15 overflow-hidden flex flex-col shadow-2xl text-left"
        >
          {/* Header Image Banner */}
          <div className="relative h-48 w-full bg-zinc-900 flex-shrink-0">
            <img
              src={artist.bannerUrl || artist.avatarUrl}
              alt={artist.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e17] via-[#0c0e17]/50 to-transparent" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center border border-white/10 hover:bg-black/80 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Artist Info Badge on Banner */}
            <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  {artist.isVerified && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-sky-400">
                      <CheckCircle2 className="w-3.5 h-3.5 fill-sky-400 text-black" />
                      Nghệ sĩ xác minh
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-extrabold text-white tracking-tight">
                  {artist.name}
                </h2>
                <p className="text-xs text-zinc-300 font-medium flex items-center gap-2 mt-0.5">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-zinc-400" />
                    {artist.monthlyListeners} người nghe/tháng
                  </span>
                  <span>•</span>
                  <span>{artist.genre}</span>
                </p>
              </div>

              {/* Play All Button */}
              <button
                onClick={handlePlayAll}
                className="w-12 h-12 rounded-full flex items-center justify-center text-black font-bold shadow-xl transition-transform active:scale-90 cursor-pointer flex-shrink-0"
                style={{
                  backgroundColor: accentTheme.color,
                  boxShadow: `0 0 16px ${accentTheme.glow}`,
                }}
                title="Phát tất cả"
              >
                <Play className="w-5 h-5 fill-black text-black ml-0.5" />
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 no-scrollbar pb-10">
            {/* Bio */}
            {artist.bio && (
              <div className="p-3 rounded-2xl glass-card border border-white/5">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">
                  Giới thiệu
                </h4>
                <p className="text-xs text-zinc-300 leading-relaxed">{artist.bio}</p>
              </div>
            )}

            {/* Popular Tracks */}
            <div>
              <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <Disc className="w-4 h-4 text-emerald-400" />
                Bài hát phổ biến
              </h3>
              <div className="space-y-1">
                {topSongs.map((song, idx) => (
                  <SongListItem
                    key={song.id}
                    song={song}
                    index={idx}
                    playlistContext={topSongs}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
