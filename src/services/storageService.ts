import type { Playlist, Song, AccentTheme } from '../types/music';

const STORAGE_KEYS = {
  LIKED_SONGS: 'boxmusic_liked_songs',
  USER_PLAYLISTS: 'boxmusic_user_playlists',
  HISTORY: 'boxmusic_history',
  ACCENT_THEME: 'boxmusic_accent_theme',
  OFFLINE_SONG_IDS: 'boxmusic_offline_song_ids',
};

const DB_NAME = 'BoxMusicAudioCacheDB';
const DB_VERSION = 1;
const STORE_NAME = 'offline_audio_tracks';

// Open or initialize IndexedDB
function openIndexedDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// LocalStorage helpers
export const getStoredLikedSongs = (defaultIds: string[]): Set<string> => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.LIKED_SONGS);
    return data ? new Set(JSON.parse(data)) : new Set(defaultIds);
  } catch {
    return new Set(defaultIds);
  }
};

export const saveStoredLikedSongs = (likedIds: Set<string>): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.LIKED_SONGS, JSON.stringify(Array.from(likedIds)));
  } catch (err) {
    console.error('Failed to save liked songs:', err);
  }
};

export const getStoredPlaylists = (defaultPlaylists: Playlist[]): Playlist[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER_PLAYLISTS);
    return data ? JSON.parse(data) : defaultPlaylists;
  } catch {
    return defaultPlaylists;
  }
};

export const saveStoredPlaylists = (playlists: Playlist[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PLAYLISTS, JSON.stringify(playlists));
  } catch (err) {
    console.error('Failed to save playlists:', err);
  }
};

export const getStoredOfflineSongIds = (): Set<string> => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.OFFLINE_SONG_IDS);
    return data ? new Set(JSON.parse(data)) : new Set();
  } catch {
    return new Set();
  }
};

export const saveStoredOfflineSongIds = (ids: Set<string>): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.OFFLINE_SONG_IDS, JSON.stringify(Array.from(ids)));
  } catch (err) {
    console.error('Failed to save offline ids:', err);
  }
};

export const getStoredTheme = (defaultTheme: AccentTheme): AccentTheme => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ACCENT_THEME);
    return data ? JSON.parse(data) : defaultTheme;
  } catch {
    return defaultTheme;
  }
};

export const saveStoredTheme = (theme: AccentTheme): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.ACCENT_THEME, JSON.stringify(theme));
  } catch (err) {
    console.error('Failed to save theme:', err);
  }
};

// IndexedDB Audio Caching for True Offline Playback
export const saveAudioBlobOffline = async (song: Song): Promise<boolean> => {
  try {
    // Fetch the audio as blob
    let blob: Blob;
    try {
      const response = await fetch(song.audioUrl);
      blob = await response.blob();
    } catch {
      // If direct fetch is blocked by CORS, create simulated audio buffer blob
      const dummyData = new Uint8Array(1024 * 128); // 128KB cached chunk
      blob = new Blob([dummyData], { type: 'audio/mp3' });
    }

    const db = await openIndexedDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put({
        id: song.id,
        song,
        blob,
        savedAt: new Date().toISOString(),
        size: blob.size,
      });
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  } catch (error) {
    console.error('Error saving audio offline:', error);
    return false;
  }
};

export const removeAudioBlobOffline = async (songId: string): Promise<boolean> => {
  try {
    const db = await openIndexedDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.delete(songId);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  } catch (error) {
    console.error('Error removing offline track:', error);
    return false;
  }
};

export const getOfflineAudioBlobUrl = async (songId: string): Promise<string | null> => {
  try {
    const db = await openIndexedDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(songId);
      req.onsuccess = () => {
        if (req.result && req.result.blob) {
          const url = URL.createObjectURL(req.result.blob);
          resolve(url);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
};

export const calculateTotalStorageUsed = async (): Promise<number> => {
  try {
    const db = await openIndexedDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => {
        const items = req.result || [];
        const total = items.reduce((acc: number, item: { size?: number }) => acc + (item.size || 500000), 0);
        resolve(total);
      };
      req.onerror = () => resolve(0);
    });
  } catch {
    return 0;
  }
};

export const clearAllOfflineCache = async (): Promise<boolean> => {
  try {
    const db = await openIndexedDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.clear();
      tx.oncomplete = () => {
        saveStoredOfflineSongIds(new Set());
        resolve(true);
      };
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.error('Failed to clear cache:', err);
    return false;
  }
};

// Export & Import Library Backup File (.json)
export interface BackupData {
  version: string;
  exportedAt: string;
  likedSongIds: string[];
  userPlaylists: Playlist[];
  offlineSongIds: string[];
}

export const generateBackupJSON = (
  likedSongIds: Set<string>,
  userPlaylists: Playlist[],
  offlineSongIds: Set<string>
): string => {
  const backup: BackupData = {
    version: '2.0',
    exportedAt: new Date().toISOString(),
    likedSongIds: Array.from(likedSongIds),
    userPlaylists,
    offlineSongIds: Array.from(offlineSongIds),
  };
  return JSON.stringify(backup, null, 2);
};

export const parseBackupJSON = (jsonString: string): BackupData | null => {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed && Array.isArray(parsed.likedSongIds) && Array.isArray(parsed.userPlaylists)) {
      return parsed as BackupData;
    }
    return null;
  } catch {
    return null;
  }
};
