import React, { useState, useRef } from 'react';
import { useMusic } from '../../context/MusicPlayerContext';
import {
  X,
  UploadCloud,
  CheckCircle2,
  Sparkles,
  Loader2,
  FileAudio,
  Image as ImageIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PRESET_COVERS = [
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=800&auto=format&fit=crop',
];

export const UploadSongModal: React.FC = () => {
  const {
    isUploadModalOpen,
    setIsUploadModalOpen,
    uploadCustomSong,
    playSong,
    accentTheme,
  } = useMusic();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [album, setAlbum] = useState('Nhạc Tải Lên Cá Nhân');
  const [coverUrl, setCoverUrl] = useState(PRESET_COVERS[0]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isUploadModalOpen) return null;

  const handleFileChange = (file: File) => {
    setSelectedFile(file);
    const cleanName = file.name.replace(/\.[^/.]+$/, '');
    if (cleanName.includes(' - ')) {
      const parts = cleanName.split(' - ');
      setArtist(parts[0].trim());
      setTitle(parts.slice(1).join(' - ').trim());
    } else {
      setTitle(cleanName);
      setArtist('Bạn (Tải lên)');
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const createdSong = await uploadCustomSong(selectedFile, {
        title: title || selectedFile.name,
        artist: artist || 'Bạn',
        album: album || 'Nhạc Tải Lên',
        coverUrl,
      });

      setIsUploading(false);
      setUploadSuccess(true);

      setTimeout(() => {
        setUploadSuccess(false);
        setIsUploadModalOpen(false);
        setSelectedFile(null);
        setTitle('');
        setArtist('');
        playSong(createdSong);
      }, 1200);
    } catch (err) {
      console.error(err);
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 max-w-lg mx-auto select-none">
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
          onClick={() => !isUploading && setIsUploadModalOpen(false)}
        />

        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 15 }}
          className="relative z-10 w-full glass-panel p-6 rounded-3xl border border-white/15 shadow-2xl text-left flex flex-col max-h-[85vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-black font-bold shadow-md"
                style={{ backgroundColor: accentTheme.color }}
              >
                <UploadCloud className="w-5 h-5 fill-black text-black" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">
                  Tải Nhạc Lên BOXMUSIC
                </h3>
                <p className="text-xs text-zinc-400">
                  Hỗ trợ MP3, MP4, M4A, WAV, FLAC lưu trữ ngoại tuyến
                </p>
              </div>
            </div>

            <button
              onClick={() => !isUploading && setIsUploadModalOpen(false)}
              className="w-8 h-8 rounded-full glass-card flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-4 space-y-4 no-scrollbar">
            {/* File Dropzone Area */}
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
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-black shadow-lg group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: `${accentTheme.color}30`, color: accentTheme.color }}
                >
                  <UploadCloud className="w-7 h-7" />
                </div>

                <div>
                  <p className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                    Kéo thả hoặc Bấm để chọn file nhạc
                  </p>
                  <p className="text-xs text-zinc-400 mt-1">
                    MP3, MP4, M4A, FLAC, WAV (Không giới hạn dung lượng)
                  </p>
                </div>
              </div>
            ) : (
              /* Selected File Card */
              <div className="p-3.5 rounded-2xl glass-card border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <FileAudio className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-white truncate">{selectedFile.name}</p>
                    <p className="text-[10px] text-zinc-400 mt-0.5">
                      {formatFileSize(selectedFile.size)} • Sẵn sàng tải lên
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="text-xs font-semibold text-rose-400 hover:underline cursor-pointer pl-2"
                >
                  Đổi file khác
                </button>
              </div>
            )}

            {/* Metadata Fields */}
            {selectedFile && (
              <div className="space-y-3 pt-1">
                {/* Title */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider">
                    Tên bài hát
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Nhập tên bài hát..."
                    className="w-full px-3.5 py-2.5 rounded-xl glass-card text-xs font-medium text-white border border-white/10 focus:border-emerald-400 focus:outline-none transition-colors"
                  />
                </div>

                {/* Artist */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider">
                    Tên ca sĩ / Nghệ sĩ
                  </label>
                  <input
                    type="text"
                    required
                    value={artist}
                    onChange={(e) => setArtist(e.target.value)}
                    placeholder="Nhập tên ca sĩ..."
                    className="w-full px-3.5 py-2.5 rounded-xl glass-card text-xs font-medium text-white border border-white/10 focus:border-emerald-400 focus:outline-none transition-colors"
                  />
                </div>

                {/* Album */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider">
                    Album / Tuyển tập
                  </label>
                  <input
                    type="text"
                    value={album}
                    onChange={(e) => setAlbum(e.target.value)}
                    placeholder="Nhập tên album..."
                    className="w-full px-3.5 py-2.5 rounded-xl glass-card text-xs font-medium text-white border border-white/10 focus:border-emerald-400 focus:outline-none transition-colors"
                  />
                </div>

                {/* Cover Art Picker */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5" />
                    Ảnh bìa bài hát
                  </label>
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                    {PRESET_COVERS.map((preset, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setCoverUrl(preset)}
                        className={`relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${
                          coverUrl === preset
                            ? 'border-emerald-400 scale-105 shadow-md'
                            : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={preset} alt="preset cover" className="w-full h-full object-cover" />
                        {coverUrl === preset && (
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

            {/* Success feedback toast */}
            {uploadSuccess && (
              <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Đã thêm bài hát vào thư viện & tự động phát nhạc!</span>
              </div>
            )}

            {/* Submit Button */}
            {selectedFile && !uploadSuccess && (
              <button
                type="submit"
                disabled={isUploading}
                className="w-full py-3 rounded-2xl font-bold text-xs sm:text-sm text-black flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer"
                style={{
                  backgroundColor: accentTheme.color,
                  boxShadow: `0 0 20px ${accentTheme.glow}`,
                }}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang lưu vào bộ nhớ IndexedDB...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Thêm Vào Thư Viện & Phát Ngay</span>
                  </>
                )}
              </button>
            )}
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
