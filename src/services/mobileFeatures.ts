/**
 * ID3 Tag Parser — đọc metadata nhúng trong file MP3/M4A/FLAC
 * Trả về: title, artist, album, cover art (Base64 URL)
 * Sử dụng thư viện music-metadata (hỗ trợ trình duyệt)
 */

interface ID3Tags {
  title?: string;
  artist?: string;
  album?: string;
  coverUrl?: string;
}

export const parseID3Tags = async (file: File): Promise<ID3Tags> => {
  try {
    const { parseBlob } = await import('music-metadata');
    const meta = await parseBlob(file, { skipCovers: false });
    const common = meta.common;

    let coverUrl: string | undefined;

    // Extract embedded cover art
    if (common.picture && common.picture.length > 0) {
      const pic = common.picture[0];
      // Convert to plain ArrayBuffer to satisfy strict TypeScript BlobPart type
      const ab = pic.data.buffer.slice(pic.data.byteOffset, pic.data.byteOffset + pic.data.byteLength) as ArrayBuffer;
      const blob = new Blob([ab], { type: pic.format || 'image/jpeg' });
      coverUrl = URL.createObjectURL(blob);
    }

    return {
      title: common.title?.trim() || undefined,
      artist: (common.artist || common.albumartist)?.trim() || undefined,
      album: common.album?.trim() || undefined,
      coverUrl,
    };
  } catch {
    return {};
  }
};

/**
 * Dynamic Cover Color Extractor — Canvas API
 * Lấy màu chủ đạo từ ảnh bìa bài hát
 */
export const extractDominantColor = (imageUrl: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const size = 50; // small sample for speed
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) { resolve('#10B981'); return; }

        ctx.drawImage(img, 0, 0, size, size);
        const data = ctx.getImageData(0, 0, size, size).data;

        // Average the sampled pixels (skip transparent & near-black/white)
        let r = 0, g = 0, b = 0, count = 0;
        for (let i = 0; i < data.length; i += 16) {
          const pr = data[i], pg = data[i + 1], pb = data[i + 2], pa = data[i + 3];
          if (pa < 100) continue;
          const brightness = (pr + pg + pb) / 3;
          if (brightness < 30 || brightness > 225) continue; // skip near-black/white
          r += pr; g += pg; b += pb; count++;
        }

        if (count === 0) { resolve('#10B981'); return; }

        r = Math.round(r / count);
        g = Math.round(g / count);
        b = Math.round(b / count);

        // Boost saturation slightly for vibrancy
        const max = Math.max(r, g, b);
        const boost = 1.3;
        r = Math.min(255, Math.round(((r - max / 2) * boost) + max / 2));
        g = Math.min(255, Math.round(((g - max / 2) * boost) + max / 2));
        b = Math.min(255, Math.round(((b - max / 2) * boost) + max / 2));

        const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        resolve(hex);
      } catch {
        resolve('#10B981');
      }
    };

    img.onerror = () => resolve('#10B981');
    img.src = imageUrl;
  });
};

/**
 * Haptic Feedback — rung thiết bị theo tình huống
 */
export const haptic = {
  light: () => {
    try { navigator.vibrate?.(8); } catch {}
  },
  medium: () => {
    try { navigator.vibrate?.(22); } catch {}
  },
  heavy: () => {
    try { navigator.vibrate?.(45); } catch {}
  },
  success: () => {
    try { navigator.vibrate?.([12, 60, 12]); } catch {}
  },
  skip: () => {
    try { navigator.vibrate?.([6, 30, 6]); } catch {}
  },
};

/**
 * Media Session API — điều khiển trên màn hình khóa điện thoại
 */
export const updateMediaSession = (song: {
  title: string;
  artist: string;
  album: string;
  coverUrl?: string;
}) => {
  if (!('mediaSession' in navigator)) return;

  navigator.mediaSession.metadata = new MediaMetadata({
    title: song.title,
    artist: song.artist,
    album: song.album,
    artwork: song.coverUrl
      ? [
          { src: song.coverUrl, sizes: '512x512', type: 'image/jpeg' },
          { src: song.coverUrl, sizes: '256x256', type: 'image/jpeg' },
        ]
      : [],
  });
};

export const setMediaSessionHandlers = (handlers: {
  onPlay?: () => void;
  onPause?: () => void;
  onPreviousTrack?: () => void;
  onNextTrack?: () => void;
  onSeekBackward?: () => void;
  onSeekForward?: () => void;
}) => {
  if (!('mediaSession' in navigator)) return;

  if (handlers.onPlay)
    navigator.mediaSession.setActionHandler('play', handlers.onPlay);
  if (handlers.onPause)
    navigator.mediaSession.setActionHandler('pause', handlers.onPause);
  if (handlers.onPreviousTrack)
    navigator.mediaSession.setActionHandler('previoustrack', handlers.onPreviousTrack);
  if (handlers.onNextTrack)
    navigator.mediaSession.setActionHandler('nexttrack', handlers.onNextTrack);
  if (handlers.onSeekBackward)
    navigator.mediaSession.setActionHandler('seekbackward', handlers.onSeekBackward);
  if (handlers.onSeekForward)
    navigator.mediaSession.setActionHandler('seekforward', handlers.onSeekForward);
};

export const setMediaSessionPlaybackState = (state: 'playing' | 'paused' | 'none') => {
  if (!('mediaSession' in navigator)) return;
  navigator.mediaSession.playbackState = state;
};

/**
 * Mood Auto-Detection by Time of Day
 */
export const getMoodByTime = (): string => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 9) return 'Acoustic';
  if (hour >= 9 && hour < 12) return 'Tập trung làm việc';
  if (hour >= 12 && hour < 14) return 'Chill & Thư giãn';
  if (hour >= 14 && hour < 18) return 'Tập trung làm việc';
  if (hour >= 18 && hour < 21) return 'Chill & Thư giãn';
  if (hour >= 21 || hour < 2) return 'Lo-fi';
  return 'Tất cả';
};
