import React, { useState } from 'react';
import { TeacherItem, TTDSettings } from '../types';
import { 
  Users, 
  UserPlus, 
  Search, 
  Edit3, 
  Trash2, 
  Check, 
  Copy, 
  Award, 
  Phone, 
  Mail, 
  X, 
  Star,
  CheckCircle2,
  Building2
} from 'lucide-react';

interface TeacherListManagerProps {
  teachers: TeacherItem[];
  ttd: TTDSettings;
  onSaveTeachers: (teachers: TeacherItem[]) => void;
  onUpdateTTD: (newTtd: TTDSettings) => void;
}

export const TeacherListManager: React.FC<TeacherListManagerProps> = ({
  teachers,
  ttd,
  onSaveTeachers,
  onUpdateTTD
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [teacherToDelete, setTeacherToDelete] = useState<TeacherItem | null>(null);

  const [formNama, setFormNama] = useState('');
  const [formNip, setFormNip] = useState('');
  const [formJabatan, setFormJabatan] = useState('');
  const [formKontak, setFormKontak] = useState('');
  const [formEmail, setFormEmail] = useState('');

  const [copiedNipId, setCopiedNipId] = useState<string | null>(null);

  const filteredTeachers = teachers.filter(t => {
    const q = searchQuery.toLowerCase();
    return (
      t.nama.toLowerCase().includes(q) ||
      t.nip.toLowerCase().includes(q) ||
      t.jabatanAtauKelas.toLowerCase().includes(q)
    );
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormNama('');
    setFormNip('');
    setFormJabatan('Guru Kelas I');
    setFormKontak('');
    setFormEmail('');
    setShowModal(true);
  };

  const handleOpenEdit = (t: TeacherItem) => {
    setEditingId(t.id);
    setFormNama(t.nama);
    setFormNip(t.nip);
    setFormJabatan(t.jabatanAtauKelas);
    setFormKontak(t.kontak || '');
    setFormEmail(t.email || '');
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNama.trim()) return;

    if (editingId) {
      const updated = teachers.map(item =>
        item.id === editingId
          ? {
              ...item,
              nama: formNama.trim(),
              nip: formNip.trim(),
              jabatanAtauKelas: formJabatan.trim(),
              kontak: formKontak.trim(),
              email: formEmail.trim()
            }
          : item
      );
      onSaveTeachers(updated);
    } else {
      const newItem: TeacherItem = {
        id: `teacher-${Date.now()}`,
        nama: formNama.trim(),
        nip: formNip.trim() || '-',
        jabatanAtauKelas: formJabatan.trim() || 'Guru Kelas',
        kontak: formKontak.trim(),
        email: formEmail.trim()
      };
      onSaveTeachers([newItem, ...teachers]);
    }

    setShowModal(false);
  };

  const handleDelete = (t: TeacherItem) => {
    setTeacherToDelete(t);
  };

  const handleConfirmDeleteTeacher = () => {
    if (!teacherToDelete) return;
    const updated = teachers.filter(t => t.id !== teacherToDelete.id);
    onSaveTeachers(updated);

    if (ttd && onUpdateTTD) {
      const newTtd = { ...ttd };
      let changed = false;
      if (ttd.kepalaMadrasahNama === teacherToDelete.nama) {
        newTtd.kepalaMadrasahNama = '-';
        newTtd.kepalaMadrasahNIP = '-';
        changed = true;
      }
      if (ttd.guruKelasNama === teacherToDelete.nama) {
        newTtd.guruKelasNama = '-';
        newTtd.guruKelasNIP = '-';
        changed = true;
      }
      if (changed) {
        onUpdateTTD(newTtd);
      }
    }

    setTeacherToDelete(null);
  };

  const handleSetHeadmaster = (t: TeacherItem) => {
    onUpdateTTD({
      ...ttd,
      kepalaMadrasahNama: t.nama,
      kepalaMadrasahNIP: t.nip
    });
  };

  const handleSetClassTeacher = (t: TeacherItem) => {
    onUpdateTTD({
      ...ttd,
      guruKelasNama: t.nama,
      guruKelasNIP: t.nip,
      jabatanGuru: t.jabatanAtauKelas
    });
  };

  const handleCopyNip = (id: string, nip: string) => {
    navigator.clipboard.writeText(nip);
    setCopiedNipId(id);
    setTimeout(() => setCopiedNipId(null), 2000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-20 p-3 sm:p-6">
      {/* Top Banner & Title */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 rounded-3xl p-5 sm:p-7 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center space-x-2 bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 rounded-full text-emerald-300 text-xs font-bold mb-2">
              <Users className="w-3.5 h-3.5" />
              <span>Direktori Pendidik & Tenaga Kependidikan MI</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Daftar Nama Guru, NIP & Jabatan Kelas
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed font-normal">
              Kelola data pendidik, NIP resmi, serta tetapkan penandatangan dokumen (Kepala Madrasah & Guru Kelas) dalam 1-klik.
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-lg shadow-emerald-500/20 shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah Guru Baru</span>
          </button>
        </div>

        {/* Current Active Signatories Quick Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5 pt-4 border-t border-white/10 text-xs">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-300 shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <span className="text-[10px] text-amber-300 font-bold block uppercase tracking-wider">Kepala Madrasah Aktif</span>
              <p className="font-extrabold text-white truncate">{ttd.kepalaMadrasahNama}</p>
              <p className="text-[10px] text-slate-300 truncate">NIP: {ttd.kepalaMadrasahNIP || '-'}</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-400/20 border border-cyan-300/40 flex items-center justify-center text-cyan-300 shrink-0">
              <Star className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <span className="text-[10px] text-cyan-300 font-bold block uppercase tracking-wider">Guru Kelas / Penyusun Aktif</span>
              <p className="font-extrabold text-white truncate">{ttd.guruKelasNama}</p>
              <p className="text-[10px] text-slate-300 truncate">NIP: {ttd.guruKelasNIP || '-'} ({ttd.jabatanGuru})</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar & Counter */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari nama guru, NIP, atau kelas..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-medium"
          />
        </div>

        <div className="text-xs text-slate-700 font-bold flex items-center space-x-2 shrink-0">
          <span className="bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-200 font-extrabold">
            Total {teachers.length} Guru & Staff
          </span>
        </div>
      </div>

      {/* Teachers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeachers.map((teacher, idx) => {
          const isHeadmaster = ttd.kepalaMadrasahNama === teacher.nama;
          const isClassTeacher = ttd.guruKelasNama === teacher.nama;

          return (
            <div
              key={`${teacher.id}-${idx}`}
              className={`bg-white border rounded-2xl p-4 shadow-xs transition-all flex flex-col justify-between space-y-3 relative group ${
                isHeadmaster
                  ? 'border-amber-400 ring-1 ring-amber-300 bg-amber-50/30'
                  : isClassTeacher
                  ? 'border-emerald-400 ring-1 ring-emerald-300 bg-emerald-50/30'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Header Badges */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center space-x-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-black text-sm flex items-center justify-center shadow-xs shrink-0">
                    {teacher.nama.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm leading-snug">
                      {teacher.nama}
                    </h3>
                    <span className="inline-block bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-md text-[10px] font-bold mt-0.5">
                      {teacher.jabatanAtauKelas}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-1 shrink-0">
                  <button
                    onClick={() => handleOpenEdit(teacher)}
                    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all"
                    title="Edit Data Guru"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(teacher)}
                    className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg transition-all"
                    title="Hapus Data Guru"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* NIP Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-center justify-between text-[11px]">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">NIP Resmi:</span>
                  <span className="font-mono font-bold text-slate-900">{teacher.nip || '-'}</span>
                </div>
                {teacher.nip && teacher.nip !== '-' && (
                  <button
                    onClick={() => handleCopyNip(teacher.id, teacher.nip)}
                    className="text-[10px] bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold px-2 py-1 rounded-md flex items-center space-x-1 transition-all"
                  >
                    {copiedNipId === teacher.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-slate-500" />
                        <span>Salin</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Contact Info if available */}
              {(teacher.kontak || teacher.email) && (
                <div className="space-y-1 text-[11px] text-slate-600 pt-1">
                  {teacher.kontak && (
                    <div className="flex items-center space-x-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{teacher.kontak}</span>
                    </div>
                  )}
                  {teacher.email && (
                    <div className="flex items-center space-x-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{teacher.email}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Set Signatory Quick Buttons */}
              <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-[10px]">
                <button
                  onClick={() => handleSetHeadmaster(teacher)}
                  disabled={isHeadmaster}
                  className={`py-1.5 px-2 rounded-xl border font-bold flex items-center justify-center space-x-1 transition-all ${
                    isHeadmaster
                      ? 'bg-amber-100 border-amber-300 text-amber-900 cursor-default'
                      : 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-800'
                  }`}
                >
                  <Award className="w-3 h-3 shrink-0" />
                  <span>{isHeadmaster ? 'Kepala (Aktif)' : 'Set Kepala'}</span>
                </button>

                <button
                  onClick={() => handleSetClassTeacher(teacher)}
                  disabled={isClassTeacher}
                  className={`py-1.5 px-2 rounded-xl border font-bold flex items-center justify-center space-x-1 transition-all ${
                    isClassTeacher
                      ? 'bg-emerald-100 border-emerald-300 text-emerald-900 cursor-default'
                      : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-800'
                  }`}
                >
                  <Star className="w-3 h-3 shrink-0" />
                  <span>{isClassTeacher ? 'Guru Kelas (Aktif)' : 'Set Guru Kelas'}</span>
                </button>
              </div>
            </div>
          );
        })}

        {filteredTeachers.length === 0 && (
          <div className="col-span-full bg-white border border-slate-200 rounded-3xl p-10 text-center space-y-3">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">Data guru tidak ditemukan.</p>
            <p className="text-xs text-slate-500">Coba kata kunci lain atau tambahkan data guru baru.</p>
          </div>
        )}
      </div>

      {/* Modal Add / Edit Teacher */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] overflow-y-auto flex items-center justify-center p-3 sm:p-4">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden text-xs text-slate-800">
            <div className="bg-slate-900 p-4 border-b border-slate-800 flex items-center justify-between text-white">
              <h3 className="font-extrabold text-sm text-white flex items-center space-x-2">
                <UserPlus className="w-4 h-4 text-emerald-400" />
                <span>{editingId ? 'Edit Data Guru & NIP' : 'Tambah Data Guru Baru'}</span>
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-4 space-y-3 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="text-slate-800 font-bold block mb-1">Nama Lengkap & Gelar *</label>
                <input
                  type="text"
                  value={formNama}
                  onChange={e => setFormNama(e.target.value)}
                  placeholder="misal: Jaenal Maskun, S.Pd.I."
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="text-slate-800 font-bold block mb-1">NIP Resmi (Nomor Induk Pegawai)</label>
                <input
                  type="text"
                  value={formNip}
                  onChange={e => setFormNip(e.target.value)}
                  placeholder="misal: 19850314 201001 1 012"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-800 font-bold block mb-1">Jabatan / Guru Kelas / Mapel *</label>
                <input
                  type="text"
                  value={formJabatan}
                  onChange={e => setFormJabatan(e.target.value)}
                  placeholder="misal: Guru Kelas III / Guru Mapel PAI"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-800 font-bold block mb-1">No. HP / WhatsApp (Opsional)</label>
                  <input
                    type="text"
                    value={formKontak}
                    onChange={e => setFormKontak(e.target.value)}
                    placeholder="0812xxxx"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-slate-800 font-bold block mb-1">Email Resmi (Opsional)</label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={e => setFormEmail(e.target.value)}
                    placeholder="guru@kemenag.go.id"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold border border-slate-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-5 py-2 rounded-xl text-xs shadow-xs"
                >
                  Simpan Data Guru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirm Delete Teacher */}
      {teacherToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[70] overflow-y-auto flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl p-5 space-y-4">
            <div className="flex items-center space-x-3 text-rose-600">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">Konfirmasi Hapus Data Guru</h3>
                <p className="text-[11px] text-slate-500 font-medium">Tindakan ini tidak dapat dibatalkan.</p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-1 text-xs">
              <p className="font-extrabold text-slate-900 text-sm">{teacherToDelete.nama}</p>
              <p className="text-[11px] text-slate-600">
                <span className="font-bold">Jabatan:</span> {teacherToDelete.jabatanAtauKelas}
              </p>
              <p className="text-[11px] font-mono text-slate-500">
                <span className="font-sans font-bold">NIP:</span> {teacherToDelete.nip || '-'}
              </p>
            </div>

            {(ttd.kepalaMadrasahNama === teacherToDelete.nama || ttd.guruKelasNama === teacherToDelete.nama) && (
              <div className="p-2.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-[11px] font-medium leading-relaxed">
                ⚠️ Guru ini saat ini terdaftar sebagai penandatangan aktif. Menghapus data ini juga akan mereset status penandatangan di TTD dokumen.
              </div>
            )}

            <div className="pt-2 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setTeacherToDelete(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 transition-all"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteTeacher}
                className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold px-4 py-2 rounded-xl text-xs shadow-md transition-all flex items-center space-x-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Ya, Hapus Data Guru</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
