import React, { useState, useEffect, useRef } from 'react';
import {
  GraduationCap,
  Users,
  Calendar,
  BookOpen,
  Printer,
  Plus,
  Trash2,
  Edit,
  Save,
  Check,
  Search,
  FileText,
  Sparkles,
  Clock,
  ChevronRight,
  X,
  Layers,
  CheckCircle,
  Building2,
  Table,
  Upload,
  Download,
  FileSpreadsheet,
  UserPlus,
  Filter,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { KopSuratSettings, TTDSettings } from '../types';
import { loadMasterMapelList, loadStoredTeachers, loadStoredStudents, saveStudents } from '../utils/storage';

export interface SiswaItem {
  id: string;
  rombelId: string;
  nisn: string;
  nis: string;
  namaSiswa: string;
  jenisKelamin: 'L' | 'P';
  tempatLahir?: string;
  tanggalLahir?: string;
  nik?: string;
  namaAyah?: string;
  namaIbu?: string;
  alamat?: string;
}

export interface RombelItem {
  id: string;
  namaRombel: string; // e.g. "Kelas 1", "Kelas 7A"
  tingkatFase: string; // e.g. "Fase A", "Fase D"
  waliKelas: string;
  jumlahSiswa: number;
  tahunPelajaran: string;
  kurikulum: string;
}

export type SlotKategori = 
  | 'PELAJARAN' 
  | 'UPACARA' 
  | 'RELIGI' 
  | 'ISTIRAHAT' 
  | 'SHOLAT' 
  | 'LITERASI' 
  | 'P5' 
  | 'EKSTRA' 
  | 'LAINNYA';

export interface JadwalSlot {
  id: string;
  rombelId: string;
  hari: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';
  jamKe: number; // 1 - 8
  waktu: string; // e.g. "07.00 - 07.35"
  kategori: SlotKategori;
  mataPelajaran: string;
  guruPengajar: string;
  keterangan?: string;
}

interface MasterKurikulumSectionProps {
  kopSurat: KopSuratSettings;
  ttd: TTDSettings;
}

const DEFAULT_ROMBEL_LIST: RombelItem[] = [
  { id: 'rombel-1', namaRombel: 'Kelas 1', tingkatFase: 'Fase A (Kelas 1-2)', waliKelas: '', jumlahSiswa: 0, tahunPelajaran: '2025/2026', kurikulum: 'Kurikulum Berbasis Cinta (KBC)' },
  { id: 'rombel-2', namaRombel: 'Kelas 2', tingkatFase: 'Fase A (Kelas 1-2)', waliKelas: '', jumlahSiswa: 0, tahunPelajaran: '2025/2026', kurikulum: 'Kurikulum Berbasis Cinta (KBC)' },
  { id: 'rombel-3', namaRombel: 'Kelas 3', tingkatFase: 'Fase B (Kelas 3-4)', waliKelas: '', jumlahSiswa: 0, tahunPelajaran: '2025/2026', kurikulum: 'Kurikulum Berbasis Cinta (KBC)' },
  { id: 'rombel-4', namaRombel: 'Kelas 4', tingkatFase: 'Fase B (Kelas 3-4)', waliKelas: '', jumlahSiswa: 0, tahunPelajaran: '2025/2026', kurikulum: 'Kurikulum Berbasis Cinta (KBC)' },
  { id: 'rombel-5', namaRombel: 'Kelas 5', tingkatFase: 'Fase C (Kelas 5-6)', waliKelas: '', jumlahSiswa: 0, tahunPelajaran: '2025/2026', kurikulum: 'Kurikulum Berbasis Cinta (KBC)' },
  { id: 'rombel-6', namaRombel: 'Kelas 6', tingkatFase: 'Fase C (Kelas 5-6)', waliKelas: '', jumlahSiswa: 0, tahunPelajaran: '2025/2026', kurikulum: 'Kurikulum Berbasis Cinta (KBC)' }
];

const DEFAULT_SISWA_LIST: SiswaItem[] = [];

const DEFAULT_JADWAL_SLOTS: JadwalSlot[] = [
  { id: 'j-1', rombelId: 'rombel-1', hari: 'Senin', jamKe: 1, waktu: '07.00 - 07.35', kategori: 'UPACARA', mataPelajaran: 'Upacara Bendera', guruPengajar: '' },
  { id: 'j-2', rombelId: 'rombel-1', hari: 'Senin', jamKe: 2, waktu: '07.35 - 08.10', kategori: 'PELAJARAN', mataPelajaran: 'Pendidikan Pancasila', guruPengajar: '' },
  { id: 'j-3', rombelId: 'rombel-1', hari: 'Senin', jamKe: 3, waktu: '08.10 - 08.45', kategori: 'PELAJARAN', mataPelajaran: 'Bahasa Indonesia', guruPengajar: '' },
  { id: 'j-4', rombelId: 'rombel-1', hari: 'Senin', jamKe: 4, waktu: '08.45 - 09.15', kategori: 'ISTIRAHAT', mataPelajaran: 'Istirahat I', guruPengajar: '' },
  { id: 'j-5', rombelId: 'rombel-1', hari: 'Senin', jamKe: 5, waktu: '09.15 - 09.50', kategori: 'PELAJARAN', mataPelajaran: 'Matematika', guruPengajar: '' },

  { id: 'j-6', rombelId: 'rombel-1', hari: 'Selasa', jamKe: 1, waktu: '07.00 - 07.35', kategori: 'RELIGI', mataPelajaran: 'Pembiasaan Dhuha & Tadarus', guruPengajar: '' },
  { id: 'j-7', rombelId: 'rombel-1', hari: 'Selasa', jamKe: 2, waktu: '07.35 - 08.10', kategori: 'PELAJARAN', mataPelajaran: 'Al-Qur\'an Hadis', guruPengajar: '' },
  { id: 'j-8', rombelId: 'rombel-1', hari: 'Selasa', jamKe: 3, waktu: '08.10 - 08.45', kategori: 'PELAJARAN', mataPelajaran: 'Akidah Akhlak', guruPengajar: '' },
  { id: 'j-9', rombelId: 'rombel-1', hari: 'Selasa', jamKe: 4, waktu: '08.45 - 09.15', kategori: 'ISTIRAHAT', mataPelajaran: 'Istirahat I', guruPengajar: '' },

  { id: 'j-10', rombelId: 'rombel-1', hari: 'Rabu', jamKe: 1, waktu: '07.00 - 07.35', kategori: 'LITERASI', mataPelajaran: 'Literasi & Numerasi Pagi', guruPengajar: '' },
  { id: 'j-11', rombelId: 'rombel-1', hari: 'Rabu', jamKe: 2, waktu: '07.35 - 08.10', kategori: 'PELAJARAN', mataPelajaran: 'IPAS (Sains & Sosial)', guruPengajar: '' },
  { id: 'j-12', rombelId: 'rombel-1', hari: 'Rabu', jamKe: 3, waktu: '08.10 - 08.45', kategori: 'PELAJARAN', mataPelajaran: 'Bahasa Jawa', guruPengajar: '' },

  { id: 'j-13', rombelId: 'rombel-1', hari: 'Kamis', jamKe: 1, waktu: '07.00 - 07.35', kategori: 'RELIGI', mataPelajaran: 'Pembiasaan Asmaul Husna', guruPengajar: '' },
  { id: 'j-14', rombelId: 'rombel-1', hari: 'Kamis', jamKe: 2, waktu: '07.35 - 08.10', kategori: 'PELAJARAN', mataPelajaran: 'Seni Budaya & Keterampilan', guruPengajar: '' },

  { id: 'j-15', rombelId: 'rombel-1', hari: 'Jumat', jamKe: 1, waktu: '07.00 - 07.35', kategori: 'P5', mataPelajaran: 'P5 / PRAA (Projek Pancasila)', guruPengajar: '' },
  { id: 'j-16', rombelId: 'rombel-1', hari: 'Jumat', jamKe: 2, waktu: '07.35 - 08.10', kategori: 'PELAJARAN', mataPelajaran: 'PJOK / Olahraga', guruPengajar: '' },

  { id: 'j-17', rombelId: 'rombel-1', hari: 'Sabtu', jamKe: 1, waktu: '07.00 - 07.35', kategori: 'EKSTRA', mataPelajaran: 'Ekstrakurikuler Pramuka', guruPengajar: '' },
];

export const MasterKurikulumSection: React.FC<MasterKurikulumSectionProps> = ({ kopSurat, ttd }) => {
  const [subTab, setSubTab] = useState<'rombel' | 'jadwal' | 'modul' | 'cetak'>('rombel');

  // Master Mapel List loaded dynamically from storage
  const [masterMapelOptions, setMasterMapelOptions] = useState<string[]>([]);
  // Teachers loaded dynamically
  const [teacherOptions, setTeacherOptions] = useState<{ nama: string; nip?: string }[]>([]);

  // Sample names filter list
  const SAMPLE_NAMES = ['Guru Wali Kelas', 'Jaenal Maskun', 'Ahmad Fauzi', 'Siti Nurjanah', 'Fitri Handayani', 'Dewi Rahmawati', 'Budi Santoso', 'Semua Guru', 'Panitia', 'Tim P5'];

  // Local Storage Data for Rombel, Siswa, & Jadwal
  const [rombelList, setRombelList] = useState<RombelItem[]>(() => {
    try {
      const saved = localStorage.getItem('kbc_master_rombel_list');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((r: RombelItem) => ({
            ...r,
            waliKelas: SAMPLE_NAMES.some(s => r.waliKelas?.includes(s)) ? '' : (r.waliKelas || '')
          }));
        }
      }
    } catch (e) {
      console.warn('Failed to load saved rombel list:', e);
    }
    return DEFAULT_ROMBEL_LIST;
  });

  const [siswaList, setSiswaList] = useState<SiswaItem[]>(() => {
    try {
      // Clean legacy student list from storage if not cleared yet
      if (!localStorage.getItem('kbc_master_siswa_cleared_v10')) {
        localStorage.removeItem('kbc_master_siswa_list');
        localStorage.setItem('kbc_master_siswa_cleared_v10', 'true');
        return [];
      }
      const saved = localStorage.getItem('kbc_master_siswa_list');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const sampleStudentNames = ['Ahmad Zaky Mubarak', 'Ahmad Muzakki', 'Nur Laili', 'M. Sholahuddin', 'Annisa Nur Aini'];
          return parsed.filter((s: SiswaItem) => !sampleStudentNames.some(name => s.namaSiswa?.includes(name)));
        }
      }
    } catch (e) {
      console.warn('Failed to load saved siswa list:', e);
    }
    return DEFAULT_SISWA_LIST;
  });

  const [jadwalSlots, setJadwalSlots] = useState<JadwalSlot[]>(() => {
    try {
      const saved = localStorage.getItem('kbc_master_jadwal_list');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((j: JadwalSlot) => ({
            ...j,
            guruPengajar: SAMPLE_NAMES.some(s => j.guruPengajar?.includes(s)) ? '' : (j.guruPengajar || '')
          }));
        }
      }
    } catch (e) {
      console.warn('Failed to load saved jadwal list:', e);
    }
    return DEFAULT_JADWAL_SLOTS;
  });

  // State for Add / Edit Rombel Modal
  const [showRombelModal, setShowRombelModal] = useState(false);
  const [editingRombel, setEditingRombel] = useState<RombelItem | null>(null);
  const [rombelForm, setRombelForm] = useState<Partial<RombelItem>>({
    namaRombel: '',
    tingkatFase: 'Fase A (Kelas 1-2)',
    waliKelas: '',
    jumlahSiswa: 0,
    tahunPelajaran: '2025/2026',
    kurikulum: 'Kurikulum Berbasis Cinta (KBC)'
  });

  // State for Kelola Siswa EMIS per Rombel Modal
  const [activeRombelForSiswa, setActiveRombelForSiswa] = useState<RombelItem | null>(null);
  const [siswaSearch, setSiswaSearch] = useState('');
  const [siswaGenderrFilter, setSiswaGenderFilter] = useState<'ALL' | 'L' | 'P'>('ALL');
  const [editingSiswa, setEditingSiswa] = useState<SiswaItem | null>(null);
  const [showSiswaModal, setShowSiswaModal] = useState(false);
  const [siswaForm, setSiswaForm] = useState<Partial<SiswaItem>>({
    nisn: '',
    nis: '',
    namaSiswa: '',
    jenisKelamin: 'L',
    tempatLahir: '',
    tanggalLahir: '',
    nik: '',
    namaAyah: '',
    namaIbu: '',
    alamat: ''
  });

  // File input ref for Excel import
  const excelFileInputRef = useRef<HTMLInputElement>(null);

  // State for Jadwal Selection & Editing
  const [selectedJadwalRombelId, setSelectedJadwalRombelId] = useState<string>(() => rombelList[0]?.id || 'rombel-1');
  const [editingSlot, setEditingSlot] = useState<JadwalSlot | null>(null);
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [slotForm, setSlotForm] = useState<Partial<JadwalSlot>>({
    hari: 'Senin',
    jamKe: 1,
    waktu: '07.00 - 07.35',
    kategori: 'PELAJARAN',
    mataPelajaran: '',
    guruPengajar: ''
  });

  useEffect(() => {
    try {
      const mapels = loadMasterMapelList();
      setMasterMapelOptions(mapels);
      const teachers = loadStoredTeachers();
      setTeacherOptions(teachers.map(t => ({ nama: t.nama, nip: t.nip })));
    } catch (err) {
      console.warn('Failed to load master mapel / teachers:', err);
    }
  }, [subTab, showRombelModal, showSlotModal]);

  // Print Preview Modal State
  const [printDocType, setPrintDocType] = useState<'jadwal' | 'rombel' | 'siswa_emis' | 'modul' | 'kalender' | null>(null);

  // Save changes to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('kbc_master_rombel_list', JSON.stringify(rombelList));
      // Auto-sync Student Accounts when Rombel names/lists change
      const synced = loadStoredStudents();
      saveStudents(synced, true);
    } catch (e) {
      console.warn('Failed to save rombel list:', e);
    }
  }, [rombelList]);

  useEffect(() => {
    try {
      localStorage.setItem('kbc_master_siswa_list', JSON.stringify(siswaList));
      // Auto-sync Student Accounts when Master Siswa list changes
      const synced = loadStoredStudents();
      saveStudents(synced, true);
    } catch (e) {
      console.warn('Failed to save siswa list:', e);
    }
  }, [siswaList]);

  useEffect(() => {
    try {
      localStorage.setItem('kbc_master_jadwal_list', JSON.stringify(jadwalSlots));
    } catch (e) {
      console.warn('Failed to save jadwal list:', e);
    }
  }, [jadwalSlots]);

  // Recalculate and synchronize Rombel student counts from real student list
  const syncRombelStudentCounts = (updatedSiswa: SiswaItem[]) => {
    setRombelList(prev => prev.map(r => {
      const realCount = updatedSiswa.filter(s => s.rombelId === r.id).length;
      return realCount > 0 ? { ...r, jumlahSiswa: realCount } : r;
    }));
  };

  // Handler for Saving Rombel
  const handleSaveRombel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rombelForm.namaRombel?.trim()) return;

    if (editingRombel) {
      setRombelList(prev => prev.map(r => r.id === editingRombel.id ? { ...r, ...rombelForm } as RombelItem : r));
    } else {
      const newItem: RombelItem = {
        id: 'rombel-' + Date.now(),
        namaRombel: rombelForm.namaRombel || 'Rombel Baru',
        tingkatFase: rombelForm.tingkatFase || 'Fase A (Kelas 1-2)',
        waliKelas: rombelForm.waliKelas || '',
        jumlahSiswa: Number(rombelForm.jumlahSiswa) || 0,
        tahunPelajaran: rombelForm.tahunPelajaran || '2025/2026',
        kurikulum: rombelForm.kurikulum || 'Kurikulum Berbasis Cinta (KBC)'
      };
      setRombelList(prev => [...prev, newItem]);
    }
    setShowRombelModal(false);
    setEditingRombel(null);
  };

  const handleDeleteRombel = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus Rombel ini beserta data jadwal dan siswanya?')) {
      setRombelList(prev => prev.filter(r => r.id !== id));
      setJadwalSlots(prev => prev.filter(j => j.rombelId !== id));
      setSiswaList(prev => {
        const next = prev.filter(s => s.rombelId !== id);
        return next;
      });
    }
  };

  // Handler for Manual Add/Edit Siswa
  const handleSaveSiswa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRombelForSiswa || !siswaForm.namaSiswa?.trim()) return;

    let nextSiswaList: SiswaItem[];
    if (editingSiswa) {
      nextSiswaList = siswaList.map(s => s.id === editingSiswa.id ? { ...s, ...siswaForm } as SiswaItem : s);
    } else {
      const newSiswa: SiswaItem = {
        id: 'siswa-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
        rombelId: activeRombelForSiswa.id,
        nisn: siswaForm.nisn || '',
        nis: siswaForm.nis || '',
        namaSiswa: siswaForm.namaSiswa.trim(),
        jenisKelamin: (siswaForm.jenisKelamin === 'P' ? 'P' : 'L'),
        tempatLahir: siswaForm.tempatLahir || '',
        tanggalLahir: siswaForm.tanggalLahir || '',
        nik: siswaForm.nik || '',
        namaAyah: siswaForm.namaAyah || '',
        namaIbu: siswaForm.namaIbu || '',
        alamat: siswaForm.alamat || ''
      };
      nextSiswaList = [...siswaList, newSiswa];
    }

    setSiswaList(nextSiswaList);
    syncRombelStudentCounts(nextSiswaList);
    setShowSiswaModal(false);
    setEditingSiswa(null);
  };

  const handleDeleteSiswa = (siswaId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data siswa ini?')) {
      const nextList = siswaList.filter(s => s.id !== siswaId);
      setSiswaList(nextList);
      syncRombelStudentCounts(nextList);
    }
  };

  const handleDeleteAllSiswaInRombel = (rombelId: string) => {
    if (confirm('🚨 PERINGATAN: Apakah Anda yakin ingin MENGHAPUS SELURUH SISWA di rombel ini? Action ini tidak dapat dibatalkan.')) {
      const nextList = siswaList.filter(s => s.rombelId !== rombelId);
      setSiswaList(nextList);
      syncRombelStudentCounts(nextList);
    }
  };

  // EMIS Excel Import Handler
  const handleExcelImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeRombelForSiswa) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const workbook = XLSX.read(bstr, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawJson: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (!rawJson || rawJson.length === 0) {
          alert('Gagal membaca file Excel. File kosong atau format tidak sesuai.');
          return;
        }

        const importedSiswa: SiswaItem[] = [];

        rawJson.forEach((row, idx) => {
          // Normalize column headers
          const keys = Object.keys(row);
          const getValue = (possibleHeaders: string[]): string => {
            for (const ph of possibleHeaders) {
              const matchedKey = keys.find(k => k.trim().toLowerCase() === ph.toLowerCase());
              if (matchedKey && row[matchedKey] !== undefined && row[matchedKey] !== null) {
                return String(row[matchedKey]).trim();
              }
            }
            return '';
          };

          const nama = getValue(['nama', 'nama siswa', 'nama_siswa', 'nama lengkap', 'nama lengkap siswa', 'student_name']);
          if (!nama) return; // Skip empty row

          const nisn = getValue(['nisn', 'no. nisn', 'nomor nisn', 'nisn_siswa']);
          const nis = getValue(['nis', 'no. nis', 'no. induk', 'nis_siswa', 'nipd']);
          const jkRaw = getValue(['jk', 'l/p', 'jenis kelamin', 'jenis_kelamin', 'gender']);
          const jk: 'L' | 'P' = (jkRaw.toUpperCase().startsWith('P') || jkRaw.toUpperCase().startsWith('PEREMPUAN') || jkRaw.toUpperCase().startsWith('FEMALE')) ? 'P' : 'L';
          const tempatLahir = getValue(['tempat lahir', 'tempat_lahir', 'tmp_lahir', 'tempat']);
          const tanggalLahir = getValue(['tanggal lahir', 'tanggal_lahir', 'tgl_lahir', 'tgl lahir']);
          const nik = getValue(['nik', 'nik_siswa', 'nik siswa']);
          const namaAyah = getValue(['nama ayah', 'ayah', 'nama_ayah', 'ayah kandung']);
          const namaIbu = getValue(['nama ibu', 'ibu', 'nama_ibu', 'ibu kandung']);
          const alamat = getValue(['alamat', 'alamat_siswa', 'domisili', 'dusun']);

          importedSiswa.push({
            id: 'siswa-' + Date.now() + '-' + idx + '-' + Math.random().toString(36).substr(2, 4),
            rombelId: activeRombelForSiswa.id,
            nisn,
            nis,
            namaSiswa: nama,
            jenisKelamin: jk,
            tempatLahir,
            tanggalLahir,
            nik,
            namaAyah,
            namaIbu,
            alamat
          });
        });

        if (importedSiswa.length === 0) {
          alert('Tidak ada data siswa yang valid ditemukan. Pastikan Excel memiliki kolom NAMA / NAMA LENGKAP SISWA.');
          return;
        }

        // Merge or replace
        const nextList = [...siswaList.filter(s => s.rombelId !== activeRombelForSiswa.id), ...importedSiswa];
        setSiswaList(nextList);
        syncRombelStudentCounts(nextList);

        alert(`✅ Berhasil mengimpor ${importedSiswa.length} data siswa format EMIS untuk ${activeRombelForSiswa.namaRombel}!`);
      } catch (err) {
        console.error('Error importing excel:', err);
        alert('Terjadi kesalahan saat mengimpor file Excel: ' + (err as Error).message);
      } finally {
        if (excelFileInputRef.current) {
          excelFileInputRef.current.value = '';
        }
      }
    };

    reader.readAsBinaryString(file);
  };

  // Download EMIS Template Excel
  const handleDownloadEmisTemplate = () => {
    const headers = [
      {
        'NO': 1,
        'NISN': '',
        'NIS': '',
        'NAMA LENGKAP SISWA': '',
        'JENIS KELAMIN (L/P)': 'L',
        'TEMPAT LAHIR': '',
        'TANGGAL LAHIR': '',
        'NIK': '',
        'NAMA AYAH': '',
        'NAMA IBU': '',
        'ALAMAT': ''
      },
      {
        'NO': 2,
        'NISN': '',
        'NIS': '',
        'NAMA LENGKAP SISWA': '',
        'JENIS KELAMIN (L/P)': 'P',
        'TEMPAT LAHIR': '',
        'TANGGAL LAHIR': '',
        'NIK': '',
        'NAMA AYAH': '',
        'NAMA IBU': '',
        'ALAMAT': ''
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(headers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Siswa EMIS');
    XLSX.writeFile(workbook, 'Template_Data_Siswa_EMIS.xlsx');
  };

  // Export Siswa Rombel to Excel
  const handleExportSiswaToExcel = (rombel: RombelItem) => {
    const list = siswaList.filter(s => s.rombelId === rombel.id);
    if (list.length === 0) {
      alert('Belum ada data siswa di rombel ini.');
      return;
    }

    const dataExcel = list.map((s, idx) => ({
      'NO': idx + 1,
      'NISN': s.nisn,
      'NIS': s.nis,
      'NAMA LENGKAP SISWA': s.namaSiswa,
      'JENIS KELAMIN': s.jenisKelamin,
      'TEMPAT LAHIR': s.tempatLahir || '-',
      'TANGGAL LAHIR': s.tanggalLahir || '-',
      'NIK': s.nik || '-',
      'NAMA AYAH': s.namaAyah || '-',
      'NAMA IBU': s.namaIbu || '-',
      'ALAMAT': s.alamat || '-'
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, rombel.namaRombel);
    XLSX.writeFile(workbook, `Data_Siswa_EMIS_${rombel.namaRombel.replace(/\s+/g, '_')}.xlsx`);
  };

  // Handler for Saving Jadwal Slot
  const handleSaveSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slotForm.mataPelajaran?.trim()) return;

    if (editingSlot) {
      setJadwalSlots(prev => prev.map(s => s.id === editingSlot.id ? { ...s, ...slotForm } as JadwalSlot : s));
    } else {
      const newSlot: JadwalSlot = {
        id: 'slot-' + Date.now(),
        rombelId: selectedJadwalRombelId,
        hari: slotForm.hari || 'Senin',
        jamKe: Number(slotForm.jamKe) || 1,
        waktu: slotForm.waktu || '07.00 - 07.35',
        kategori: slotForm.kategori || 'PELAJARAN',
        mataPelajaran: slotForm.mataPelajaran || '-',
        guruPengajar: slotForm.guruPengajar || '-'
      };
      setJadwalSlots(prev => [...prev, newSlot]);
    }
    setShowSlotModal(false);
    setEditingSlot(null);
  };

  const handleDeleteSlot = (id: string) => {
    setJadwalSlots(prev => prev.filter(s => s.id !== id));
  };

  // Helper function to print document window
  const triggerPrintWindow = (elementId: string, titleName: string) => {
    const printElement = document.getElementById(elementId);
    if (!printElement) {
      window.print();
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      window.print();
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${titleName}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          @page { size: A4 portrait; margin: 12mm; }
          body { font-family: ui-sans-serif, system-ui, sans-serif, BlinkMacSystemFont; background: #ffffff; color: #000000; padding: 15px; }
          .border-double { border-style: double; }
          @media print {
            .no-print { display: none !important; }
            body { padding: 0 !important; }
          }
        </style>
      </head>
      <body>
        ${printElement.innerHTML}
        <script>
          setTimeout(() => {
            window.print();
          }, 600);
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const currentRombel = rombelList.find(r => r.id === selectedJadwalRombelId) || rombelList[0];

  return (
    <div className="space-y-5">
      {/* Hidden File Input for EMIS Excel Upload */}
      <input
        type="file"
        ref={excelFileInputRef}
        onChange={handleExcelImport}
        accept=".xlsx, .xls, .csv"
        className="hidden"
      />

      {/* Top Banner Section */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-emerald-700/80 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/15 rounded-2xl backdrop-blur-md border border-white/20 shrink-0">
              <GraduationCap className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-extrabold tracking-tight">
                  MASTER KURIKULUM
                </h3>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  KBC Official
                </span>
              </div>
              <p className="text-xs text-emerald-100/90 font-medium">
                Kelola Rombel, Upload Data Siswa EMIS, Jadwal Pelajaran, Pemetaan Modul &amp; Cetak Dokumen Resmi
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              type="button"
              onClick={() => setPrintDocType('jadwal')}
              className="bg-white hover:bg-emerald-50 text-emerald-900 font-extrabold text-xs px-3.5 py-2 rounded-xl transition-all shadow-xs cursor-pointer flex items-center space-x-1.5"
            >
              <Printer className="w-4 h-4 text-emerald-700" />
              <span>Cetak Jadwal Pelajaran</span>
            </button>
          </div>
        </div>

        {/* Sub Navigation Cards (Minimalist Grid - Non-sliding) */}
        <div className="pt-3 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          {[
            {
              id: 'rombel',
              label: '1. Rombel & Siswa EMIS',
              desc: 'Kelola kelompok kelas & data siswa',
              icon: Users,
              count: rombelList.length
            },
            {
              id: 'jadwal',
              label: '2. Jadwal Pelajaran',
              desc: 'Jadwal jam & matpel rombel',
              icon: Calendar,
              count: jadwalSlots.length
            },
            {
              id: 'modul',
              label: '3. Pemetaan Modul',
              desc: 'Struktur KBC & alokasi JP',
              icon: BookOpen
            },
            {
              id: 'cetak',
              label: '4. Pusat Cetak Dokumen',
              desc: 'Cetak jadwal & laporan resmi',
              icon: Printer,
              badge: 'Official'
            },
          ].map(tab => {
            const IconComp = tab.icon;
            const isActive = subTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSubTab(tab.id as any)}
                className={`p-3 rounded-2xl text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 border ${
                  isActive
                    ? 'bg-white text-emerald-950 shadow-md border-emerald-300 ring-2 ring-emerald-400/40'
                    : 'bg-emerald-900/50 hover:bg-emerald-900/80 text-emerald-100 border border-emerald-700/60'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isActive ? 'bg-emerald-700 text-white shadow-xs' : 'bg-emerald-900/80 text-emerald-300 border border-emerald-700/80'
                  }`}>
                    <IconComp className="w-4 h-4" />
                  </div>
                  {tab.count !== undefined && (
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-emerald-100 text-emerald-900 font-black' : 'bg-emerald-800/80 text-emerald-200 border border-emerald-700/60'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                  {tab.badge && (
                    <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-md shadow-xs">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-black leading-tight tracking-tight">{tab.label}</h4>
                  <p className={`text-[10px] mt-0.5 line-clamp-1 ${isActive ? 'text-slate-600 font-medium' : 'text-emerald-200/70'}`}>
                    {tab.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SUB TAB 1: ROMBONGAN BELAJAR (ROMBEL) & UPLOAD SISWA EMIS */}
      {subTab === 'rombel' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 space-y-4 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
            <div>
              <h4 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>Daftar Rombongan Belajar (Rombel) &amp; Import Data Siswa EMIS</span>
              </h4>
              <p className="text-xs text-slate-500 font-medium">
                Kelola kelompok kelas, wali kelas, serta upload file Excel Data Siswa format EMIS.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setEditingRombel(null);
                setRombelForm({
                  namaRombel: '',
                  tingkatFase: 'Fase A (Kelas 1-2)',
                  waliKelas: '',
                  jumlahSiswa: 0,
                  tahunPelajaran: '2025/2026',
                  kurikulum: 'Kurikulum Berbasis Cinta (KBC)'
                });
                setShowRombelModal(true);
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl transition-all shadow-xs cursor-pointer flex items-center space-x-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tambah Rombel Baru</span>
            </button>
          </div>

          {/* Rombel Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {rombelList.map((item, idx) => {
              const studentsInRombel = siswaList.filter(s => s.rombelId === item.id);
              const countL = studentsInRombel.filter(s => s.jenisKelamin === 'L').length;
              const countP = studentsInRombel.filter(s => s.jenisKelamin === 'P').length;

              return (
                <div
                  key={`${item.id}-${idx}`}
                  className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 hover:border-emerald-500/70 transition-all group relative flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="p-2 bg-emerald-100 text-emerald-800 font-extrabold text-xs rounded-xl border border-emerald-200 shrink-0">
                          {item.namaRombel}
                        </div>
                        <div>
                          <h5 className="text-xs font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                            {item.namaRombel}
                          </h5>
                          <p className="text-[10px] text-slate-500 font-medium">
                            {item.tingkatFase}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingRombel(item);
                            setRombelForm({ ...item });
                            setShowRombelModal(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Data Rombel"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteRombel(item.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Rombel"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 text-xs space-y-1">
                      <div className="flex items-center justify-between text-slate-700">
                        <span className="text-[11px] text-slate-500">Wali Kelas:</span>
                        <span className="font-bold text-slate-900">{item.waliKelas || '-'}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-700">
                        <span className="text-[11px] text-slate-500">Jumlah Siswa:</span>
                        <span className="font-bold text-emerald-700">{studentsInRombel.length || item.jumlahSiswa} Siswa ({countL} L / {countP} P)</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-700 pt-0.5">
                        <span className="text-[10px] text-slate-400">Kurikulum:</span>
                        <span className="text-[10px] font-extrabold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                          {item.kurikulum}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between gap-1">
                    <button
                      type="button"
                      onClick={() => setActiveRombelForSiswa(item)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] px-3 py-1.5 rounded-xl transition-all shadow-xs flex items-center space-x-1 cursor-pointer"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>👨‍🎓 Kelola Siswa EMIS ({studentsInRombel.length})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedJadwalRombelId(item.id);
                        setSubTab('jadwal');
                      }}
                      className="text-[11px] text-slate-600 font-bold hover:text-emerald-700 flex items-center space-x-0.5 cursor-pointer"
                      title="Lihat Jadwal Pelajaran"
                    >
                      <span>Jadwal</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL KELOLA SISWA EMIS UNTUK ROMBEL TERPILIH */}
      {activeRombelForSiswa && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[60] flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden my-auto animate-in fade-in duration-150">
            {/* Header Modal */}
            <div className="bg-emerald-800 text-white p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-white/15 rounded-xl">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-200" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base flex items-center space-x-2">
                    <span>Data Siswa EMIS - {activeRombelForSiswa.namaRombel}</span>
                    <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                      Tahun {activeRombelForSiswa.tahunPelajaran}
                    </span>
                  </h4>
                  <p className="text-xs text-emerald-100/90 font-medium">
                    Wali Kelas: {activeRombelForSiswa.waliKelas || '-'} | Total: {siswaList.filter(s => s.rombelId === activeRombelForSiswa.id).length} Siswa
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveRombelForSiswa(null)}
                className="p-1.5 hover:bg-emerald-700 rounded-xl text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Toolbar Action Buttons */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0 text-xs">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => excelFileInputRef.current?.click()}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-3.5 py-2 rounded-xl transition-all shadow-xs cursor-pointer flex items-center space-x-1.5"
                >
                  <Upload className="w-4 h-4" />
                  <span>📥 Upload Excel EMIS (.xlsx)</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadEmisTemplate}
                  className="bg-white hover:bg-slate-100 text-slate-700 font-extrabold border border-slate-300 px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5"
                >
                  <Download className="w-4 h-4 text-emerald-600" />
                  <span>📄 Download Template EMIS</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEditingSiswa(null);
                    setSiswaForm({
                      nisn: '',
                      nis: '',
                      namaSiswa: '',
                      jenisKelamin: 'L',
                      tempatLahir: '',
                      tanggalLahir: '',
                      nik: '',
                      namaAyah: '',
                      namaIbu: '',
                      alamat: ''
                    });
                    setShowSiswaModal(true);
                  }}
                  className="bg-teal-700 hover:bg-teal-800 text-white font-extrabold px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>+ Tambah Siswa Manual</span>
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => handleExportSiswaToExcel(activeRombelForSiswa)}
                  className="bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-extrabold px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-1"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Export Excel Rombel</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteAllSiswaInRombel(activeRombelForSiswa.id)}
                  className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold border border-rose-200 px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-1"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Kosongkan Siswa</span>
                </button>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="px-4 py-2 bg-white border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0 text-xs">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari Nama Siswa, NISN, atau NIS..."
                  value={siswaSearch}
                  onChange={e => setSiswaSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <Filter className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-bold text-slate-600">Filter Gender:</span>
                {(['ALL', 'L', 'P'] as const).map(g => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setSiswaGenderFilter(g)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      siswaGenderrFilter === g
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {g === 'ALL' ? 'Semua' : g === 'L' ? 'Laki-laki (L)' : 'Perempuan (P)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Student Table */}
            <div className="p-4 flex-1 overflow-y-auto">
              {(() => {
                const filtered = siswaList
                  .filter(s => s.rombelId === activeRombelForSiswa.id)
                  .filter(s => {
                    if (siswaGenderrFilter !== 'ALL' && s.jenisKelamin !== siswaGenderrFilter) return false;
                    if (!siswaSearch.trim()) return true;
                    const query = siswaSearch.toLowerCase();
                    return (
                      s.namaSiswa.toLowerCase().includes(query) ||
                      s.nisn.includes(query) ||
                      s.nis.includes(query) ||
                      (s.nik && s.nik.includes(query))
                    );
                  });

                if (filtered.length === 0) {
                  return (
                    <div className="text-center py-12 space-y-3 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                      <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
                      <div>
                        <h5 className="font-extrabold text-slate-800 text-sm">Belum Ada Data Siswa</h5>
                        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                          Silakan klik tombol <strong>"📥 Upload Excel EMIS"</strong> di atas untuk mengimpor file Excel dari aplikasi EMIS Kemenag, atau tambahkan siswa secara manual.
                        </p>
                      </div>
                    </div>
                  );
                }

                return (
                  <div className="overflow-x-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-emerald-800 text-white font-extrabold text-center">
                          <th className="p-2.5 border-r border-emerald-700 w-10">No</th>
                          <th className="p-2.5 border-r border-emerald-700 w-28">NISN</th>
                          <th className="p-2.5 border-r border-emerald-700 w-24">NIS</th>
                          <th className="p-2.5 border-r border-emerald-700 min-w-[180px]">Nama Lengkap Siswa</th>
                          <th className="p-2.5 border-r border-emerald-700 w-16">L/P</th>
                          <th className="p-2.5 border-r border-emerald-700 min-w-[140px]">Tempat, Tgl Lahir</th>
                          <th className="p-2.5 border-r border-emerald-700 min-w-[130px]">NIK Siswa</th>
                          <th className="p-2.5 border-r border-emerald-700 min-w-[130px]">Nama Ayah</th>
                          <th className="p-2.5 border-r border-emerald-700 min-w-[130px]">Nama Ibu</th>
                          <th className="p-2.5 w-20">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white">
                        {filtered.map((siswa, idx) => (
                          <tr key={`${siswa.id}-${idx}`} className="hover:bg-slate-50 transition-colors">
                            <td className="p-2 text-center font-bold text-slate-700 bg-slate-50 border-r border-slate-200">{idx + 1}</td>
                            <td className="p-2 font-mono text-[11px] text-slate-800 border-r border-slate-200">{siswa.nisn || '-'}</td>
                            <td className="p-2 font-mono text-[11px] text-slate-800 border-r border-slate-200">{siswa.nis || '-'}</td>
                            <td className="p-2 font-extrabold text-slate-900 border-r border-slate-200">{siswa.namaSiswa}</td>
                            <td className="p-2 text-center border-r border-slate-200">
                              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                                siswa.jenisKelamin === 'L' ? 'bg-blue-100 text-blue-900 border border-blue-200' : 'bg-pink-100 text-pink-900 border border-pink-200'
                              }`}>
                                {siswa.jenisKelamin}
                              </span>
                            </td>
                            <td className="p-2 text-slate-700 border-r border-slate-200">
                              {siswa.tempatLahir ? `${siswa.tempatLahir}, ${siswa.tanggalLahir || ''}` : '-'}
                            </td>
                            <td className="p-2 font-mono text-[10px] text-slate-600 border-r border-slate-200">{siswa.nik || '-'}</td>
                            <td className="p-2 text-slate-800 border-r border-slate-200">{siswa.namaAyah || '-'}</td>
                            <td className="p-2 text-slate-800 border-r border-slate-200">{siswa.namaIbu || '-'}</td>
                            <td className="p-2 text-center space-x-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingSiswa(siswa);
                                  setSiswaForm({ ...siswa });
                                  setShowSiswaModal(true);
                                }}
                                className="p-1 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors cursor-pointer"
                                title="Edit Siswa"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteSiswa(siswa.id)}
                                className="p-1 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                                title="Hapus Siswa"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH / EDIT SISWA MANUAL */}
      {showSiswaModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs z-[70] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in duration-150">
            <div className="bg-teal-800 text-white p-4 flex items-center justify-between">
              <h4 className="font-extrabold text-sm flex items-center space-x-2">
                <UserPlus className="w-4 h-4 text-teal-200" />
                <span>{editingSiswa ? 'Edit Data Siswa' : 'Tambah Siswa Manual'}</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowSiswaModal(false)}
                className="p-1 hover:bg-teal-700 rounded-lg text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSiswa} className="p-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">NISN:</label>
                  <input
                    type="text"
                    placeholder="10 digit NISN"
                    value={siswaForm.nisn || ''}
                    onChange={e => setSiswaForm({ ...siswaForm, nisn: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-mono text-slate-900 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">NIS / No. Induk:</label>
                  <input
                    type="text"
                    placeholder="No. Induk Siswa"
                    value={siswaForm.nis || ''}
                    onChange={e => setSiswaForm({ ...siswaForm, nis: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-mono text-slate-900 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Lengkap Siswa *:</label>
                <input
                  type="text"
                  required
                  placeholder="Nama Lengkap Siswa sesuai Akta"
                  value={siswaForm.namaSiswa || ''}
                  onChange={e => setSiswaForm({ ...siswaForm, namaSiswa: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Jenis Kelamin:</label>
                  <select
                    value={siswaForm.jenisKelamin || 'L'}
                    onChange={e => setSiswaForm({ ...siswaForm, jenisKelamin: e.target.value as 'L' | 'P' })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900 focus:outline-none focus:border-teal-500"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tempat Lahir:</label>
                  <input
                    type="text"
                    placeholder="Banyumas"
                    value={siswaForm.tempatLahir || ''}
                    onChange={e => setSiswaForm({ ...siswaForm, tempatLahir: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tgl Lahir:</label>
                  <input
                    type="date"
                    value={siswaForm.tanggalLahir || ''}
                    onChange={e => setSiswaForm({ ...siswaForm, tanggalLahir: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nama Ayah Kandung:</label>
                  <input
                    type="text"
                    placeholder="Nama Ayah"
                    value={siswaForm.namaAyah || ''}
                    onChange={e => setSiswaForm({ ...siswaForm, namaAyah: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nama Ibu Kandung:</label>
                  <input
                    type="text"
                    placeholder="Nama Ibu"
                    value={siswaForm.namaIbu || ''}
                    onChange={e => setSiswaForm({ ...siswaForm, namaIbu: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Alamat Tempat Tinggal:</label>
                <input
                  type="text"
                  placeholder="RT / RW, Desa, Kecamatan"
                  value={siswaForm.alamat || ''}
                  onChange={e => setSiswaForm({ ...siswaForm, alamat: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowSiswaModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-teal-700 hover:bg-teal-800 text-white font-extrabold px-4 py-2 rounded-xl shadow-xs cursor-pointer flex items-center space-x-1"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Data Siswa</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUB TAB 2: JADWAL PELAJARAN PER ROMBEL (SYNC MASTER MAPEL & ACTIVITIES) */}
      {subTab === 'jadwal' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 space-y-4 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
            <div>
              <h4 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>Matriks Jadwal Pelajaran Rombel (Synced with Master Mapel)</span>
              </h4>
              <p className="text-xs text-slate-500 font-medium">
                Pilih rombel untuk mengatur alokasi jam pelajaran, kegiatan non-KBM (Istirahat, Upacara, Religi), dan pengajar.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-xs font-bold text-slate-700 shrink-0">Pilih Rombel:</label>
              <select
                value={selectedJadwalRombelId}
                onChange={e => setSelectedJadwalRombelId(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
              >
                {rombelList.map((r, idx) => (
                  <option key={`${r.id}-${idx}`} value={r.id}>
                    {r.namaRombel} ({r.tingkatFase})
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => {
                  setEditingSlot(null);
                  setSlotForm({
                    hari: 'Senin',
                    jamKe: 1,
                    waktu: '07.00 - 07.35',
                    kategori: 'PELAJARAN',
                    mataPelajaran: masterMapelOptions[0] || 'Pendidikan Pancasila',
                    guruPengajar: currentRombel?.waliKelas || ''
                  });
                  setShowSlotModal(true);
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-3 py-1.5 rounded-xl transition-all shadow-xs cursor-pointer flex items-center space-x-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Slot Pelajaran / Kegiatan</span>
              </button>
            </div>
          </div>

          {/* Legend Badges */}
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
            <span className="text-slate-500 font-medium">Keterangan Warna Slot:</span>
            <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded-md">Pelajaran Normal</span>
            <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-md">Istirahat / Makan</span>
            <span className="bg-indigo-100 text-indigo-900 border border-indigo-300 px-2 py-0.5 rounded-md">Pembiasaan Religi / Dhuha</span>
            <span className="bg-rose-100 text-rose-900 border border-rose-300 px-2 py-0.5 rounded-md">Upacara Bendera</span>
            <span className="bg-purple-100 text-purple-900 border border-purple-300 px-2 py-0.5 rounded-md">P5 / PRAA</span>
            <span className="bg-cyan-100 text-cyan-900 border border-cyan-300 px-2 py-0.5 rounded-md">Literasi &amp; Numerasi</span>
          </div>

          {/* Jadwal Table Grid */}
          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-emerald-800 text-white text-center font-extrabold border-b border-emerald-900">
                  <th className="p-2.5 border-r border-emerald-700 w-16">Jam Ke</th>
                  <th className="p-2.5 border-r border-emerald-700 w-28">Waktu</th>
                  {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map(hari => (
                    <th key={hari} className="p-2.5 border-r border-emerald-700 min-w-[140px]">
                      {hari}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(jamKe => {
                  return (
                    <tr key={jamKe} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-2 text-center font-extrabold text-slate-800 bg-slate-100 border-r border-slate-200">
                        {jamKe}
                      </td>
                      <td className="p-2 text-center text-[10px] text-slate-500 font-mono bg-slate-50 border-r border-slate-200">
                        {jamKe === 1 && '07.00 - 07.35'}
                        {jamKe === 2 && '07.35 - 08.10'}
                        {jamKe === 3 && '08.10 - 08.45'}
                        {jamKe === 4 && '08.45 - 09.15'}
                        {jamKe === 5 && '09.15 - 09.50'}
                        {jamKe === 6 && '09.50 - 10.25'}
                        {jamKe === 7 && '10.25 - 11.00'}
                        {jamKe === 8 && '11.00 - 11.35'}
                      </td>
                      {(['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'] as const).map(hari => {
                        const slot = jadwalSlots.find(
                          s => s.rombelId === selectedJadwalRombelId && s.hari === hari && Number(s.jamKe) === jamKe
                        );

                        // Category styling
                        let slotStyle = 'bg-emerald-50/90 border-emerald-200 text-emerald-950';
                        if (slot) {
                          if (slot.kategori === 'ISTIRAHAT') slotStyle = 'bg-amber-100/90 border-amber-300 text-amber-950';
                          else if (slot.kategori === 'RELIGI') slotStyle = 'bg-indigo-100/90 border-indigo-300 text-indigo-950';
                          else if (slot.kategori === 'UPACARA') slotStyle = 'bg-rose-100/90 border-rose-300 text-rose-950';
                          else if (slot.kategori === 'SHOLAT') slotStyle = 'bg-teal-100/90 border-teal-300 text-teal-950';
                          else if (slot.kategori === 'P5') slotStyle = 'bg-purple-100/90 border-purple-300 text-purple-950';
                          else if (slot.kategori === 'LITERASI') slotStyle = 'bg-cyan-100/90 border-cyan-300 text-cyan-950';
                          else if (slot.kategori === 'EKSTRA') slotStyle = 'bg-blue-100/90 border-blue-300 text-blue-950';
                        }

                        return (
                          <td key={hari} className="p-2 border-r border-slate-200 vertical-top">
                            {slot ? (
                              <div className={`border p-2 rounded-xl text-xs space-y-1 relative group ${slotStyle}`}>
                                <p className="font-extrabold leading-tight">
                                  {slot.mataPelajaran}
                                </p>
                                <p className="text-[10px] opacity-80 font-medium">
                                  👨‍🏫 {slot.guruPengajar}
                                </p>

                                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1 bg-white/90 p-0.5 rounded-lg border border-slate-200 shadow-2xs">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingSlot(slot);
                                      setSlotForm({ ...slot });
                                      setShowSlotModal(true);
                                    }}
                                    className="p-1 text-slate-600 hover:text-emerald-700 cursor-pointer"
                                  >
                                    <Edit className="w-3 h-3" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteSlot(slot.id)}
                                    className="p-1 text-slate-600 hover:text-rose-600 cursor-pointer"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingSlot(null);
                                  setSlotForm({
                                    hari,
                                    jamKe,
                                    waktu: jamKe === 1 ? '07.00 - 07.35' : jamKe === 4 ? '08.45 - 09.15' : '07.35 - 08.10',
                                    kategori: 'PELAJARAN',
                                    mataPelajaran: masterMapelOptions[0] || '',
                                    guruPengajar: currentRombel?.waliKelas || ''
                                  });
                                  setShowSlotModal(true);
                                }}
                                className="w-full py-2.5 text-[10px] text-slate-400 hover:text-emerald-700 hover:bg-emerald-50/50 border border-dashed border-slate-200 rounded-xl transition-all cursor-pointer font-medium"
                              >
                                + Isi Slot
                              </button>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500 font-medium">
              💡 Seluruh pilihan Mata Pelajaran tersinkronkan otomatis dengan Master Mapel.
            </span>
            <button
              type="button"
              onClick={() => setPrintDocType('jadwal')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer flex items-center space-x-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Jadwal Pelajaran {currentRombel?.namaRombel}</span>
            </button>
          </div>
        </div>
      )}

      {/* SUB TAB 3: PEMETAAN MODUL & ALOKASI KURIKULUM */}
      {subTab === 'modul' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 space-y-4 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
            <div>
              <h4 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>Pemetaan Modul Ajar &amp; Alokasi JP per Minggu</span>
              </h4>
              <p className="text-xs text-slate-500 font-medium">
                Struktur kurikulum terapan dan target modul ajar yang harus diselesaikan guru.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setPrintDocType('modul')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl transition-all shadow-xs cursor-pointer flex items-center space-x-1.5 shrink-0"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Pemetaan Modul</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rombelList.map((r, idx) => (
              <div key={`${r.id}-${idx}`} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-slate-900 text-xs">{r.namaRombel}</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded border border-emerald-200">
                      {r.tingkatFase}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Wali: {r.waliKelas}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  {masterMapelOptions.slice(0, 6).map((mapelName, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-200/80">
                      <div>
                        <span className="font-bold text-slate-900 block">{mapelName}</span>
                        <span className="text-[10px] text-slate-500">Alokasi: {idx === 0 ? 4 : idx === 1 ? 6 : 5} JP/Minggu</span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-extrabold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200 block">
                          Target: {idx === 0 ? 4 : 5} Modul
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB TAB 4: PUSAT CETAK DOKUMEN (SIAP CETAK) */}
      {subTab === 'cetak' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 space-y-4 shadow-2xs">
          <div>
            <h4 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2">
              <Printer className="w-4 h-4 text-emerald-600" />
              <span>Pusat Cetak Dokumen Kurikulum Resmi (Siap Cetak)</span>
            </h4>
            <p className="text-xs text-slate-500 font-medium">
              Pilih dokumen kurikulum di bawah ini untuk langsung dicetak dengan Kop Surat Resmi &amp; Penandatangan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                type: 'jadwal',
                title: 'Jadwal Pelajaran Rombel',
                desc: 'Tabel jadwal pelajaran lengkap per rombel dengan kegiatan non-KBM & nama guru.',
                badge: 'Paling Populer'
              },
              {
                type: 'rombel',
                title: 'Daftar Rombel & Wali Kelas',
                desc: 'Laporan resmi daftar kelompok belajar, wali kelas & rekap jumlah siswa.',
                badge: 'Resmi'
              },
              {
                type: 'siswa_emis',
                title: 'Data Siswa Format EMIS',
                desc: 'Laporan resmi biodata lengkap siswa EMIS (NISN, NIS, NIK, Wali) per Rombel.',
                badge: 'Terbaru'
              },
              {
                type: 'modul',
                title: 'Struktur & Pemetaan Modul',
                desc: 'Alokasi jam pelajaran dan target modul ajar per mata pelajaran.',
                badge: 'Kurikulum'
              },
            ].map(doc => (
              <div
                key={doc.type}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 hover:border-emerald-500 transition-all flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-200">
                      {doc.badge}
                    </span>
                    <Printer className="w-4 h-4 text-slate-400" />
                  </div>
                  <h5 className="text-xs font-extrabold text-slate-900">{doc.title}</h5>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-normal">{doc.desc}</p>
                </div>

                <button
                  type="button"
                  onClick={() => setPrintDocType(doc.type as any)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-3 py-2 rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center space-x-1.5 w-full mt-2"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Prinjau &amp; Cetak</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL ADD / EDIT ROMBEL */}
      {showRombelModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in duration-150">
            <div className="bg-emerald-800 text-white p-4 flex items-center justify-between">
              <h4 className="font-extrabold text-sm flex items-center space-x-2">
                <Users className="w-4 h-4 text-emerald-200" />
                <span>{editingRombel ? 'Edit Data Rombel' : 'Tambah Rombel Baru'}</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowRombelModal(false)}
                className="p-1 hover:bg-emerald-700 rounded-lg text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveRombel} className="p-4 space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Rombel / Kelas:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kelas 7A, Kelas 1, X IPA 1"
                  value={rombelForm.namaRombel || ''}
                  onChange={e => setRombelForm({ ...rombelForm, namaRombel: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Tingkat / Fase Kurikulum:</label>
                <select
                  value={rombelForm.tingkatFase || ''}
                  onChange={e => setRombelForm({ ...rombelForm, tingkatFase: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Fase A (Kelas 1-2)">Fase A (Kelas 1-2)</option>
                  <option value="Fase B (Kelas 3-4)">Fase B (Kelas 3-4)</option>
                  <option value="Fase C (Kelas 5-6)">Fase C (Kelas 5-6)</option>
                  <option value="Fase D (Kelas 7-9)">Fase D (Kelas 7-9)</option>
                  <option value="Fase E/F (Kelas 10-12)">Fase E/F (Kelas 10-12)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Wali Kelas:</label>
                <select
                  value={rombelForm.waliKelas || ''}
                  onChange={e => setRombelForm({ ...rombelForm, waliKelas: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500 font-bold"
                >
                  <option value="">-- Kosong (Belum Ditentukan) --</option>
                  {teacherOptions.map((t, idx) => (
                    <option key={idx} value={t.nama}>
                      {t.nama} {t.nip && t.nip !== '-' ? `(NIP. ${t.nip})` : ''}
                    </option>
                  ))}
                </select>
                {teacherOptions.length === 0 && (
                  <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200 mt-1 font-medium">
                    💡 Belum ada data guru di modul <strong>Daftar Guru</strong>. Silakan tambahkan nama guru di menu Pengaturan &gt; Daftar Guru.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Estimasi / Kapasitas Siswa:</label>
                  <input
                    type="number"
                    min="0"
                    value={rombelForm.jumlahSiswa || 0}
                    onChange={e => setRombelForm({ ...rombelForm, jumlahSiswa: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tahun Pelajaran:</label>
                  <input
                    type="text"
                    value={rombelForm.tahunPelajaran || '2025/2026'}
                    onChange={e => setRombelForm({ ...rombelForm, tahunPelajaran: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowRombelModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-4 py-2 rounded-xl shadow-xs cursor-pointer flex items-center space-x-1"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Rombel</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ADD / EDIT JADWAL SLOT */}
      {showSlotModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in duration-150">
            <div className="bg-emerald-800 text-white p-4 flex items-center justify-between">
              <h4 className="font-extrabold text-sm flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-emerald-200" />
                <span>{editingSlot ? 'Edit Slot Pelajaran' : 'Tambah Slot Pelajaran / Kegiatan'}</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowSlotModal(false)}
                className="p-1 hover:bg-emerald-700 rounded-lg text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSlot} className="p-4 space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Kategori / Jenis Kegiatan:</label>
                <select
                  value={slotForm.kategori || 'PELAJARAN'}
                  onChange={e => {
                    const kat = e.target.value as SlotKategori;
                    let mapelAuto = slotForm.mataPelajaran || '';
                    let guruAuto = slotForm.guruPengajar || '';

                    if (kat === 'ISTIRAHAT') {
                      mapelAuto = 'Istirahat';
                      guruAuto = 'Panitia / Semua Guru';
                    } else if (kat === 'UPACARA') {
                      mapelAuto = 'Upacara Bendera Hari Senin';
                      guruAuto = 'Pembina Upacara / Semua Guru';
                    } else if (kat === 'RELIGI') {
                      mapelAuto = 'Pembiasaan Dhuha & Tadarus Al-Qur\'an';
                      guruAuto = 'Tim Keagamaan';
                    } else if (kat === 'SHOLAT') {
                      mapelAuto = 'Sholat Dhuhur Berjamaah';
                      guruAuto = 'Imam / Semua Guru';
                    } else if (kat === 'P5') {
                      mapelAuto = 'P5 / PRAA (Projek Pancasila)';
                      guruAuto = 'Tim Koordinator P5';
                    } else if (kat === 'LITERASI') {
                      mapelAuto = 'Literasi & Numerasi Pagi';
                      guruAuto = currentRombel?.waliKelas || '';
                    } else if (kat === 'EKSTRA') {
                      mapelAuto = 'Ekstrakurikuler Pramuka / Minat';
                      guruAuto = 'Pembina Ekstra';
                    }

                    setSlotForm({
                      ...slotForm,
                      kategori: kat,
                      mataPelajaran: mapelAuto,
                      guruPengajar: guruAuto
                    });
                  }}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                >
                  <option value="PELAJARAN">📚 Pelajaran Normal (Master Mapel)</option>
                  <option value="ISTIRAHAT">🍱 Istirahat / Makan</option>
                  <option value="UPACARA">🇮🇩 Upacara Bendera / Apel</option>
                  <option value="RELIGI">🕌 Pembiasaan Religi / Dhuha / Tadarus</option>
                  <option value="SHOLAT">☪️ Sholat Dhuhur Berjamaah</option>
                  <option value="LITERASI">📖 Literasi &amp; Numerasi Pagi</option>
                  <option value="P5">🌟 P5 / PRAA (Projek Pancasila)</option>
                  <option value="EKSTRA">⛺ Ekstrakurikuler / Pramuka</option>
                  <option value="LAINNYA">📌 Kegiatan Lainnya</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Hari:</label>
                  <select
                    value={slotForm.hari || 'Senin'}
                    onChange={e => setSlotForm({ ...slotForm, hari: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                  >
                    {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map(h => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Jam Ke-:</label>
                  <select
                    value={slotForm.jamKe || 1}
                    onChange={e => setSlotForm({ ...slotForm, jamKe: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(j => (
                      <option key={j} value={j}>Jam Ke-{j}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Mata Pelajaran / Nama Kegiatan:</label>
                {slotForm.kategori === 'PELAJARAN' ? (
                  <select
                    value={slotForm.mataPelajaran || ''}
                    onChange={e => setSlotForm({ ...slotForm, mataPelajaran: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">-- Pilih dari Master Mapel --</option>
                    {masterMapelOptions.map((m, idx) => (
                      <option key={idx} value={m}>{m}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Istirahat I, Pembiasaan Dhuha, Upacara"
                    value={slotForm.mataPelajaran || ''}
                    onChange={e => setSlotForm({ ...slotForm, mataPelajaran: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                )}
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Guru Pengajar / Pendamping:</label>
                <select
                  value={slotForm.guruPengajar || ''}
                  onChange={e => setSlotForm({ ...slotForm, guruPengajar: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500 font-bold"
                >
                  <option value="">-- Pilih Guru Pengajar --</option>
                  {teacherOptions.map((t, idx) => (
                    <option key={idx} value={t.nama}>{t.nama}</option>
                  ))}
                  <option value="Panitia / Semua Guru">Panitia / Semua Guru</option>
                  <option value="Pembina Upacara">Pembina Upacara</option>
                  <option value="Tim Keagamaan">Tim Keagamaan</option>
                  <option value="Tim P5 KBC">Tim P5 KBC</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowSlotModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-4 py-2 rounded-xl shadow-xs cursor-pointer flex items-center space-x-1"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Slot</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINT PREVIEW OVERLAY MODAL (OFFICIAL PRINT TEMPLATES) */}
      {printDocType && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs z-[60] flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col overflow-hidden my-auto">
            {/* Modal Print Toolbar Header */}
            <div className="bg-slate-900 text-white p-3.5 sm:p-4 flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
                  <Printer className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-white">
                    Prinjau Dokumen Resmi Siap Cetak
                  </h4>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Dilengkapi Kop Surat Resmi &amp; Format Penandatangan
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => triggerPrintWindow('printable-kurikulum-doc', `Dokumen Kurikulum - ${kopSurat.namaMadrasah}`)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-4 py-2 rounded-xl transition-all shadow-md flex items-center space-x-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Langsung (PDF)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPrintDocType(null)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Printable Document Container */}
            <div className="p-6 sm:p-8 bg-white flex-1 overflow-y-auto font-sans text-slate-900 space-y-6" id="printable-kurikulum-doc">
              {/* KOP SURAT HEADER */}
              <div className="border-b-4 border-double border-slate-900 pb-3 flex items-center space-x-4">
                {kopSurat.logoUrl && (
                  <img
                    src={kopSurat.logoUrl}
                    alt="Logo Madrasah"
                    className="w-16 h-16 object-contain shrink-0"
                  />
                )}
                <div className="flex-1 text-center space-y-0.5">
                  {kopSurat.namaInstansiAtas && (
                    <p className="text-[10px] uppercase font-bold tracking-wider text-slate-700">{kopSurat.namaInstansiAtas}</p>
                  )}
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-800">{kopSurat.namaKantor || 'KELOMPOK KERJA MADRASAH'}</p>
                  <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-tight text-slate-900">{kopSurat.namaMadrasah || 'NAMA MADRASAH'}</h2>
                  <p className="text-[10px] text-slate-600 font-medium">{kopSurat.alamatMadrasah || '-'}</p>
                  <p className="text-[9px] text-slate-500 font-mono">
                    {kopSurat.kontakMadrasah ? `Kontak: ${kopSurat.kontakMadrasah}` : ''} {kopSurat.website ? `| Web: ${kopSurat.website}` : ''}
                  </p>
                </div>
              </div>

              {/* DOKUMEN 1: JADWAL PELAJARAN ROMBEL */}
              {printDocType === 'jadwal' && (
                <div className="space-y-4">
                  <div className="text-center space-y-0.5">
                    <h3 className="text-sm font-black uppercase text-slate-900 tracking-wide">
                      JADWAL PELAJARAN ROMBONGAN BELAJAR ({currentRombel?.namaRombel || 'KELAS 1'})
                    </h3>
                    <p className="text-xs font-bold text-slate-700">
                      TAHUN PELAJARAN {currentRombel?.tahunPelajaran || '2025/2026'} - {currentRombel?.kurikulum}
                    </p>
                    <p className="text-[11px] text-slate-600 font-medium">
                      Wali Kelas: {currentRombel?.waliKelas || '-'} | Total Siswa: {siswaList.filter(s => s.rombelId === currentRombel?.id).length || currentRombel?.jumlahSiswa} Anak
                    </p>
                  </div>

                  <table className="w-full text-left text-xs border-collapse border border-slate-900">
                    <thead>
                      <tr className="bg-slate-100 text-center font-bold border-b border-slate-900">
                        <th className="p-2 border-r border-slate-900 w-12">Jam</th>
                        <th className="p-2 border-r border-slate-900 w-24">Waktu</th>
                        {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map(h => (
                          <th key={h} className="p-2 border-r border-slate-900">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(j => (
                        <tr key={j} className="text-[11px]">
                          <td className="p-2 text-center font-bold border-r border-slate-900 bg-slate-50">{j}</td>
                          <td className="p-1.5 text-center text-[10px] font-mono border-r border-slate-900">
                            {j === 1 && '07.00 - 07.35'}
                            {j === 2 && '07.35 - 08.10'}
                            {j === 3 && '08.10 - 08.45'}
                            {j === 4 && '08.45 - 09.15'}
                            {j === 5 && '09.15 - 09.50'}
                            {j === 6 && '09.50 - 10.25'}
                            {j === 7 && '10.25 - 11.00'}
                            {j === 8 && '11.00 - 11.35'}
                          </td>
                          {(['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'] as const).map(hari => {
                            const slot = jadwalSlots.find(
                              s => s.rombelId === selectedJadwalRombelId && s.hari === hari && Number(s.jamKe) === j
                            );
                            return (
                              <td key={hari} className="p-1.5 border-r border-slate-900 text-[10px]">
                                {slot ? (
                                  <div>
                                    <p className="font-extrabold text-slate-900 leading-tight">{slot.mataPelajaran}</p>
                                    <p className="text-[9px] text-slate-600 font-medium">{slot.guruPengajar}</p>
                                  </div>
                                ) : '-'}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* DOKUMEN 2: DAFTAR ROMBEL & WALI KELAS */}
              {printDocType === 'rombel' && (
                <div className="space-y-4">
                  <div className="text-center space-y-0.5">
                    <h3 className="text-sm font-black uppercase text-slate-900 tracking-wide">
                      DAFTAR ROMBONGAN BELAJAR &amp; WALI KELAS MADRASAH
                    </h3>
                    <p className="text-xs font-bold text-slate-700">
                      TAHUN PELAJARAN 2025/2026 - KURIKULUM BERBASIS CINTA (KBC)
                    </p>
                  </div>

                  <table className="w-full text-left text-xs border-collapse border border-slate-900">
                    <thead>
                      <tr className="bg-slate-100 text-center font-bold border-b border-slate-900">
                        <th className="p-2 border-r border-slate-900 w-10">No</th>
                        <th className="p-2 border-r border-slate-900">Nama Rombel</th>
                        <th className="p-2 border-r border-slate-900">Tingkat / Fase</th>
                        <th className="p-2 border-r border-slate-900">Nama Wali Kelas</th>
                        <th className="p-2 border-r border-slate-900 w-24">Jumlah Siswa</th>
                        <th className="p-2 border-r border-slate-900">Kurikulum</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900">
                      {rombelList.map((r, idx) => {
                        const totalReal = siswaList.filter(s => s.rombelId === r.id).length;
                        return (
                          <tr key={`${r.id}-${idx}`} className="text-xs">
                            <td className="p-2 text-center font-bold border-r border-slate-900">{idx + 1}</td>
                            <td className="p-2 font-extrabold border-r border-slate-900">{r.namaRombel}</td>
                            <td className="p-2 border-r border-slate-900">{r.tingkatFase}</td>
                            <td className="p-2 border-r border-slate-900 font-bold">{r.waliKelas || '-'}</td>
                            <td className="p-2 text-center font-bold border-r border-slate-900">{totalReal || r.jumlahSiswa} Anak</td>
                            <td className="p-2 border-r border-slate-900">{r.kurikulum}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* DOKUMEN 3: DAFTAR SISWA EMIS OFFICIAL */}
              {printDocType === 'siswa_emis' && (
                <div className="space-y-4">
                  <div className="text-center space-y-0.5">
                    <h3 className="text-sm font-black uppercase text-slate-900 tracking-wide">
                      DAFTAR SISWA MADRASAH FORMAT EMIS ({currentRombel?.namaRombel || 'KELAS 1'})
                    </h3>
                    <p className="text-xs font-bold text-slate-700">
                      TAHUN PELAJARAN {currentRombel?.tahunPelajaran || '2025/2026'} - WALI KELAS: {currentRombel?.waliKelas || '-'}
                    </p>
                  </div>

                  <table className="w-full text-left text-xs border-collapse border border-slate-900">
                    <thead>
                      <tr className="bg-slate-100 text-center font-bold border-b border-slate-900">
                        <th className="p-2 border-r border-slate-900 w-8">No</th>
                        <th className="p-2 border-r border-slate-900 w-24">NISN</th>
                        <th className="p-2 border-r border-slate-900 w-20">NIS</th>
                        <th className="p-2 border-r border-slate-900">Nama Lengkap Siswa</th>
                        <th className="p-2 border-r border-slate-900 w-10">L/P</th>
                        <th className="p-2 border-r border-slate-900">Tempat, Tgl Lahir</th>
                        <th className="p-2 border-r border-slate-900">Nama Orang Tua (Ayah / Ibu)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900 text-xs">
                      {siswaList.filter(s => s.rombelId === currentRombel?.id).map((s, idx) => (
                        <tr key={`${s.id}-${idx}`}>
                          <td className="p-2 text-center font-bold border-r border-slate-900">{idx + 1}</td>
                          <td className="p-2 font-mono border-r border-slate-900">{s.nisn || '-'}</td>
                          <td className="p-2 font-mono border-r border-slate-900">{s.nis || '-'}</td>
                          <td className="p-2 font-bold border-r border-slate-900">{s.namaSiswa}</td>
                          <td className="p-2 text-center font-bold border-r border-slate-900">{s.jenisKelamin}</td>
                          <td className="p-2 border-r border-slate-900">{s.tempatLahir ? `${s.tempatLahir}, ${s.tanggalLahir}` : '-'}</td>
                          <td className="p-2 border-r border-slate-900">{s.namaAyah || s.namaIbu || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* DOKUMEN 4: MODUL & ALOKASI JP */}
              {printDocType === 'modul' && (
                <div className="space-y-4">
                  <div className="text-center space-y-0.5">
                    <h3 className="text-sm font-black uppercase text-slate-900 tracking-wide">
                      STRUKTUR ALOKASI WAKTU KURIKULUM &amp; TARGET MODUL AJAR
                    </h3>
                    <p className="text-xs font-bold text-slate-700">
                      TAHUN PELAJARAN 2025/2026 - KURIKULUM BERBASIS CINTA (KBC)
                    </p>
                  </div>

                  <table className="w-full text-left text-xs border-collapse border border-slate-900">
                    <thead>
                      <tr className="bg-slate-100 text-center font-bold border-b border-slate-900">
                        <th className="p-2 border-r border-slate-900 w-10">No</th>
                        <th className="p-2 border-r border-slate-900">Mata Pelajaran</th>
                        <th className="p-2 border-r border-slate-900">Alokasi JP / Minggu</th>
                        <th className="p-2 border-r border-slate-900">Target Modul / Sem</th>
                        <th className="p-2 border-r border-slate-900">Status Penyusunan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900 text-xs">
                      {masterMapelOptions.slice(0, 8).map((mapel, idx) => (
                        <tr key={idx}>
                          <td className="p-2 text-center font-bold border-r border-slate-900">{idx + 1}</td>
                          <td className="p-2 font-bold border-r border-slate-900">{mapel}</td>
                          <td className="p-2 border-r border-slate-900">{idx === 0 ? '4 JP / Minggu' : idx === 1 ? '6 JP / Minggu' : '5 JP / Minggu'}</td>
                          <td className="p-2 border-r border-slate-900">4 - 6 Modul Ajar KBC</td>
                          <td className="p-2 border-r border-slate-900 font-bold">Lengkap (Siap Ajar)</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* SIGNATURE BLOCK */}
              <div className="pt-8 flex items-start justify-between text-xs text-slate-900">
                <div className="text-center space-y-12">
                  <p>Mengetahui,<br /><strong>Kepala {kopSurat.namaMadrasah || 'Madrasah'}</strong></p>
                  <div>
                    <p className="font-extrabold underline uppercase">{ttd.kepalaMadrasahNama || 'Nama Kepala Madrasah'}</p>
                    <p className="text-[10px]">NIP. {ttd.kepalaMadrasahNIP || '-'}</p>
                  </div>
                </div>

                <div className="text-center space-y-12">
                  <p>{ttd.tempatPenetapan || 'Banyumas'}, {ttd.tanggalPenetapan || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}<br /><strong>{ttd.jabatanGuru || 'Guru Kelas / Penyusun'}</strong></p>
                  <div>
                    <p className="font-extrabold underline uppercase">{ttd.guruKelasNama || 'Nama Guru'}</p>
                    <p className="text-[10px]">NIP. {ttd.guruKelasNIP || '-'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
