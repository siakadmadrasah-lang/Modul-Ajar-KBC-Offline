import { saveMadrasahList, loadMadrasahList, saveActiveMadrasahId, saveSupabaseConfig, DEFAULT_SUPABASE_CONFIG, saveApiKey, restoreSuperAdminCredentials, saveSuperAdminCredentialsBackup, clearActiveCredentialsForRegularUser } from './storage';
import { MadrasahItem } from '../types';

export interface UserSession {
  username: string;
  email?: string;
  namaLengkap: string;
  role: 'admin' | 'guru' | 'operator' | 'superadmin';
  isSuperAdmin?: boolean;
  loginAt: number; // timestamp
  trialStartDate: number; // timestamp
  isRegisteredOfficial: boolean; // whether officially registered or still in trial
  registeredMadrasahName?: string;
}

export const SUPER_ADMIN_EMAIL = 'jaenalmaskun@gmail.com';

export function isSuperAdminUser(session?: UserSession | null): boolean {
  const current = session || loadUserSession();
  if (!current) return false;
  const cleanUser = (current.username || '').trim().toLowerCase();
  const cleanEmail = (current.email || '').trim().toLowerCase();
  return cleanUser === SUPER_ADMIN_EMAIL || cleanEmail === SUPER_ADMIN_EMAIL || cleanUser === 'jaenalmaskun' || current.isSuperAdmin === true;
}

const AUTH_STORAGE_KEY = 'kbc_mi_user_session_v1';
const TRIAL_START_KEY = 'kbc_mi_trial_start_date_v1';
const REGISTERED_OFFICIAL_KEY = 'kbc_mi_registered_official_v1';

export const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000; // 3 days in ms

export function getTrialStartDate(): number {
  try {
    const raw = localStorage.getItem(TRIAL_START_KEY);
    if (raw) {
      const parsed = parseInt(raw, 10);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
  } catch (e) {}
  const now = Date.now();
  try {
    localStorage.setItem(TRIAL_START_KEY, now.toString());
  } catch (e) {}
  return now;
}

export function isOfficialRegistered(): boolean {
  try {
    return localStorage.getItem(REGISTERED_OFFICIAL_KEY) === 'true';
  } catch (e) {
    return false;
  }
}

export function setOfficialRegistered(registered: boolean = true): void {
  try {
    localStorage.setItem(REGISTERED_OFFICIAL_KEY, registered ? 'true' : 'false');
  } catch (e) {}
}

export interface TrialStatus {
  isExpired: boolean;
  isRegisteredOfficial: boolean;
  remainingMs: number;
  remainingDays: number;
  remainingHours: number;
  remainingMinutes: number;
  totalDays: number;
  percentRemaining: number;
}

export function getTrialStatus(): TrialStatus {
  const isOfficial = isOfficialRegistered();
  if (isOfficial) {
    return {
      isExpired: false,
      isRegisteredOfficial: true,
      remainingMs: THREE_DAYS_MS,
      remainingDays: 3,
      remainingHours: 72,
      remainingMinutes: 4320,
      totalDays: 3,
      percentRemaining: 100
    };
  }

  const startDate = getTrialStartDate();
  const now = Date.now();
  const elapsed = now - startDate;
  const remainingMs = Math.max(0, THREE_DAYS_MS - elapsed);
  const isExpired = remainingMs <= 0;

  const remainingMinutes = Math.floor(remainingMs / (1000 * 60));
  const remainingHours = Math.floor(remainingMs / (1000 * 60 * 60));
  const remainingDays = Math.ceil(remainingMs / (1000 * 60 * 60 * 24));
  const percentRemaining = Math.max(0, Math.min(100, Math.round((remainingMs / THREE_DAYS_MS) * 100)));

  return {
    isExpired,
    isRegisteredOfficial: false,
    remainingMs,
    remainingDays,
    remainingHours,
    remainingMinutes,
    totalDays: 3,
    percentRemaining
  };
}

// Load current logged in user session
export function loadUserSession(): UserSession | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) {
      const session = JSON.parse(raw);
      if (session && session.username) {
        return session;
      }
    }
  } catch (e) {}
  return null;
}

// Save user session
export function saveUserSession(session: UserSession | null): void {
  try {
    if (session) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch (e) {}
}

const LAST_LOGGED_USER_KEY = 'kbc_mi_last_logged_username_v1';

export function getLastLoggedUsername(): string {
  try {
    return localStorage.getItem(LAST_LOGGED_USER_KEY) || '';
  } catch (err) {
    return '';
  }
}

export function setLastLoggedUsername(username: string): void {
  try {
    localStorage.setItem(LAST_LOGGED_USER_KEY, username.trim().toLowerCase());
  } catch (err) {
    console.error('Error saving last logged username:', err);
  }
}

// System login verification
export function authenticateUser(usernameInput: string, passwordInput: string): { success: boolean; session?: UserSession; message?: string } {
  const cleanUser = usernameInput.trim().toLowerCase();
  const cleanPass = passwordInput.trim();

  if (!cleanUser || !cleanPass) {
    return { success: false, message: 'Username / email dan kata sandi wajib diisi!' };
  }

  // Check if logging in as Super Admin email
  const isSuper = cleanUser === SUPER_ADMIN_EMAIL || cleanUser === 'jaenalmaskun';

  // System credentials list
  const DEFAULT_ACCOUNTS = [
    { user: 'jaenalmaskun@gmail.com', pass: 'admin', name: 'Jaenal Maskun, S.Pd.I. (Super Admin)', role: 'superadmin', isSuper: true, email: 'jaenalmaskun@gmail.com' },
    { user: 'jaenalmaskun', pass: 'admin', name: 'Jaenal Maskun, S.Pd.I. (Super Admin)', role: 'superadmin', isSuper: true, email: 'jaenalmaskun@gmail.com' },
    { user: 'admin', pass: 'admin', name: 'Administrator Madrasah', role: 'admin' },
    { user: 'guru', pass: 'guru123', name: 'Guru Pengajar', role: 'guru' },
    { user: 'operator', pass: 'operator123', name: 'Operator Madrasah', role: 'operator' },
    { user: 'demo', pass: 'demo123', name: 'Pengguna Trial Demo', role: 'guru' }
  ];

  const matched = DEFAULT_ACCOUNTS.find(a => a.user === cleanUser && a.pass === cleanPass);

  let userSession: UserSession;
  if (isSuper) {
    setOfficialRegistered(true);
    userSession = {
      username: SUPER_ADMIN_EMAIL,
      email: SUPER_ADMIN_EMAIL,
      namaLengkap: 'Jaenal Maskun, S.Pd.I. (Super Admin)',
      role: 'superadmin',
      isSuperAdmin: true,
      loginAt: Date.now(),
      trialStartDate: getTrialStartDate(),
      isRegisteredOfficial: true
    };
  } else if (matched) {
    userSession = {
      username: matched.user,
      email: matched.email || matched.user,
      namaLengkap: matched.name,
      role: matched.role as any,
      isSuperAdmin: matched.isSuper || false,
      loginAt: Date.now(),
      trialStartDate: getTrialStartDate(),
      isRegisteredOfficial: matched.isSuper ? true : isOfficialRegistered()
    };
  } else if (cleanPass.length >= 3) {
    userSession = {
      username: cleanUser,
      email: cleanUser.includes('@') ? cleanUser : undefined,
      namaLengkap: cleanUser.charAt(0).toUpperCase() + cleanUser.slice(1),
      role: 'guru',
      isSuperAdmin: false,
      loginAt: Date.now(),
      trialStartDate: getTrialStartDate(),
      isRegisteredOfficial: isOfficialRegistered()
    };
  } else {
    return { success: false, message: 'Username atau kata sandi tidak sesuai! Gunakan akun sistem: admin / admin atau jaenalmaskun@gmail.com / admin' };
  }

  const newUsernameClean = userSession.username.trim().toLowerCase();

  // Save session first so system recognizes current user
  saveUserSession(userSession);
  setLastLoggedUsername(newUsernameClean);

  // If logging in as Super Admin, restore Super Admin's Supabase credentials and API Key
  if (isSuperAdminUser(userSession)) {
    restoreSuperAdminCredentials();
  } else {
    // Regular users: Reset active Supabase credentials and Gemini API Key to default empty
    clearActiveCredentialsForRegularUser();
  }

  return { success: true, session: userSession };
}

// Logout user
export function logoutUser(): void {
  const currentSession = loadUserSession();
  if (isSuperAdminUser(currentSession)) {
    saveSuperAdminCredentialsBackup();
  }
  clearActiveCredentialsForRegularUser();
  saveUserSession(null);
}

// Register Official Madrasah to unlock full features & convert from Trial to Official
export function registerOfficialMadrasah(data: {
  namaMadrasah: string;
  kotaKabupaten?: string;
  nsmOrNpsn?: string;
  alamat?: string;
  kontak?: string;
}): { success: boolean; newMadrasahId: string; message: string } {
  if (!data.namaMadrasah || !data.namaMadrasah.trim()) {
    return { success: false, newMadrasahId: '', message: 'Nama Madrasah wajib diisi!' };
  }

  const cleanNama = data.namaMadrasah.trim();
  const slug = cleanNama.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const id = `m-${slug}-${Date.now().toString(36)}`;

  const newMadrasahItem: MadrasahItem = {
    id,
    nama: cleanNama,
    kodeMadrasah: (data.nsmOrNpsn && data.nsmOrNpsn.trim()) || slug.toUpperCase().slice(0, 15),
    nsmOrNpsn: data.nsmOrNpsn?.trim() || '',
    alamat: data.alamat?.trim() || (data.kotaKabupaten ? `Kab/Kota ${data.kotaKabupaten.trim()}` : ''),
    kontak: data.kontak?.trim() || '',
    createdAt: new Date().toISOString()
  };

  const list = loadMadrasahList();
  const existingIndex = list.findIndex(m => m.nama.toLowerCase() === cleanNama.toLowerCase());
  if (existingIndex >= 0) {
    list[existingIndex] = { ...list[existingIndex], ...newMadrasahItem, id: list[existingIndex].id };
    saveMadrasahList(list);
    saveActiveMadrasahId(list[existingIndex].id);
    setOfficialRegistered(true);

    const cur = loadUserSession();
    if (cur) {
      cur.isRegisteredOfficial = true;
      cur.registeredMadrasahName = cleanNama;
      saveUserSession(cur);
    }

    return {
      success: true,
      newMadrasahId: list[existingIndex].id,
      message: `Selamat! Madrasah "${cleanNama}" berhasil didaftarkan secara resmi.`
    };
  }

  const updatedList = [newMadrasahItem, ...list];
  saveMadrasahList(updatedList);
  saveActiveMadrasahId(id);
  setOfficialRegistered(true);

  const cur = loadUserSession();
  if (cur) {
    cur.isRegisteredOfficial = true;
    cur.registeredMadrasahName = cleanNama;
    saveUserSession(cur);
  }

  return {
    success: true,
    newMadrasahId: id,
    message: `Selamat! Madrasah "${cleanNama}" telah resmi terdaftar di Sistem Pengelola Madrasah.`
  };
}
