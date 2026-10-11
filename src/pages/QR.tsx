import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import QRCode from 'qrcode';
import { getPatient } from '../lib/storage';
import type { EmergencyData } from '../lib/types';

export default function QRPage() {
  const [params] = useSearchParams();
  const id = params.get('id') || '';
  const [data, setData] = useState<EmergencyData | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [loading, setLoading] = useState(false);

  // Load patient kalau ada id di URL
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    async function load() {
      const p = await getPatient(id);
      setData(p);
      if (p) {
        const url = `${window.location.origin}/e/${id}`;
        QRCode.toDataURL(url, { width: 300, margin: 1 }).then(setQrDataUrl);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  // Kalau tidak ada ID → tampilkan halaman untuk input manual ID
  if (!id) {
    return (
      <div className="min-h-screen bg-zinc-50 px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <Link to="/" className="mb-4 inline-block text-sm text-zinc-500">
            ← Back
          </Link>
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h1 className="text-xl font-bold">Emergency Card</h1>
            <p className="mt-1 text-xs text-zinc-500">
              Enter a patient ID to view the card, or register a new patient.
            </p>

            <div className="mt-6 space-y-3">
              <Link
                to="/daftar"
                className="block w-full rounded-xl bg-teal-600 px-6 py-4 text-white font-semibold text-center hover:bg-teal-700"
              >
                Register New Patient
              </Link>
              <Link
                to="/scan"
                className="block w-full rounded-xl border-2 border-teal-600 px-6 py-4 text-teal-700 font-semibold text-center hover:bg-teal-50"
              >
                📷 Scan Patient QR (Responder)
              </Link>
            </div>

            <div className="mt-6 pt-6 border-t border-zinc-200">
              <p className="text-xs text-zinc-500 text-center">
                For responders: scan a patient's QR from their card, phone, or helmet.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Kalau loading
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
        <p className="text-zinc-500">Loading...</p>
      </div>
    );
  }

  // Kalau data tidak ditemukan
  if (!data) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-zinc-600">Patient data not found.</p>
          <Link to="/daftar" className="mt-4 inline-block rounded-xl bg-teal-600 px-6 py-3 text-white font-semibold">
            Register New Patient
          </Link>
        </div>
      </div>
    );
  }

  // Render kartu
  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <Link to="/" className="mb-4 inline-block text-sm text-zinc-500">
          ← Back
        </Link>

        <div className="rounded-2xl bg-white p-6 shadow-sm text-center">
          <h1 className="text-xl font-bold">Emergency Card</h1>
          <p className="mt-1 text-xs text-zinc-500">Print or keep it in your wallet.</p>

          {/* Kartu ukuran ATM */}
          <div className="mt-6 mx-auto w-[8.5cm] h-[5.4cm] rounded-xl border-2 border-zinc-300 flex overflow-hidden shadow-lg">
            <div className="flex-1 p-3 flex flex-col justify-between bg-gradient-to-br from-teal-50 to-white border-r border-zinc-200">
              <div>
                <p className="text-[10px] font-bold tracking-widest text-teal-700">
                  NADIPASS
                </p>
                <p className="text-[10px] font-bold text-red-600 mt-1 leading-tight">
                  SCAN JIKA
                  <br />
                  TIDAK SADAR
                </p>
              </div>
              {qrDataUrl && (
                <img src={qrDataUrl} alt="QR" className="w-[100px] h-[100px] mx-auto" />
              )}
              <p className="text-[8px] text-zinc-400 text-center">ID: {id}</p>
            </div>
            <div className="flex-1 p-3 flex flex-col justify-between bg-white">
              <div>
                <p className="text-[10px] font-bold text-zinc-700">
                  Name: {data.fullName}
                </p>
                <p className="text-[9px] text-zinc-500 mt-1">
                  Blood: {data.bloodType}
                </p>
              </div>
              <ul className="text-[8px] text-zinc-400 space-y-0.5">
                <li>• Allergies shown when unconscious</li>
                <li>• Family contact is notified automatically</li>
                <li>• Every access is recorded on Monad</li>
              </ul>
            </div>
          </div>

          {/* Tombol */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={() => window.print()}
              className="h-14 rounded-xl bg-teal-600 px-6 text-white font-semibold hover:bg-teal-700"
            >
              Print Card
            </button>
            <Link
              to={`/e/${id}`}
              className="h-14 flex items-center justify-center rounded-xl border-2 border-zinc-300 px-6 text-zinc-700 font-semibold hover:bg-zinc-50"
            >
              View Emergency Page
            </Link>
          </div>

          <p className="mt-4 text-xs text-zinc-400 break-all">
            URL: {window.location.origin}/e/{id}
          </p>
        </div>
      </div>
    </div>
  );
}