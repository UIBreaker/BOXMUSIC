import React, { useState, useRef, useEffect } from 'react';
import { useMusic } from '../../context/MusicPlayerContext';
import {
  X,
  UploadCloud,
  CheckCircle2,
  Sparkles,
  Loader2,
  FileAudio,
  Image as ImageIcon,
  Cloud,
  Wand2,
  Link as LinkIcon,
  Play,
  Clock,
} from 'lucide-react';
import { YouTubeIcon } from '../common/YouTubeIcon';
import { motion, AnimatePresence } from 'framer-motion';
import { parseID3Tags } from '../../services/mobileFeatures';
import {
  fetchYouTubeMetadata,
  parseGenericMediaUrl,
  extractYouTubeId,
  type YouTubeMetadata,
} from '../../services/urlSongService';

const PRESET_COVERS = [
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=800&auto=format&fit=crop',
];

type ModalTab = 'file' | 'url';

export const UploadSongModal: React.FC = () => {
  const {
    isUploadModalOpen,
    setIsUploadModalOpen,
    uploadCustomSong,
    addSongByUrl,
    playSong,
    accentTheme,
  } = useMusic();

  const [activeTab, setActiveTab] = useState<ModalTab>('url');

  // File Upload States
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileTitle, setFileTitle] = useState('');
  const [fileArtist, setFileArtist] = useState('');
  const [fileAlbum, setFileAlbum] = useState('Nhạc Tải Lên Đám Mây');
  const [fileCoverUrl, setFileCoverUrl] = useState(PRESET_COVERS[0]);
  const [embeddedCoverUrl, setEmbeddedCoverUrl] = useState<string | null>(null);
  const [isParsingTags, setIsParsingTags] = useState(false);

  // URL / YouTube States
  const [inputUrl, setInputUrl] = useState('');
  const [isFetchingUrl, setIsFetchingUrl] = useState(false);
  const [ytMeta, setYtMeta] = useState<YouTubeMetadata | null>(null);
  const [urlTitle, setUrlTitle] = useState('');
  const [urlArtist, setUrlArtist] = useState('');
  const [urlAlbum, setUrlAlbum] = useState('YouTube Music');
  const [urlCoverUrl, setUrlCoverUrl] = useState(PRESET_COVERS[0]);
  const [videoIntroStart, setVideoIntroStart] = useState<number>(0);
  const [showVideoPreview, setShowVideoPreview] = useState(true);

  // General Loading & Status
  const [isSaving, setIsSaving] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Auto fetch when user pastes or types a valid URL
  useEffect(() => {
    if (!inputUrl.trim()) {
      setYtMeta(null);
      return;
    }

    const timer = setTimeout(async () => {
      const trimmed = inputUrl.trim();
      const ytId = extractYouTubeId(trimmed);

      setIsFetchingUrl(true);
      if (ytId) {
        const meta = await fetchYouTubeMetadata(trimmed);
        if (meta) {
          setYtMeta(meta);
          setUrlTitle(meta.title);
          setUrlArtist(meta.artist);
          setUrlAlbum('YouTube Music');
          setUrlCoverUrl(meta.thumbnailUrl);
        }
      } else if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
        const genericMeta = parseGenericMediaUrl(trimmed);
        setYtMeta(null);
        setUrlTitle(genericMeta.title);
        setUrlArtist(genericMeta.artist);
        setUrlAlbum('Nhạc Trực Tuyến');
        setUrlCoverUrl(genericMeta.coverUrl);
      }
      setIsFetchingUrl(false);
    }, 450);

    return () => clearTimeout(timer);
  }, [inputUrl]);

  if (!isUploadModalOpen) return null;

  const handleFileChange = async (file: File) => {
    setSelectedFile(file);
    setIsParsingTags(true);
    setEmbeddedCoverUrl(null);

    const cleanName = file.name.replace(/\.[^/.]+$/, '');
    if (cleanName.includes(' - ')) {
      const parts = cleanName.split(' - ');
      setFileArtist(parts[0].trim());
      setFileTitle(parts.slice(1).join(' - ').trim());
    } else {
      setFileTitle(cleanName);
      setFileArtist('Bạn');
    }

    try {
      const tags = await parseID3Tags(file);
      if (tags.title) setFileTitle(tags.title);
      if (tags.artist) setFileArtist(tags.artist);
      if (tags.album) setFileAlbum(tags.album);
      if (tags.coverUrl) {
        setEmbeddedCoverUrl(tags.coverUrl);
        setFileCoverUrl(tags.coverUrl);
      }
    } catch {
      // fallback is already set
    }

    setIsParsingTags(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleFileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsSaving(true);
    try {
      const createdSong = await uploadCustomSong(selectedFile, {
        title: fileTitle || selectedFile.name,
        artist: fileArtist || 'Bạn',
        album: fileAlbum || 'Nhạc Tải Lên',
        coverUrl: fileCoverUrl,
      });

      setIsSaving(false);
      setUploadSuccess(true);

      setTimeout(() => {
        setUploadSuccess(false);
        setIsUploadModalOpen(false);
        setSelectedFile(null);
        setFileTitle('');
        setFileArtist('');
        setEmbeddedCoverUrl(null);
        setFileCoverUrl(PRESET_COVERS[0]);
        if (createdSong) {
          playSong(createdSong);
        }
      }, 1200);
    } catch (err) {
      console.error(err);
      setIsSaving(false);
    }
  };

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;

    setIsSaving(true);
    try {
      const ytId = extractYouTubeId(inputUrl.trim());
      const createdSong = await addSongByUrl({
        title: urlTitle || (ytId ? `YouTube Track (${ytId})` : 'Bài Hát URL'),
        artist: urlArtist || 'Nghệ Sĩ',
        album: urlAlbum || (ytId ? 'YouTube Music' : 'Nhạc Trực Tuyến'),
        coverUrl: urlCoverUrl,
        audioUrl: inputUrl.trim(),
        youtubeId: ytId || undefined,
        videoPreviewStart: videoIntroStart,
      });

      setIsSaving(false);
      setUploadSuccess(true);

      setTimeout(() => {
        setUploadSuccess(false);
        setIsUploadModalOpen(false);
        setInputUrl('');
        setYtMeta(null);
        setUrlTitle('');
        setUrlArtist('');
        if (createdSong) {
          playSong(createdSong);
        }
      }, 1200);
    } catch (err) {
      console.error(err);
      setIsSaving(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 max-w-lg mx-auto select-none">
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
          onClick={() => !isSaving && setIsUploadModalOpen(false)}
        />

        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 15 }}
          className="relative z-10 w-full glass-panel p-5 sm:p-6 rounded-3xl border border-white/15 shadow-2xl text-left flex flex-col max-h-[88vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-black font-bold shadow-md"
                style={{ backgroundColor: accentTheme.color }}
              >
                <Cloud className="w-5 h-5 fill-black text-black" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">
                  Thêm Nhạc Vào BOXMUSIC
                </h3>
                <p className="text-[11px] text-zinc-400">
                  Lưu trữ đám mây Supabase • Đồng bộ ngay với Điện thoại
                </p>
              </div>
            </div>

            <button
              onClick={() => !isSaving && setIsUploadModalOpen(false)}
              className="w-8 h-8 rounded-full glass-card flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="pt-3 pb-2 flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('url')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'url'
                  ? 'text-black shadow-md'
                  : 'glass-card text-zinc-400 hover:text-white'
              }`}
              style={activeTab === 'url' ? { backgroundColor: accentTheme.color } : {}}
            >
              <YouTubeIcon className="w-4 h-4 text-red-500" />
              <span>Link URL / YouTube</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('file')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'file'
                  ? 'text-black shadow-md'
                  : 'glass-card text-zinc-400 hover:text-white'
              }`}
              style={activeTab === 'file' ? { backgroundColor: accentTheme.color } : {}}
            >
              <UploadCloud className="w-4 h-4" />
              <span>Tải File Lên (MP3/FLAC)</span>
            </button>
          </div>

          {/* TAB 1: ADD BY URL / YOUTUBE */}
          {activeTab === 'url' && (
            <form onSubmit={handleUrlSubmit} className="flex-1 overflow-y-auto py-3 space-y-4 no-scrollbar">
              {/* URL Input */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <LinkIcon className="w-3.5 h-3.5" />
                    Dán Link YouTube hoặc Link Audio / Video
                  </span>
                  {isFetchingUrl && (
                    <span className="text-amber-400 flex items-center gap-1 normal-case text-[10px]">
                      <Loader2 className="w-3 h-3 animate-spin" /> Đang lấy thông tin...
                    </span>
                  )}
                </label>

                <div className="relative">
                  <input
                    type="url"
                    required
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=... hoặc youtu.be/..."
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl glass-card text-xs font-medium text-white border border-white/15 focus:border-emerald-400 focus:outline-none transition-colors"
                  />
                  {inputUrl && (
                    <button
                      type="button"
                      onClick={() => { setInputUrl(''); setYtMeta(null); }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 text-xs cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-zinc-400">
                  Hỗ trợ link YouTube (MV, Shorts, Live), link MP3, MP4 trực tuyến
                </p>
              </div>

              {/* Live YouTube Metadata Preview Card */}
              {ytMeta && (
                <div className="space-y-3 p-3.5 rounded-2xl glass-card border border-emerald-500/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                      <Sparkles className="w-4 h-4" />
                      <span>Đã tìm thấy bài hát trên YouTube!</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowVideoPreview((p) => !p)}
                      className="text-[10px] font-bold text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      <Play className="w-3 h-3" />
                      {showVideoPreview ? 'Ẩn video preview' : 'Xem video preview'}
                    </button>
                  </div>

                  {/* Embedded YouTube Video Intro Preview */}
                  {showVideoPreview && ytMeta.youtubeId && (
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg border border-white/10 bg-black">
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${ytMeta.youtubeId}?start=${videoIntroStart}&rel=0&modestbranding=1&playsinline=1`}
                        title="YouTube Preview"
                        className="w-full h-full object-cover border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}

                  {/* Video Intro Clip Start Time */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-1.5 text-zinc-300 text-xs font-medium">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Bắt đầu đoạn giới thiệu từ giây:</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="0"
                        max="3600"
                        value={videoIntroStart}
                        onChange={(e) => setVideoIntroStart(Math.max(0, Number(e.target.value)))}
                        className="w-14 px-2 py-1 rounded-lg glass-card text-xs font-bold text-white text-center border border-white/10 focus:border-emerald-400 focus:outline-none"
                      />
                      <span className="text-xs text-zinc-400">giây</span>
                    </div>
                  </div>

                  {/* Editable Title & Artist */}
                  <div className="space-y-2.5 pt-1">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase">
                        Tên bài hát
                      </label>
                      <input
                        type="text"
                        required
                        value={urlTitle}
                        onChange={(e) => setUrlTitle(e.target.value)}
                        placeholder="Nhập tên bài hát..."
                        className="w-full px-3 py-2 rounded-xl glass-card text-xs font-medium text-white border border-white/10 focus:border-emerald-400 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase">
                        Tên ca sĩ / Nghệ sĩ
                      </label>
                      <input
                        type="text"
                        required
                        value={urlArtist}
                        onChange={(e) => setUrlArtist(e.target.value)}
                        placeholder="Nhập tên ca sĩ..."
                        className="w-full px-3 py-2 rounded-xl glass-card text-xs font-medium text-white border border-white/10 focus:border-emerald-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Thumbnail Cover Art */}
                  <div className="space-y-1.5 pt-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase flex items-center gap-1">
                      <ImageIcon className="w-3 h-3" /> Ảnh Bìa / Thumbnail (Làm Nền Nhạc & Glow)
                    </label>
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                      {ytMeta.thumbnailUrl && (
                        <button
                          type="button"
                          onClick={() => setUrlCoverUrl(ytMeta.thumbnailUrl)}
                          className={`relative w-16 h-12 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${
                            urlCoverUrl === ytMeta.thumbnailUrl
                              ? 'border-emerald-400 scale-105 shadow-md'
                              : 'border-transparent opacity-75 hover:opacity-100'
                          }`}
                        >
                          <img src={ytMeta.thumbnailUrl} alt="YT cover" className="w-full h-full object-cover" />
                          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-[8px] text-center text-emerald-300 font-bold py-0.5">
                            HD Thumb
                          </div>
                          {urlCoverUrl === ytMeta.thumbnailUrl && (
                            <div className="absolute inset-0 bg-emerald-500/30 flex items-center justify-center">
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </button>
                      )}

                      {PRESET_COVERS.map((preset, idx) => (
                        <button
                          type="button"
                          key={idx}
                          onClick={() => setUrlCoverUrl(preset)}
                          className={`relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${
                            urlCoverUrl === preset
                              ? 'border-emerald-400 scale-105 shadow-md'
                              : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={preset} alt="preset" className="w-full h-full object-cover" />
                          {urlCoverUrl === preset && (
                            <div className="absolute inset-0 bg-emerald-500/30 flex items-center justify-center">
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Generic URL metadata when not YouTube */}
              {!ytMeta && inputUrl.trim() && !isFetchingUrl && (
                <div className="space-y-3 pt-1">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-zinc-300 uppercase">Tên bài hát</label>
                    <input
                      type="text"
                      required
                      value={urlTitle}
                      onChange={(e) => setUrlTitle(e.target.value)}
                      placeholder="Tên bài hát..."
                      className="w-full px-3.5 py-2.5 rounded-xl glass-card text-xs font-medium text-white border border-white/10 focus:border-emerald-400 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-zinc-300 uppercase">Tên ca sĩ</label>
                    <input
                      type="text"
                      required
                      value={urlArtist}
                      onChange={(e) => setUrlArtist(e.target.value)}
                      placeholder="Tên nghệ sĩ..."
                      className="w-full px-3.5 py-2.5 rounded-xl glass-card text-xs font-medium text-white border border-white/10 focus:border-emerald-400 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Success feedback */}
              {uploadSuccess && (
                <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Đã thêm bài hát & đồng bộ tới mọi thiết bị!</span>
                </div>
              )}

              {/* Submit Button */}
              {inputUrl.trim() && !uploadSuccess && (
                <button
                  type="submit"
                  disabled={isSaving || isFetchingUrl}
                  className="w-full py-3 rounded-2xl font-bold text-xs sm:text-sm text-black flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer disabled:opacity-60"
                  style={{
                    backgroundColor: accentTheme.color,
                    boxShadow: `0 0 20px ${accentTheme.glow}`,
                  }}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang lưu vào Cloud Database...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Thêm Vào Thư Viện & Đồng Bộ Cloud</span>
                    </>
                  )}
                </button>
              )}
            </form>
          )}

          {/* TAB 2: UPLOAD LOCAL AUDIO FILE */}
          {activeTab === 'file' && (
            <form onSubmit={handleFileSubmit} className="flex-1 overflow-y-auto py-3 space-y-4 no-scrollbar">
              {!selectedFile ? (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-white/20 hover:border-emerald-400/60 rounded-3xl p-8 text-center cursor-pointer transition-all hover:bg-white/5 flex flex-col items-center justify-center space-y-3 group"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                    accept="audio/*,video/mp4,.mp3,.mp4,.m4a,.wav,.flac,.ogg"
                    className="hidden"
                  />

                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: `${accentTheme.color}25`, color: accentTheme.color }}
                  >
                    <UploadCloud className="w-7 h-7" />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                      Kéo thả hoặc Bấm để chọn file nhạc
                    </p>
                    <p className="text-xs text-zinc-400 mt-1">
                      MP3, MP4, M4A, FLAC, WAV • Tự động đọc metadata ID3
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl glass-card border border-emerald-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                      <FileAudio className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-white truncate">{selectedFile.name}</p>
                      <p className="text-[10px] text-zinc-400 mt-0.5 flex items-center gap-1">
                        {formatFileSize(selectedFile.size)}
                        {isParsingTags && (
                          <span className="text-amber-400 flex items-center gap-1">
                            <Loader2 className="w-3 h-3 animate-spin" /> Đọc ID3 tags...
                          </span>
                        )}
                        {!isParsingTags && <span className="text-emerald-400">• Đã đọc metadata ✓</span>}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => { setSelectedFile(null); setEmbeddedCoverUrl(null); }}
                    className="text-xs font-semibold text-rose-400 hover:underline cursor-pointer pl-2"
                  >
                    Đổi file
                  </button>
                </div>
              )}

              {selectedFile && (
                <div className="space-y-3 pt-1">
                  {(fileTitle || fileArtist) && !isParsingTags && (
                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold">
                      <Wand2 className="w-3.5 h-3.5" />
                      <span>Tự động điền từ ID3 Tag — chỉnh sửa nếu cần</span>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider">
                      Tên bài hát
                    </label>
                    <input
                      type="text"
                      required
                      value={fileTitle}
                      onChange={(e) => setFileTitle(e.target.value)}
                      placeholder="Nhập tên bài hát..."
                      className="w-full px-3.5 py-2.5 rounded-xl glass-card text-xs font-medium text-white border border-white/10 focus:border-emerald-400 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider">
                      Tên ca sĩ / Nghệ sĩ
                    </label>
                    <input
                      type="text"
                      required
                      value={fileArtist}
                      onChange={(e) => setFileArtist(e.target.value)}
                      placeholder="Nhập tên ca sĩ..."
                      className="w-full px-3.5 py-2.5 rounded-xl glass-card text-xs font-medium text-white border border-white/10 focus:border-emerald-400 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <label className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5" /> Ảnh bìa bài hát
                    </label>
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                      {embeddedCoverUrl && (
                        <button
                          type="button"
                          onClick={() => setFileCoverUrl(embeddedCoverUrl)}
                          className={`relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${
                            fileCoverUrl === embeddedCoverUrl
                              ? 'border-emerald-400 scale-105 shadow-md'
                              : 'border-transparent opacity-80 hover:opacity-100'
                          }`}
                        >
                          <img src={embeddedCoverUrl} alt="ID3 cover" className="w-full h-full object-cover" />
                          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-[8px] text-center text-emerald-300 font-bold py-0.5">
                            ID3
                          </div>
                          {fileCoverUrl === embeddedCoverUrl && (
                            <div className="absolute inset-0 bg-emerald-500/30 flex items-center justify-center">
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </button>
                      )}
                      {PRESET_COVERS.map((preset, idx) => (
                        <button
                          type="button"
                          key={idx}
                          onClick={() => setFileCoverUrl(preset)}
                          className={`relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${
                            fileCoverUrl === preset
                              ? 'border-emerald-400 scale-105 shadow-md'
                              : 'border-transparent opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={preset} alt="preset" className="w-full h-full object-cover" />
                          {fileCoverUrl === preset && (
                            <div className="absolute inset-0 bg-emerald-500/30 flex items-center justify-center">
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {uploadSuccess && (
                <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Đã tải lên Cloud & đồng bộ tới mọi thiết bị!</span>
                </div>
              )}

              {selectedFile && !uploadSuccess && (
                <button
                  type="submit"
                  disabled={isSaving || isParsingTags}
                  className="w-full py-3 rounded-2xl font-bold text-xs sm:text-sm text-black flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer disabled:opacity-60"
                  style={{
                    backgroundColor: accentTheme.color,
                    boxShadow: `0 0 20px ${accentTheme.glow}`,
                  }}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang tải lên Supabase Cloud...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Tải Lên Cloud & Đồng Bộ Mọi Thiết Bị</span>
                    </>
                  )}
                </button>
              )}
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
