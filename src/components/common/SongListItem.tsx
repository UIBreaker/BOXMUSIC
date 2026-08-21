import React, { useState } from 'react';
import type { Song } from '../../types/music';
import { useMusic } from '../../context/MusicPlayerContext';
import {
  Play,
  Heart,
  MoreVertical,
  ListPlus,
  FolderPlus,
  ArrowDownToLine,
  CheckCircle2,
  Loader2,
  Trash2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SongListItemProps {
  song: Song;
  index?: number;
  playlistContext?: Song[];
  showIndex?: boolean;
}

export const SongListItem: React.FC<SongListItemProps> = ({
  song,
  index,
  playlistContext,
  showIndex = true,
}) => {
  const {
    currentSong,
    isPlaying,
    playSong,
    toggleLike,
    likedSongIds,
    addToQueue,
    userPlaylists,
    addSongToPlaylist,
    accentTheme,
    offlineSongIds,
    downloadingSongIds,
    toggleOfflineDownload,
    deleteSong,
  } = useMusic();

  const [showMenu, setShowMenu] = useState(false);
  const [showPlaylistPicker, setShowPlaylistPicker] = useState(false);

  const isCurrent = currentSong?.id === song.id;
  const isLiked = likedSongIds.has(song.id);
  const isDownloaded = offlineSongIds.has(song.id) || song.isCustomUpload;
  const isDownloading = downloadingSongIds.has(song.id);

  const formatTime = (secs: number) => {
    const min = Math.floor(secs / 60);
    const sec = Math.floor(secs % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const handlePlay = () => {
    playSong(song, playlistContext);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleOfflineDownload(song);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Bạn có chắc muốn xóa bài hát "${song.title}" khỏi thư viện?`)) {
      deleteSong(song.id);
      setShowMenu(false);
    }
  };

  return (
    <div
      className={`group relative flex items-center justify-between p-2 rounded-2xl transition-all duration-200 cursor-pointer ${
        isCurrent
          ? 'bg-white/10 shadow-sm border border-white/10'
          : 'hover:bg-white/5 border border-transparent'
      }`}
      onClick={handlePlay}
    >
      {/* Left side: Index/Wave + Cover + Info */}
      <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
        {/* Track Number / Equalizer Animation */}
        {showIndex && (
          <div className="w-5 text-center flex-shrink-0 flex items-center justify-center">
            {isCurrent && isPlaying ? (
              <div className="flex items-end gap-0.5 h-3.5">
                <span className="w-1 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1 bg-emerald-400 rounded-full animate-bounce" />
              </div>
            ) : (
              <span
                className={`text-xs font-bold transition-colors ${
                  isCurrent ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'
                }`}
                style={{ color: isCurrent ? accentTheme.color : undefined }}
              >
                {index !== undefined ? index + 1 : '•'}
              </span>
            )}
          </div>
        )}

        {/* Thumbnail */}
        <div className="relative w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 bg-zinc-800 shadow">
          <img
            src={song.coverUrl}
            alt={song.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Hover Play overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Play className="w-4 h-4 text-white fill-white ml-0.5" />
          </div>
        </div>

        {/* Title & Artist */}
        <div className="min-w-0 flex-1 text-left">
          <div className="flex items-center gap-1.5">
            <p
              className={`text-xs font-bold truncate transition-colors ${
                isCurrent ? 'text-white' : 'text-zinc-200 group-hover:text-white'
              }`}
              style={{ color: isCurrent ? accentTheme.color : undefined }}
            >
              {song.title}
            </p>
            {isDownloaded && (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20 flex-shrink-0" />
            )}
            {song.isCustomUpload && (
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 font-extrabold uppercase flex-shrink-0">
                Tải lên
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-zinc-400 truncate">
            <span className="truncate">{song.artist}</span>
            <span>•</span>
            <span className="text-[10px] text-zinc-500">{formatTime(song.duration)}</span>
          </div>
        </div>
      </div>

      {/* Right side: Offline Download + Like + Menu */}
      <div
        className="flex items-center gap-1 flex-shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Offline Download Button (hide if already custom uploaded) */}
        {!song.isCustomUpload && (
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              isDownloaded
                ? 'text-emerald-400'
                : 'text-zinc-500 hover:text-zinc-200 opacity-80 sm:opacity-0 group-hover:opacity-100'
            }`}
            title={isDownloaded ? 'Đã lưu ngoại tuyến (Bấm để xóa)' : 'Tải về nghe ngoại tuyến'}
          >
            {isDownloading ? (
              <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
            ) : isDownloaded ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <ArrowDownToLine className="w-4 h-4" />
            )}
          </button>
        )}

        {/* Like Button */}
        <button
          onClick={(e) => toggleLike(song.id, e)}
          className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-500 hover:text-white transition-transform active:scale-75 cursor-pointer"
          title="Yêu thích"
        >
          <Heart
            className={`w-4 h-4 transition-colors duration-200 ${
              isLiked ? 'text-rose-500 fill-rose-500' : 'text-zinc-500 group-hover:text-zinc-300'
            }`}
          />
        </button>

        {/* 3-dots Menu Button */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-500 hover:text-zinc-200 hover:bg-white/5 transition-colors cursor-pointer"
            title="Tùy chọn khác"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => {
                    setShowMenu(false);
                    setShowPlaylistPicker(false);
                  }}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 5 }}
                  className="absolute right-0 top-9 z-50 p-2 rounded-2xl glass-panel shadow-2xl border border-white/15 w-52 text-left space-y-1"
                >
                  <button
                    onClick={() => {
                      addToQueue(song);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-300 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <ListPlus className="w-4 h-4 text-emerald-400" />
                    <span>Thêm vào hàng đợi</span>
                  </button>

                  {!song.isCustomUpload && (
                    <button
                      onClick={handleDownload}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-300 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      <ArrowDownToLine className="w-4 h-4 text-cyan-400" />
                      <span>{isDownloaded ? 'Xóa khỏi bộ nhớ Offline' : 'Tải về nghe Offline'}</span>
                    </button>
                  )}

                  <button
                    onClick={() => setShowPlaylistPicker(!showPlaylistPicker)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-zinc-300 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <FolderPlus className="w-4 h-4 text-purple-400" />
                      <span>Thêm vào Playlist</span>
                    </div>
                  </button>

                  {/* Nested Playlist List */}
                  {showPlaylistPicker && (
                    <div className="pl-3 py-1 space-y-1 border-l-2 border-white/10 ml-2">
                      {userPlaylists.map((pl) => (
                        <button
                          key={pl.id}
                          onClick={() => {
                            addSongToPlaylist(pl.id, song.id);
                            setShowMenu(false);
                            setShowPlaylistPicker(false);
                          }}
                          className="w-full text-left px-2 py-1.5 rounded-lg text-[11px] text-zinc-400 hover:text-white hover:bg-white/10 truncate font-medium block"
                        >
                          + {pl.title}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Delete option for custom songs or removing from library */}
                  {song.isCustomUpload && (
                    <button
                      onClick={handleDelete}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Xóa bài hát khỏi máy</span>
                    </button>
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
