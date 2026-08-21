import React from 'react';
import type { Playlist, Song } from '../../types/music';
import { SongCard } from '../common/SongCard';
import { Sparkles, UploadCloud } from 'lucide-react';
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
  const { accentTheme, setIsUploadModalOpen } = useMusic();

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
              Tuyển Tập Của Bạn
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
      {recommendedSongs.length > 0 ? (
        <div className="space-y-3">
          <div className="px-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
                Nhạc của bạn
              </span>
              <h2 className="text-base font-extrabold text-white tracking-tight mt-0.5">
                Bài Hát Đã Tải Lên ({recommendedSongs.length})
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
      ) : (
        <div className="px-4">
          <div className="p-6 rounded-3xl glass-card border border-white/5 text-center space-y-3">
            <UploadCloud className="w-8 h-8 mx-auto text-emerald-400 opacity-60" />
            <div>
              <h3 className="text-sm font-bold text-white">Chưa có bài hát nào trong danh sách</h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Tải lên file MP3 / MP4 từ máy tính hoặc điện thoại để bắt đầu tạo thư viện nhạc của riêng bạn!
              </p>
            </div>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-black transition-transform active:scale-95 cursor-pointer shadow-md inline-flex items-center gap-1.5"
              style={{ backgroundColor: accentTheme.color }}
            >
              <UploadCloud className="w-4 h-4" />
              <span>Tải Nhạc Lên Ngay (+ MP3/MP4)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
