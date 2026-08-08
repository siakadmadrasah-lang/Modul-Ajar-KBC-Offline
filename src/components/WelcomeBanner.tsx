import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserSession } from '../utils/auth';
import { WelcomeBannerConfig, DEFAULT_WELCOME_BANNER_CONFIG } from '../types';
import { loadWelcomeBannerConfig, saveWelcomeBannerConfig, loadKopSurat } from '../utils/storage';
import { compressAndResizeImage } from '../utils/imageHelper';
import {
  Sparkles,
  Heart,
  Crown,
  BookOpen,
  GraduationCap,
  X,
  School,
  Calendar,
  Wand2,
  Zap,
  Compass,
  Edit3,
  RotateCcw,
  CheckCircle2,
  Image as ImageIcon,
  Palette,
  Clock,
  Layout,
  ExternalLink,
  Settings,
  Flame,
  Award,
  Upload,
  Trash2,
  Camera,
  Loader2,
  Building,
  Check,
  Link as LinkIcon,
  FileImage,
  RefreshCw,
  UploadCloud,
  LogIn,
  LogOut,
  ArrowRight
} from 'lucide-react';

interface WelcomeBannerProps {
  isOpen: boolean;
  onClose: () => void;
  userSession: UserSession | null;
  activeMadrasahName?: string;
  activeTahunAjaran?: string;
  onOpenAiModal?: () => void;
  onNavigateTab?: (tab: 'my-modules' | 'materi' | 'quiz' | 'master-kurikulum' | 'settings') => void;
  onOpenLoginModal?: () => void;
  onLogout?: () => void;
  isStudentMode?: boolean;
  studentTargetMapel?: string;
  onOpenPinModal?: () => void;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
  isOpen,
  onClose,
  userSession,
  activeMadrasahName = "MI Ma'arif NU 2 Sanggreman",
  activeTahunAjaran = "2024/2025",
  onOpenAiModal,
  onNavigateTab,
  onOpenLoginModal,
  onLogout,
  isStudentMode = false,
  studentTargetMapel = '',
  onOpenPinModal
}) => {
  const [config, setConfig] = useState<WelcomeBannerConfig>(() => loadWelcomeBannerConfig());
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState<WelcomeBannerConfig>(config);
  const [saveToast, setSaveToast] = useState(false);

  // Logo upload state
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const bannerFileInputRef = useRef<HTMLInputElement>(null);
  const editModalFileInputRef = useRef<HTMLInputElement>(null);

  // Sync state when config changes or when banner opens
  useEffect(() => {
    if (isOpen) {
      const loaded = loadWelcomeBannerConfig();
      setConfig(loaded);
      setEditForm(loaded);
    }
  }, [isOpen]);

  if (!isOpen || !config.isBannerActive) return null;

  const isSuperAdmin = userSession ? (userSession.username === 'admin' || userSession.role === 'super_admin') : false;
  const displayName = userSession ? userSession.namaLengkap : 'Pengunjung / Tamu Madrasah';

  // Process file upload dynamically
  const processAndSetLogo = async (file: File, directSaveToBanner = false) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('File harus berupa gambar (PNG, JPG, WEBP, SVG, GIF)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Ukuran gambar terlalu besar! Maksimal 10MB.');
      return;
    }

    setIsUploadingLogo(true);
    setUploadError(null);

    try {
      // Compress and resize image to ~600px so data URL stays light (~30-80KB)
      const base64Data = await compressAndResizeImage(file, 600, 0.85);

      if (!base64Data) {
        setUploadError('Gagal memproses gambar. Silakan coba file lain.');
        return;
      }

      if (directSaveToBanner) {
        const updatedConfig = { ...config, gambarUrl: base64Data };
        setConfig(updatedConfig);
        setEditForm(updatedConfig);
        saveWelcomeBannerConfig(updatedConfig);
        setSaveToast(true);
        setTimeout(() => setSaveToast(false), 3000);
      } else {
        setEditForm((prev) => ({ ...prev, gambarUrl: base64Data }));
      }
    } catch (err) {
      console.error('Error processing logo image:', err);
      setUploadError('Terjadi kesalahan saat memproses gambar.');
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleBannerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processAndSetLogo(file, true);
    }
    // reset input
    e.target.value = '';
  };

  const handleEditModalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processAndSetLogo(file, false);
    }
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processAndSetLogo(file, false);
    }
  };

  // Quick Presets for Logos
  const handleApplyPresetLogo = (type: 'kop' | 'kemenag' | 'kbc' | 'pendidikan') => {
    setUploadError(null);
    if (type === 'kop') {
      const kop = loadKopSurat();
      if (kop && kop.logoUrl) {
        setEditForm((prev) => ({ ...prev, gambarUrl: kop.logoUrl || '' }));
      } else {
        setUploadError('Logo Kop Surat Madrasah belum diatur di Pengaturan Kop Surat.');
      }
    } else if (type === 'kemenag') {
      // SVG emblem badge data URL for Kemenag / Madrasah
      const kemenagSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><circle cx="100" cy="100" r="95" fill="%23047857" stroke="%23fbbf24" stroke-width="8"/><path d="M100 30 L160 80 L140 160 L60 160 L40 80 Z" fill="%23065f46" stroke="%23ffffff" stroke-width="4"/><text x="100" y="100" font-family="Arial" font-size="22" font-weight="bold" fill="%23fef08a" text-anchor="middle">KEMENAG</text><text x="100" y="130" font-family="Arial" font-size="16" font-weight="bold" fill="%23ffffff" text-anchor="middle">MADRASAH</text></svg>`;
      setEditForm((prev) => ({ ...prev, gambarUrl: kemenagSvg }));
    } else if (type === 'kbc') {
      // SVG emblem badge for KBC (Kurikulum Berbasis Cinta)
      const kbcSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" rx="40" fill="%230f766e"/><path d="M100 40 C60 10, 20 60, 100 160 C180 60, 140 10, 100 40 Z" fill="%23f43f5e" opacity="0.9"/><text x="100" y="105" font-family="Arial" font-size="28" font-weight="900" fill="%23ffffff" text-anchor="middle">KBC</text><text x="100" y="180" font-family="Arial" font-size="13" font-weight="bold" fill="%23fef08a" text-anchor="middle">BERBASIS CINTA</text></svg>`;
      setEditForm((prev) => ({ ...prev, gambarUrl: kbcSvg }));
    } else if (type === 'pendidikan') {
      const tutWuriSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" rx="40" fill="%231e3a8a"/><polygon points="100,25 175,75 145,165 55,165 25,75" fill="%231d4ed8" stroke="%23fbbf24" stroke-width="6"/><text x="100" y="100" font-family="Arial" font-size="20" font-weight="bold" fill="%23ffffff" text-anchor="middle">PENDIDIKAN</text><text x="100" y="130" font-family="Arial" font-size="14" font-weight="bold" fill="%23fef08a" text-anchor="middle">INDONESIA</text></svg>`;
      setEditForm((prev) => ({ ...prev, gambarUrl: tutWuriSvg }));
    }
  };

  // Handle action triggers - Directs non-logged-in user to login modal, logged-in user into app
  const handleCloseToAdmin = () => {
    onClose();
    if (!userSession && onOpenLoginModal) {
      onOpenLoginModal();
    }
    if (userSession && onNavigateTab) {
      onNavigateTab('settings');
    }
  };

  const handleActionClick = (action: WelcomeBannerConfig['tombolUtamaAction']) => {
    onClose();
    if (!userSession && onOpenLoginModal) {
      onOpenLoginModal();
    }
    if (userSession && onNavigateTab) {
      onNavigateTab('settings');
    }
    if (action === 'ai-modal' && onOpenAiModal) {
      onOpenAiModal();
    }
  };

  // Helper function to get theme classes
  const getThemeClasses = (themeStyle: WelcomeBannerConfig['themeStyle']) => {
    switch (themeStyle) {
      case 'indigo':
        return {
          border: 'border-indigo-500/50',
          glowLeft: 'bg-indigo-500/25',
          glowRight: 'bg-purple-500/25',
          badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
          btnPrimary: 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white shadow-indigo-500/30',
          accentText: 'text-indigo-400'
        };
      case 'amber':
        return {
          border: 'border-amber-500/50',
          glowLeft: 'bg-amber-500/25',
          glowRight: 'bg-orange-500/25',
          badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          btnPrimary: 'bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black shadow-amber-500/30',
          accentText: 'text-amber-400'
        };
      case 'rose':
        return {
          border: 'border-rose-500/50',
          glowLeft: 'bg-rose-500/25',
          glowRight: 'bg-pink-500/25',
          badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          btnPrimary: 'bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white shadow-rose-500/30',
          accentText: 'text-rose-400'
        };
      case 'dark_luxury':
        return {
          border: 'border-slate-500/50',
          glowLeft: 'bg-amber-500/15',
          glowRight: 'bg-slate-400/20',
          badgeBg: 'bg-slate-700/50 text-amber-300 border-slate-600',
          btnPrimary: 'bg-gradient-to-r from-slate-100 to-amber-200 hover:from-white hover:to-amber-100 text-slate-950 font-black shadow-slate-900/50',
          accentText: 'text-amber-300'
        };
      case 'emerald':
      default:
        return {
          border: 'border-emerald-500/50',
          glowLeft: 'bg-emerald-500/25',
          glowRight: 'bg-teal-500/25',
          badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          btnPrimary: 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black shadow-emerald-500/30',
          accentText: 'text-emerald-400'
        };
    }
  };

  const theme = getThemeClasses(config.themeStyle);

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    saveWelcomeBannerConfig(editForm);
    setConfig(editForm);
    setShowEditModal(false);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleResetDefault = () => {
    if (confirm('Apakah Anda yakin ingin mengembalikan isi Banner Welcome ke standar awal?')) {
      saveWelcomeBannerConfig(DEFAULT_WELCOME_BANNER_CONFIG);
      setConfig(DEFAULT_WELCOME_BANNER_CONFIG);
      setEditForm(DEFAULT_WELCOME_BANNER_CONFIG);
      setShowEditModal(false);
    }
  };

  // Render Student Mode Banner if in student mode
  if (isStudentMode) {
    if (!isOpen || config.studentBannerActive === false) return null;
    return (
      <AnimatePresence>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative w-full max-w-lg bg-slate-900/95 backdrop-blur-2xl border border-emerald-500/50 text-white rounded-3xl p-5 sm:p-6 shadow-2xl overflow-hidden shadow-emerald-950/60 my-auto space-y-4"
          >
            {/* Ambient Glows */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Header Badge & Close */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 relative z-10">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center space-x-1.5 shadow-xs">
                <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                <span>{config.studentBadgeText || '🎓 KUIS & LATIHAN SISWA INTERAKTIF'}</span>
              </span>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer border border-slate-700 active:scale-95"
                title="Tutup Banner Siswa"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-2 text-center sm:text-left relative z-10">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                {config.studentJudulBanner || 'SELAMAT DATANG DI KUIS SISWA 🚀'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                {config.studentSubJudulBanner || 'Selamat mengerjakan kuis dan latihan interaktif secara mandiri. Silakan tekan tombol di bawah untuk mulai mengerjakan kuis!'}
              </p>

              <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
                <span className="inline-flex items-center space-x-1.5 bg-slate-800/90 border border-slate-700 px-3 py-1 rounded-xl font-bold text-slate-300">
                  <School className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{activeMadrasahName}</span>
                </span>
                {studentTargetMapel && (
                  <span className="inline-flex items-center space-x-1.5 bg-emerald-950/80 border border-emerald-600/50 px-3 py-1 rounded-xl font-extrabold text-emerald-300">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Mapel: {studentTargetMapel}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5 relative z-10">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg shadow-emerald-950/60 transition-all cursor-pointer active:scale-95 border border-emerald-300/40"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>{config.studentTombolUtamaText || '🎯 MULAI KERJAKAN KUIS'}</span>
              </button>

              {onOpenPinModal && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenPinModal();
                  }}
                  className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 font-bold text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer active:scale-95"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Mode Guru</span>
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {/* Hidden File Input for Direct Banner Upload */}
      <input
        type="file"
        ref={bannerFileInputRef}
        onChange={handleBannerFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* CENTERED MODAL OVERLAY */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className={`relative w-full max-w-2xl bg-slate-900/95 backdrop-blur-2xl border ${theme.border} text-white rounded-3xl sm:rounded-[28px] shadow-2xl overflow-hidden shadow-black/80 my-auto`}
        >
          {/* Animated Background Glows */}
          <div className={`absolute -top-32 -left-32 w-64 h-64 ${theme.glowLeft} rounded-full blur-3xl pointer-events-none`} />
          <div className={`absolute -bottom-32 -right-32 w-64 h-64 ${theme.glowRight} rounded-full blur-3xl pointer-events-none`} />

          {/* Banner Body */}
          <div className="p-3.5 sm:p-6 relative z-10 space-y-2.5 sm:space-y-3.5">
            {/* Top Control Bar */}
            <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-2 sm:pb-3">
              <div className="flex items-center space-x-1.5 sm:space-x-2 flex-wrap gap-y-1">
                <span className={`text-[9px] sm:text-[11px] font-black uppercase tracking-wider px-2 py-0.5 sm:px-3 sm:py-1 rounded-full ${theme.badgeBg} border flex items-center space-x-1 sm:space-x-1.5 shadow-xs`}>
                  <Sparkles className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-amber-300 animate-spin-slow" />
                  <span>{config.kategoriBadge}</span>
                </span>

                <span className="text-[9px] sm:text-[11px] font-bold text-slate-300 bg-slate-800/90 border border-slate-700/80 px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full flex items-center space-x-1">
                  <School className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-emerald-400" />
                  <span className="truncate max-w-[130px] sm:max-w-none">{activeMadrasahName}</span>
                </span>

                <span className="text-[9px] sm:text-[11px] font-bold text-slate-400 bg-slate-800/90 border border-slate-700/80 px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full flex items-center space-x-1">
                  <Calendar className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-teal-400" />
                  <span>TA: {activeTahunAjaran}</span>
                </span>
              </div>

              {/* Edit & Dismiss Controls */}
              <div className="flex items-center space-x-1 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setEditForm(config);
                    setShowEditModal(true);
                  }}
                  className="px-2 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-all border border-slate-700 font-bold text-[10px] sm:text-xs flex items-center space-x-1 cursor-pointer shadow-xs active:scale-95"
                  title="Edit isi & tampilan banner welcome"
                >
                  <Edit3 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Edit Banner</span>
                </button>

                <button
                  type="button"
                  onClick={handleCloseToAdmin}
                  className="p-1 sm:p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700 cursor-pointer active:scale-95"
                  title="Tutup banner"
                >
                  <X className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            {/* Main Header & Dynamic Image / Logo Section */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 sm:gap-4 items-center">
              {/* Dynamic Circular Uploadable Logo */}
              <div className="md:col-span-4 flex justify-center">
                <div className="relative group/img overflow-hidden rounded-full w-20 h-20 sm:w-32 sm:h-32 border-2 border-emerald-400 bg-slate-950 shadow-2xl ring-2 sm:ring-4 ring-emerald-500/30 flex items-center justify-center p-0.5 sm:p-1 transition-all duration-300 hover:border-emerald-300 hover:ring-emerald-400/50 shrink-0 mx-auto">
                  {config.gambarUrl ? (
                    <img
                      src={config.gambarUrl}
                      alt="Logo / Header Banner"
                      className="w-full h-full object-cover rounded-full group-hover/img:scale-105 transition-transform duration-500 drop-shadow-md"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-slate-800 border border-emerald-500/30 flex flex-col items-center justify-center shadow-inner relative group/icon">
                      <Award className="w-7 h-7 sm:w-10 sm:h-10 text-emerald-400 group-hover/icon:scale-110 transition-transform duration-300 drop-shadow-lg" />
                      <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-amber-300 absolute top-1 right-1 sm:top-2 sm:right-2 animate-bounce" />
                      <span className="text-[8px] sm:text-[9px] font-bold text-slate-400 mt-0.5">Logo</span>
                    </div>
                  )}

                  {/* Direct Logo Upload Overlay Button */}
                  <div className="absolute inset-0 rounded-full bg-slate-950/80 backdrop-blur-xs opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col items-center justify-center space-y-1 p-1 text-center">
                    <button
                      type="button"
                      disabled={isUploadingLogo}
                      onClick={() => bannerFileInputRef.current?.click()}
                      className="px-2 py-0.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[9px] sm:text-[10px] flex items-center space-x-1 shadow-lg cursor-pointer transition-all active:scale-95"
                    >
                      {isUploadingLogo ? (
                        <>
                          <Loader2 className="w-2.5 h-2.5 animate-spin" />
                          <span>...</span>
                        </>
                      ) : (
                        <>
                          <Camera className="w-2.5 h-2.5" />
                          <span>Upload</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setEditForm(config);
                        setShowEditModal(true);
                      }}
                      className="text-[8px] text-slate-300 hover:text-white underline font-medium cursor-pointer"
                    >
                      Atur Logo
                    </button>
                  </div>
                </div>
              </div>

              {/* Title & Description */}
              <div className="md:col-span-8 space-y-1 sm:space-y-2 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start space-x-1.5 sm:space-x-2">
                  <span className="text-[11px] sm:text-xs font-bold text-slate-400">
                    Halo, <strong className="text-white">{displayName}</strong>
                  </span>
                  <span className={`text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                    !userSession ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' :
                    isSuperAdmin ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {!userSession ? '👋 Tamu Madrasah' : isSuperAdmin ? '👑 Super Admin' : '🎓 Guru Madrasah'}
                  </span>
                </div>

                <h2 className="text-lg sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-snug">
                  {config.judulBanner}
                </h2>

                <p className="text-[11px] sm:text-sm text-slate-300 font-medium leading-relaxed line-clamp-3 sm:line-clamp-none">
                  {config.subJudulBanner}
                </p>
              </div>
            </div>

            {/* Motto Quote Card */}
            {config.mottoBanner && (
              <div className="bg-slate-800/90 border border-slate-700/80 p-2.5 sm:p-4 rounded-xl sm:rounded-2xl flex items-center space-x-2.5 sm:space-x-3 text-xs text-slate-200 shadow-inner">
                <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-emerald-500/10 border border-emerald-500/30 shrink-0 text-emerald-400">
                  <Compass className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <p className="italic font-semibold text-emerald-200/90 text-[11px] sm:text-sm leading-snug">
                  "{config.mottoBanner}"
                </p>
              </div>
            )}

            {/* Action Buttons Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5 pt-1 sm:pt-2">
              {config.tombolUtamaText && (
                <button
                  type="button"
                  onClick={() => handleActionClick(config.tombolUtamaAction)}
                  className={`${theme.btnPrimary} font-black py-2.5 px-3 sm:p-3.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all active:scale-[0.98] cursor-pointer shadow-lg`}
                >
                  <Wand2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                  <span>{config.tombolUtamaText}</span>
                </button>
              )}

              {config.tombolSekunderText && (
                <button
                  type="button"
                  onClick={() => handleActionClick(config.tombolSekunderAction)}
                  className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-slate-600 font-bold py-2.5 px-3 sm:p-3.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all active:scale-[0.98] cursor-pointer shadow-md"
                >
                  <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
                  <span>{config.tombolSekunderText}</span>
                </button>
              )}

              {config.tombolTersierText && (
                <button
                  type="button"
                  onClick={() => handleActionClick(config.tombolTersierAction)}
                  className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-slate-600 font-bold py-2.5 px-3 sm:p-3.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all active:scale-[0.98] cursor-pointer shadow-md"
                >
                  <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
                  <span>{config.tombolTersierText}</span>
                </button>
              )}
            </div>

            {/* Bottom Action Bar: Tutup Banner */}
            <div className="pt-2 sm:pt-3 border-t border-slate-800/90 flex items-center justify-end">
              <button
                type="button"
                onClick={handleCloseToAdmin}
                className="w-full sm:w-auto px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs sm:text-sm transition-all cursor-pointer border border-slate-700 active:scale-95 flex items-center justify-center space-x-1.5 shadow-md"
              >
                <span>Tutup Banner</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* EDIT BANNER MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-lg overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-slate-900 border border-slate-700 text-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 space-y-5 shadow-2xl my-auto max-h-[92vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    Edit Banner Selamat Datang
                  </h3>
                  <p className="text-xs text-slate-400">
                    Sesuaikan judul, logo/gambar, tema warna, dan tombol aksi banner welcome.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              {/* Judul Banner */}
              <div>
                <label className="font-bold text-slate-300 block mb-1">
                  Judul Utama Banner *:
                </label>
                <input
                  type="text"
                  required
                  value={editForm.judulBanner}
                  onChange={(e) => setEditForm({ ...editForm, judulBanner: e.target.value })}
                  placeholder="misal: Selamat Datang di Portal Modul Ajar Berbasis Cinta (KBC)"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Sub-Judul */}
              <div>
                <label className="font-bold text-slate-300 block mb-1">
                  Deskripsi / Sub-Judul *:
                </label>
                <textarea
                  rows={2}
                  required
                  value={editForm.subJudulBanner}
                  onChange={(e) => setEditForm({ ...editForm, subJudulBanner: e.target.value })}
                  placeholder="Deskripsi singkat layanan..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Motto / Slogan & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">
                    Motto / Slogan (Quotes):
                  </label>
                  <input
                    type="text"
                    value={editForm.mottoBanner}
                    onChange={(e) => setEditForm({ ...editForm, mottoBanner: e.target.value })}
                    placeholder="misal: Mendidik dengan Cinta..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">
                    Label Badge Kategori:
                  </label>
                  <input
                    type="text"
                    value={editForm.kategoriBadge}
                    onChange={(e) => setEditForm({ ...editForm, kategoriBadge: e.target.value })}
                    placeholder="misal: Sistem Informasi KBC"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* DYNAMIC LOGO / GAMBAR BANNER SECTION */}
              <div className="bg-slate-800/80 p-3.5 sm:p-4 rounded-2xl border border-slate-700/80 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-extrabold text-amber-300 text-xs flex items-center space-x-1.5">
                    <ImageIcon className="w-4 h-4 text-emerald-400" />
                    <span>Upload & Pengaturan Logo Header Banner</span>
                  </label>
                  {editForm.gambarUrl && (
                    <button
                      type="button"
                      onClick={() => setEditForm({ ...editForm, gambarUrl: '' })}
                      className="text-[11px] font-bold text-rose-400 hover:text-rose-300 flex items-center space-x-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus Logo</span>
                    </button>
                  )}
                </div>

                {/* Upload Drag and Drop Dropzone */}
                <input
                  type="file"
                  ref={editModalFileInputRef}
                  onChange={handleEditModalFileChange}
                  accept="image/*"
                  className="hidden"
                />

                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => editModalFileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-2 ${
                    isDragOver
                      ? 'border-emerald-400 bg-emerald-500/20 scale-[0.99]'
                      : 'border-slate-700 bg-slate-900/80 hover:border-emerald-500/50 hover:bg-slate-900'
                  }`}
                >
                  {isUploadingLogo ? (
                    <div className="flex items-center space-x-2 text-emerald-400 py-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="font-bold text-xs">Mengompres & memproses gambar logo...</span>
                    </div>
                  ) : (
                    <>
                      <div className="p-2.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-extrabold text-white text-xs">
                          Tarik & Lepas File Logo di sini, atau <span className="text-emerald-400 underline">Klik untuk Memilih File</span>
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Mendukung Format PNG, JPG, WEBP, SVG, GIF (Otomatis Kompres Sesuai Layar)
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {uploadError && (
                  <p className="text-[11px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-xl">
                    ⚠️ {uploadError}
                  </p>
                )}

                {/* Live Logo Preview Box */}
                {editForm.gambarUrl ? (
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-700 flex items-center justify-between gap-3">
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <div className="w-14 h-14 bg-slate-900 rounded-full p-1 border-2 border-emerald-500/80 shrink-0 flex items-center justify-center overflow-hidden">
                        <img
                          src={editForm.gambarUrl}
                          alt="Logo Preview"
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-bold text-emerald-300 flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Logo Bulat Banner Aktif</span>
                        </p>
                        <p className="text-[10px] text-slate-400 truncate max-w-xs">
                          {editForm.gambarUrl.startsWith('data:') ? 'File Gambar Lokal (Dikompres Base64)' : editForm.gambarUrl}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setEditForm({ ...editForm, gambarUrl: '' })}
                      className="p-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30 cursor-pointer shrink-0"
                      title="Hapus Logo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <p className="text-[11px] italic text-slate-400">
                    Belum ada logo khusus diset (Menggunakan Ikon Default Banner KBC).
                  </p>
                )}

                {/* Quick Presets for Logo Choice */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold text-slate-300 block">
                    Atau Pilih Preset Logo Siap Pakai:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleApplyPresetLogo('kop')}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-700 text-emerald-300 border border-slate-700 text-[10px] font-bold flex items-center space-x-1 cursor-pointer transition-all"
                    >
                      <Building className="w-3 h-3 text-emerald-400" />
                      <span>Logo Kop Surat Madrasah</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleApplyPresetLogo('kemenag')}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-700 text-amber-300 border border-slate-700 text-[10px] font-bold flex items-center space-x-1 cursor-pointer transition-all"
                    >
                      <Award className="w-3 h-3 text-amber-400" />
                      <span>Logo Kemenag / Madrasah</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleApplyPresetLogo('kbc')}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-700 text-rose-300 border border-slate-700 text-[10px] font-bold flex items-center space-x-1 cursor-pointer transition-all"
                    >
                      <Heart className="w-3 h-3 text-rose-400" />
                      <span>Logo KBC (Berbasis Cinta)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleApplyPresetLogo('pendidikan')}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-700 text-indigo-300 border border-slate-700 text-[10px] font-bold flex items-center space-x-1 cursor-pointer transition-all"
                    >
                      <GraduationCap className="w-3 h-3 text-indigo-400" />
                      <span>Logo Pendidikan</span>
                    </button>
                  </div>
                </div>

                {/* Optional URL Input */}
                <div className="pt-1">
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1 flex items-center space-x-1">
                    <LinkIcon className="w-3 h-3" />
                    <span>Atau Tuliskan URL Gambar Web (Opsional):</span>
                  </label>
                  <input
                    type="url"
                    value={editForm.gambarUrl && !editForm.gambarUrl.startsWith('data:') ? editForm.gambarUrl : ''}
                    onChange={(e) => setEditForm({ ...editForm, gambarUrl: e.target.value })}
                    placeholder="https://domain.com/gambar-logo.jpg"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-medium text-[11px] focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Tema Warna Banner */}
              <div>
                <label className="font-bold text-slate-300 block mb-1.5 flex items-center space-x-1">
                  <Palette className="w-4 h-4 text-emerald-400" />
                  <span>Pilihan Tema Warna Banner:</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { id: 'emerald', name: 'Emerald KBC', color: 'from-emerald-500 to-teal-600' },
                    { id: 'indigo', name: 'Indigo Modern', color: 'from-indigo-500 to-purple-600' },
                    { id: 'amber', name: 'Amber Gold', color: 'from-amber-400 to-amber-600' },
                    { id: 'rose', name: 'Rose Love', color: 'from-rose-500 to-pink-600' },
                    { id: 'dark_luxury', name: 'Dark Luxury', color: 'from-slate-700 to-amber-400' }
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setEditForm({ ...editForm, themeStyle: t.id as any })}
                      className={`p-2 rounded-xl border text-[11px] font-bold text-center transition-all cursor-pointer flex flex-col items-center space-y-1 ${
                        editForm.themeStyle === t.id
                          ? 'border-emerald-400 bg-emerald-500/20 text-white ring-2 ring-emerald-500/50'
                          : 'border-slate-700 bg-slate-800/80 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className={`w-full h-3 rounded-md bg-gradient-to-r ${t.color}`} />
                      <span>{t.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Settings Action Buttons */}
              <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/80 space-y-3">
                <h4 className="font-extrabold text-amber-300 text-xs flex items-center space-x-1">
                  <Flame className="w-3.5 h-3.5" />
                  <span>Pengaturan Tombol Pintas / Quick Actions</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Tombol Utama */}
                  <div className="space-y-1 bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                    <label className="font-bold text-slate-200 block text-[11px]">Tombol 1 (Utama):</label>
                    <input
                      type="text"
                      value={editForm.tombolUtamaText}
                      onChange={(e) => setEditForm({ ...editForm, tombolUtamaText: e.target.value })}
                      placeholder="Label tombol..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-medium"
                    />
                    <select
                      value={editForm.tombolUtamaAction}
                      onChange={(e) => setEditForm({ ...editForm, tombolUtamaAction: e.target.value as any })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-slate-200 font-medium text-[11px]"
                    >
                      <option value="ai-modal">✨ Buat Modul AI</option>
                      <option value="materi-bank">📚 Bank Materi & LKPD</option>
                      <option value="quiz-player">⚡ Kuis Interaktif</option>
                      <option value="my-modules">📑 Modul Ajar Saya</option>
                      <option value="master-kurikulum">🏫 Master Kurikulum</option>
                      <option value="settings">⚙️ Pengaturan</option>
                    </select>
                  </div>

                  {/* Tombol Sekunder */}
                  <div className="space-y-1 bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                    <label className="font-bold text-slate-200 block text-[11px]">Tombol 2 (Sekunder):</label>
                    <input
                      type="text"
                      value={editForm.tombolSekunderText}
                      onChange={(e) => setEditForm({ ...editForm, tombolSekunderText: e.target.value })}
                      placeholder="Label tombol..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-medium"
                    />
                    <select
                      value={editForm.tombolSekunderAction}
                      onChange={(e) => setEditForm({ ...editForm, tombolSekunderAction: e.target.value as any })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-slate-200 font-medium text-[11px]"
                    >
                      <option value="ai-modal">✨ Buat Modul AI</option>
                      <option value="materi-bank">📚 Bank Materi & LKPD</option>
                      <option value="quiz-player">⚡ Kuis Interaktif</option>
                      <option value="my-modules">📑 Modul Ajar Saya</option>
                      <option value="master-kurikulum">🏫 Master Kurikulum</option>
                      <option value="settings">⚙️ Pengaturan</option>
                    </select>
                  </div>

                  {/* Tombol Tersier */}
                  <div className="space-y-1 bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                    <label className="font-bold text-slate-200 block text-[11px]">Tombol 3 (Tersier):</label>
                    <input
                      type="text"
                      value={editForm.tombolTersierText}
                      onChange={(e) => setEditForm({ ...editForm, tombolTersierText: e.target.value })}
                      placeholder="Label tombol..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-medium"
                    />
                    <select
                      value={editForm.tombolTersierAction}
                      onChange={(e) => setEditForm({ ...editForm, tombolTersierAction: e.target.value as any })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-slate-200 font-medium text-[11px]"
                    >
                      <option value="ai-modal">✨ Buat Modul AI</option>
                      <option value="materi-bank">📚 Bank Materi & LKPD</option>
                      <option value="quiz-player">⚡ Kuis Interaktif</option>
                      <option value="my-modules">📑 Modul Ajar Saya</option>
                      <option value="master-kurikulum">🏫 Master Kurikulum</option>
                      <option value="settings">⚙️ Pengaturan</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* STUDENT QUIZ LINK BANNER SETTINGS */}
              <div className="bg-slate-800/90 p-3.5 rounded-2xl border border-emerald-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-emerald-300 text-xs flex items-center space-x-1.5">
                    <GraduationCap className="w-4 h-4 text-emerald-400" />
                    <span>Pengaturan Banner Khusus Link Kuis Siswa</span>
                  </h4>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="studentBannerActive"
                      checked={editForm.studentBannerActive !== false}
                      onChange={(e) => setEditForm({ ...editForm, studentBannerActive: e.target.checked })}
                      className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                    />
                    <label htmlFor="studentBannerActive" className="font-bold text-xs text-slate-200 cursor-pointer">
                      Tampilkan Banner Siswa
                    </label>
                  </div>
                </div>

                {editForm.studentBannerActive !== false && (
                  <div className="space-y-2.5 pt-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="font-bold text-slate-300 block mb-1 text-[11px]">
                          Badge Text Banner Siswa:
                        </label>
                        <input
                          type="text"
                          value={editForm.studentBadgeText || ''}
                          onChange={(e) => setEditForm({ ...editForm, studentBadgeText: e.target.value })}
                          placeholder="🎓 KUIS & LATIHAN SISWA INTERAKTIF"
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-medium text-[11px]"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-300 block mb-1 text-[11px]">
                          Label Tombol Utama Siswa:
                        </label>
                        <input
                          type="text"
                          value={editForm.studentTombolUtamaText || ''}
                          onChange={(e) => setEditForm({ ...editForm, studentTombolUtamaText: e.target.value })}
                          placeholder="🎯 MULAI KERJAKAN KUIS"
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-medium text-[11px]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-slate-300 block mb-1 text-[11px]">
                        Judul Banner Kuis Siswa:
                      </label>
                      <input
                        type="text"
                        value={editForm.studentJudulBanner || ''}
                        onChange={(e) => setEditForm({ ...editForm, studentJudulBanner: e.target.value })}
                        placeholder="SELAMAT DATANG DI KUIS SISWA 🚀"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-medium text-[11px]"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-300 block mb-1 text-[11px]">
                        Deskripsi / Pesan Banner Siswa:
                      </label>
                      <textarea
                        rows={2}
                        value={editForm.studentSubJudulBanner || ''}
                        onChange={(e) => setEditForm({ ...editForm, studentSubJudulBanner: e.target.value })}
                        placeholder="Selamat mengerjakan kuis dan latihan interaktif secara mandiri..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-medium text-[11px]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleResetDefault}
                  className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Default</span>
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all cursor-pointer"
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center space-x-1.5 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Simpan Perubahan</span>
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Save Notification Toast */}
      {saveToast && (
        <div className="fixed top-5 right-5 z-[70] bg-emerald-600 text-white font-bold px-4 py-2.5 rounded-2xl shadow-2xl flex items-center space-x-2 text-xs border border-emerald-400 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>✅ Banner Welcome & Logo Berhasil Diperbarui!</span>
        </div>
      )}
    </AnimatePresence>
  );
};

