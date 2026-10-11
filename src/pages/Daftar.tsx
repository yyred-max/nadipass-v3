import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { savePatient } from '../lib/storage';
import { generateId, BLOOD_TYPES } from '../lib/types';
import type { EmergencyData, BloodType } from '../lib/types';

const CONDITIONS = ['Diabetes', 'Asthma', 'Epilepsy', 'Cardiac', 'Other'];

const PHONE_REGEX = /^08\d{8,12}$/;

function normalizePhone(phone: string): string {
  let p = phone.replace(/[\s-]/g, '');
  if (p.startsWith('+62')) p = '0' + p.slice(3);
  if (p.startsWith('62')) p = '0' + p.slice(2);
  return p;
}

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
      setError('This allergy already exists.');
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
      setError('This medication already exists.');
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
      setError('Maximum 3 contacts.');
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

    // ===== VALIDATE FULL NAME =====
    const nameTrimmed = fullName.trim();
    if (!nameTrimmed) {
      setError('Full name is required.');
      return;
    }
    if (nameTrimmed.length < 2) {
      setError('Full name must be at least 2 characters.');
      return;
    }

    // ===== VALIDATE YEAR OF BIRTH (optional, must be valid if filled) =====
    if (birthYear) {
      const year = parseInt(birthYear, 10);
      const currentYear = new Date().getFullYear();
      if (isNaN(year) || year < 1900 || year > currentYear) {
        setError(`Tahun lahir harus antara 1900 dan ${currentYear}.`);
        return;
      }
    }

    // ===== VALIDATE ALLERGIES (REQUIRED) =====
    // Minimal 1 alergi, atau user ketik "None"
    // (already handled: if empty, we set ['Tidak ada'] di data)

    // ===== VALIDATE BLOOD TYPE =====
    if (!bloodType) {
      setError('Blood type is required.');
      return;
    }

    // ===== VALIDATE EMERGENCY CONTACTS =====
    for (let i = 0; i < contacts.length; i++) {
      const name = contacts[i].name.trim();
      const phoneRaw = contacts[i].phone.trim();
      const phone = normalizePhone(phoneRaw);

      // Skip contact that is completely empty (except first contact)
      if (!name && !phoneRaw && i > 0) continue;

      // Name is required
      if (!name) {
        setError(`Nama kontak ${i + 1} wajib diisi.`);
        return;
      }
      if (name.length < 2) {
        setError(`Nama kontak ${i + 1} minimal 2 karakter.`);
        return;
      }

      // Phone is required
      if (!phoneRaw) {
        setError(`Nomor HP kontak ${i + 1} wajib diisi.`);
        return;
      }

      // Phone format
      if (!PHONE_REGEX.test(phone)) {
        setError(
          `Contact {i + 1} phone format is invalid. Must be 08xx (10-13 digits). Example: 08123456789`,
        );
        return;
      }
    }

    const validContacts = contacts
      .map((c) => ({
        name: c.name.trim(),
        phone: normalizePhone(c.phone.trim()),
      }))
      .filter((c) => c.name && c.phone);

    if (validContacts.length === 0) {
      setError('At least 1 complete emergency contact (name + valid phone).');
      return;
    }

    // ===== BUILD DATA =====
    const id = generateId();
    const data: EmergencyData = {
      id,
      fullName: nameTrimmed,
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

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <Link to="/" className="mb-4 inline-block text-sm text-zinc-500">
          ← Back
        </Link>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h1 className="text-xl font-bold">Enter Critical Data</h1>
          <p className="mt-1 text-xs text-zinc-500">
            Data is stored securely on the server. Responders can access it from their devices.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            {/* Identitas */}
            <div>
              <h2 className="text-sm font-semibold text-zinc-800 mb-2">
                Identitas <span className="text-red-600">*</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Full Name (required)"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  maxLength={60}
                  required
                  className="sm:col-span-2 rounded-xl border border-zinc-300 px-4 py-3 text-base focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none"
                />
                <input
                  type="number"
                  placeholder={`Year of Birth`}
                  value={birthYear}
                  onChange={(e) => setBirthYear(e.target.value.slice(0, 4))}
                  min="1900"
                  max={currentYear}
                  className="rounded-xl border border-zinc-300 px-4 py-3 text-base focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none"
                />
              </div>
              <p className="mt-1 text-xs text-zinc-400">
                Tahun lahir antara 1900–{currentYear}.
              </p>
            </div>

            {/* Allergies */}
            <div>
              <h2 className="text-sm font-semibold text-zinc-800">
                Allergies <span className="text-red-600">*</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Required. Type &quot;None&quot; if you have no allergies.
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {allergies.map((a, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-800"
                  >
                    {a}
                    <button
                      type="button"
                      onClick={() =>
                        setAllergies(allergies.filter((_, j) => j !== i))
                      }
                      className="hover:text-amber-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addAllergy();
                    }
                  }}
                  placeholder="Allergies..."
                  maxLength={60}
                  className="flex-1 min-w-[120px] rounded-lg border border-zinc-300 px-3 py-2 text-sm"
                />
              </div>
              <button
                type="button"
                onClick={addAllergy}
                className="mt-1 text-xs text-teal-600 hover:underline"
              >
                + Add allergy
              </button>
            </div>

            {/* Chronic Conditions */}
            <div>
              <h2 className="text-sm font-semibold text-zinc-800">
                Chronic Conditions
              </h2>
              <div className="mt-2 flex flex-wrap gap-3">
                {CONDITIONS.map((c) => (
                  <label
                    key={c}
                    className="inline-flex items-center gap-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={conditions.includes(c)}
                      onChange={(e) =>
                        setConditions(
                          e.target.checked
                            ? [...conditions, c]
                            : conditions.filter((x) => x !== c),
                        )
                      }
                      className="h-4 w-4 rounded border-zinc-300 text-teal-600"
                    />
                    {c}
                  </label>
                ))}
              </div>
            </div>

            {/* Routine Medications */}
            <div>
              <h2 className="text-sm font-semibold text-zinc-800">Routine Medications</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {meds.map((m, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-3 py-1 text-sm text-violet-800"
                  >
                    {m}
                    <button
                      type="button"
                      onClick={() => setMeds(meds.filter((_, j) => j !== i))}
                      className="hover:text-violet-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  value={newMed}
                  onChange={(e) => setNewMed(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addMed();
                    }
                  }}
                  placeholder="Medication..."
                  maxLength={60}
                  className="flex-1 min-w-[120px] rounded-lg border border-zinc-300 px-3 py-2 text-sm"
                />
              </div>
              <button
                type="button"
                onClick={addMed}
                className="mt-1 text-xs text-violet-600 hover:underline"
              >
                + Add medication
              </button>
            </div>

            {/* Blood Type */}
            <div>
              <label className="block text-sm font-semibold text-zinc-800 mb-1">
                Blood Type <span className="text-red-600">*</span>
              </label>
              <select
                value={bloodType}
                onChange={(e) => setBloodType(e.target.value as BloodType | '')}
                required
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-base"
              >
                <option value="">Select...</option>
                {BLOOD_TYPES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Emergency Contacts */}
            <div>
              <h2 className="text-sm font-semibold text-zinc-800">
                Emergency Contacts <span className="text-red-600">*</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Minimum 1, maximum 3. Phone: 08xx (10-13 digits).
              </p>
              <div className="mt-2 space-y-3">
                {contacts.map((c, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                  >
                    <input
                      value={c.name}
                      onChange={(e) =>
                        updateContact(i, 'name', e.target.value)
                      }
                      placeholder="Name (required)"
                      maxLength={60}
                      className="rounded-xl border border-zinc-300 px-4 py-3 text-base"
                    />
                    <input
                      value={c.phone}
                      onChange={(e) => {
                        // Hanya angka, max 14 digit
                        const cleaned = e.target.value
                          .replace(/\D/g, '')
                          .slice(0, 14);
                        updateContact(i, 'phone', cleaned);
                      }}
                      placeholder="08123456789"
                      inputMode="numeric"
                      maxLength={14}
                      className="rounded-xl border border-zinc-300 px-4 py-3 text-base"
                    />
                    {contacts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeContact(i)}
                        className="text-xs text-red-600 sm:col-span-2 text-left"
                      >
                        Remove this contact
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {contacts.length < 3 && (
                <button
                  type="button"
                  onClick={addContact}
                  className="mt-2 text-xs text-teal-600 hover:underline"
                >
                  + Add contact
                </button>
              )}
            </div>

            {/* Catatan */}
            <div>
              <label className="block text-sm font-semibold text-zinc-800 mb-1">
                Notes (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., uses a hearing aid"
                rows={3}
                maxLength={500}
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
              {saving ? 'Saving...' : 'Save & Generate QR'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}