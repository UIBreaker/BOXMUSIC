import { createClient } from '@supabase/supabase-js';
import type { Song } from '../types/music';
import { extractYouTubeId } from './urlSongService';

const SUPABASE_URL = 'https://yuojwjulopewytphkgor.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_BFiMhaXqo3CzyKkdO5l2-Q_GlX65Gia';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
  },
});

const BUCKET_NAME = 'songs';
const TABLE_NAME = 'songs';

// Interface for DB row exactly matching Supabase table schema
export interface DBSongRow {
  id: string;
  title: string;
  artist: string;
  album?: string;
  cover_url?: string;
  audio_url: string;
  duration?: number;
  created_at?: string;
}

// Convert DB row to Song model
export const rowToSong = (row: DBSongRow): Song => {
  const ytId = extractYouTubeId(row.audio_url);
  const isYt = !!ytId;
  const defaultYtCover = ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : undefined;

  return {
    id: row.id,
    title: row.title,
    artist: row.artist,
    album: row.album || (isYt ? 'YouTube Music' : 'Tuyển Tập Đám Mây'),
    coverUrl:
      row.cover_url ||
      defaultYtCover ||
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop',
    duration: row.duration || 210,
    audioUrl: row.audio_url,
    youtubeId: ytId || undefined,
    isYoutube: isYt,
    genre: isYt ? 'YouTube / Online' : 'Nhạc Cá Nhân',
    mood: ['Tất cả', 'Chill & Thư giãn'],
    isLiked: true,
    plays: 1,
    releaseYear: new Date().getFullYear(),
    isCustomUpload: true,
    uploadedAt: row.created_at || new Date().toISOString(),
  };
};

// Fetch all songs from Supabase
export const fetchCloudSongs = async (): Promise<Song[]> => {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch notice:', error.message);
      return [];
    }

    if (data && Array.isArray(data)) {
      return data.map((row) => rowToSong(row as DBSongRow));
    }
    return [];
  } catch (err) {
    console.error('Error fetching songs from Supabase:', err);
    return [];
  }
};

// Upload Audio file to Supabase Storage & Insert record into Supabase Database
export const uploadSongToCloud = async (
  file: File,
  meta: { title: string; artist: string; album?: string; coverUrl?: string }
): Promise<{ song: Song | null; error?: string }> => {
  try {
    const songId = `song_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const fileExt = file.name.split('.').pop() || 'mp3';
    const safeFileName = `${songId}.${fileExt}`;

    // 1. Calculate duration via temporary Audio object
    const tempAudio = new Audio(URL.createObjectURL(file));
    let calculatedDuration = 210;
    await new Promise<void>((res) => {
      tempAudio.onloadedmetadata = () => {
        if (tempAudio.duration && !isNaN(tempAudio.duration)) {
          calculatedDuration = Math.floor(tempAudio.duration);
        }
        res();
      };
      setTimeout(res, 800);
    });

    // 2. Upload to Storage Bucket 'songs'
    const { error: storageError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(safeFileName, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type || 'audio/mpeg',
      });

    if (storageError) {
      console.error('Supabase storage upload error:', storageError);
      return {
        song: null,
        error: `Lỗi Storage: ${storageError.message}`,
      };
    }

    // 3. Get Public Streaming URL
    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(safeFileName);

    const publicAudioUrl = publicUrlData.publicUrl;

    // 4. Insert row into PostgreSQL database (exact schema without genre)
    const dbRow: DBSongRow = {
      id: songId,
      title: meta.title || file.name.replace(/\.[^/.]+$/, ''),
      artist: meta.artist || 'Bạn',
      album: meta.album || 'Nhạc Tải Lên',
      cover_url:
        meta.coverUrl ||
        'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop',
      audio_url: publicAudioUrl,
      duration: calculatedDuration,
    };

    const { error: dbError } = await supabase.from(TABLE_NAME).insert([dbRow]);

    if (dbError) {
      console.error('Supabase DB insert error:', dbError.message);
      return {
        song: null,
        error: `Lỗi Database: ${dbError.message}`,
      };
    }

    return { song: rowToSong(dbRow) };
  } catch (err: any) {
    console.error('Failed to upload song to Supabase:', err);
    return { song: null, error: err.message || 'Lỗi không xác định khi tải lên Cloud' };
  }
};

// Add Song to Cloud directly via URL / YouTube Link (No file storage upload needed)
export const addUrlSongToCloud = async (meta: {
  title: string;
  artist: string;
  album?: string;
  coverUrl?: string;
  audioUrl: string;
  duration?: number;
}): Promise<{ song: Song | null; error?: string }> => {
  try {
    const songId = `url_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const dbRow: DBSongRow = {
      id: songId,
      title: meta.title,
      artist: meta.artist,
      album: meta.album || 'Nhạc Trực Tuyến',
      cover_url: meta.coverUrl,
      audio_url: meta.audioUrl,
      duration: meta.duration || 210,
    };

    const { error: dbError } = await supabase.from(TABLE_NAME).insert([dbRow]);

    if (dbError) {
      console.error('Supabase DB insert error:', dbError.message);
      return {
        song: null,
        error: `Lỗi Database: ${dbError.message}`,
      };
    }

    return { song: rowToSong(dbRow) };
  } catch (err: any) {
    console.error('Failed to add song by URL to Supabase:', err);
    return { song: null, error: err.message || 'Lỗi không xác định khi lưu URL' };
  }
};

// Delete Song from Supabase (Database & Storage)
export const deleteSongFromCloud = async (song: Song): Promise<boolean> => {
  try {
    // 1. Delete from DB table
    const { error: dbError } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', song.id);

    if (dbError) {
      console.warn('DB delete warning:', dbError.message);
    }

    // 2. Extract file name from audio URL and delete from Storage
    if (song.audioUrl && song.audioUrl.includes(BUCKET_NAME)) {
      const fileName = song.audioUrl.split('/').pop();
      if (fileName) {
        await supabase.storage.from(BUCKET_NAME).remove([fileName]);
      }
    }

    return true;
  } catch (err) {
    console.error('Failed to delete song from Supabase:', err);
    return false;
  }
};

// Realtime listener for cross-device synchronization
export const subscribeToSongUpdates = (onUpdate: () => void) => {
  try {
    const channel = supabase
      .channel('public:songs')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: TABLE_NAME },
        () => {
          onUpdate();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch {
    return () => {};
  }
};
