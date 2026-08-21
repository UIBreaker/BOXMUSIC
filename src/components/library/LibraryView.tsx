import React, { useState } from 'react';
import { useMusic } from '../../context/MusicPlayerContext';
import { MOCK_SONGS } from '../../data/mockData';
import type { Playlist, Song } from '../../types/music';
import { SongListItem } from '../common/SongListItem';
import { SongCard } from '../common/SongCard';
import { CreatePlaylistModal } from './CreatePlaylistModal';
import { PlaylistDetailModal } from './PlaylistDetailModal';
import {
  Heart,
  Plus,
  LayoutGrid,
  List,
  FolderHeart,
  Music4,
  Play,
  Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';

type LibraryFilter = 'all' | 'playlists' | 'liked';

export const LibraryView: React.FC = () => {
  const {
    likedSongIds,
    userPlaylists,
    playSong,
    accentTheme,
    selectedPlaylist,
    setSelectedPlaylist,
    isCreatePlaylistOpen,
    setIsCreatePlaylistOpen,
  } = useMusic();

  const [filter, setFilter] = useState<LibraryFilter>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const likedSongs: Song[] = MOCK_SONGS.filter((s) => likedSongIds.has(s.id));

  const handlePlayLikedSongs = () => {
    if (likedSongs.length > 0) {
      playSong(likedSongs[0], likedSongs);
    }
  };

  const filterTabs: { id: LibraryFilter; label: string }[] = [
    { id: 'all', label: 'Tất cả' },
    { id: 'playlists', label: 'Danh sách phát' },
    { id: 'liked', label: 'Đã thích' },
  ];

  return (
    <div className="space-y-4 px-4 select-none text-left pb-28 md:pb-8">
      {/* Top Library Title & Add Button */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <FolderHeart className="w-5 h-5" style={{ color: accentTheme.color }} />
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Thư Viện Của Tôi
          </h1>
        </div>

        <div className="flex items-center gap-2">
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
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-black shadow-md transition-transform active:scale-95 cursor-pointer"
            style={{
              backgroundColor: accentTheme.color,
              boxShadow: `0 0 12px ${accentTheme.glow}`,
            }}
          >
            <Plus className="w-4 h-4" />
            <span>Tạo mới</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {filterTabs.map((tab) => {
          const isActive = filter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'text-black shadow-md'
                  : 'glass-card text-zinc-400 hover:text-white'
              }`}
              style={{
                backgroundColor: isActive ? accentTheme.color : undefined,
              }}
            >
              {tab.label}
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
          {/* Ambient Glow */}
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
                {likedSongs.length} ca khúc yêu thích • Tự động đồng bộ
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

      {/* Create Playlist Modal */}
      <CreatePlaylistModal
        isOpen={isCreatePlaylistOpen}
        onClose={() => setIsCreatePlaylistOpen(false)}
      />

      {/* Playlist Detail Modal */}
      <PlaylistDetailModal
        playlist={selectedPlaylist}
        onClose={() => setSelectedPlaylist(null)}
      />
    </div>
  );
};
