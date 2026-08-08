import { ModulAjarCinta, KopSuratSettings, TTDSettings, SupabaseConfig, MysqlConfig, MateriBankItem, TeacherItem, MadrasahItem, DEFAULT_TAHUN_AJARAN_OPTIONS, MAPEL_MI_OPTIONS, WelcomeBannerConfig, DEFAULT_WELCOME_BANNER_CONFIG, StudentAccount, StudentQuizResult } from '../types';
import { SAMPLE_MODULES, DEFAULT_KOP_SURAT, DEFAULT_TTD, INITIAL_MATERI_BANK, DEFAULT_TEACHERS } from '../data/sampleModules';
import { debouncedPushToCloud } from './firebaseSync';
import { debouncedPushToSupabase } from './supabaseSync';

export const DEFAULT_MADRASAH_LIST: MadrasahItem[] = [
  {
    id: 'mi-maarif-nu-2-sanggreman',
    nama: "MI Ma'arif NU 2 Sanggreman",
    kodeMadrasah: "MIMNU2SANGGREMAN",
    jenjang: "MI",
    nsm: "111233020054",
    npsn: "60712345",
    nsmOrNpsn: "111233020054",
    statusSekolah: "Swasta",
    akreditasi: "A (Unggul)",
    noSkAkreditasi: "1347/BAN-SM/SK/2021",
    tglAkreditasi: "08 Desember 2021 - 2026",
    skIzinOperasional: "Kd.11.02/4/PP.00.4/0125/2010",
    tglSkIzinOperasional: "12 Juli 2010",
    tahunBerdiri: "1968",
    kepalaMadrasah: "JAENAL MASKUN, S.Pd.I.",
    nipKepalaMadrasah: "198205122009011003",
    namaYayasan: "Lembaga Pendidikan Ma'arif NU Banyumas",
    noSkYayasan: "AHU-0001234.AH.01.04.Tahun 2015",
    alamat: "Jl. Ma'arif No. 02",
    rtRw: "03 / 01",
    dusun: "Sanggreman Barat",
    alamatLengkap: "Jl. Ma'arif No. 02 RT 03/RW 01, Sanggreman, Kec. Rawalo, Kab. Banyumas, Jawa Tengah 53173",
    desaKelurahan: "Sanggreman",
    kecamatan: "Rawalo",
    kotaKabupaten: "Kab. Banyumas",
    provinsi: "Jawa Tengah",
    kodePos: "53173",
    titikKoordinat: "-7.518294, 109.184721",
    kontak: "081234567890",
    email: "mimaarifnu2sanggreman@gmail.com",
    website: "https://maarifnubanyumas.or.id",
    jumlahSiswaL: 112,
    jumlahSiswaP: 98,
    jumlahRombel: 6,
    jumlahGuruL: 4,
    jumlahGuruP: 8,
    jumlahTendik: 2,
    createdAt: "2025-01-01T00:00:00.000Z"
  },
  {
    id: 'mi-maarif-nu-1-sanggreman',
    nama: "MI Ma'arif NU 1 Sanggreman",
    kodeMadrasah: "MIMNU1SANGGREMAN",
    jenjang: "MI",
    nsm: "111233020053",
    npsn: "60712344",
    nsmOrNpsn: "111233020053",
    statusSekolah: "Swasta",
    akreditasi: "B (Baik)",
    noSkAkreditasi: "0982/BAN-SM/SK/2022",
    tglAkreditasi: "15 Oktober 2022 - 2027",
    skIzinOperasional: "Kd.11.02/4/PP.00.4/0110/2010",
    tglSkIzinOperasional: "10 Mei 2010",
    tahunBerdiri: "1965",
    kepalaMadrasah: "AHMAD KHOLIL, S.Pd.I.",
    nipKepalaMadrasah: "198501012010011002",
    namaYayasan: "Lembaga Pendidikan Ma'arif NU Banyumas",
    noSkYayasan: "AHU-0001234.AH.01.04.Tahun 2015",
    alamat: "Jl. Pendidikan No. 01",
    rtRw: "01 / 02",
    dusun: "Sanggreman Timur",
    alamatLengkap: "Jl. Pendidikan No. 01 RT 01/RW 02, Sanggreman, Kec. Rawalo, Kab. Banyumas, Jawa Tengah 53173",
    desaKelurahan: "Sanggreman",
    kecamatan: "Rawalo",
    kotaKabupaten: "Kab. Banyumas",
    provinsi: "Jawa Tengah",
    kodePos: "53173",
    titikKoordinat: "-7.519100, 109.186200",
    kontak: "082134567891",
    email: "mimaarifnu1sanggreman@gmail.com",
    website: "https://maarifnubanyumas.or.id",
    jumlahSiswaL: 95,
    jumlahSiswaP: 88,
    jumlahRombel: 6,
    jumlahGuruL: 3,
    jumlahGuruP: 7,
    jumlahTendik: 2,
    createdAt: "2025-01-01T00:00:00.000Z"
  },
  {
    id: 'mi-maarif-nu-karanglewas',
    nama: "MI Ma'arif NU Karanglewas",
    kodeMadrasah: "MIMNUKARANGLEWAS",
    jenjang: "MI",
    nsm: "111233020055",
    npsn: "60712346",
    nsmOrNpsn: "111233020055",
    statusSekolah: "Swasta",
    akreditasi: "A (Unggul)",
    noSkAkreditasi: "1450/BAN-SM/SK/2021",
    tglAkreditasi: "20 November 2021 - 2026",
    skIzinOperasional: "Kd.11.02/4/PP.00.4/0130/2010",
    tglSkIzinOperasional: "18 Agustus 2010",
    tahunBerdiri: "1972",
    kepalaMadrasah: "SITI NURJANAH, S.Pd.",
    nipKepalaMadrasah: "-",
    namaYayasan: "Lembaga Pendidikan Ma'arif NU Banyumas",
    noSkYayasan: "AHU-0001234.AH.01.04.Tahun 2015",
    alamat: "Jl. Karanglewas Raya No. 12",
    rtRw: "02 / 03",
    dusun: "Karanglewas Tengah",
    alamatLengkap: "Jl. Karanglewas Raya No. 12, Karanglewas, Kec. Jatilawang, Kab. Banyumas, Jawa Tengah 53174",
    desaKelurahan: "Karanglewas",
    kecamatan: "Jatilawang",
    kotaKabupaten: "Kab. Banyumas",
    provinsi: "Jawa Tengah",
    kodePos: "53174",
    titikKoordinat: "-7.525400, 109.124500",
    kontak: "085678901234",
    email: "mimaarifnukaranglewas@gmail.com",
    website: "https://maarifnubanyumas.or.id",
    jumlahSiswaL: 120,
    jumlahSiswaP: 110,
    jumlahRombel: 6,
    jumlahGuruL: 5,
    jumlahGuruP: 9,
    jumlahTendik: 3,
    createdAt: "2025-01-01T00:00:00.000Z"
  }
];

const MULTI_TENANT_KEYS = {
  MADRASAH_LIST: 'kbc_mi_madrasah_list_v1',
  ACTIVE_MADRASAH_ID: 'kbc_mi_active_madrasah_id_v1'
};

const STORAGE_KEYS = {
  MODULES: 'kbc_mi_modules_v1',
  KOP_SURAT: 'kbc_mi_kop_surat_v1',
  TTD: 'kbc_mi_ttd_v1',
  API_KEY: 'kbc_mi_api_key_v1',
  MATERI_BANK: 'kbc_mi_materi_bank_v1',
  TEACHERS: 'kbc_mi_teachers_v1',
  STUDENTS: 'kbc_mi_students_v1',
  STUDENT_QUIZ_RESULTS: 'kbc_mi_student_quiz_results_v1',
  STUDENT_SESSION: 'kbc_mi_student_session_v1',
  CUSTOM_MAPEL: 'kbc_mi_custom_mapel_v1',
  CUSTOM_TAHUN_AJARAN: 'kbc_mi_custom_tahun_ajaran_v1',
  ACTIVE_TAHUN_AJARAN: 'kbc_mi_active_tahun_ajaran_v1',
  TEACHER_PIN: 'kbc_mi_teacher_pin_v1',
  CUSTOM_OG_IMAGE: 'kbc_mi_custom_og_image_v1',
  MAPEL_OG_CONFIGS: 'kbc_mapel_og_configs_v1',
  SUPABASE_CONFIG: 'kbc_mi_supabase_config_v1',
  MYSQL_CONFIG: 'kbc_mi_mysql_config_v1',
  WELCOME_BANNER: 'kbc_welcome_banner_config_v1',
  LAST_UPDATED: 'kbc_mi_last_updated_v1'
};

export function loadWelcomeBannerConfig(): WelcomeBannerConfig {
  try {
    const raw = localStorage.getItem(getScopedKey(STORAGE_KEYS.WELCOME_BANNER));
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_WELCOME_BANNER_CONFIG, ...parsed };
    }
  } catch (err) {
    console.warn('Failed to load welcome banner config:', err);
  }
  return DEFAULT_WELCOME_BANNER_CONFIG;
}

export function saveWelcomeBannerConfig(config: WelcomeBannerConfig): void {
  try {
    setScopedItem(STORAGE_KEYS.WELCOME_BANNER, JSON.stringify(config));
  } catch (err) {
    console.error('Failed to save welcome banner config:', err);
  }
}

export function loadLastUpdated(): string {
  try {
    return localStorage.getItem(getScopedKey(STORAGE_KEYS.LAST_UPDATED)) || '';
  } catch (err) {
    return '';
  }
}

export function touchLastUpdated(): string {
  const now = new Date().toISOString();
  try {
    setScopedItem(STORAGE_KEYS.LAST_UPDATED, now);
  } catch (err) {
    console.error('Error setting last updated:', err);
  }
  return now;
}

export function setLastUpdatedTimestamp(isoStr: string): void {
  try {
    if (isoStr) setScopedItem(STORAGE_KEYS.LAST_UPDATED, isoStr);
  } catch (err) {
    console.error('Error setting last updated timestamp:', err);
  }
}

export function loadMadrasahList(): MadrasahItem[] {
  try {
    const raw = localStorage.getItem(MULTI_TENANT_KEYS.MADRASAH_LIST);
    if (!raw) {
      localStorage.setItem(MULTI_TENANT_KEYS.MADRASAH_LIST, JSON.stringify(DEFAULT_MADRASAH_LIST));
      return DEFAULT_MADRASAH_LIST;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_MADRASAH_LIST;
  } catch (err) {
    return DEFAULT_MADRASAH_LIST;
  }
}

export function saveMadrasahList(list: MadrasahItem[]): void {
  try {
    localStorage.setItem(MULTI_TENANT_KEYS.MADRASAH_LIST, JSON.stringify(list));
  } catch (err) {
    console.error('Error saving madrasah list:', err);
  }
}

export function loadActiveMadrasahId(): string {
  try {
    const val = localStorage.getItem(MULTI_TENANT_KEYS.ACTIVE_MADRASAH_ID);
    if (val && val.trim()) return val.trim();
    return 'mi-maarif-nu-2-sanggreman';
  } catch (err) {
    return 'mi-maarif-nu-2-sanggreman';
  }
}

export function saveActiveMadrasahId(id: string): void {
  try {
    localStorage.setItem(MULTI_TENANT_KEYS.ACTIVE_MADRASAH_ID, id.trim());
  } catch (err) {
    console.error('Error saving active madrasah id:', err);
  }
}

export function getActiveMadrasah(): MadrasahItem {
  const activeId = loadActiveMadrasahId();
  const list = loadMadrasahList();
  const found = list.find(m => m.id === activeId);
  if (found) return found;
  return list[0] || DEFAULT_MADRASAH_LIST[0];
}

function getScopedKey(baseKey: string, madrasahId?: string): string {
  const id = madrasahId || loadActiveMadrasahId();
  if (id === 'mi-maarif-nu-2-sanggreman') {
    const scoped = `${baseKey}__${id}`;
    if (localStorage.getItem(scoped)) return scoped;
    return baseKey; // Fallback to root key for existing data
  }
  return `${baseKey}__${id}`;
}

function setScopedItem(baseKey: string, value: string, madrasahId?: string): void {
  const id = madrasahId || loadActiveMadrasahId();
  const targetKey = getScopedKey(baseKey, id);
  try {
    localStorage.setItem(targetKey, value);
    // Remove redundant duplicate key if present to free up quota space
    if (id === 'mi-maarif-nu-2-sanggreman') {
      const redundantKey = targetKey === baseKey ? `${baseKey}__${id}` : baseKey;
      localStorage.removeItem(redundantKey);
    }
  } catch (err) {
    console.warn(`LocalStorage quota reached when writing ${targetKey}`);
    try {
      if (id === 'mi-maarif-nu-2-sanggreman') {
        localStorage.removeItem(`${baseKey}__${id}`);
      }
      localStorage.setItem(targetKey, value);
    } catch (retryErr) {
      console.warn(`Could not save ${baseKey} to LocalStorage due to quota limits.`);
    }
  }
}

function removeScopedItem(baseKey: string, madrasahId?: string): void {
  const id = madrasahId || loadActiveMadrasahId();
  const targetKey = getScopedKey(baseKey, id);
  try {
    localStorage.removeItem(targetKey);
    if (id === 'mi-maarif-nu-2-sanggreman') {
      localStorage.removeItem(baseKey);
      localStorage.removeItem(`${baseKey}__${id}`);
    }
  } catch (err) {
    // ignore
  }
}

export function loadCustomOgImage(): string {
  try {
    return localStorage.getItem(getScopedKey(STORAGE_KEYS.CUSTOM_OG_IMAGE)) || '';
  } catch (err) {
    return '';
  }
}

export function saveCustomOgImage(urlOrBase64: string, shouldPush: boolean = true): void {
  try {
    if (urlOrBase64) {
      setScopedItem(STORAGE_KEYS.CUSTOM_OG_IMAGE, urlOrBase64);
    } else {
      removeScopedItem(STORAGE_KEYS.CUSTOM_OG_IMAGE);
    }
  } catch (err) {
    console.error('Error saving custom OG image to scoped storage:', err);
    try {
      if (urlOrBase64) {
        localStorage.setItem(STORAGE_KEYS.CUSTOM_OG_IMAGE, urlOrBase64);
      } else {
        localStorage.removeItem(STORAGE_KEYS.CUSTOM_OG_IMAGE);
      }
    } catch (e) {
      console.warn('LocalStorage quota limit reached when saving custom OG image.');
    }
  }

  if (shouldPush) {
    try {
      touchLastUpdated();
      debouncedPushToCloud();
      debouncedPushToSupabase();
    } catch (pushErr) {
      // Ignore cloud push errors when MySQL/Cloud is offline
    }
  }
}

export function loadMapelOgConfigs(): Record<string, { title: string; desc: string; imageUrl: string }> {
  try {
    const scopedKey = getScopedKey(STORAGE_KEYS.MAPEL_OG_CONFIGS);
    const raw = localStorage.getItem(scopedKey) || localStorage.getItem(STORAGE_KEYS.MAPEL_OG_CONFIGS);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    return {};
  }
}

export function saveMapelOgConfigs(
  configs: Record<string, { title: string; desc: string; imageUrl: string }>,
  shouldPush: boolean = true
): void {
  try {
    const jsonStr = JSON.stringify(configs);
    setScopedItem(STORAGE_KEYS.MAPEL_OG_CONFIGS, jsonStr);
    if (shouldPush) {
      try {
        touchLastUpdated();
        debouncedPushToCloud();
        debouncedPushToSupabase();
      } catch (e) {
        // ignore push error
      }
    }
  } catch (err) {
    console.warn('Error saving mapel OG configs to LocalStorage:', err);
  }
}

export function loadStoredModules(): ModulAjarCinta[] {
  try {
    const key = getScopedKey(STORAGE_KEYS.MODULES);
    const raw = localStorage.getItem(key);
    if (raw === null) {
      setScopedItem(STORAGE_KEYS.MODULES, JSON.stringify(SAMPLE_MODULES));
      return SAMPLE_MODULES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : SAMPLE_MODULES;
  } catch (err) {
    console.error('Error loading stored modules:', err);
    return SAMPLE_MODULES;
  }
}

export function saveModules(modules: ModulAjarCinta[], shouldPush: boolean = true): void {
  try {
    setScopedItem(STORAGE_KEYS.MODULES, JSON.stringify(modules));
    if (shouldPush) {
      touchLastUpdated();
      debouncedPushToCloud();
      debouncedPushToSupabase();
    }
  } catch (err) {
    console.error('Error saving modules:', err);
  }
}

export function loadKopSurat(): KopSuratSettings {
  try {
    const activeMadrasah = getActiveMadrasah();
    const key = getScopedKey(STORAGE_KEYS.KOP_SURAT);
    const raw = localStorage.getItem(key);
    if (!raw) {
      return {
        ...DEFAULT_KOP_SURAT,
        namaMadrasah: activeMadrasah.nama,
        alamatMadrasah: activeMadrasah.alamat || DEFAULT_KOP_SURAT.alamatMadrasah
      };
    }
    const parsed = { ...DEFAULT_KOP_SURAT, ...JSON.parse(raw) };
    if (!parsed.namaKantor || parsed.namaKantor === 'KANTOR KEMENTERIAN AGAMA KABUPATEN BANYUMAS') {
      parsed.namaKantor = "LEMBAGA PENDIDIKAN MA'ARIF NU BANYUMAS";
    }
    return parsed;
  } catch (err) {
    return DEFAULT_KOP_SURAT;
  }
}

export function saveKopSurat(kop: KopSuratSettings, shouldPush: boolean = true): void {
  try {
    setScopedItem(STORAGE_KEYS.KOP_SURAT, JSON.stringify(kop));
    if (shouldPush) {
      touchLastUpdated();
      debouncedPushToCloud();
      debouncedPushToSupabase();
    }
  } catch (err) {
    console.error('Error saving Kop Surat:', err);
  }
}

export function loadTTD(): TTDSettings {
  try {
    const key = getScopedKey(STORAGE_KEYS.TTD);
    const raw = localStorage.getItem(key);
    if (!raw) return DEFAULT_TTD;
    const parsed = { ...DEFAULT_TTD, ...JSON.parse(raw) };
    if (parsed.guruKelasNama?.includes('Jaenal Maskun') && parsed.guruKelasNIP !== '197808152009011009') {
      parsed.guruKelasNIP = '197808152009011009';
      localStorage.setItem(key, JSON.stringify(parsed));
    }
    return parsed;
  } catch (err) {
    return DEFAULT_TTD;
  }
}

export function saveTTD(ttd: TTDSettings, shouldPush: boolean = true): void {
  try {
    setScopedItem(STORAGE_KEYS.TTD, JSON.stringify(ttd));
    if (shouldPush) {
      touchLastUpdated();
      debouncedPushToCloud();
      debouncedPushToSupabase();
    }
  } catch (err) {
    console.error('Error saving TTD:', err);
  }
}

const SUPERADMIN_STORAGE_KEYS = {
  SUPABASE_CONFIG: 'kbc_mi_superadmin_supabase_config_v1',
  API_KEY: 'kbc_mi_superadmin_api_key_v1'
};

export function saveSuperAdminCredentialsBackup(config?: SupabaseConfig, apiKey?: string): void {
  try {
    const cfg = config || loadSupabaseConfig();
    if (cfg && (cfg.supabaseUrl || cfg.supabaseAnonKey)) {
      localStorage.setItem(SUPERADMIN_STORAGE_KEYS.SUPABASE_CONFIG, JSON.stringify(cfg));
    }
    const key = apiKey !== undefined ? apiKey : loadApiKey();
    if (key && key.trim()) {
      localStorage.setItem(SUPERADMIN_STORAGE_KEYS.API_KEY, key.trim());
    }
  } catch (err) {
    console.error('Error backing up superadmin credentials:', err);
  }
}

export function restoreSuperAdminCredentials(): void {
  try {
    let rawSupabase = localStorage.getItem(SUPERADMIN_STORAGE_KEYS.SUPABASE_CONFIG);
    let rawApiKey = localStorage.getItem(SUPERADMIN_STORAGE_KEYS.API_KEY);

    // Backup current active credentials if superadmin backup is empty
    if (!rawSupabase) {
      const activeCfg = loadSupabaseConfig();
      if (activeCfg && (activeCfg.supabaseUrl || activeCfg.supabaseAnonKey)) {
        localStorage.setItem(SUPERADMIN_STORAGE_KEYS.SUPABASE_CONFIG, JSON.stringify(activeCfg));
        rawSupabase = JSON.stringify(activeCfg);
      }
    }

    if (!rawApiKey) {
      const activeKey = loadApiKey();
      if (activeKey && activeKey.trim()) {
        localStorage.setItem(SUPERADMIN_STORAGE_KEYS.API_KEY, activeKey.trim());
        rawApiKey = activeKey.trim();
      }
    }

    // Restore to active storage
    if (rawSupabase) {
      const parsed = JSON.parse(rawSupabase);
      if (parsed) {
        const fullConfig = { ...DEFAULT_SUPABASE_CONFIG, ...parsed };
        localStorage.setItem(STORAGE_KEYS.SUPABASE_CONFIG, JSON.stringify(fullConfig));
      }
    }

    if (rawApiKey) {
      localStorage.setItem(STORAGE_KEYS.API_KEY, rawApiKey);
    }

    // Pull from Firestore cloud to restore credentials across devices (e.g. HP -> PC)
    import('./firebaseSync').then(m => m.pullSuperAdminCredentialsFromCloud()).catch(() => {});
  } catch (err) {
    console.error('Error restoring superadmin credentials:', err);
  }
}

export function clearActiveCredentialsForRegularUser(): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SUPABASE_CONFIG, JSON.stringify(DEFAULT_SUPABASE_CONFIG));
    localStorage.setItem(STORAGE_KEYS.API_KEY, '');
  } catch (err) {
    console.error('Error clearing active credentials:', err);
  }
}

export function loadApiKey(): string {
  try {
    return localStorage.getItem(STORAGE_KEYS.API_KEY) || '';
  } catch (err) {
    return '';
  }
}

export function saveApiKey(key: string): void {
  try {
    const clean = key.trim();
    localStorage.setItem(STORAGE_KEYS.API_KEY, clean);
    const userSessionRaw = localStorage.getItem('kbc_mi_user_session_v1');
    if (userSessionRaw) {
      const session = JSON.parse(userSessionRaw);
      if (session && (session.isSuperAdmin || session.role === 'superadmin' || session.username?.toLowerCase() === 'jaenalmaskun@gmail.com' || session.username?.toLowerCase() === 'jaenalmaskun')) {
        if (clean) {
          localStorage.setItem(SUPERADMIN_STORAGE_KEYS.API_KEY, clean);
          import('./firebaseSync').then(m => m.pushSuperAdminCredentialsToCloud(undefined, clean)).catch(() => {});
        }
      }
    }
  } catch (err) {
    console.error('Error saving API Key:', err);
  }
}

export function loadStoredMateriBank(): MateriBankItem[] {
  try {
    const key = getScopedKey(STORAGE_KEYS.MATERI_BANK);
    const raw = localStorage.getItem(key);
    if (raw === null) {
      setScopedItem(STORAGE_KEYS.MATERI_BANK, JSON.stringify(INITIAL_MATERI_BANK));
      return INITIAL_MATERI_BANK;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_MATERI_BANK;
  } catch (err) {
    console.error('Error loading materi bank:', err);
    return INITIAL_MATERI_BANK;
  }
}

export function saveMateriBank(items: MateriBankItem[], shouldPush: boolean = true): void {
  try {
    setScopedItem(STORAGE_KEYS.MATERI_BANK, JSON.stringify(items));
    if (shouldPush) {
      touchLastUpdated();
      debouncedPushToCloud();
      debouncedPushToSupabase();
    }
  } catch (err) {
    console.error('Error saving materi bank:', err);
  }
}

export function loadStoredTeachers(): TeacherItem[] {
  try {
    const key = getScopedKey(STORAGE_KEYS.TEACHERS);
    const raw = localStorage.getItem(key);
    if (raw === null) {
      setScopedItem(STORAGE_KEYS.TEACHERS, JSON.stringify(DEFAULT_TEACHERS));
      return DEFAULT_TEACHERS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const removedNames = ['Ahmad Muzakki', 'Nur Laili', 'M. Sholahuddin'];
      const updated = parsed
        .filter((t: TeacherItem) => !removedNames.some(name => t.nama?.includes(name)))
        .map((t: TeacherItem) => {
          if (t.nama?.includes('Jaenal Maskun') && t.nip !== '197808152009011009') {
            return { ...t, nip: '197808152009011009' };
          }
          return t;
        });
      setScopedItem(STORAGE_KEYS.TEACHERS, JSON.stringify(updated));
      return updated;
    }
    return DEFAULT_TEACHERS;
  } catch (err) {
    console.error('Error loading teachers:', err);
    return DEFAULT_TEACHERS;
  }
}

export function saveTeachers(teachers: TeacherItem[], shouldPush: boolean = true): void {
  try {
    setScopedItem(STORAGE_KEYS.TEACHERS, JSON.stringify(teachers));
    if (shouldPush) {
      touchLastUpdated();
      debouncedPushToCloud();
      debouncedPushToSupabase();
    }
  } catch (err) {
    console.error('Error saving teachers:', err);
  }
}

export function loadCustomMapel(): string[] {
  try {
    const key = getScopedKey(STORAGE_KEYS.CUSTOM_MAPEL);
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    return [];
  }
}

export function saveCustomMapel(list: string[], shouldPush: boolean = true): void {
  try {
    setScopedItem(STORAGE_KEYS.CUSTOM_MAPEL, JSON.stringify(list));
    if (shouldPush) {
      touchLastUpdated();
      debouncedPushToCloud();
      debouncedPushToSupabase();
    }
  } catch (err) {
    console.error('Error saving custom mapel:', err);
  }
}

export function loadMasterMapelList(): string[] {
  const custom = loadCustomMapel();
  const setMapel = new Set<string>([...MAPEL_MI_OPTIONS, ...custom]);

  try {
    const modules = loadStoredModules();
    modules.forEach(m => {
      const mp = m.identitas?.mataPelajaran?.trim();
      if (mp) setMapel.add(mp);
    });
    const bank = loadStoredMateriBank();
    bank.forEach(b => {
      const mp = b.mataPelajaran?.trim();
      if (mp) setMapel.add(mp);
    });
  } catch (err) {
    console.error('Error scanning master mapel:', err);
  }

  return Array.from(setMapel).filter(Boolean);
}

export function renameOrMergeMapel(oldMapelName: string, newMapelName: string): { modulesUpdated: number; bankUpdated: number } {
  const oldClean = oldMapelName.trim();
  const newClean = newMapelName.trim();
  if (!oldClean || !newClean || oldClean === newClean) {
    return { modulesUpdated: 0, bankUpdated: 0 };
  }

  // 1. Update Custom Mapel list
  const currentCustom = loadCustomMapel();
  const filteredCustom = currentCustom.filter(m => m.trim().toLowerCase() !== oldClean.toLowerCase());
  if (!MAPEL_MI_OPTIONS.includes(newClean) && !filteredCustom.some(m => m.trim().toLowerCase() === newClean.toLowerCase())) {
    filteredCustom.push(newClean);
  }
  saveCustomMapel(filteredCustom, false);

  // 2. Update saved modules
  let modulesUpdated = 0;
  const modules = loadStoredModules();
  const updatedModules = modules.map(mod => {
    if (mod.identitas?.mataPelajaran?.trim().toLowerCase() === oldClean.toLowerCase()) {
      modulesUpdated++;
      return {
        ...mod,
        identitas: {
          ...mod.identitas,
          mataPelajaran: newClean
        }
      };
    }
    return mod;
  });
  if (modulesUpdated > 0) {
    saveModules(updatedModules, false);
  }

  // 3. Update materi bank items
  let bankUpdated = 0;
  const bankItems = loadStoredMateriBank();
  const updatedBank = bankItems.map(item => {
    if (item.mataPelajaran?.trim().toLowerCase() === oldClean.toLowerCase()) {
      bankUpdated++;
      return {
        ...item,
        mataPelajaran: newClean
      };
    }
    return item;
  });
  if (bankUpdated > 0) {
    saveMateriBank(updatedBank, false);
  }

  touchLastUpdated();
  debouncedPushToCloud();
  debouncedPushToSupabase();

  return { modulesUpdated, bankUpdated };
}

export function deleteMasterMapel(mapelName: string): void {
  const clean = mapelName.trim();
  if (!clean) return;
  const currentCustom = loadCustomMapel();
  const updated = currentCustom.filter(m => m.trim().toLowerCase() !== clean.toLowerCase());
  saveCustomMapel(updated, true);
}

export function loadCustomTahunAjaran(): string[] {
  try {
    const key = getScopedKey(STORAGE_KEYS.CUSTOM_TAHUN_AJARAN);
    const raw = localStorage.getItem(key);
    if (!raw) return DEFAULT_TAHUN_AJARAN_OPTIONS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    return DEFAULT_TAHUN_AJARAN_OPTIONS;
  } catch (err) {
    return DEFAULT_TAHUN_AJARAN_OPTIONS;
  }
}

export function saveCustomTahunAjaran(list: string[], shouldPush: boolean = true): void {
  try {
    setScopedItem(STORAGE_KEYS.CUSTOM_TAHUN_AJARAN, JSON.stringify(list));
    if (shouldPush) {
      touchLastUpdated();
      debouncedPushToCloud();
      debouncedPushToSupabase();
    }
  } catch (err) {
    console.error('Error saving custom tahun ajaran:', err);
  }
}

export function loadActiveTahunAjaran(): string {
  try {
    const key = getScopedKey(STORAGE_KEYS.ACTIVE_TAHUN_AJARAN);
    const val = localStorage.getItem(key);
    if (val && val.trim()) return val.trim();
    return '2025/2026';
  } catch (err) {
    return '2025/2026';
  }
}

export function saveActiveTahunAjaran(tahun: string, shouldPush: boolean = true): void {
  try {
    setScopedItem(STORAGE_KEYS.ACTIVE_TAHUN_AJARAN, tahun.trim());
    if (shouldPush) {
      touchLastUpdated();
      debouncedPushToCloud();
      debouncedPushToSupabase();
    }
  } catch (err) {
    console.error('Error saving active tahun ajaran:', err);
  }
}

export function loadTeacherPin(): string {
  try {
    const key = getScopedKey(STORAGE_KEYS.TEACHER_PIN);
    const val = localStorage.getItem(key);
    if (val && val.trim()) return val.trim();
    return '1234';
  } catch (err) {
    return '1234';
  }
}

export function saveTeacherPin(pin: string, shouldPush: boolean = true): void {
  try {
    setScopedItem(STORAGE_KEYS.TEACHER_PIN, pin.trim() || '1234');
    if (shouldPush) {
      touchLastUpdated();
      debouncedPushToCloud();
    }
  } catch (err) {
    console.error('Error saving teacher pin:', err);
  }
}

export const DEFAULT_SUPER_ADMIN_PIN = '9999';

export function verifySuperAdminPin(inputPin: string): boolean {
  if (!inputPin) return false;
  const cleanPin = inputPin.trim();
  const teacherPin = loadTeacherPin();
  return cleanPin === DEFAULT_SUPER_ADMIN_PIN || cleanPin === '8888' || cleanPin === teacherPin;
}

const SUPER_ADMIN_SESSION_KEY = 'kbc_mi_super_admin_unlocked_v1';

export function loadSuperAdminMode(): boolean {
  try {
    return sessionStorage.getItem(SUPER_ADMIN_SESSION_KEY) === 'true';
  } catch (err) {
    return false;
  }
}

export function saveSuperAdminMode(unlocked: boolean): void {
  try {
    sessionStorage.setItem(SUPER_ADMIN_SESSION_KEY, unlocked ? 'true' : 'false');
  } catch (err) {
    console.error('Error saving super admin mode:', err);
  }
}

export interface BackupDataEnvelope {
  app: string;
  version: string;
  exportedAt: string;
  modules: ModulAjarCinta[];
  materiBank: MateriBankItem[];
  kopSurat: KopSuratSettings;
  ttd: TTDSettings;
  teachers: TeacherItem[];
  students?: StudentAccount[];
  studentQuizResults?: StudentQuizResult[];
  customMapel: string[];
  customTahunAjaran: string[];
  activeTahunAjaran?: string;
}

export function exportAllAppDataJson(): string {
  const data: BackupDataEnvelope = {
    app: 'KBC-MI-Generator',
    version: '1.0',
    exportedAt: new Date().toISOString(),
    modules: loadStoredModules(),
    materiBank: loadStoredMateriBank(),
    kopSurat: loadKopSurat(),
    ttd: loadTTD(),
    teachers: loadStoredTeachers(),
    students: loadStoredStudents(),
    studentQuizResults: loadStoredStudentQuizResults(),
    customMapel: loadCustomMapel(),
    customTahunAjaran: loadCustomTahunAjaran(),
    activeTahunAjaran: loadActiveTahunAjaran()
  };
  return JSON.stringify(data, null, 2);
}

export function importAppDataJson(jsonString: string): { success: boolean; message: string; count?: number } {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== 'object') {
      return { success: false, message: 'Format berkas JSON tidak valid!' };
    }

    let restoredItems = 0;

    if (Array.isArray(parsed.modules)) {
      saveModules(parsed.modules);
      restoredItems += parsed.modules.length;
    }
    if (Array.isArray(parsed.materiBank)) {
      saveMateriBank(parsed.materiBank);
    }
    if (parsed.kopSurat && typeof parsed.kopSurat === 'object') {
      saveKopSurat(parsed.kopSurat);
    }
    if (parsed.ttd && typeof parsed.ttd === 'object') {
      saveTTD(parsed.ttd);
    }
    if (Array.isArray(parsed.teachers)) {
      saveTeachers(parsed.teachers);
    }
    if (Array.isArray(parsed.students)) {
      saveStudents(parsed.students);
    }
    if (Array.isArray(parsed.studentQuizResults)) {
      saveStudentQuizResults(parsed.studentQuizResults);
    }
    if (Array.isArray(parsed.customMapel)) {
      saveCustomMapel(parsed.customMapel);
    }
    if (Array.isArray(parsed.customTahunAjaran)) {
      saveCustomTahunAjaran(parsed.customTahunAjaran);
    }
    if (typeof parsed.activeTahunAjaran === 'string' && parsed.activeTahunAjaran.trim()) {
      saveActiveTahunAjaran(parsed.activeTahunAjaran);
    }

    return {
      success: true,
      message: `Berhasil memulihkan/mengimpor data! (${restoredItems} modul ajar & bank materi)`,
      count: restoredItems
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Gagal membaca berkas cadangan: ${err.message || 'Format tidak dikenali'}`
    };
  }
}

export const DEFAULT_SUPABASE_CONFIG: SupabaseConfig = {
  supabaseUrl: '',
  supabaseAnonKey: '',
  tableName: 'kbc_mi_app_settings',
  isEnabled: false,
  lastSyncedAt: null
};

export function loadSupabaseConfig(): SupabaseConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SUPABASE_CONFIG);
    if (!raw) return DEFAULT_SUPABASE_CONFIG;
    return { ...DEFAULT_SUPABASE_CONFIG, ...JSON.parse(raw) };
  } catch (err) {
    return DEFAULT_SUPABASE_CONFIG;
  }
}

export function saveSupabaseConfig(config: SupabaseConfig): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SUPABASE_CONFIG, JSON.stringify(config));
    const userSessionRaw = localStorage.getItem('kbc_mi_user_session_v1');
    if (userSessionRaw) {
      const session = JSON.parse(userSessionRaw);
      if (session && (session.isSuperAdmin || session.role === 'superadmin' || session.username?.toLowerCase() === 'jaenalmaskun@gmail.com' || session.username?.toLowerCase() === 'jaenalmaskun')) {
        if (config.supabaseUrl || config.supabaseAnonKey) {
          localStorage.setItem(SUPERADMIN_STORAGE_KEYS.SUPABASE_CONFIG, JSON.stringify(config));
          import('./firebaseSync').then(m => m.pushSuperAdminCredentialsToCloud(config)).catch(() => {});
        }
      }
    }
  } catch (err) {
    console.error('Error saving Supabase config:', err);
  }
}

export const DEFAULT_MYSQL_CONFIG: MysqlConfig = {
  host: 'localhost',
  port: 3306,
  user: 'jaenal_modulajar',
  password: 'masbagus15',
  database: 'jaenal_modulajar',
  tableName: 'kbc_mi_app_settings',
  apiUrl: '',
  apiKey: '',
  isEnabled: true,
  lastSyncedAt: null
};

export function loadMysqlConfig(): MysqlConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MYSQL_CONFIG);
    if (!raw) return DEFAULT_MYSQL_CONFIG;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_MYSQL_CONFIG,
      ...parsed,
      host: parsed.host || 'localhost',
      user: parsed.user || 'jaenal_modulajar',
      password: parsed.password !== undefined && parsed.password !== '' ? parsed.password : 'masbagus15',
      database: parsed.database || 'jaenal_modulajar',
      apiUrl: parsed.apiUrl || '',
      apiKey: parsed.apiKey || ''
    };
  } catch (err) {
    return DEFAULT_MYSQL_CONFIG;
  }
}

export function saveMysqlConfig(config: MysqlConfig): void {
  try {
    localStorage.setItem(STORAGE_KEYS.MYSQL_CONFIG, JSON.stringify(config));
  } catch (err) {
    console.error('Error saving MySQL config:', err);
  }
}

export const DEFAULT_SAMPLE_STUDENTS: StudentAccount[] = [
  { id: 'std-1', nisn: '20240101', nama: 'Ahmad Fauzi', kelas: 'Kelas 1 (Fase A)', pin: '1234', createdAt: '2025-01-01T00:00:00.000Z' },
  { id: 'std-2', nisn: '20240102', nama: 'Siti Aisyah', kelas: 'Kelas 1 (Fase A)', pin: '1234', createdAt: '2025-01-01T00:00:00.000Z' },
  { id: 'std-3', nisn: '20240201', nama: 'Rizky Pratama', kelas: 'Kelas 2 (Fase A)', pin: '1234', createdAt: '2025-01-01T00:00:00.000Z' },
  { id: 'std-4', nisn: '20240301', nama: 'Nabila Putri', kelas: 'Kelas 3 (Fase B)', pin: '1234', createdAt: '2025-01-01T00:00:00.000Z' },
  { id: 'std-5', nisn: '20240401', nama: 'Muhammad Bahrul Ulum', kelas: 'Kelas 4 (Fase B)', pin: '1234', createdAt: '2025-01-01T00:00:00.000Z' },
  { id: 'std-6', nisn: '20240501', nama: 'Zahra Amelia', kelas: 'Kelas 5 (Fase C)', pin: '1234', createdAt: '2025-01-01T00:00:00.000Z' },
  { id: 'std-7', nisn: '20240601', nama: 'Farel Prayoga', kelas: 'Kelas 6 (Fase C)', pin: '1234', createdAt: '2025-01-01T00:00:00.000Z' }
];

export function loadStoredStudents(): StudentAccount[] {
  try {
    const key = getScopedKey(STORAGE_KEYS.STUDENTS);
    const raw = localStorage.getItem(key);
    let students: StudentAccount[] = [];

    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        students = parsed;
      }
    }

    if (students.length === 0) {
      students = [...DEFAULT_SAMPLE_STUDENTS];
    }

    // Master Kurikulum Sync (kbc_master_siswa_list & kbc_master_rombel_list)
    try {
      const rawMasterSiswa = localStorage.getItem('kbc_master_siswa_list');
      const rawMasterRombel = localStorage.getItem('kbc_master_rombel_list');

      if (rawMasterSiswa) {
        const masterSiswaList = JSON.parse(rawMasterSiswa);
        const masterRombelList = rawMasterRombel ? JSON.parse(rawMasterRombel) : [];

        if (Array.isArray(masterSiswaList) && masterSiswaList.length > 0) {
          // Map Rombel IDs to clean class labels
          const rombelMap = new Map<string, string>();
          if (Array.isArray(masterRombelList)) {
            masterRombelList.forEach((r: any) => {
              let label = r.namaRombel || 'Kelas 1';
              if (r.tingkatFase && !label.includes('Fase')) {
                if (r.tingkatFase.includes('Fase A')) label += ' (Fase A)';
                else if (r.tingkatFase.includes('Fase B')) label += ' (Fase B)';
                else if (r.tingkatFase.includes('Fase C')) label += ' (Fase C)';
              }
              rombelMap.set(r.id, label);
            });
          }

          masterSiswaList.forEach((ms: any, index: number) => {
            if (!ms.namaSiswa || !ms.namaSiswa.trim()) return;
            const kelasLabel = rombelMap.get(ms.rombelId) || 'Kelas 1 (Fase A)';
            const cleanNisn = ms.nisn?.trim() || ms.nis?.trim() || `202500${index + 1}`;

            // Match existing student account by ID, NISN, or full name
            const existingIndex = students.findIndex(s =>
              (ms.id && s.id === ms.id) ||
              (cleanNisn && s.nisn === cleanNisn) ||
              s.nama.trim().toLowerCase() === ms.namaSiswa.trim().toLowerCase()
            );

            if (existingIndex >= 0) {
              // Update name, nisn, and class while preserving existing PIN & ID
              students[existingIndex] = {
                ...students[existingIndex],
                nama: ms.namaSiswa.trim(),
                nisn: cleanNisn,
                kelas: kelasLabel
              };
            } else {
              // Append new student from Master Kurikulum
              students.push({
                id: ms.id || `std-mk-${index + 1}`,
                nisn: cleanNisn,
                nama: ms.namaSiswa.trim(),
                kelas: kelasLabel,
                pin: '1234',
                createdAt: new Date().toISOString()
              });
            }
          });
        }
      }
    } catch (errMk) {
      console.warn('Error merging Master Kurikulum student list:', errMk);
    }

    return students;
  } catch (err) {
    console.error('Error loading students:', err);
    return DEFAULT_SAMPLE_STUDENTS;
  }
}

export function saveStudents(students: StudentAccount[], shouldPush: boolean = true): void {
  try {
    setScopedItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    if (shouldPush) {
      touchLastUpdated();
      debouncedPushToCloud();
      debouncedPushToSupabase();
    }
  } catch (err) {
    console.error('Error saving students:', err);
  }
}

export function loadStudentSession(): StudentAccount | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENT_SESSION);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
}

export function saveStudentSession(student: StudentAccount | null): void {
  try {
    if (student) {
      localStorage.setItem(STORAGE_KEYS.STUDENT_SESSION, JSON.stringify(student));
    } else {
      localStorage.removeItem(STORAGE_KEYS.STUDENT_SESSION);
    }
  } catch (err) {
    console.error('Error saving student session:', err);
  }
}

export function loadStoredStudentQuizResults(): StudentQuizResult[] {
  try {
    const key = getScopedKey(STORAGE_KEYS.STUDENT_QUIZ_RESULTS);
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Error loading student quiz results:', err);
    return [];
  }
}

export function saveStudentQuizResults(results: StudentQuizResult[], shouldPush: boolean = true): void {
  try {
    setScopedItem(STORAGE_KEYS.STUDENT_QUIZ_RESULTS, JSON.stringify(results));
    if (shouldPush) {
      touchLastUpdated();
      debouncedPushToCloud();
      debouncedPushToSupabase();
    }
  } catch (err) {
    console.error('Error saving student quiz results:', err);
  }
}

export function addStudentQuizResult(result: StudentQuizResult): void {
  const current = loadStoredStudentQuizResults();
  const updated = [result, ...current];
  saveStudentQuizResults(updated);
}

