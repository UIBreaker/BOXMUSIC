import React, { useState, useMemo } from 'react';
import { HeroBanner } from './HeroBanner';
import { MoodFilter } from './MoodFilter';
import { RecentlyPlayed } from './RecentlyPlayed';
import { ForYouSection } from './ForYouSection';
import { TopArtists } from './TopArtists';
import { TrendingCharts } from './TrendingCharts';
import { useMusic } from '../../context/MusicPlayerContext';
import { MOCK_ARTISTS } from '../../data/mockData';

export const HomeView: React.FC = () => {
  const { allSongs, history, userPlaylists, setSelectedArtist, setSelectedPlaylist } = useMusic();
  const [activeMood, setActiveMood] = useState<string>('Tất cả');

  // Filter songs based on active mood
  const moodFilteredSongs = useMemo(() => {
    if (activeMood === 'Tất cả') return allSongs;
    return allSongs.filter(
      (song) => song.mood?.includes(activeMood) || song.genre.includes(activeMood)
    );
  }, [activeMood, allSongs]);

  // Recently played items
  const recentItems = useMemo(() => {
    if (history.length > 0) {
      return [...history, ...userPlaylists].slice(0, 6);
    }
    return [...allSongs.slice(0, 4), ...userPlaylists.slice(0, 2)];
  }, [history, userPlaylists, allSongs]);

  return (
    <div className="space-y-6 pb-28 md:pb-8 text-left">
      {/* Top Grand Hero Banner on Desktop / Tablet */}
      <div className="px-4 pt-1">
        <HeroBanner />
      </div>

      {/* Mood Category Filter Chips */}
      <MoodFilter
        activeMood={activeMood}
        onSelectMood={setActiveMood}
      />

      {/* Recently Played Section */}
      {recentItems.length > 0 && (
        <RecentlyPlayed
          items={recentItems}
          onSelectPlaylist={setSelectedPlaylist}
        />
      )}

      {/* For You Section (Daily Mixes + Recommended Songs) */}
      <ForYouSection
        playlists={userPlaylists}
        recommendedSongs={moodFilteredSongs}
        onSelectPlaylist={setSelectedPlaylist}
      />

      {/* Trending Artists */}
      <TopArtists
        artists={MOCK_ARTISTS}
        onSelectArtist={setSelectedArtist}
      />

      {/* Trending Top 5 Charts */}
      {allSongs.length > 0 && <TrendingCharts songs={allSongs} />}
    </div>
  );
};
