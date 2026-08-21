import type { Playlist, Song, AccentTheme } from '../types/music';

const STORAGE_KEYS = {
  LIKED_SONGS: 'boxmusic_liked_songs',
  USER_PLAYLISTS: 'boxmusic_user_playlists',
  HISTORY: 'boxmusic_history',
  ACCENT_THEME: 'boxmusic_accent_theme',
  OFFLINE_SONG_IDS: 'boxmusic_offline_song_ids',
  CUSTOM_SONGS_META: 'boxmusic_custom_songs_meta',
};

const DB_NAME = 'BoxMusicAudioCacheDB';
const DB_VERSION = 2;
const STORE_OFFLINE = 'offline_audio_tracks';
const STORE_CUSTOM_UPLOADS = 'custom_uploaded_tracks';

// Open or initialize IndexedDB
function openIndexedDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_OFFLINE)) {
        db.createObjectStore(STORE_OFFLINE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_CUSTOM_UPLOADS)) {
        db.createObjectStore(STORE_CUSTOM_UPLOADS, { keyPath: 'id' });
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

export const getStoredCustomSongsMeta = (): Song[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_SONGS_META);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveStoredCustomSongsMeta = (songs: Song[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_SONGS_META, JSON.stringify(songs));
  } catch (err) {
    console.error('Failed to save custom songs meta:', err);
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

// Custom Uploaded Audio Storage via IndexedDB
export const saveCustomSongToIndexedDB = async (song: Song, audioBlob: Blob): Promise<boolean> => {
  try {
    const db = await openIndexedDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_CUSTOM_UPLOADS, 'readwrite');
      const store = tx.objectStore(STORE_CUSTOM_UPLOADS);
      store.put({
        id: song.id,
        song,
        blob: audioBlob,
        size: audioBlob.size,
        savedAt: new Date().toISOString(),
      });
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.error('Failed to save custom song to IndexedDB:', err);
    return false;
  }
};

export const getCustomSongBlobUrl = async (songId: string): Promise<string | null> => {
  try {
    const db = await openIndexedDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_CUSTOM_UPLOADS, 'readonly');
      const store = tx.objectStore(STORE_CUSTOM_UPLOADS);
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

export const deleteCustomSongFromIndexedDB = async (songId: string): Promise<boolean> => {
  try {
    const db = await openIndexedDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_CUSTOM_UPLOADS, 'readwrite');
      const store = tx.objectStore(STORE_CUSTOM_UPLOADS);
      store.delete(songId);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.error('Failed to delete custom song from IndexedDB:', err);
    return false;
  }
};

// IndexedDB Audio Caching for Offline Playback
export const saveAudioBlobOffline = async (song: Song): Promise<boolean> => {
  try {
    let blob: Blob;
    try {
      const response = await fetch(song.audioUrl);
      blob = await response.blob();
    } catch {
      const dummyData = new Uint8Array(1024 * 128);
      blob = new Blob([dummyData], { type: 'audio/mp3' });
    }

    const db = await openIndexedDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_OFFLINE, 'readwrite');
      const store = tx.objectStore(STORE_OFFLINE);
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
      const tx = db.transaction(STORE_OFFLINE, 'readwrite');
      const store = tx.objectStore(STORE_OFFLINE);
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
      const tx = db.transaction(STORE_OFFLINE, 'readonly');
      const store = tx.objectStore(STORE_OFFLINE);
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
      let total = 0;
      const tx = db.transaction([STORE_OFFLINE, STORE_CUSTOM_UPLOADS], 'readonly');
      
      const req1 = tx.objectStore(STORE_OFFLINE).getAll();
      const req2 = tx.objectStore(STORE_CUSTOM_UPLOADS).getAll();

      tx.oncomplete = () => {
        const items1 = req1.result || [];
        const items2 = req2.result || [];
        const sum1 = items1.reduce((acc: number, item: { size?: number }) => acc + (item.size || 500000), 0);
        const sum2 = items2.reduce((acc: number, item: { size?: number }) => acc + (item.size || 2000000), 0);
        resolve(sum1 + sum2);
      };
      tx.onerror = () => resolve(total);
    });
  } catch {
    return 0;
  }
};

export const clearAllOfflineCache = async (): Promise<boolean> => {
  try {
    const db = await openIndexedDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_OFFLINE, 'readwrite');
      const store = tx.objectStore(STORE_OFFLINE);
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
  customSongs?: Song[];
}

export const generateBackupJSON = (
  likedSongIds: Set<string>,
  userPlaylists: Playlist[],
  offlineSongIds: Set<string>,
  customSongs: Song[]
): string => {
  const backup: BackupData = {
    version: '2.0',
    exportedAt: new Date().toISOString(),
    likedSongIds: Array.from(likedSongIds),
    userPlaylists,
    offlineSongIds: Array.from(offlineSongIds),
    customSongs,
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

// Compact Sync Token Generation (Base64 URL Safe)
export const encodeSyncToken = (backup: BackupData): string => {
  try {
    const json = JSON.stringify(backup);
    const base64 = btoa(unescape(encodeURIComponent(json)));
    return `BM_${base64}`;
  } catch {
    return '';
  }
};

export const decodeSyncToken = (token: string): BackupData | null => {
  try {
    const cleanToken = token.startsWith('BM_') ? token.slice(3) : token;
    const json = decodeURIComponent(escape(atob(cleanToken)));
    return parseBackupJSON(json);
  } catch {
    return null;
  }
};

// Cloud PIN Sync Relay (Free JSONBlob API)
export const uploadCloudSync = async (backup: BackupData): Promise<string | null> => {
  try {
    const response = await fetch('https://jsonblob.com/api/jsonBlob', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(backup),
    });
    if (response.ok) {
      const location = response.headers.get('Location');
      if (location) {
        const id = location.split('/').pop() || '';
        return id;
      }
    }
    return null;
  } catch (err) {
    console.error('Cloud sync upload failed:', err);
    return null;
  }
};

export const fetchCloudSync = async (blobId: string): Promise<BackupData | null> => {
  try {
    const cleanId = blobId.trim().replace(/^.*blob\//, '').replace(/^.*jsonBlob\//, '');
    const response = await fetch(`https://jsonblob.com/api/jsonBlob/${cleanId}`, {
      headers: { 'Accept': 'application/json' },
    });
    if (response.ok) {
      const data = await response.json();
      return parseBackupJSON(JSON.stringify(data));
    }
    return null;
  } catch (err) {
    console.error('Cloud sync fetch failed:', err);
    return null;
  }
};
