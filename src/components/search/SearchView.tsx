import React, { useState } from 'react';
import { SearchBar } from './SearchBar';
import { GenreGrid } from './GenreGrid';
import { SearchResults } from './SearchResults';
import { useMusic } from '../../context/MusicPlayerContext';
import { MOCK_ARTISTS } from '../../data/mockData';

export const SearchView: React.FC = () => {
  const { allSongs, userPlaylists, setSelectedArtist, setSelectedPlaylist } = useMusic();
  const [searchQuery, setSearchQuery] = useState<string>('');

  return (
    <div className="space-y-4 pb-28 md:pb-8 text-left">
      {/* Search Input Bar */}
      <SearchBar
        query={searchQuery}
        onChange={setSearchQuery}
        onClear={() => setSearchQuery('')}
      />

      {/* If user typed a query, show live search results, otherwise show browse genre grid */}
      {searchQuery.trim().length > 0 ? (
        <SearchResults
          query={searchQuery}
          songs={allSongs}
          artists={MOCK_ARTISTS}
          playlists={userPlaylists}
          onSelectArtist={setSelectedArtist}
          onSelectPlaylist={setSelectedPlaylist}
        />
      ) : (
        <GenreGrid
          onSelectGenre={(genreName) => setSearchQuery(genreName)}
        />
      )}
    </div>
  );
};
