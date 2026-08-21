import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import type {
  Song,
  Playlist,
  Artist,
  RepeatMode,
  MainTab,
  PlayerSubTab,
  DesktopRightPanelTab,
  AudioQuality,
  AccentTheme,
} from '../types/music';
import { MOCK_SONGS, MOCK_PLAYLISTS, ACCENT_THEMES } from '../data/mockData';
import {
  getStoredLikedSongs,
  saveStoredLikedSongs,
  getStoredPlaylists,
  saveStoredPlaylists,
  getStoredOfflineSongIds,
  saveStoredOfflineSongIds,
  getStoredTheme,
  saveStoredTheme,
  saveAudioBlobOffline,
  removeAudioBlobOffline,
  getOfflineAudioBlobUrl,
  calculateTotalStorageUsed,
  clearAllOfflineCache,
  generateBackupJSON,
  parseBackupJSON,
} from '../services/storageService';
import confetti from 'canvas-confetti';

interface MusicContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  repeatMode: RepeatMode;
  isFullScreen: boolean;
  playerSubTab: PlayerSubTab;
  mainTab: MainTab;
  accentTheme: AccentTheme;
  queue: Song[];
  history: Song[];
  likedSongIds: Set<string>;
  userPlaylists: Playlist[];
  turntableMode: boolean;
  
  // Offline & Storage States
  offlineSongIds: Set<string>;
  storageUsedBytes: number;
  isSyncModalOpen: boolean;
  downloadingSongIds: Set<string>;

  // Desktop Pro States
  desktopRightPanelTab: DesktopRightPanelTab;
  isDesktopRightPanelOpen: boolean;
  audioQuality: AudioQuality;
  selectedArtist: Artist | null;
  selectedPlaylist: Playlist | null;
  isCreatePlaylistOpen: boolean;

  // Actions
  playSong: (song: Song, newQueue?: Song[]) => void;
  togglePlay: () => void;
  nextSong: () => void;
  prevSong: () => void;
  seekTo: (time: number) => void;
  setVolume: (val: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  toggleLike: (songId: string, event?: React.MouseEvent) => void;
  setIsFullScreen: (val: boolean) => void;
  setPlayerSubTab: (tab: PlayerSubTab) => void;
  setMainTab: (tab: MainTab) => void;
  setAccentTheme: (theme: AccentTheme) => void;
  addToQueue: (song: Song) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  createUserPlaylist: (title: string, description: string) => void;
  addSongToPlaylist: (playlistId: string, songId: string) => void;
  toggleTurntableMode: () => void;
  getAudioWaveform: () => number[];
  
  // Offline & Storage Actions
  toggleOfflineDownload: (song: Song) => Promise<void>;
  clearAllOfflineStorage: () => Promise<void>;
  exportLibraryBackup: () => void;
  importLibraryBackup: (jsonStr: string) => boolean;
  setIsSyncModalOpen: (val: boolean) => void;

  // Desktop Panel actions
  setDesktopRightPanelTab: (tab: DesktopRightPanelTab) => void;
  setIsDesktopRightPanelOpen: (val: boolean) => void;
  setAudioQuality: (q: AudioQuality) => void;
  setSelectedArtist: (artist: Artist | null) => void;
  setSelectedPlaylist: (playlist: Playlist | null) => void;
  setIsCreatePlaylistOpen: (val: boolean) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicPlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(MOCK_SONGS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(MOCK_SONGS[0].duration);
  const [volume, setVolumeState] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('all');
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [playerSubTab, setPlayerSubTab] = useState<PlayerSubTab>('player');
  const [mainTab, setMainTab] = useState<MainTab>('home');
  
  // Load persistent states
  const [accentTheme, setAccentThemeState] = useState<AccentTheme>(() =>
    getStoredTheme(ACCENT_THEMES[0])
  );
  const [queue, setQueue] = useState<Song[]>(MOCK_SONGS.slice(1));
  const [history, setHistory] = useState<Song[]>([]);
  const [likedSongIds, setLikedSongIds] = useState<Set<string>>(() =>
    getStoredLikedSongs(MOCK_SONGS.filter((s) => s.isLiked).map((s) => s.id))
  );
  const [userPlaylists, setUserPlaylists] = useState<Playlist[]>(() =>
    getStoredPlaylists(MOCK_PLAYLISTS)
  );
  const [turntableMode, setTurntableMode] = useState<boolean>(false);

  // Offline & Sync States
  const [offlineSongIds, setOfflineSongIds] = useState<Set<string>>(() =>
    getStoredOfflineSongIds()
  );
  const [storageUsedBytes, setStorageUsedBytes] = useState<number>(0);
  const [downloadingSongIds, setDownloadingSongIds] = useState<Set<string>>(new Set());
  const [isSyncModalOpen, setIsSyncModalOpen] = useState<boolean>(false);

  // Desktop Pro States
  const [desktopRightPanelTab, setDesktopRightPanelTab] = useState<DesktopRightPanelTab>('nowPlaying');
  const [isDesktopRightPanelOpen, setIsDesktopRightPanelOpen] = useState<boolean>(true);
  const [audioQuality, setAudioQuality] = useState<AudioQuality>('lossless');
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState<boolean>(false);

  // Audio element ref
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthIntervalRef = useRef<number | null>(null);

  // Update storage size calculation on mount and state changes
  const refreshStorageSize = async () => {
    const bytes = await calculateTotalStorageUsed();
    setStorageUsedBytes(bytes);
  };

  useEffect(() => {
    refreshStorageSize();
  }, [offlineSongIds]);

  // Initialize Audio
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    audio.preload = 'metadata';
    audio.volume = volume;

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(Math.floor(audio.duration));
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(Math.floor(audio.currentTime));
    };

    const handleEnded = () => {
      handleSongEnded();
    };

    const handleError = () => {
      // Fallback timer handles smoothly
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.pause();
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  // Sync theme css variable to root
  useEffect(() => {
    document.documentElement.style.setProperty('--accent-color', accentTheme.color);
    document.documentElement.style.setProperty('--accent-glow', accentTheme.glow);
    saveStoredTheme(accentTheme);
  }, [accentTheme]);

  // Audio timer ticker fallback
  useEffect(() => {
    if (isPlaying) {
      synthIntervalRef.current = window.setInterval(() => {
        setCurrentTime((prev) => {
          const maxDur = currentSong?.duration || 200;
          if (prev >= maxDur) {
            handleSongEnded();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (synthIntervalRef.current) {
        clearInterval(synthIntervalRef.current);
      }
    }
    return () => {
      if (synthIntervalRef.current) {
        clearInterval(synthIntervalRef.current);
      }
    };
  }, [isPlaying, currentSong]);

  const handleSongEnded = () => {
    if (repeatMode === 'one') {
      seekTo(0);
      playSong(currentSong!);
    } else {
      nextSong();
    }
  };

  const playSong = async (song: Song, newQueue?: Song[]) => {
    setCurrentSong(song);
    setDuration(song.duration);
    setCurrentTime(0);
    setIsPlaying(true);

    if (newQueue) {
      const filtered = newQueue.filter((s) => s.id !== song.id);
      setQueue(filtered);
    }

    // Add to history
    setHistory((prev) => [song, ...prev.filter((s) => s.id !== song.id)].slice(0, 20));

    if (audioRef.current) {
      // Check if song is cached offline in IndexedDB
      const offlineBlobUrl = await getOfflineAudioBlobUrl(song.id);
      audioRef.current.src = offlineBlobUrl || song.audioUrl;
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        // Fallback handles smoothly
      });
    }
  };

  const togglePlay = () => {
    if (!currentSong) {
      if (MOCK_SONGS.length > 0) {
        playSong(MOCK_SONGS[0]);
      }
      return;
    }

    if (isPlaying) {
      if (audioRef.current) audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (audioRef.current) {
        audioRef.current.play().catch(() => {});
      }
      setIsPlaying(true);
    }
  };

  const nextSong = () => {
    if (queue.length === 0) {
      if (repeatMode === 'all' && history.length > 0) {
        const resetQueue = [...MOCK_SONGS];
        const next = resetQueue[0];
        playSong(next, resetQueue);
      } else {
        setIsPlaying(false);
      }
      return;
    }

    let nextTrack: Song;
    let newQueue: Song[];

    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * queue.length);
      nextTrack = queue[randomIndex];
      newQueue = queue.filter((_, idx) => idx !== randomIndex);
    } else {
      nextTrack = queue[0];
      newQueue = queue.slice(1);
    }

    playSong(nextTrack, newQueue);
  };

  const prevSong = () => {
    if (currentTime > 4) {
      seekTo(0);
      return;
    }

    if (history.length > 1) {
      const prevTrack = history[1];
      const updatedHistory = history.slice(1);
      setHistory(updatedHistory);
      if (currentSong) {
        setQueue([currentSong, ...queue]);
      }
      playSong(prevTrack);
    } else {
      seekTo(0);
    }
  };

  const seekTo = (time: number) => {
    const clamped = Math.max(0, Math.min(time, duration));
    setCurrentTime(clamped);
    if (audioRef.current && !isNaN(clamped)) {
      audioRef.current.currentTime = clamped;
    }
  };

  const setVolume = (val: number) => {
    const clamped = Math.max(0, Math.min(val, 1));
    setVolumeState(clamped);
    if (audioRef.current) {
      audioRef.current.volume = clamped;
    }
    if (clamped === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      if (audioRef.current) audioRef.current.volume = volume || 0.8;
    } else {
      setIsMuted(true);
      if (audioRef.current) audioRef.current.volume = 0;
    }
  };

  const toggleShuffle = () => {
    setIsShuffle((prev) => !prev);
  };

  const toggleRepeat = () => {
    setRepeatMode((prev) => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  };

  const toggleLike = (songId: string, event?: React.MouseEvent) => {
    setLikedSongIds((prev) => {
      const next = new Set(prev);
      if (next.has(songId)) {
        next.delete(songId);
      } else {
        next.add(songId);
        // Trigger subtle confetti burst on like
        if (event) {
          const rect = event.currentTarget.getBoundingClientRect();
          const x = (rect.left + rect.width / 2) / window.innerWidth;
          const y = (rect.top + rect.height / 2) / window.innerHeight;
          confetti({
            particleCount: 30,
            spread: 65,
            origin: { x, y },
            colors: [accentTheme.color, '#F43F5E', '#EC4899', '#FFF'],
            ticks: 120,
            gravity: 1.2,
            scalar: 0.85,
          });
        }
      }
      saveStoredLikedSongs(next);
      return next;
    });
  };

  const addToQueue = (song: Song) => {
    setQueue((prev) => [...prev, song]);
  };

  const removeFromQueue = (index: number) => {
    setQueue((prev) => prev.filter((_, idx) => idx !== index));
  };

  const clearQueue = () => {
    setQueue([]);
  };

  const createUserPlaylist = (title: string, description: string) => {
    const newPlaylist: Playlist = {
      id: `user_p_${Date.now()}`,
      title: title || 'Playlist Mới Của Tôi',
      description: description || 'Playlist tuyển tập cá nhân',
      coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop',
      trackCount: 0,
      songIds: [],
      isPersonal: true,
      author: 'Bạn',
      updatedAt: 'Vừa tạo',
      gradient: 'from-emerald-600 via-teal-900 to-slate-950',
    };
    setUserPlaylists((prev) => {
      const updated = [newPlaylist, ...prev];
      saveStoredPlaylists(updated);
      return updated;
    });
  };

  const addSongToPlaylist = (playlistId: string, songId: string) => {
    setUserPlaylists((prev) => {
      const updated = prev.map((pl) => {
        if (pl.id === playlistId) {
          if (pl.songIds.includes(songId)) return pl;
          return {
            ...pl,
            songIds: [...pl.songIds, songId],
            trackCount: pl.songIds.length + 1,
            updatedAt: 'Vừa cập nhật',
          };
        }
        return pl;
      });
      saveStoredPlaylists(updated);
      return updated;
    });
  };

  const toggleTurntableMode = () => {
    setTurntableMode((prev) => !prev);
  };

  // Offline Download handler
  const toggleOfflineDownload = async (song: Song) => {
    const isDownloaded = offlineSongIds.has(song.id);
    if (isDownloaded) {
      await removeAudioBlobOffline(song.id);
      setOfflineSongIds((prev) => {
        const next = new Set(prev);
        next.delete(song.id);
        saveStoredOfflineSongIds(next);
        return next;
      });
    } else {
      setDownloadingSongIds((prev) => new Set(prev).add(song.id));
      const success = await saveAudioBlobOffline(song);
      setDownloadingSongIds((prev) => {
        const next = new Set(prev);
        next.delete(song.id);
        return next;
      });
      if (success) {
        setOfflineSongIds((prev) => {
          const next = new Set(prev).add(song.id);
          saveStoredOfflineSongIds(next);
          return next;
        });
      }
    }
    refreshStorageSize();
  };

  const clearAllOfflineStorage = async () => {
    await clearAllOfflineCache();
    setOfflineSongIds(new Set());
    setStorageUsedBytes(0);
  };

  // Export / Import library backup
  const exportLibraryBackup = () => {
    const jsonStr = generateBackupJSON(likedSongIds, userPlaylists, offlineSongIds);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `boxmusic-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importLibraryBackup = (jsonStr: string): boolean => {
    const backup = parseBackupJSON(jsonStr);
    if (!backup) return false;

    const newLiked = new Set(backup.likedSongIds);
    setLikedSongIds(newLiked);
    saveStoredLikedSongs(newLiked);

    if (backup.userPlaylists) {
      setUserPlaylists(backup.userPlaylists);
      saveStoredPlaylists(backup.userPlaylists);
    }

    if (backup.offlineSongIds) {
      const newOffline = new Set(backup.offlineSongIds);
      setOfflineSongIds(newOffline);
      saveStoredOfflineSongIds(newOffline);
    }
    return true;
  };

  // Generate simulated dynamic waveform bars for visualizer
  const getAudioWaveform = () => {
    if (!isPlaying) {
      return [15, 20, 15, 10, 25, 15, 20, 10, 15, 20, 15, 10];
    }
    const time = currentTime;
    return Array.from({ length: 16 }, (_, i) => {
      const base = 25;
      const variation = Math.sin(time * 3 + i * 0.8) * 35 + Math.cos(time * 2 + i * 0.5) * 25;
      return Math.max(12, Math.min(95, Math.abs(base + variation)));
    });
  };

  const setAccentTheme = (theme: AccentTheme) => {
    setAccentThemeState(theme);
    saveStoredTheme(theme);
  };

  return (
    <MusicContext.Provider
      value={{
        currentSong,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        isShuffle,
        repeatMode,
        isFullScreen,
        playerSubTab,
        mainTab,
        accentTheme,
        queue,
        history,
        likedSongIds,
        userPlaylists,
        turntableMode,
        offlineSongIds,
        storageUsedBytes,
        isSyncModalOpen,
        downloadingSongIds,
        desktopRightPanelTab,
        isDesktopRightPanelOpen,
        audioQuality,
        selectedArtist,
        selectedPlaylist,
        isCreatePlaylistOpen,
        playSong,
        togglePlay,
        nextSong,
        prevSong,
        seekTo,
        setVolume,
        toggleMute,
        toggleShuffle,
        toggleRepeat,
        toggleLike,
        setIsFullScreen,
        setPlayerSubTab,
        setMainTab,
        setAccentTheme,
        addToQueue,
        removeFromQueue,
        clearQueue,
        createUserPlaylist,
        addSongToPlaylist,
        toggleTurntableMode,
        getAudioWaveform,
        toggleOfflineDownload,
        clearAllOfflineStorage,
        exportLibraryBackup,
        importLibraryBackup,
        setIsSyncModalOpen,
        setDesktopRightPanelTab,
        setIsDesktopRightPanelOpen,
        setAudioQuality,
        setSelectedArtist,
        setSelectedPlaylist,
        setIsCreatePlaylistOpen,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = (): MusicContextType => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicPlayerProvider');
  }
  return context;
};
