import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPatient } from '../lib/storage';
import { logBreakGlassOnChain, isMonadConfigured } from '../lib/monad';
import type { EmergencyData, BreakGlassReason } from '../lib/types';

const REASONS: { value: BreakGlassReason; label: string }[] = [
  { value: 'IGD', label: 'IGD' },
  { value: 'AMBULANS', label: 'Ambulans' },
  { value: 'EVENT', label: 'Acara / Event' },
  { value: 'LAINNYA', label: 'Lainnya' },
];

type Stage = 'locked' | 'break' | 'unlocked';

export default function Emergency() {
  const { id = '' } = useParams<{ id: string }>();
  const [stage, setStage] = useState<Stage>('locked');
  const [reason, setReason] = useState<BreakGlassReason>('IGD');
  const [confirmed, setConfirmed] = useState(false);
  const [monadStatus, setMonadStatus] = useState<'idle' | 'loading' | 'success' | 'failed'>('idle');
  const [monadTx, setMonadTx] = useState('');
  const [error, setError] = useState('');
  const [patient, setPatient] = useState<EmergencyData | null>(null);

  useEffect(() => {
    const p = getPatient(id);
    if (!p) {
      setError('Data pasien tidak ditemukan.');
    } else {
      setPatient(p);
    }
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-5xl mb-4">🔒</div>
          <p className="text-lg text-red-600 font-semibold">{error}</p>
          <p className="mt-2 text-sm text-zinc-500">
            Pastikan QR valid atau data ada di HP ini.
          </p>
          <Link
            to="/"
            className="mt-6 inline-block rounded-xl bg-teal-600 px-6 py-3 text-white font-semibold"
          >
            Kembali
          </Link>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
        <p className="text-zinc-500">Memuat...</p>
      </div>
    );
  }

  const age = patient.birthYear ? new Date().getFullYear() - patient.birthYear : null;
  const initials = patient.fullName.slice(0, 2).toUpperCase();

  const handleLogMonad = async () => {
    setMonadStatus('loading');
    const dataHash = JSON.stringify({
      allergies: patient.allergies,
      conditions: patient.conditions,
      meds: patient.meds,
      bloodType: patient.bloodType,
    });
    const tx = await logBreakGlassOnChain(patient.id, dataHash, reason);
    if (tx) {
      setMonadStatus('success');
      setMonadTx(tx);
    } else {
      setMonadStatus('failed');
    }
  };

  // STAGE 1: LOCKED
  if (stage === 'locked') {
    return (
      <div className="min-h-screen bg-zinc-50 px-4 py-8">
        <div className="mx-auto max-w-lg text-center">
          <Link to="/" className="mb-4 inline-block text-sm text-zinc-500">
            ← Kembali
          </Link>

          <div className="mb-6 flex justify-center">
            <div className="h-24 w-24 rounded-full bg-teal-100 flex items-center justify-center text-3xl font-bold text-teal-700">
              {initials}
            </div>
          </div>

          <h1 className="text-2xl font-bold text-zinc-900">{patient.fullName}</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {age ? `${age} tahun` : 'Umur belum diisi'} · Gol. Darah {patient.bloodType}
          </p>

          <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold tracking-widest text-zinc-500 uppercase">
              🔒 Data kritis terkunci
            </p>
            <p className="mt-2 text-sm text-zinc-600">
              Hanya petugas darurat yang bisa membuka.
            </p>
            <button
              onClick={() => setStage('break')}
              className="mt-6 w-full h-16 rounded-xl bg-teal-600 text-white font-semibold text-lg hover:bg-teal-700"
            >
              🔓 Buka Data Darurat
            </button>
          </div>

          <p className="mt-4 text-xs text-zinc-400">
            NadiPass bukan rekam medis resmi.
          </p>
        </div>
      </div>
    );
  }

  // STAGE 2: BREAK GLASS
  if (stage === 'break') {
    return (
      <div className="min-h-screen bg-zinc-50 px-4 py-8">
        <div className="mx-auto max-w-lg">
          <button
            onClick={() => setStage('locked')}
            className="mb-4 text-sm text-zinc-500"
          >
            ← Kembali
          </button>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h1 className="text-xl font-bold">Buka Data Darurat</h1>
            <p className="mt-1 text-xs text-zinc-500">2 tap. Data terbuka tanpa akun.</p>

            <div className="mt-6">
              <h2 className="text-sm font-semibold mb-3">Alasan membuka:</h2>
              <div className="space-y-2">
                {REASONS.map((r) => (
                  <label
                    key={r.value}
                    className="flex items-center gap-3 rounded-xl border p-4 cursor-pointer hover:bg-zinc-50"
                  >
                    <input
                      type="radio"
                      name="reason"
                      value={r.value}
                      checked={reason === r.value}
                      onChange={() => setReason(r.value)}
                      className="h-4 w-4"
                    />
                    <span className="font-medium">{r.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <label className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 cursor-pointer">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="mt-1 h-4 w-4"
              />
              <span className="text-sm text-red-800">
                Saya membuka karena ada darurat.
              </span>
            </label>

            <button
              onClick={() => {
                if (confirmed) setStage('unlocked');
              }}
              disabled={!confirmed}
              className="mt-6 w-full h-16 rounded-xl bg-teal-600 text-white font-semibold text-lg disabled:opacity-50 hover:bg-teal-700"
            >
              Buka Sekarang
            </button>
          </div>
        </div>
      </div>
    );
  }

  // STAGE 3: UNLOCKED
  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-8">
      <div className="mx-auto max-w-lg">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center font-bold text-teal-700">
              {initials}
            </div>
            <div>
              <h1 className="text-lg font-bold">{patient.fullName}</h1>
              <p className="text-xs text-zinc-500">
                {age ? `${age} thn` : ''} · {patient.bloodType}
              </p>
            </div>
          </div>

          <div className="rounded-xl border-l-4 border-red-500 bg-red-50 p-4 mb-4">
            <p className="text-xs font-bold text-red-700 uppercase tracking-wider">
              ⚠️ Alergi
            </p>
            <p className="mt-1 text-2xl font-bold text-red-800">
              {patient.allergies.join(', ')}
            </p>
          </div>

          <div className="space-y-3">
            {patient.conditions.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase">
                  Penyakit Kronis
                </p>
                <p className="text-sm text-zinc-800">{patient.conditions.join(', ')}</p>
              </div>
            )}
            {patient.meds.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase">
                  Obat Rutin
                </p>
                <p className="text-sm text-zinc-800">{patient.meds.join(', ')}</p>
              </div>
            )}
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase">
                Kontak Darurat
              </p>
              {patient.contacts.map((c, i) => (
                <p key={i} className="text-sm text-zinc-800">
                  {c.name} ·{' '}
                  <a href={`tel:${c.phone}`} className="text-teal-600 underline">
                    {c.phone}
                  </a>
                </p>
              ))}
            </div>
            {patient.notes && (
              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase">Catatan</p>
                <p className="text-sm text-zinc-800">{patient.notes}</p>
              </div>
            )}
          </div>

          <div className="mt-4 rounded-xl bg-teal-50 border-l-4 border-teal-500 p-3">
            <p className="text-xs text-teal-800">✓ Kontak darurat diberi tahu (simulasi).</p>
          </div>

          <div className="mt-4 rounded-xl border border-zinc-200 p-3">
            <p className="text-xs text-zinc-500 mb-2">
              Catat akses ke Monad testnet:
            </p>
            {monadStatus === 'idle' && (
              <button
                onClick={handleLogMonad}
                disabled={!isMonadConfigured()}
                className="w-full h-11 rounded-lg bg-zinc-900 text-white text-sm font-semibold hover:bg-zinc-800 disabled:opacity-50"
              >
                📝 Catat di Monad
              </button>
            )}
            {monadStatus === 'loading' && (
              <p className="text-sm text-zinc-600">⏳ Mencatat...</p>
            )}
            {monadStatus === 'success' && (
              <div>
                <p className="text-sm text-teal-700 font-semibold">✓ Tercatat di Monad</p>
                <p className="text-xs text-zinc-400 mt-1 break-all">{monadTx}</p>
              </div>
            )}
            {monadStatus === 'failed' && (
              <p className="text-sm text-amber-700">⚠️ Gagal mencatat (data tetap terbuka)</p>
            )}
          </div>

          <p className="mt-4 text-xs text-zinc-400">
            Data diisi pasien, belum tentu terverifikasi medis.
          </p>
        </div>
      </div>
    </div>
  );
}