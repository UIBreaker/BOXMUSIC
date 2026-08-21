import React, { useState, useRef } from 'react';
import { useMusic } from '../../context/MusicPlayerContext';
import {
  X,
  Download,
  Upload,
  QrCode,
  HardDrive,
  Trash2,
  Share2,
  Smartphone,
  FileCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const SyncModal: React.FC = () => {
  const {
    isSyncModalOpen,
    setIsSyncModalOpen,
    likedSongIds,
    userPlaylists,
    offlineSongIds,
    storageUsedBytes,
    exportLibraryBackup,
    importLibraryBackup,
    clearAllOfflineStorage,
    accentTheme,
  } = useMusic();

  const [activeTab, setActiveTab] = useState<'backup' | 'device' | 'storage'>('backup');
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [syncCode] = useState<string>(() =>
    Math.floor(100000 + Math.random() * 900000).toString()
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isSyncModalOpen) return null;

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 MB';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importLibraryBackup(content);
        if (success) {
          setImportStatus('Khôi phục thư viện thành công!');
          setTimeout(() => setImportStatus(null), 3000);
        } else {
          setImportStatus('File sao lưu không hợp lệ!');
          setTimeout(() => setImportStatus(null), 3000);
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 max-w-lg mx-auto select-none">
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
          onClick={() => setIsSyncModalOpen(false)}
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
                <Share2 className="w-5 h-5 fill-black text-black" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">
                  Lưu Trữ & Đồng Bộ Thư Viện
                </h3>
                <p className="text-xs text-zinc-400">
                  Nghe nhạc trên mọi thiết bị và khi không có mạng
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsSyncModalOpen(false)}
              className="w-8 h-8 rounded-full glass-card flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Nav Tabs */}
          <div className="flex items-center gap-2 pt-3 pb-2">
            <button
              onClick={() => setActiveTab('backup')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'backup'
                  ? 'bg-white/20 text-white shadow-sm'
                  : 'glass-card text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              Sao Lưu & Khôi Phục
            </button>

            <button
              onClick={() => setActiveTab('device')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'device'
                  ? 'bg-white/20 text-white shadow-sm'
                  : 'glass-card text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              Đồng Bộ Thiết Bị
            </button>

            <button
              onClick={() => setActiveTab('storage')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'storage'
                  ? 'bg-white/20 text-white shadow-sm'
                  : 'glass-card text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <HardDrive className="w-3.5 h-3.5" />
              Bộ Nhớ Offline
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto py-3 space-y-4 no-scrollbar">
            {activeTab === 'backup' && (
              <div className="space-y-4">
                {/* Stats overview */}
                <div className="p-3.5 rounded-2xl glass-card border border-white/5 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-base font-black text-rose-400">{likedSongIds.size}</p>
                    <p className="text-[10px] text-zinc-400 font-semibold uppercase">Đã thích</p>
                  </div>
                  <div>
                    <p className="text-base font-black text-emerald-400">{userPlaylists.length}</p>
                    <p className="text-[10px] text-zinc-400 font-semibold uppercase">Playlists</p>
                  </div>
                  <div>
                    <p className="text-base font-black text-cyan-400">{offlineSongIds.size}</p>
                    <p className="text-[10px] text-zinc-400 font-semibold uppercase">Offline</p>
                  </div>
                </div>

                {/* Export Card */}
                <div className="p-4 rounded-2xl glass-card border border-white/10 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">Xuất file sao lưu (.json)</h4>
                    <p className="text-[11px] text-zinc-400 mt-0.5 max-w-[220px]">
                      Tải về máy toàn bộ danh sách bài hát và playlist cá nhân.
                    </p>
                  </div>
                  <button
                    onClick={exportLibraryBackup}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-black flex items-center gap-1.5 shadow-lg transition-transform active:scale-95 cursor-pointer"
                    style={{ backgroundColor: accentTheme.color }}
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Xuất file</span>
                  </button>
                </div>

                {/* Import Card */}
                <div className="p-4 rounded-2xl glass-card border border-white/10 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">Khôi phục từ file sao lưu</h4>
                    <p className="text-[11px] text-zinc-400 mt-0.5 max-w-[220px]">
                      Chọn file `.json` đã xuất để đồng bộ lại thư viện trên thiết bị này.
                    </p>
                  </div>
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept=".json"
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3.5 py-2 rounded-xl glass-panel hover:bg-white/15 text-xs font-bold text-white flex items-center gap-1.5 border border-white/15 transition-all cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Nhập file</span>
                    </button>
                  </div>
                </div>

                {/* Import status toast */}
                {importStatus && (
                  <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                    <FileCheck className="w-4 h-4" />
                    <span>{importStatus}</span>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'device' && (
              <div className="space-y-4 text-center">
                <div className="p-5 rounded-2xl glass-card border border-white/10 flex flex-col items-center justify-center space-y-3">
                  <div className="w-28 h-28 rounded-2xl bg-white p-2 flex items-center justify-center shadow-lg">
                    <QrCode className="w-full h-full text-black" />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-white">Mã kết nối nhanh đa thiết bị</p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Nhập mã này trên điện thoại/máy tính khác để đồng bộ:
                    </p>
                  </div>

                  <div className="px-6 py-2 rounded-xl bg-white/10 border border-white/20 text-xl font-mono font-black tracking-widest text-emerald-400">
                    {syncCode}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'storage' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl glass-card border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <HardDrive className="w-4 h-4 text-emerald-400" />
                      Dung lượng nhạc ngoại tuyến
                    </span>
                    <span className="text-xs font-bold text-emerald-400">
                      {formatBytes(storageUsedBytes)} / Vô hạn
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-emerald-400 rounded-full transition-all"
                      style={{
                        width: storageUsedBytes > 0 ? '25%' : '2%',
                        backgroundColor: accentTheme.color,
                      }}
                    />
                  </div>

                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Nhạc tải về được mã hóa và lưu trực tiếp trong bộ nhớ đệm `IndexedDB` của trình duyệt, sẵn sàng phát ngay cả khi ngắt kết nối Internet.
                  </p>
                </div>

                <div className="p-4 rounded-2xl glass-card border border-white/10 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">Xóa toàn bộ nhạc đã tải</h4>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Giải phóng bộ nhớ đã lưu ({offlineSongIds.size} bài hát).
                    </p>
                  </div>
                  <button
                    onClick={clearAllOfflineStorage}
                    className="px-3.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold border border-rose-500/40 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xóa cache</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
