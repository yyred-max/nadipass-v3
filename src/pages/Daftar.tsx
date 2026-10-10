import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { savePatient } from '../lib/storage';
import { generateId, BLOOD_TYPES } from '../lib/types';
import type { EmergencyData, BloodType } from '../lib/types';

const CONDITIONS = ['Diabetes', 'Asma', 'Epilepsi', 'Jantung', 'Lainnya'];

export default function Daftar() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [bloodType, setBloodType] = useState<BloodType | ''>('');
  const [allergies, setAllergies] = useState<string[]>([]);
  const [newAllergy, setNewAllergy] = useState('');
  const [conditions, setConditions] = useState<string[]>([]);
  const [meds, setMeds] = useState<string[]>([]);
  const [newMed, setNewMed] = useState('');
  const [contacts, setContacts] = useState([{ name: '', phone: '' }]);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const addAllergy = () => {
    const t = newAllergy.trim();
    if (!t) return;
    if (allergies.some((a) => a.toLowerCase() === t.toLowerCase())) {
      setError('Alergi ini sudah ada.');
      return;
    }
    setAllergies([...allergies, t]);
    setNewAllergy('');
    setError('');
  };

  const addMed = () => {
    const t = newMed.trim();
    if (!t) return;
    if (meds.some((m) => m.toLowerCase() === t.toLowerCase())) {
      setError('Obat ini sudah ada.');
      return;
    }
    setMeds([...meds, t]);
    setNewMed('');
    setError('');
  };

  const updateContact = (i: number, field: 'name' | 'phone', value: string) => {
    setContacts(contacts.map((c, j) => (j === i ? { ...c, [field]: value } : c)));
  };

  const addContact = () => {
    if (contacts.length >= 3) {
      setError('Maksimal 3 kontak.');
      return;
    }
    setContacts([...contacts, { name: '', phone: '' }]);
  };

  const removeContact = (i: number) => {
    setContacts(contacts.filter((_, j) => j !== i));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validContacts = contacts.filter((c) => c.name.trim() && c.phone.trim());
    if (!bloodType) {
      setError('Golongan darah wajib diisi.');
      return;
    }
    if (validContacts.length === 0) {
      setError('Minimal 1 kontak darurat lengkap.');
      return;
    }

    const id = generateId();
    const data: EmergencyData = {
      id,
      fullName: fullName.trim() || 'Tanpa Nama',
      birthYear: birthYear ? parseInt(birthYear, 10) : undefined,
      bloodType,
      allergies: allergies.length > 0 ? allergies : ['Tidak ada'],
      conditions,
      meds,
      contacts: validContacts,
      notes: notes.trim() || undefined,
      createdAt: Date.now(),
    };

    setSaving(true);
    try {
      await savePatient(data);
      navigate(`/qr?id=${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan data');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <Link to="/" className="mb-4 inline-block text-sm text-zinc-500">
          ← Kembali
        </Link>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h1 className="text-xl font-bold">Isi Data Kritis</h1>
          <p className="mt-1 text-xs text-zinc-500">
            Data tersimpan di server. Bisa diakses petugas dari HP mereka.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            {/* Identitas */}
            <div>
              <h2 className="text-sm font-semibold text-zinc-800 mb-2">Identitas</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Nama Lengkap"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="sm:col-span-2 rounded-xl border border-zinc-300 px-4 py-3 text-base focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none"
                />
                <input
                  type="number"
                  placeholder="Tahun Lahir"
                  value={birthYear}
                  onChange={(e) => setBirthYear(e.target.value)}
                  min="1900"
                  max="2025"
                  className="rounded-xl border border-zinc-300 px-4 py-3 text-base focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none"
                />
              </div>
            </div>

            {/* Alergi */}
            <div>
              <h2 className="text-sm font-semibold text-zinc-800">Alergi (wajib diisi)</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {allergies.map((a, i) => (
                  <span key={i} className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-800">
                    {a}
                    <button type="button" onClick={() => setAllergies(allergies.filter((_, j) => j !== i))} className="hover:text-amber-600">×</button>
                  </span>
                ))}
                <input
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') { e.preventDefault(); addAllergy(); }
                  }}
                  placeholder="Alergi..."
                  className="flex-1 min-w-[120px] rounded-lg border border-zinc-300 px-3 py-2 text-sm"
                />
              </div>
              <button type="button" onClick={addAllergy} className="mt-1 text-xs text-teal-600 hover:underline">+ Tambah alergi</button>
            </div>

            {/* Penyakit Kronis */}
            <div>
              <h2 className="text-sm font-semibold text-zinc-800">Penyakit Kronis</h2>
              <div className="mt-2 flex flex-wrap gap-3">
                {CONDITIONS.map((c) => (
                  <label key={c} className="inline-flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={conditions.includes(c)}
                      onChange={(e) => setConditions(e.target.checked ? [...conditions, c] : conditions.filter((x) => x !== c))}
                      className="h-4 w-4 rounded border-zinc-300 text-teal-600"
                    />
                    {c}
                  </label>
                ))}
              </div>
            </div>

            {/* Obat Rutin */}
            <div>
              <h2 className="text-sm font-semibold text-zinc-800">Obat Rutin</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {meds.map((m, i) => (
                  <span key={i} className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-3 py-1 text-sm text-violet-800">
                    {m}
                    <button type="button" onClick={() => setMeds(meds.filter((_, j) => j !== i))} className="hover:text-violet-600">×</button>
                  </span>
                ))}
                <input
                  value={newMed}
                  onChange={(e) => setNewMed(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') { e.preventDefault(); addMed(); }
                  }}
                  placeholder="Obat rutin..."
                  className="flex-1 min-w-[120px] rounded-lg border border-zinc-300 px-3 py-2 text-sm"
                />
              </div>
              <button type="button" onClick={addMed} className="mt-1 text-xs text-violet-600 hover:underline">+ Tambah obat</button>
            </div>

            {/* Golongan Darah */}
            <div>
              <label className="block text-sm font-semibold text-zinc-800 mb-1">Golongan Darah</label>
              <select
                value={bloodType}
                onChange={(e) => setBloodType(e.target.value as BloodType | '')}
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-base"
              >
                <option value="">Pilih...</option>
                {BLOOD_TYPES.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Kontak Darurat */}
            <div>
              <h2 className="text-sm font-semibold text-zinc-800">Kontak Darurat</h2>
              <p className="text-xs text-zinc-400 mt-1">Minimal 1, maksimal 3.</p>
              <div className="mt-2 space-y-3">
                {contacts.map((c, i) => (
                  <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      value={c.name}
                      onChange={(e) => updateContact(i, 'name', e.target.value)}
                      placeholder="Nama (wajib)"
                      className="rounded-xl border border-zinc-300 px-4 py-3 text-base"
                    />
                    <input
                      value={c.phone}
                      onChange={(e) => updateContact(i, 'phone', e.target.value)}
                      placeholder="No. HP"
                      className="rounded-xl border border-zinc-300 px-4 py-3 text-base"
                    />
                    {contacts.length > 1 && (
                      <button type="button" onClick={() => removeContact(i)} className="text-xs text-red-600 sm:col-span-2 text-left">
                        Hapus kontak ini
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {contacts.length < 3 && (
                <button type="button" onClick={addContact} className="mt-2 text-xs text-teal-600 hover:underline">+ Tambah kontak</button>
              )}
            </div>

            {/* Catatan */}
            <div>
              <label className="block text-sm font-semibold text-zinc-800 mb-1">Catatan Singkat (opsional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: pakai alat bantu dengar"
                rows={3}
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-base"
              />
            </div>

            {error && (
              <p className="rounded-lg border-l-4 border-red-500 bg-red-50 px-3 py-2 text-sm text-red-700">
                ⚠️ {error}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full h-14 rounded-xl bg-teal-600 text-white font-semibold text-base hover:bg-teal-700 disabled:opacity-50"
            >
              {saving ? 'Menyimpan...' : 'Simpan & Buat QR'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}