import React from 'react';
import type { Playlist, Song } from '../../types/music';
import { SongCard } from '../common/SongCard';
import { Sparkles } from 'lucide-react';
import { useMusic } from '../../context/MusicPlayerContext';

interface ForYouSectionProps {
  playlists: Playlist[];
  recommendedSongs: Song[];
  onSelectPlaylist: (playlist: Playlist) => void;
}

export const ForYouSection: React.FC<ForYouSectionProps> = ({
  playlists,
  recommendedSongs,
  onSelectPlaylist,
}) => {
  const { accentTheme } = useMusic();

  return (
    <div className="space-y-6 select-none text-left">
      {/* Daily Mixes Carousel */}
      <div className="space-y-3">
        <div className="px-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-400">
              <Sparkles className="w-3.5 h-3.5" style={{ color: accentTheme.color }} />
              <span>Dành cho bạn</span>
            </div>
            <h2 className="text-base font-extrabold text-white tracking-tight mt-0.5">
              Mix Hàng Ngày Cá Nhân Hóa
            </h2>
          </div>
        </div>

        {/* Horizontal Carousel */}
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar px-4 pb-1">
          {playlists.map((playlist) => (
            <SongCard
              key={playlist.id}
              playlist={playlist}
              onSelectPlaylist={onSelectPlaylist}
            />
          ))}
        </div>
      </div>

      {/* Recommended Tracks (Có thể bạn thích) */}
      <div className="space-y-3">
        <div className="px-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
              Gợi ý theo gu âm nhạc
            </span>
            <h2 className="text-base font-extrabold text-white tracking-tight mt-0.5">
              Có Thể Bạn Thích
            </h2>
          </div>
        </div>

        {/* Horizontal Carousel */}
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar px-4 pb-1">
          {recommendedSongs.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      </div>
    </div>
  );
};
