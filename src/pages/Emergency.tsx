import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPatient } from '../lib/storage';
import { logBreakGlassOnChain, isMonadConfigured } from '../lib/monad';
import type { EmergencyData, BreakGlassReason } from '../lib/types';

const REASONS: { value: BreakGlassReason; label: string }[] = [
  { value: 'IGD', label: 'Emergency Room (IGD)' },
  { value: 'AMBULANS', label: 'Ambulance' },
  { value: 'EVENT', label: 'Event / Gathering' },
  { value: 'LAINNYA', label: 'Other' },
];

// Session duration (seconds). Default: 2 hours (7200).
// For demo: set VITE_SESSION_DURATION_SECONDS="60" in .env.local
const SESSION_DURATION = parseInt(
  import.meta.env.VITE_SESSION_DURATION_SECONDS || '7200',
  10,
);

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
  const [timeLeft, setTimeLeft] = useState(SESSION_DURATION);
  const [openedAt, setOpenedAt] = useState<Date | null>(null);
  const autoLoggedRef = useRef(false);

  useEffect(() => {
    async function load() {
      const p = await getPatient(id);
      if (!p) setError('Patient data not found.');
      else setPatient(p);
    }
    load();
  }, [id]);

  // Countdown timer while unlocked
  useEffect(() => {
    if (stage !== 'unlocked') return;
    if (timeLeft <= 0) {
      setStage('locked');
      setError('Session expired. Data has been locked again.');
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [stage, timeLeft]);

  // Auto-log to Monad when first unlocked
  useEffect(() => {
    if (stage !== 'unlocked' || !patient || autoLoggedRef.current) return;
    autoLoggedRef.current = true;
    setOpenedAt(new Date());

    if (!isMonadConfigured()) {
      setMonadStatus('failed');
      return;
    }

    async function logToMonad() {
      setMonadStatus('loading');
      const dataHash = JSON.stringify({
        allergies: patient!.allergies,
        conditions: patient!.conditions,
        meds: patient!.meds,
        bloodType: patient!.bloodType,
      });
      const tx = await logBreakGlassOnChain(patient!.id, dataHash, reason);
      if (tx) {
        setMonadStatus('success');
        setMonadTx(tx);
      } else {
        setMonadStatus('failed');
      }
    }
    logToMonad();
  }, [stage, patient, reason]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (error && !patient) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-5xl mb-4">🔒</div>
          <p className="text-lg text-red-600 font-semibold">{error}</p>
          <p className="mt-2 text-sm text-zinc-500">
            Make sure the QR is valid or the data exists on this server.
          </p>
          <Link
            to="/"
            className="mt-6 inline-block rounded-xl bg-teal-600 px-6 py-3 text-white font-semibold"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
        <p className="text-zinc-500">Loading...</p>
      </div>
    );
  }

  const age = patient.birthYear
    ? new Date().getFullYear() - patient.birthYear
    : null;
  const initials = patient.fullName.slice(0, 2).toUpperCase();

  // STAGE 1: LOCKED
  if (stage === 'locked') {
    return (
      <div className="min-h-screen bg-zinc-50 px-4 py-8">
        <div className="mx-auto max-w-lg text-center">
          <Link to="/" className="mb-4 inline-block text-sm text-zinc-500">
            ← Back
          </Link>

          <div className="mb-6 flex justify-center">
            <div className="h-24 w-24 rounded-full bg-teal-100 flex items-center justify-center text-3xl font-bold text-teal-700">
              {initials}
            </div>
          </div>

          <h1 className="text-2xl font-bold text-zinc-900">
            {patient.fullName}
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            {age ? `${age} years old` : 'Age not set'} · Blood Type{' '}
            {patient.bloodType}
          </p>

          {error && (
            <p className="mt-4 rounded-lg border-l-4 border-amber-500 bg-amber-50 px-3 py-2 text-sm text-amber-700">
              {error}
            </p>
          )}

          <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold tracking-widest text-zinc-500 uppercase">
              🔒 Critical Data Locked
            </p>
            <p className="mt-2 text-sm text-zinc-600">
              Only emergency responders can unlock this data.
            </p>
            <button
              onClick={() => setStage('break')}
              className="mt-6 w-full h-16 rounded-xl bg-teal-600 text-white font-semibold text-lg hover:bg-teal-700"
            >
              🔓 Unlock Emergency Data
            </button>
          </div>

          <p className="mt-4 text-xs text-zinc-400">
            NadiPass is not an official medical record.
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
            ← Back
          </button>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h1 className="text-xl font-bold">Unlock Emergency Data</h1>
            <p className="mt-1 text-xs text-zinc-500">
              2 taps. Data opens without an account.
            </p>

            <div className="mt-6">
              <h2 className="text-sm font-semibold mb-3">
                Reason for unlocking:
              </h2>
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
                I am unlocking this because of an emergency.
              </span>
            </label>

            <button
              onClick={() => {
                if (confirmed) setStage('unlocked');
              }}
              disabled={!confirmed}
              className="mt-6 w-full h-16 rounded-xl bg-teal-600 text-white font-semibold text-lg disabled:opacity-50 hover:bg-teal-700"
            >
              Unlock Now
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
        {/* Timer header */}
        <div className="mb-4 flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-zinc-500">⏱ Session expires in</span>
            <span className="font-mono font-bold text-teal-700">
              {formatTime(timeLeft)}
            </span>
          </div>
          <button
            onClick={() => setStage('locked')}
            className="text-xs text-zinc-500 hover:text-red-600"
          >
            Lock now
          </button>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          {/* Patient header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center font-bold text-teal-700">
              {initials}
            </div>
            <div>
              <h1 className="text-lg font-bold">{patient.fullName}</h1>
              <p className="text-xs text-zinc-500">
                {age ? `${age} years old` : ''} · {patient.bloodType}
              </p>
            </div>
          </div>

          {/* ALLERGIES — top priority */}
          <div className="rounded-xl border-l-4 border-red-500 bg-red-50 p-4 mb-4">
            <p className="text-xs font-bold text-red-700 uppercase tracking-wider">
              ⚠️ Allergies
            </p>
            <p className="mt-1 text-2xl font-bold text-red-800">
              {patient.allergies.join(', ')}
            </p>
          </div>

          {/* Other info */}
          <div className="space-y-3">
            {patient.conditions.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase">
                  Chronic Conditions
                </p>
                <p className="text-sm text-zinc-800">
                  {patient.conditions.join(', ')}
                </p>
              </div>
            )}
            {patient.meds.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase">
                  Routine Medications
                </p>
                <p className="text-sm text-zinc-800">
                  {patient.meds.join(', ')}
                </p>
              </div>
            )}
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase">
                Emergency Contacts
              </p>
              {patient.contacts.map((c, i) => (
                <p key={i} className="text-sm text-zinc-800">
                  {c.name} ·{' '}
                  <a
                    href={`tel:${c.phone}`}
                    className="text-teal-600 underline"
                  >
                    {c.phone}
                  </a>
                </p>
              ))}
            </div>
            {patient.notes && (
              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase">
                  Notes
                </p>
                <p className="text-sm text-zinc-800">{patient.notes}</p>
              </div>
            )}
          </div>

          {/* Contact notification banner */}
          <div className="mt-4 rounded-xl bg-teal-50 border-l-4 border-teal-500 p-3">
            <p className="text-xs text-teal-800">
              ✓ Emergency contact has been notified (simulated).
            </p>
          </div>

          {/* Auto-log Monad status */}
          <div className="mt-4 rounded-xl border border-zinc-200 p-3">
            <p className="text-xs text-zinc-500 mb-2">
              Audit trail (Monad testnet):
            </p>
            {monadStatus === 'loading' && (
              <p className="text-sm text-zinc-600">⏳ Recording...</p>
            )}
            {monadStatus === 'success' && (
              <div>
                <p className="text-sm text-teal-700 font-semibold">
                  ✓ Recorded on Monad
                </p>
                <p className="text-xs text-zinc-400 mt-1 break-all">
                  {monadTx}
                </p>
              </div>
            )}
            {monadStatus === 'failed' && (
              <p className="text-sm text-amber-700">
                ⚠️ Failed to record (data remains accessible)
              </p>
            )}
            {openedAt && (
              <p className="text-xs text-zinc-400 mt-2">
                Opened: {openedAt.toLocaleString('en-US')} · Reason: {reason}
              </p>
            )}
          </div>

          {/* Disclaimer */}
          <p className="mt-4 text-xs text-zinc-400">
            Data is self-reported by the patient. May not be medically verified.
          </p>
        </div>
      </div>
    </div>
  );
}