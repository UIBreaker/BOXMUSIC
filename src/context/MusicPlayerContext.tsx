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
  getStoredCustomSongsMeta,
  saveStoredCustomSongsMeta,
  getStoredTheme,
  saveStoredTheme,
  saveCustomSongToIndexedDB,
  getCustomSongBlob,
  getCustomSongBlobUrl,
  deleteCustomSongFromIndexedDB,
  saveAudioBlobOffline,
  removeAudioBlobOffline,
  getOfflineAudioBlobUrl,
  calculateTotalStorageUsed,
  clearAllOfflineCache,
  generateBackupJSON,
  parseBackupJSON,
} from '../services/storageService';
import {
  fetchCloudSongs,
  uploadSongToCloud,
  addUrlSongToCloud,
  deleteSongFromCloud,
  subscribeToSongUpdates,
} from '../services/supabase';
import { extractYouTubeId } from '../services/urlSongService';
import confetti from 'canvas-confetti';
import {
  updateMediaSession,
  setMediaSessionHandlers,
  setMediaSessionPlaybackState,
  extractDominantColor,
  haptic,
} from '../services/mobileFeatures';

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
  
  // Custom Uploads & Offline States
  customSongs: Song[];
  allSongs: Song[];
  offlineSongIds: Set<string>;
  storageUsedBytes: number;
  isSyncModalOpen: boolean;
  isUploadModalOpen: boolean;
  downloadingSongIds: Set<string>;
  isCloudLoading: boolean;

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
  
  // Custom Upload & Delete Actions
  uploadCustomSong: (file: File, meta: { title: string; artist: string; album?: string; coverUrl?: string }) => Promise<Song>;
  addSongByUrl: (meta: { title: string; artist: string; album?: string; coverUrl?: string; audioUrl: string; duration?: number; youtubeId?: string; videoPreviewStart?: number }) => Promise<Song>;
  deleteSong: (songId: string) => Promise<void>;
  setIsUploadModalOpen: (val: boolean) => void;

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

  // Dynamic Color & Sleep Timer
  dynamicCoverColor: string | null;
  setSleepTimer: (minutes: number | null) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicPlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Custom songs list
  const [customSongs, setCustomSongs] = useState<Song[]>(() => getStoredCustomSongsMeta());
  const [isCloudLoading, setIsCloudLoading] = useState<boolean>(false);

  const [currentSong, setCurrentSong] = useState<Song | null>(() => {
    const stored = getStoredCustomSongsMeta();
    return stored.length > 0 ? stored[0] : null;
  });
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(() => {
    const stored = getStoredCustomSongsMeta();
    return stored.length > 0 ? stored[0].duration : 0;
  });
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
  const [queue, setQueue] = useState<Song[]>(() => {
    const stored = getStoredCustomSongsMeta();
    return stored.length > 1 ? stored.slice(1) : [];
  });
  const [history, setHistory] = useState<Song[]>([]);
  const [likedSongIds, setLikedSongIds] = useState<Set<string>>(() =>
    getStoredLikedSongs([])
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
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);

  // Dynamic Album Cover Color
  const [dynamicCoverColor, setDynamicCoverColor] = useState<string | null>(null);

  // Sleep Timer
  const sleepTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  // All songs combined
  const allSongs = [...customSongs, ...MOCK_SONGS];

  // Auto sync any local songs to Cloud if they were saved locally before Cloud was active
  const syncLocalSongsToCloud = async () => {
    const localList = getStoredCustomSongsMeta();
    for (const song of localList) {
      if (!song.audioUrl || !song.audioUrl.startsWith('http')) {
        try {
          const blob = await getCustomSongBlob(song.id);
          if (blob) {
            const file = new File([blob], `${song.title || 'song'}.mp3`, {
              type: blob.type || 'audio/mpeg',
            });
            const res = await uploadSongToCloud(file, {
              title: song.title,
              artist: song.artist,
              album: song.album,
              coverUrl: song.coverUrl,
            });
            if (res.song) {
              setCustomSongs((prev) => {
                const updated = prev.map((s) => (s.id === song.id ? res.song! : s));
                saveStoredCustomSongsMeta(updated);
                return updated;
              });
            }
          }
        } catch (err) {
          console.warn('Auto sync song failed:', err);
        }
      }
    }
  };

  // Refresh songs from Supabase Cloud on mount & Realtime
  const loadCloudSongs = async () => {
    setIsCloudLoading(true);
    const cloudSongs = await fetchCloudSongs();
    if (cloudSongs.length > 0) {
      setCustomSongs((prev) => {
        // Merge cloud songs with existing local songs avoiding duplicates
        const map = new Map<string, Song>();
        cloudSongs.forEach((s) => map.set(s.id, s));
        prev.forEach((s) => {
          if (!map.has(s.id)) map.set(s.id, s);
        });
        const merged = Array.from(map.values());
        saveStoredCustomSongsMeta(merged);
        return merged;
      });

      // If currentSong is null, select the first cloud song
      setCurrentSong((prev) => prev || cloudSongs[0]);
      setDuration((prev) => prev || cloudSongs[0].duration);
    }
    setIsCloudLoading(false);
  };

  useEffect(() => {
    loadCloudSongs().then(() => {
      syncLocalSongsToCloud();
    });

    // Subscribe to realtime updates from other devices
    const unsubscribe = subscribeToSongUpdates(() => {
      loadCloudSongs();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Refresh storage calculation
  const refreshStorageSize = async () => {
    const bytes = await calculateTotalStorageUsed();
    setStorageUsedBytes(bytes);
  };

  useEffect(() => {
    refreshStorageSize();
  }, [offlineSongIds, customSongs]);

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

  // Register Media Session action handlers (lock screen controls)
  useEffect(() => {
    setMediaSessionHandlers({
      onPlay: () => { if (audioRef.current) { audioRef.current.play().catch(() => {}); setIsPlaying(true); setMediaSessionPlaybackState('playing'); } },
      onPause: () => { if (audioRef.current) audioRef.current.pause(); setIsPlaying(false); setMediaSessionPlaybackState('paused'); },
      onNextTrack: () => nextSong(),
      onPreviousTrack: () => prevSong(),
      onSeekForward: () => { if (audioRef.current) audioRef.current.currentTime = Math.min(audioRef.current.duration, audioRef.current.currentTime + 10); },
      onSeekBackward: () => { if (audioRef.current) audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10); },
    });
  }, []);

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

    // Media Session API — update lock screen / notification info
    updateMediaSession({
      title: song.title,
      artist: song.artist,
      album: song.album,
      coverUrl: song.coverUrl,
    });
    setMediaSessionPlaybackState('playing');

    // Extract dominant color from album art for dynamic background
    if (song.coverUrl) {
      extractDominantColor(song.coverUrl).then((color) => {
        setDynamicCoverColor(color);
      });
    }

    const isYt = song.isYoutube || !!song.youtubeId || song.audioUrl?.includes('youtube.com') || song.audioUrl?.includes('youtu.be');

    if (audioRef.current) {
      if (isYt) {
        audioRef.current.pause();
        audioRef.current.src = '';
      } else {
        // 1. If song is cached in IndexedDB, use local blob URL
        let playUrl: string | null = await getOfflineAudioBlobUrl(song.id);
        
        if (!playUrl && song.isCustomUpload) {
          playUrl = await getCustomSongBlobUrl(song.id);
        }

        // 2. Otherwise use public Supabase Cloud streaming URL
        if (!playUrl && song.audioUrl) {
          playUrl = song.audioUrl;
        }

        audioRef.current.src = playUrl || song.audioUrl;
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {
          // Fallback handles smoothly
        });
      }
    }
  };

  const togglePlay = () => {
    if (!currentSong) {
      if (allSongs.length > 0) {
        playSong(allSongs[0]);
      }
      return;
    }

    haptic.light();
    if (isPlaying) {
      if (audioRef.current) audioRef.current.pause();
      setIsPlaying(false);
      setMediaSessionPlaybackState('paused');
    } else {
      if (audioRef.current) {
        audioRef.current.play().catch(() => {});
      }
      setIsPlaying(true);
      setMediaSessionPlaybackState('playing');
    }
  };

  const nextSong = () => {
    haptic.skip();
    if (queue.length === 0) {
      if (repeatMode === 'all' && history.length > 0) {
        const resetQueue = [...allSongs];
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
    let origin: { x: number; y: number } | undefined;
    if (event && event.currentTarget) {
      try {
        const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
        if (rect && rect.width > 0 && rect.height > 0) {
          origin = {
            x: (rect.left + rect.width / 2) / window.innerWidth,
            y: (rect.top + rect.height / 2) / window.innerHeight,
          };
        }
      } catch {
        origin = undefined;
      }
    }

    setLikedSongIds((prev) => {
      const next = new Set(prev);
      const isLiking = !next.has(songId);
      if (next.has(songId)) {
        next.delete(songId);
      } else {
        next.add(songId);
      }
      saveStoredLikedSongs(next);

      if (isLiking) {
        try {
          confetti({
            particleCount: 28,
            spread: 60,
            origin: origin || { x: 0.5, y: 0.5 },
            colors: [accentTheme.color, '#F43F5E', '#EC4899', '#FFF'],
            ticks: 100,
            gravity: 1.2,
            scalar: 0.85,
          });
        } catch {
          // ignore confetti error
        }
      }
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

  // Upload Custom Song to Supabase Cloud Storage + IndexedDB local backup
  const uploadCustomSong = async (
    file: File,
    meta: { title: string; artist: string; album?: string; coverUrl?: string }
  ): Promise<Song> => {
    // 1. Try uploading to Supabase Cloud
    const cloudRes = await uploadSongToCloud(file, meta);
    let createdSong = cloudRes.song;

    // 2. If offline or error, create fallback local Song object
    if (!createdSong) {
      const songId = `custom_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      createdSong = {
        id: songId,
        title: meta.title || file.name.replace(/\.[^/.]+$/, ''),
        artist: meta.artist || 'Bạn (Tải lên)',
        album: meta.album || 'Nhạc Tải Lên Cá Nhân',
        coverUrl:
          meta.coverUrl ||
          'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop',
        duration: 210,
        audioUrl: '',
        genre: 'Nhạc Cá Nhân',
        mood: ['Tất cả', 'Chill & Thư giãn'],
        isLiked: true,
        plays: 1,
        releaseYear: new Date().getFullYear(),
        accentColor: accentTheme.color,
        isCustomUpload: true,
        fileSize: file.size,
        uploadedAt: new Date().toISOString(),
      };
    }

    // Save audio blob to IndexedDB so it's always fast and offline-ready on this device
    await saveCustomSongToIndexedDB(createdSong, file);

    // Update state & LocalStorage
    setCustomSongs((prev) => {
      const updated = [createdSong!, ...prev.filter((s) => s.id !== createdSong!.id)];
      saveStoredCustomSongsMeta(updated);
      return updated;
    });

    // Auto-like newly uploaded song
    setLikedSongIds((prev) => {
      const next = new Set(prev).add(createdSong!.id);
      saveStoredLikedSongs(next);
      return next;
    });

    refreshStorageSize();
    return createdSong;
  };

  // Add Song from YouTube URL or Direct Audio/Video Link
  const addSongByUrl = async (meta: {
    title: string;
    artist: string;
    album?: string;
    coverUrl?: string;
    audioUrl: string;
    duration?: number;
    youtubeId?: string;
    videoPreviewStart?: number;
  }): Promise<Song> => {
    const ytId = meta.youtubeId || extractYouTubeId(meta.audioUrl);
    const cloudRes = await addUrlSongToCloud({
      title: meta.title,
      artist: meta.artist,
      album: meta.album || (ytId ? 'YouTube Music' : 'Nhạc Trực Tuyến'),
      coverUrl: meta.coverUrl,
      audioUrl: ytId ? `https://www.youtube.com/watch?v=${ytId}` : meta.audioUrl,
      duration: meta.duration || 210,
    });

    let createdSong = cloudRes.song;

    if (!createdSong) {
      const songId = `url_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      createdSong = {
        id: songId,
        title: meta.title,
        artist: meta.artist,
        album: meta.album || (ytId ? 'YouTube Music' : 'Nhạc Trực Tuyến'),
        coverUrl:
          meta.coverUrl ||
          (ytId
            ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`
            : 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop'),
        duration: meta.duration || 210,
        audioUrl: ytId ? `https://www.youtube.com/watch?v=${ytId}` : meta.audioUrl,
        youtubeId: ytId || undefined,
        isYoutube: !!ytId,
        videoPreviewStart: meta.videoPreviewStart || 0,
        genre: ytId ? 'YouTube / Online' : 'Nhạc Trực Tuyến',
        mood: ['Tất cả', 'Chill & Thư giãn'],
        isLiked: true,
        plays: 1,
        releaseYear: new Date().getFullYear(),
        accentColor: accentTheme.color,
        isCustomUpload: true,
        uploadedAt: new Date().toISOString(),
      };
    } else {
      if (ytId) {
        createdSong.youtubeId = ytId;
        createdSong.isYoutube = true;
      }
      if (meta.videoPreviewStart) {
        createdSong.videoPreviewStart = meta.videoPreviewStart;
      }
    }

    // Update state & LocalStorage
    setCustomSongs((prev) => {
      const updated = [createdSong!, ...prev.filter((s) => s.id !== createdSong!.id)];
      saveStoredCustomSongsMeta(updated);
      return updated;
    });

    // Auto-like
    setLikedSongIds((prev) => {
      const next = new Set(prev).add(createdSong!.id);
      saveStoredLikedSongs(next);
      return next;
    });

    return createdSong;
  };

  // Delete Song (Supabase Cloud + IndexedDB local)
  const deleteSong = async (songId: string): Promise<void> => {
    const songToDelete = customSongs.find((s) => s.id === songId);
    if (songToDelete) {
      // Delete from Supabase Cloud
      await deleteSongFromCloud(songToDelete);
    }

    // Remove from IndexedDB & customSongs state
    await deleteCustomSongFromIndexedDB(songId);
    setCustomSongs((prev) => {
      const updated = prev.filter((s) => s.id !== songId);
      saveStoredCustomSongsMeta(updated);
      return updated;
    });

    // Remove from liked if exists
    setLikedSongIds((prev) => {
      const next = new Set(prev);
      next.delete(songId);
      saveStoredLikedSongs(next);
      return next;
    });

    // Remove from offline cache
    await removeAudioBlobOffline(songId);
    setOfflineSongIds((prev) => {
      const next = new Set(prev);
      next.delete(songId);
      saveStoredOfflineSongIds(next);
      return next;
    });

    // Remove from playlists
    setUserPlaylists((prev) => {
      const updated = prev.map((pl) => ({
        ...pl,
        songIds: pl.songIds.filter((id) => id !== songId),
        trackCount: pl.songIds.filter((id) => id !== songId).length,
      }));
      saveStoredPlaylists(updated);
      return updated;
    });

    // If currently playing, move next
    if (currentSong?.id === songId) {
      nextSong();
    }

    refreshStorageSize();
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
    const jsonStr = generateBackupJSON(likedSongIds, userPlaylists, offlineSongIds, customSongs);
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

    if (backup.customSongs) {
      setCustomSongs(backup.customSongs);
      saveStoredCustomSongsMeta(backup.customSongs);
    }
    return true;
  };

  // Generate simulated dynamic waveform bars
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

  // Sleep Timer — auto-stop playback after N minutes
  const setSleepTimer = (minutes: number | null) => {
    if (sleepTimerRef.current) {
      clearTimeout(sleepTimerRef.current);
      sleepTimerRef.current = null;
    }
    if (minutes !== null && minutes > 0) {
      sleepTimerRef.current = setTimeout(() => {
        // Fade out over 3 seconds then pause
        if (audioRef.current) {
          const audio = audioRef.current;
          const originalVol = audio.volume;
          const fadeSteps = 30;
          const stepTime = 3000 / fadeSteps;
          let step = 0;
          const fadeInterval = setInterval(() => {
            step++;
            audio.volume = Math.max(0, originalVol * (1 - step / fadeSteps));
            if (step >= fadeSteps) {
              clearInterval(fadeInterval);
              audio.pause();
              audio.volume = originalVol;
              setIsPlaying(false);
              setMediaSessionPlaybackState('paused');
            }
          }, stepTime);
        }
      }, minutes * 60 * 1000);
    }
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
        customSongs,
        allSongs,
        offlineSongIds,
        storageUsedBytes,
        isSyncModalOpen,
        isUploadModalOpen,
        downloadingSongIds,
        isCloudLoading,
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
        uploadCustomSong,
        addSongByUrl,
        deleteSong,
        setIsUploadModalOpen,
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
        dynamicCoverColor,
        setSleepTimer,
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
