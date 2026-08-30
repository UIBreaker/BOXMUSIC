/**
 * URL & YouTube Music Service
 * Trích xuất ID, Metadata (tiêu đề, ca sĩ, thumbnail HD) và video intro clip từ link URL / YouTube
 */

export interface YouTubeMetadata {
  youtubeId: string;
  title: string;
  artist: string;
  thumbnailUrl: string;
  embedUrl: string;
  duration?: number;
}

export interface GenericUrlMetadata {
  title: string;
  artist: string;
  coverUrl: string;
  audioUrl: string;
}

/**
 * Trích xuất YouTube Video ID từ mọi dạng link (watch, youtu.be, shorts, embed, mobile)
 */
export const extractYouTubeId = (url: string): string | null => {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();

  // If user pasted just the 11-char ID
  if (/^[\w-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Regex matches:
  // - youtube.com/watch?v=ID
  // - youtu.be/ID
  // - youtube.com/shorts/ID
  // - youtube.com/embed/ID
  // - m.youtube.com/watch?v=ID
  // - music.youtube.com/watch?v=ID
  const regExp = /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))([\w-]{11})/;
  const match = trimmed.match(regExp);
  return match ? match[1] : null;
};

/**
 * Làm sạch tiêu đề video YouTube (bỏ bớt các tag thừa như [Official Music Video], (MV), Audio, v.v.)
 */
export const cleanYouTubeTitle = (rawTitle: string, authorName?: string): { title: string; artist: string } => {
  let cleaned = rawTitle
    .replace(/\[(Official\s*Music\s*Video|Official\s*MV|MV|Official\s*Audio|Lyric\s*Video|Audio|4K|HD)\]/gi, '')
    .replace(/\((Official\s*Music\s*Video|Official\s*MV|MV|Official\s*Audio|Lyric\s*Video|Audio|4K|HD|Vietsub|Lyrics)\)/gi, '')
    .replace(/【(Official\s*Music\s*Video|Official\s*MV|MV|Official\s*Audio)】/gi, '')
    .replace(/\|.*$/g, '')
    .trim();

  // Check if title has "Artist - Song" or "Artist – Song"
  const splitChars = [' - ', ' – ', ' — ', ' // ', ' : '];
  for (const sep of splitChars) {
    if (cleaned.includes(sep)) {
      const parts = cleaned.split(sep);
      const possibleArtist = parts[0].trim();
      const possibleTitle = parts.slice(1).join(sep).trim();
      if (possibleArtist && possibleTitle) {
        return {
          artist: possibleArtist,
          title: possibleTitle.replace(/^["']|["']$/g, ''),
        };
      }
    }
  }

  return {
    title: cleaned || rawTitle,
    artist: authorName ? authorName.replace(/ - Topic$/i, '').replace(/VEVO$/i, '').trim() : 'Nghệ Sĩ YouTube',
  };
};

/**
 * Lấy metadata từ YouTube qua oEmbed / noembed API (không cần API Key, hoạt động 100% trên client)
 */
export const fetchYouTubeMetadata = async (urlOrId: string): Promise<YouTubeMetadata | null> => {
  const videoId = extractYouTubeId(urlOrId);
  if (!videoId) return null;

  const defaultThumb = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  const maxResThumb = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}`;

  try {
    // 1. Fetch from noembed endpoint (supports CORS)
    const noembedUrl = `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`;
    const res = await fetch(noembedUrl);
    if (res.ok) {
      const data = await res.json();
      if (data.title) {
        const { title, artist } = cleanYouTubeTitle(data.title, data.author_name);
        return {
          youtubeId: videoId,
          title,
          artist,
          thumbnailUrl: maxResThumb,
          embedUrl,
          duration: 210,
        };
      }
    }
  } catch (err) {
    console.warn('noembed fetch failed, fallback to direct ID structure:', err);
  }

  // Fallback: Return basic metadata with video ID & thumbnail
  return {
    youtubeId: videoId,
    title: `YouTube Track (${videoId})`,
    artist: 'YouTube Music',
    thumbnailUrl: maxResThumb || defaultThumb,
    embedUrl,
    duration: 210,
  };
};

/**
 * Lấy metadata cho đường link âm thanh/video trực tiếp (MP3/MP4 URL)
 */
export const parseGenericMediaUrl = (url: string): GenericUrlMetadata => {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const filename = pathname.split('/').pop() || 'Track';
    const cleanName = decodeURIComponent(filename).replace(/\.[^/.]+$/, '');

    let title = cleanName;
    let artist = 'Trực Tuyến';

    if (cleanName.includes(' - ')) {
      const parts = cleanName.split(' - ');
      artist = parts[0].trim();
      title = parts.slice(1).join(' - ').trim();
    }

    return {
      title,
      artist,
      coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop',
      audioUrl: url,
    };
  } catch {
    return {
      title: 'Bài Hát URL',
      artist: 'Nghệ Sĩ',
      coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop',
      audioUrl: url,
    };
  }
};
