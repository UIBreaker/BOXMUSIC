import React from 'react';
import { useMusic } from '../../context/MusicPlayerContext';
import { Trash2, Music2, Sparkles, Plus } from 'lucide-react';
import { MOCK_SONGS } from '../../data/mockData';
import type { Song } from '../../types/music';

export const QueueView: React.FC = () => {
  const {
    currentSong,
    queue,
    playSong,
    removeFromQueue,
    clearQueue,
    addToQueue,
    accentTheme,
  } = useMusic();

  const suggestedSongs = MOCK_SONGS.filter(
    (s: Song) => s.id !== currentSong?.id && !queue.some((q) => q.id === s.id)
  ).slice(0, 4);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5 no-scrollbar text-left">
      {/* Currently Playing Card */}
      {currentSong && (
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Đang phát
          </span>
          <div
            className="p-3 rounded-2xl glass-card border flex items-center justify-between shadow-lg"
            style={{
              borderColor: `${accentTheme.color}40`,
              boxShadow: `0 4px 20px -5px ${accentTheme.glow}`,
            }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={currentSong.coverUrl}
                alt={currentSong.title}
                className="w-12 h-12 rounded-xl object-cover shadow"
              />
              <div className="min-w-0">
                <p className="text-sm font-bold text-white truncate" style={{ color: accentTheme.color }}>
                  {currentSong.title}
                </p>
                <p className="text-xs text-zinc-400 truncate">{currentSong.artist}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-4 rounded-full bg-emerald-500 animate-pulse" />
              <span className="w-1.5 h-6 rounded-full bg-emerald-400 animate-pulse [animation-delay:-0.2s]" />
              <span className="w-1.5 h-3 rounded-full bg-emerald-500 animate-pulse [animation-delay:-0.4s]" />
            </div>
          </div>
        </div>
      )}

      {/* Up Next List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Danh sách chờ ({queue.length})
          </span>
          {queue.length > 0 && (
            <button
              onClick={clearQueue}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-medium transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Xóa tất cả
            </button>
          )}
        </div>

        {queue.length === 0 ? (
          <div className="py-8 text-center glass-card rounded-2xl p-6 border border-white/5">
            <Music2 className="w-8 h-8 mx-auto text-zinc-500 mb-2" />
            <p className="text-xs text-zinc-400 font-medium">Danh sách chờ đang trống</p>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              Thêm bài hát mới từ gợi ý bên dưới để tiếp tục nghe!
            </p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {queue.map((song, index) => (
              <div
                key={`${song.id}-${index}`}
                className="group p-2.5 rounded-xl glass-card flex items-center justify-between hover:bg-white/10 transition-all border border-white/5"
              >
                <div
                  onClick={() => playSong(song, queue)}
                  className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                >
                  <span className="text-xs font-bold text-zinc-500 w-4 text-center">
                    {index + 1}
                  </span>
                  <img
                    src={song.coverUrl}
                    alt={song.title}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-zinc-200 truncate group-hover:text-white">
                      {song.title}
                    </p>
                    <p className="text-[11px] text-zinc-400 truncate">{song.artist}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => removeFromQueue(index)}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-zinc-500 hover:text-rose-400 hover:bg-white/5 transition-colors cursor-pointer"
                    title="Xóa khỏi hàng đợi"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommended Songs to Add to Queue */}
      {suggestedSongs.length > 0 && (
        <div className="space-y-2 pt-2">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Gợi ý thêm vào hàng đợi</span>
          </div>

          <div className="space-y-1.5">
            {suggestedSongs.map((song) => (
              <div
                key={song.id}
                className="p-2.5 rounded-xl glass-card flex items-center justify-between border border-white/5"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <img
                    src={song.coverUrl}
                    alt={song.title}
                    className="w-9 h-9 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-zinc-200 truncate">{song.title}</p>
                    <p className="text-[11px] text-zinc-400 truncate">{song.artist}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => addToQueue(song)}
                    className="p-1.5 rounded-lg glass-panel hover:bg-white/15 text-zinc-300 hover:text-white transition-all cursor-pointer flex items-center gap-1 text-[11px] font-medium"
                    title="Thêm vào danh sách chờ"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Thêm
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
