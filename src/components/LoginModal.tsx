import React, { useState } from 'react';
import { authenticateUser, UserSession } from '../utils/auth';
import { Lock, User, KeyRound, LogIn, AlertCircle, ShieldCheck, Clock, X } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onLoginSuccess: (session: UserSession) => void;
  onOpenOfficialRegister?: () => void;
  onClose?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onLoginSuccess,
  onOpenOfficialRegister,
  onClose
}) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      const res = authenticateUser(username, password);
      setIsLoading(false);

      if (res.success && res.session) {
        onLoginSuccess(res.session);
      } else {
        setErrorMsg(res.message || 'Username atau kata sandi salah!');
      }
    }, 300);
  };

  const handleQuickLogin = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setErrorMsg('');
    const res = authenticateUser(u, p);
    if (res.success && res.session) {
      onLoginSuccess(res.session);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-[370px] w-full overflow-hidden">
        {/* Header Visual Compact */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-900 to-slate-900 text-white px-5 py-4 relative overflow-hidden flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 border border-white/20 rounded-xl text-emerald-300 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white tracking-tight leading-tight">
                Masuk Sistem KBC-MI
              </h2>
              <p className="text-[11px] text-emerald-200/90 font-medium leading-none mt-0.5">
                Generator Modul Ajar Panca Cinta
              </p>
            </div>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-100 hover:text-white transition-all cursor-pointer shrink-0"
              title="Tutup / Batal"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Form Body Compact */}
        <div className="p-4 sm:p-5 space-y-3.5 text-xs">
          {errorMsg && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="font-semibold">{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Username
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username (contoh: admin)"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Kata Sandi
              </label>
              <div className="relative">
                <KeyRound className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Kata sandi (contoh: admin)"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5 active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? (
                <span>Memproses...</span>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Masuk Sekarang</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Login Presets */}
          <div className="pt-2 border-t border-slate-100 space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 block text-center uppercase tracking-wider">
              Akses Cepat System Default
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin', 'admin')}
                className="p-1.5 px-2 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-lg text-[11px] font-bold text-slate-700 hover:text-emerald-800 transition-all flex items-center space-x-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">Admin Utama</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('guru', 'guru123')}
                className="p-1.5 px-2 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-lg text-[11px] font-bold text-slate-700 hover:text-emerald-800 transition-all flex items-center space-x-1.5"
              >
                <User className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">Akun Guru</span>
              </button>
            </div>
          </div>

          {/* Compact Trial Notice */}
          <div className="p-2.5 bg-amber-50/80 border border-amber-200/80 rounded-xl text-amber-950 text-[10.5px] leading-tight space-y-1">
            <div className="font-extrabold flex items-center space-x-1 text-amber-900">
              <Clock className="w-3 h-3 text-amber-600 shrink-0" />
              <span>Akses Trial Gratis 3 Hari</span>
            </div>
            {onOpenOfficialRegister && (
              <button
                type="button"
                onClick={onOpenOfficialRegister}
                className="text-emerald-700 hover:text-emerald-900 font-extrabold underline block"
              >
                Daftar Resmi Nama Madrasah &rarr;
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

