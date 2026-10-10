import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';

export default function Scan() {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  const handleScanSuccess = (decodedText: string) => {
    const match = decodedText.match(/\/e\/([a-zA-Z0-9]+)/);
    if (match) {
      setSuccess(true);
      setError('');
      stopScanner();
      setTimeout(() => navigate(`/e/${match[1]}`), 800);
    } else {
      setError('QR tidak valid. Pastikan QR dari NadiPass.');
    }
  };

  const startScan = async () => {
    try {
      setError('');
      const scanner = new Html5Qrcode('qr-reader-container');
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        handleScanSuccess,
        () => {}
      );
      setScanning(true);
    } catch (err) {
      setError('Tidak dapat mengakses kamera. Coba upload gambar QR.');
      scannerRef.current = null;
    }
  };

  const stopScanner = async () => {
    const scanner = scannerRef.current;
    if (!scanner) {
      setScanning(false);
      return;
    }
    try {
      if (scanner.isScanning) {
        await scanner.stop();
      }
    } catch (err) {
      // ignore error
    } finally {
      try { scanner.clear(); } catch {}
      scannerRef.current = null;
      setScanning(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setError('');
      const scanner = new Html5Qrcode('qr-reader-container');
      const decoded = await scanner.scanFile(file, false);
      handleScanSuccess(decoded);
    } catch {
      setError('QR tidak terdeteksi. Coba foto ulang dengan jelas.');
    }
  };

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-8">
      <div className="mx-auto max-w-md">
        <Link to="/" className="mb-4 inline-block text-sm text-zinc-500">
          Kembali
        </Link>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h1 className="text-xl font-bold">Scan QR Pasien</h1>
          <p className="mt-1 text-xs text-zinc-500">
            Arahkan kamera ke QR di HP, helm, atau dompet pasien.
          </p>

          {success ? (
            <div className="mt-6 rounded-xl bg-teal-50 border-l-4 border-teal-500 px-4 py-6 text-center">
              <p className="text-lg font-semibold text-teal-700">QR terdeteksi!</p>
              <p className="text-sm text-teal-600 mt-1">Membuka data darurat...</p>
            </div>
          ) : (
            <>
              <div
                id="qr-reader-container"
                className="mt-4 w-full aspect-square rounded-2xl bg-zinc-100 overflow-hidden"
              />

              <div className="mt-4 space-y-3">
                {!scanning ? (
                  <button
                    onClick={startScan}
                    className="w-full h-14 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700"
                  >
                    Mulai Scan
                  </button>
                ) : (
                  <button
                    onClick={stopScanner}
                    className="w-full h-14 rounded-xl bg-zinc-600 text-white font-semibold hover:bg-zinc-700"
                  >
                    Stop Scan
                  </button>
                )}

                <label className="block w-full">
                  <span className="text-xs text-zinc-500 text-center block mb-1">
                    Kamera tidak bisa? Upload gambar QR:
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="block w-full text-xs file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                  />
                </label>
              </div>

              {error && (
                <p className="mt-4 rounded-lg border-l-4 border-red-500 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </p>
              )}
            </>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-zinc-400">
          Petugas tidak perlu login. Data terbuka hanya untuk darurat.
        </p>
      </div>
    </div>
  );
}
