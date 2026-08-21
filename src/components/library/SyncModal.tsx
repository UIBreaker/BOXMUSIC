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
  Copy,
  Check,
  Loader2,
  ArrowRight,
  Sparkles,
  Link as LinkIcon,
} from 'lucide-react';
import {
  encodeSyncToken,
  decodeSyncToken,
  uploadCloudSync,
  fetchCloudSync,
} from '../../services/storageService';
import type { BackupData } from '../../services/storageService';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';

export const SyncModal: React.FC = () => {
  const {
    isSyncModalOpen,
    setIsSyncModalOpen,
    likedSongIds,
    userPlaylists,
    offlineSongIds,
    customSongs,
    storageUsedBytes,
    exportLibraryBackup,
    importLibraryBackup,
    clearAllOfflineStorage,
    accentTheme,
  } = useMusic();

  const [activeTab, setActiveTab] = useState<'backup' | 'device' | 'storage'>('device');
  const [inputCode, setInputCode] = useState('');
  const [generatedPin, setGeneratedPin] = useState<string | null>(null);
  const [syncToken, setSyncToken] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [hasCopiedPin, setHasCopiedPin] = useState(false);
  const [hasCopiedLink, setHasCopiedLink] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isSyncModalOpen) return null;

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 MB';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const handleGenerateSyncCode = async () => {
    setIsGenerating(true);
    const backup: BackupData = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      likedSongIds: Array.from(likedSongIds),
      userPlaylists,
      offlineSongIds: Array.from(offlineSongIds),
      customSongs,
    };

    // Generate local token
    const token = encodeSyncToken(backup);
    setSyncToken(token);

    // Try cloud sync PIN
    const cloudId = await uploadCloudSync(backup);
    if (cloudId) {
      setGeneratedPin(cloudId);
    } else {
      // Fallback to token PIN
      setGeneratedPin(token.slice(0, 16));
    }
    setIsGenerating(false);
  };

  const handleConnectAndSync = async () => {
    const raw = inputCode.trim();
    if (!raw) return;

    setIsSyncing(true);
    setSyncStatus(null);

    // 1. Try decoding as direct Token / Base64
    let parsed = decodeSyncToken(raw);

    // 2. If not base64 token, try fetching from Cloud Sync PIN
    if (!parsed) {
      parsed = await fetchCloudSync(raw);
    }

    setIsSyncing(false);

    if (parsed) {
      const success = importLibraryBackup(JSON.stringify(parsed));
      if (success) {
        setSyncStatus({
          type: 'success',
          message: 'Đồng bộ thư viện thành công! Dữ liệu đã được nạp vào máy.',
        });
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
        });
      } else {
        setSyncStatus({ type: 'error', message: 'Dữ liệu đồng bộ bị lỗi cấu trúc!' });
      }
    } else {
      setSyncStatus({
        type: 'error',
        message: 'Mã không tồn tại hoặc đã hết hạn. Hãy kiểm tra lại mã đã nhập!',
      });
    }
  };

  const handleCopyPin = () => {
    const codeToCopy = generatedPin || syncToken;
    if (!codeToCopy) return;
    navigator.clipboard.writeText(codeToCopy);
    setHasCopiedPin(true);
    setTimeout(() => setHasCopiedPin(false), 2000);
  };

  const handleCopyShareLink = () => {
    const code = generatedPin || syncToken;
    if (!code) return;
    const url = `${window.location.origin}${window.location.pathname}?sync=${encodeURIComponent(code)}`;
    navigator.clipboard.writeText(url);
    setHasCopiedLink(true);
    setTimeout(() => setHasCopiedLink(false), 2000);
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
          setSyncStatus({ type: 'success', message: 'Khôi phục thư viện từ file thành công!' });
        } else {
          setSyncStatus({ type: 'error', message: 'File sao lưu không hợp lệ!' });
        }
      }
    };
    reader.readAsText(file);
  };

  const qrUrl = syncToken
    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
        `${window.location.origin}${window.location.pathname}?sync=${generatedPin || syncToken}`
      )}`
    : null;

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
                  Chuyển nhạc giữa Máy tính & Điện thoại qua mã PIN
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
              onClick={() => setActiveTab('device')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'device'
                  ? 'bg-white/20 text-white shadow-sm'
                  : 'glass-card text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              Đồng Bộ Mã PIN
            </button>

            <button
              onClick={() => setActiveTab('backup')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'backup'
                  ? 'bg-white/20 text-white shadow-sm'
                  : 'glass-card text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              Xuất / Nhập File
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
              Bộ Nhớ
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto py-3 space-y-4 no-scrollbar">
            {/* DEVICE SYNC TAB */}
            {activeTab === 'device' && (
              <div className="space-y-4">
                {/* 1. INPUT RECEIVE SYNC CODE SECTION */}
                <div className="p-4 rounded-2xl glass-card border border-white/10 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center">
                      1
                    </span>
                    <h4 className="text-xs font-bold text-white">
                      Nhập mã từ máy khác để nạp thư viện vào đây:
                    </h4>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                      placeholder="Dán mã đồng bộ hoặc mã PIN vào đây..."
                      className="flex-1 px-3.5 py-2.5 rounded-xl glass-card text-xs text-white placeholder-zinc-500 border border-white/10 focus:border-emerald-400 focus:outline-none font-mono"
                    />
                    <button
                      onClick={handleConnectAndSync}
                      disabled={isSyncing || !inputCode.trim()}
                      className="px-4 py-2.5 rounded-xl font-bold text-xs text-black flex items-center gap-1.5 shadow-lg transition-transform active:scale-95 cursor-pointer disabled:opacity-50"
                      style={{ backgroundColor: accentTheme.color }}
                    >
                      {isSyncing ? (
                        <Loader2 className="w-4 h-4 animate-spin text-black" />
                      ) : (
                        <ArrowRight className="w-4 h-4" />
                      )}
                      <span>Đồng Bộ Ngay</span>
                    </button>
                  </div>
                </div>

                {/* Status Feedback Toast */}
                {syncStatus && (
                  <div
                    className={`p-3 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                      syncStatus.type === 'success'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    }`}
                  >
                    <FileCheck className="w-4 h-4 flex-shrink-0" />
                    <span>{syncStatus.message}</span>
                  </div>
                )}

                {/* 2. GENERATE SYNC CODE SECTION */}
                <div className="p-4 rounded-2xl glass-card border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold flex items-center justify-center">
                        2
                      </span>
                      <h4 className="text-xs font-bold text-white">
                        Lấy mã từ máy này để gửi sang máy khác:
                      </h4>
                    </div>

                    {!generatedPin && (
                      <button
                        onClick={handleGenerateSyncCode}
                        disabled={isGenerating}
                        className="px-3 py-1.5 rounded-xl glass-panel text-xs font-bold text-white border border-white/20 hover:border-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        {isGenerating ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        )}
                        <span>Tạo Mã Mới</span>
                      </button>
                    )}
                  </div>

                  {generatedPin && (
                    <div className="space-y-3 pt-1">
                      <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-zinc-400 font-semibold uppercase">Mã Đồng Bộ Của Bạn</p>
                          <p className="text-xs font-mono font-bold text-emerald-400 mt-0.5 truncate max-w-[200px]">
                            {generatedPin}
                          </p>
                        </div>
                        <button
                          onClick={handleCopyPin}
                          className="px-3 py-1.5 rounded-lg glass-card hover:bg-white/10 text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer"
                        >
                          {hasCopiedPin ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{hasCopiedPin ? 'Đã chép' : 'Sao chép'}</span>
                        </button>
                      </div>

                      {/* Quick Share Link Button */}
                      <button
                        onClick={handleCopyShareLink}
                        className="w-full py-2 rounded-xl glass-card text-xs font-bold text-zinc-300 hover:text-white border border-white/10 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                      >
                        <LinkIcon className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{hasCopiedLink ? 'Đã sao chép link 1-chạm!' : 'Sao chép Link Đồng Bộ 1-chạm'}</span>
                      </button>

                      {/* QR Code */}
                      {qrUrl && (
                        <div className="text-center pt-2 flex flex-col items-center">
                          <div className="p-2 bg-white rounded-2xl shadow-lg w-28 h-28 flex items-center justify-center">
                            <img src={qrUrl} alt="QR Sync" className="w-full h-full object-contain" />
                          </div>
                          <p className="text-[10px] text-zinc-400 mt-1.5 flex items-center gap-1">
                            <QrCode className="w-3 h-3 text-emerald-400" />
                            Quét camera điện thoại để đồng bộ ngay
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* BACKUP TAB */}
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
                    <p className="text-base font-black text-cyan-400">{customSongs.length}</p>
                    <p className="text-[10px] text-zinc-400 font-semibold uppercase">Tải lên</p>
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
              </div>
            )}

            {/* STORAGE TAB */}
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
