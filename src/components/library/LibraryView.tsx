import React, { useState } from 'react';
import { useMusic } from '../../context/MusicPlayerContext';
import type { Playlist, Song } from '../../types/music';
import { SongListItem } from '../common/SongListItem';
import { SongCard } from '../common/SongCard';
import {
  Heart,
  Plus,
  LayoutGrid,
  List,
  FolderHeart,
  Music4,
  Play,
  Sparkles,
  ArrowDownToLine,
  HardDrive,
  Share2,
  UploadCloud,
  FileAudio,
} from 'lucide-react';
import { motion } from 'framer-motion';

type LibraryFilter = 'all' | 'liked' | 'custom' | 'offline' | 'playlists';

export const LibraryView: React.FC = () => {
  const {
    likedSongIds,
    userPlaylists,
    offlineSongIds,
    customSongs,
    allSongs,
    storageUsedBytes,
    playSong,
    accentTheme,
    setSelectedPlaylist,
    setIsCreatePlaylistOpen,
    setIsSyncModalOpen,
    setIsUploadModalOpen,
  } = useMusic();

  const [filter, setFilter] = useState<LibraryFilter>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const likedSongs: Song[] = allSongs.filter((s) => likedSongIds.has(s.id));
  const offlineSongs: Song[] = allSongs.filter((s) => offlineSongIds.has(s.id) || s.isCustomUpload);

  const handlePlayLikedSongs = () => {
    if (likedSongs.length > 0) {
      playSong(likedSongs[0], likedSongs);
    }
  };

  const handlePlayCustomSongs = () => {
    if (customSongs.length > 0) {
      playSong(customSongs[0], customSongs);
    }
  };

  const handlePlayOfflineSongs = () => {
    if (offlineSongs.length > 0) {
      playSong(offlineSongs[0], offlineSongs);
    }
  };

  const filterTabs: { id: LibraryFilter; label: string; count?: number }[] = [
    { id: 'all', label: 'Tất cả' },
    { id: 'liked', label: 'Đã thích', count: likedSongs.length },
    { id: 'custom', label: 'Nhạc của bạn (MP3/MP4)', count: customSongs.length },
    { id: 'offline', label: 'Đã tải về (Offline)', count: offlineSongs.length },
    { id: 'playlists', label: 'Danh sách phát', count: userPlaylists.length },
  ];

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 MB';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4 px-4 select-none text-left pb-28 md:pb-8">
      {/* Top Library Title & Sync/Upload/Add Buttons */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <FolderHeart className="w-5 h-5" style={{ color: accentTheme.color }} />
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Thư Viện Của Tôi
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Upload MP3/MP4 Button */}
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-black shadow-md transition-transform active:scale-95 cursor-pointer"
            style={{
              backgroundColor: accentTheme.color,
              boxShadow: `0 0 12px ${accentTheme.glow}`,
            }}
            title="Tải nhạc MP3 / MP4 từ máy"
          >
            <UploadCloud className="w-4 h-4" />
            <span className="hidden sm:inline">Thêm nhạc / URL</span>
          </button>

          {/* Sync & Backup Button */}
          <button
            onClick={() => setIsSyncModalOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold glass-card text-zinc-300 hover:text-white border border-white/10 hover:border-white/20 transition-all cursor-pointer"
            title="Đồng bộ đa thiết bị & Sao lưu"
          >
            <Share2 className="w-3.5 h-3.5 text-cyan-400" />
          </button>

          {/* Grid / List Switcher */}
          <button
            onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
            className="w-8 h-8 rounded-xl glass-card flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title={viewMode === 'list' ? 'Chế độ lưới' : 'Chế độ danh sách'}
          >
            {viewMode === 'list' ? (
              <LayoutGrid className="w-4 h-4" />
            ) : (
              <List className="w-4 h-4" />
            )}
          </button>

          {/* Create New Playlist Button */}
          <button
            onClick={() => setIsCreatePlaylistOpen(true)}
            className="w-8 h-8 rounded-xl glass-card flex items-center justify-center text-zinc-300 hover:text-white border border-white/10 transition-transform active:scale-95 cursor-pointer"
            title="Tạo playlist mới"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Storage & Offline Status Pill Banner */}
      <div className="p-3 rounded-2xl glass-card border border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <HardDrive className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-bold text-white">
              Bộ nhớ ngoại tuyến & Nhạc cá nhân:{' '}
              <span className="text-emerald-400">{formatBytes(storageUsedBytes)}</span>
            </p>
            <p className="text-[10px] text-zinc-400 truncate">
              {offlineSongs.length} bài hát sẵn sàng nghe khi không có mạng
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsSyncModalOpen(true)}
          className="text-[11px] font-bold text-cyan-400 hover:underline cursor-pointer flex-shrink-0"
        >
          Quản lý
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {filterTabs.map((tab) => {
          const isActive = filter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 flex-shrink-0 ${
                isActive
                  ? 'text-black shadow-md'
                  : 'glass-card text-zinc-400 hover:text-white'
              }`}
              style={{
                backgroundColor: isActive ? accentTheme.color : undefined,
              }}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-black/20 text-black font-bold' : 'bg-white/10 text-zinc-400'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Special "Liked Songs" Banner Card */}
      {(filter === 'all' || filter === 'liked') && (
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={handlePlayLikedSongs}
          className="relative p-5 rounded-3xl overflow-hidden cursor-pointer shadow-xl bg-gradient-to-br from-purple-700 via-indigo-900 to-slate-950 border border-white/15 flex items-center justify-between group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-pink-500/20 blur-2xl pointer-events-none" />

          <div className="flex items-center gap-3.5 z-10 min-w-0">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-400 flex items-center justify-center shadow-lg text-white flex-shrink-0">
              <Heart className="w-7 h-7 fill-white" />
            </div>

            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight flex items-center gap-1.5">
                Bài Hát Đã Thích
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              </h3>
              <p className="text-xs text-zinc-300 mt-0.5">
                {likedSongs.length} ca khúc yêu thích • Tự động lưu vĩnh viễn
              </p>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePlayLikedSongs();
            }}
            className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-2xl opacity-95 group-hover:scale-105 transition-transform flex-shrink-0 z-10 cursor-pointer"
            title="Phát tất cả bài đã thích"
          >
            <Play className="w-5 h-5 fill-black text-black ml-0.5" />
          </button>
        </motion.div>
      )}

      {/* Custom Uploaded Songs Tab */}
      {filter === 'custom' && (
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
              <FileAudio className="w-4 h-4 text-cyan-400" />
              Nhạc tự tải lên ({customSongs.length})
            </h3>
            {customSongs.length > 0 && (
              <button
                onClick={handlePlayCustomSongs}
                className="text-xs font-bold text-emerald-400 hover:underline cursor-pointer flex items-center gap-1"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Phát tất cả
              </button>
            )}
          </div>

          {customSongs.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 glass-card rounded-3xl p-6 space-y-3">
              <UploadCloud className="w-10 h-10 mx-auto opacity-40 text-cyan-400" />
              <div>
                <p className="text-xs font-bold text-zinc-300">Bạn chưa tải lên bài hát nào</p>
                <p className="text-[11px] text-zinc-500 mt-1 max-w-xs mx-auto">
                  Bấm vào nút "Tải nhạc lên" ở phía trên để thêm file MP3 / MP4 từ máy tính hoặc điện thoại!
                </p>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-black transition-transform active:scale-95 cursor-pointer shadow-lg inline-flex items-center gap-1.5"
                style={{ backgroundColor: accentTheme.color }}
              >
                <Plus className="w-4 h-4" />
                <span>Tải File MP3 / MP4 Ngay</span>
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              {customSongs.map((song, index) => (
                <SongListItem
                  key={song.id}
                  song={song}
                  index={index}
                  playlistContext={customSongs}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Offline Songs List (When filter is 'offline') */}
      {filter === 'offline' && (
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
              <ArrowDownToLine className="w-4 h-4 text-cyan-400" />
              Danh sách nhạc Offline ({offlineSongs.length})
            </h3>
            {offlineSongs.length > 0 && (
              <button
                onClick={handlePlayOfflineSongs}
                className="text-xs font-bold text-emerald-400 hover:underline cursor-pointer flex items-center gap-1"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Phát tất cả
              </button>
            )}
          </div>

          {offlineSongs.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 glass-card rounded-2xl p-6">
              <ArrowDownToLine className="w-8 h-8 mx-auto opacity-30 mb-2 text-cyan-400" />
              <p className="text-xs font-semibold text-zinc-300">Chưa có bài hát nào được lưu ngoại tuyến</p>
              <p className="text-[11px] text-zinc-500 mt-0.5 max-w-xs mx-auto">
                Bấm vào biểu tượng tải xuống (mũi tên) ở cạnh bài hát bất kỳ để nghe mà không cần Internet!
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {offlineSongs.map((song, index) => (
                <SongListItem
                  key={song.id}
                  song={song}
                  index={index}
                  playlistContext={offlineSongs}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Liked Songs List (When filter is 'liked') */}
      {filter === 'liked' && (
        <div className="space-y-1 pt-2">
          {likedSongs.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 glass-card rounded-2xl p-6">
              <Heart className="w-8 h-8 mx-auto opacity-30 mb-2" />
              <p className="text-xs font-semibold">Bạn chưa thích bài hát nào</p>
              <p className="text-[11px] text-zinc-600 mt-0.5">
                Hãy bấm vào biểu tượng trái tim trên các bài hát để lưu lại!
              </p>
            </div>
          ) : (
            likedSongs.map((song, index) => (
              <SongListItem
                key={song.id}
                song={song}
                index={index}
                playlistContext={likedSongs}
              />
            ))
          )}
        </div>
      )}

      {/* Playlists (When filter is 'all' or 'playlists') */}
      {(filter === 'all' || filter === 'playlists') && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
              <Music4 className="w-4 h-4 text-emerald-400" />
              Danh sách phát ({userPlaylists.length})
            </h3>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {userPlaylists.map((pl: Playlist) => (
                <SongCard
                  key={pl.id}
                  playlist={pl}
                  onSelectPlaylist={setSelectedPlaylist}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-1.5">
              {userPlaylists.map((playlist: Playlist) => (
                <div
                  key={playlist.id}
                  onClick={() => setSelectedPlaylist(playlist)}
                  className="p-2.5 rounded-2xl glass-card border border-white/5 hover:border-white/15 flex items-center justify-between cursor-pointer group transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <img
                      src={playlist.coverUrl}
                      alt={playlist.title}
                      className="w-12 h-12 rounded-xl object-cover shadow flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-white group-hover:text-emerald-400 truncate">
                        {playlist.title}
                      </p>
                      <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                        {playlist.author || 'BOXMUSIC'} • {playlist.songIds.length} bài
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 pr-1">
                    <span className="text-[10px] text-zinc-500 font-medium">
                      {playlist.updatedAt || 'Hôm nay'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
