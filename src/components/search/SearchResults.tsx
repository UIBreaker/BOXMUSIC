import React, { useState } from 'react';
import type { Song, Artist, Playlist } from '../../types/music';
import { SongListItem } from '../common/SongListItem';
import { SongCard } from '../common/SongCard';
import { Disc, Users, Music2, Search } from 'lucide-react';
import { useMusic } from '../../context/MusicPlayerContext';

interface SearchResultsProps {
  query: string;
  songs: Song[];
  artists: Artist[];
  playlists: Playlist[];
  onSelectArtist: (artist: Artist) => void;
  onSelectPlaylist: (playlist: Playlist) => void;
}

type SearchTab = 'all' | 'songs' | 'artists' | 'playlists';

export const SearchResults: React.FC<SearchResultsProps> = ({
  query,
  songs,
  artists,
  playlists,
  onSelectArtist,
  onSelectPlaylist,
}) => {
  const [activeTab, setActiveTab] = useState<SearchTab>('all');
  const { accentTheme } = useMusic();

  const filteredSongs = songs.filter(
    (s) =>
      s.title.toLowerCase().includes(query.toLowerCase()) ||
      s.artist.toLowerCase().includes(query.toLowerCase()) ||
      s.genre.toLowerCase().includes(query.toLowerCase())
  );

  const filteredArtists = artists.filter((a) =>
    a.name.toLowerCase().includes(query.toLowerCase())
  );

  const filteredPlaylists = playlists.filter(
    (p) =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase())
  );

  const totalResults =
    filteredSongs.length + filteredArtists.length + filteredPlaylists.length;

  const tabs: { id: SearchTab; label: string; count: number }[] = [
    { id: 'all', label: 'Tất cả', count: totalResults },
    { id: 'songs', label: 'Bài hát', count: filteredSongs.length },
    { id: 'artists', label: 'Ca sĩ', count: filteredArtists.length },
    { id: 'playlists', label: 'Playlists', count: filteredPlaylists.length },
  ];

  if (totalResults === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-zinc-500">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-3 border border-white/10">
          <Search className="w-8 h-8 opacity-40 text-zinc-400" />
        </div>
        <p className="text-sm font-bold text-zinc-300">Không tìm thấy kết quả cho "{query}"</p>
        <p className="text-xs text-zinc-500 mt-1 max-w-xs">
          Hãy thử kiểm tra lại chính tả hoặc tìm theo tên bài hát, ca sĩ khác.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 px-4 select-none text-left pb-6">
      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex-shrink-0 flex items-center gap-1.5 ${
                isActive
                  ? 'text-black shadow-md'
                  : 'glass-card text-zinc-400 hover:text-white'
              }`}
              style={{
                backgroundColor: isActive ? accentTheme.color : undefined,
              }}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-black/20 text-black font-bold' : 'bg-white/10 text-zinc-400'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Top Best Match Result (When in 'all' tab) */}
      {activeTab === 'all' && filteredSongs.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Kết quả hàng đầu
          </span>
          <div className="glass-panel p-3 rounded-2xl border border-white/10 flex items-center justify-between">
            <SongListItem
              song={filteredSongs[0]}
              playlistContext={filteredSongs}
              showIndex={false}
            />
          </div>
        </div>
      )}

      {/* Artists Section */}
      {(activeTab === 'all' || activeTab === 'artists') && filteredArtists.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-sky-400" />
              Nghệ sĩ
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {filteredArtists.map((artist) => (
              <div
                key={artist.id}
                onClick={() => onSelectArtist(artist)}
                className="p-3 rounded-2xl glass-card border border-white/5 hover:border-white/15 flex items-center gap-3 cursor-pointer group transition-all"
              >
                <img
                  src={artist.avatarUrl}
                  alt={artist.name}
                  className="w-12 h-12 rounded-full object-cover shadow"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white group-hover:text-emerald-400 truncate">
                    {artist.name}
                  </p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    {artist.monthlyListeners} người nghe
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Songs Section */}
      {(activeTab === 'all' || activeTab === 'songs') && filteredSongs.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <Disc className="w-3.5 h-3.5 text-emerald-400" />
            Bài hát ({filteredSongs.length})
          </span>

          <div className="space-y-1 glass-card rounded-2xl p-2 border border-white/5">
            {filteredSongs.map((song, idx) => (
              <SongListItem
                key={song.id}
                song={song}
                index={idx}
                playlistContext={filteredSongs}
              />
            ))}
          </div>
        </div>
      )}

      {/* Playlists Section */}
      {(activeTab === 'all' || activeTab === 'playlists') && filteredPlaylists.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <Music2 className="w-3.5 h-3.5 text-purple-400" />
            Playlists & Tuyển tập ({filteredPlaylists.length})
          </span>

          <div className="grid grid-cols-2 gap-3">
            {filteredPlaylists.map((pl) => (
              <SongCard
                key={pl.id}
                playlist={pl}
                onSelectPlaylist={onSelectPlaylist}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
