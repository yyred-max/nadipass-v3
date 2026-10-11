import { Link } from 'react-router-dom';

const EXPLORER_URL =
  'https://testnet.monadvision.com/address/0xf5DD3E72c62928F67db27F479b89900e245215F1';

// ---------- SVG icons (Heroicons) ----------
const CheckIcon = () => (
  <svg
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const EyeIcon = () => (
  <svg
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const ShieldCheckIcon = () => (
  <svg
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const ClockIcon = () => (
  <svg
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);

const DataIcon = () => (
  <svg
    className="h-6 w-6"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M3 10h18" />
    <circle cx="12" cy="16" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

const PasteIcon = () => (
  <svg
    className="h-6 w-6"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <rect x="8" y="3" width="8" height="5" rx="1" fill="currentColor" stroke="none" />
    <path d="M12 12h.01" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const ScanIcon = () => (
  <svg
    className="h-6 w-6"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M3 21l6-6 4 4 8-8" />
    <path d="M15 7h6v6" />
    <circle cx="9" cy="9" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

// ---------- On-chain live dot ----------
const LiveDot = () => (
  <span className="flex items-center gap-2">
    <span aria-hidden="true" className="relative flex h-3 w-3">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
      <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
    </span>
    <span className="text-sm font-semibold text-emerald-400">Live on Monad Testnet</span>
  </span>
);

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* ====== HERO ====== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-50 to-white pb-20 pt-16 sm:pb-28">
        {/* Latar blob teal */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-teal-100/60 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-teal-50/70 blur-3xl"
        />

        <div className="relative mx-auto grid max-w-6xl px-6 lg:grid-cols-2 lg:px-0">
          {/* Kiri: teks */}
          <div className="flex flex-col justify-center px-6 pt-6 sm:pt-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-1.5 text-xs font-semibold text-teal-700">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-teal-500" />
              Powered by Monad
            </div>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
              Responders can access emergency data
              <span className="text-red-600"> even when patients are unconscious.</span>
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-relaxed text-zinc-600">
              Medical data stays on your phone. Only audit hashes go on-chain —
              transparent, immutable, and private.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/daftar"
                className="flex h-14 items-center justify-center rounded-xl bg-teal-600 px-7 text-base font-semibold text-white transition-colors duration-200 hover:bg-teal-700"
              >
                Register Now
              </Link>
              <Link
                to="/qr"
                className="flex h-14 items-center justify-center rounded-xl border-2 border-teal-600 px-7 text-base font-semibold text-teal-700 transition-colors duration-200 hover:bg-teal-50"
              >
                View My QR
              </Link>
            </div>
          </div>

          {/* Kanan: maskot + blob */}
          <div className="relative hidden justify-center lg:flex">
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-[2rem] bg-teal-500/10"
            />
            <div className="relative mx-auto h-64 w-64 sm:h-72 sm:w-72">
              <div className="absolute inset-0 rounded-[2rem] bg-teal-500 shadow-xl shadow-teal-200" />
              <img
                src="/mascot.png"
                alt="Mascot NadiPass"
                className="relative h-full w-full rounded-[2rem] object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ====== ON-CHAIN (Paling penting) ====== */}
      <section className="relative px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Kiri: 4 card */}
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900">
                Every access is recorded on blockchain
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-zinc-600">
                Data medis tetap di HP kamu. Hanya hash audit yang on-chain.
              </p>

              <div className="mt-10 grid gap-6 sm:grid-cols-2">
                {[
                  {
                    n: 'Immutable',
                    t: 'Logs cannot be deleted or modified',
                    d: 'Every access is written to the chain, immutable.',
                    icon: <CheckIcon />,
                  },
                  {
                    n: 'Transparan',
                    t: 'Who, when, why',
                    d: 'Every access records the requester, time, and reason.',
                    icon: <EyeIcon />,
                  },
                  {
                    n: 'Privasi',
                    t: 'Medical data is NOT on-chain',
                    d: 'Only audit hashes go on-chain. Original data stays on your phone.',
                    icon: <ShieldCheckIcon />,
                  },
                  {
                    n: 'Cepat',
                    t: '2 taps to open data',
                    d: 'Critical data appears in seconds, no login required.',
                    icon: <ClockIcon />,
                  },
                ].map((s) => (
                  <div
                    key={s.n}
                    className="rounded-2xl border border-zinc-200 bg-white p-6 transition-shadow duration-200 hover:shadow-md"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                        {s.icon}
                      </span>
                      <div>
                        <span className="text-xs font-semibold text-teal-600">{s.n}</span>
                        <h3 className="mt-1 text-lg font-semibold text-zinc-900">{s.t}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-zinc-500">{s.d}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Kanan: live contract card */}
            <div className="flex flex-col justify-center rounded-2xl border border-teal-200 bg-white p-8 shadow-sm transition-shadow duration-200 hover:shadow-md">
              <div className="flex flex-wrap items-center gap-3">
                <LiveDot />
                <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-700">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Verified
                </span>
              </div>

              <div className="mt-6 rounded-xl bg-zinc-900 px-4 py-4">
                <p className="text-xs font-medium tracking-wider text-zinc-400">Contract Address</p>
                <p className="mt-1 font-mono text-sm text-zinc-100">
                  0xf5DD3E72c62928F67db27F479b89900e245215F1
                </p>
              </div>

              <a
                href={EXPLORER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-teal-700"
              >
                <span aria-hidden="true" className="text-base">
                  &gt;
                </span>
                View on Explorer
              </a>

              <p className="mt-4 text-xs text-zinc-400">
                Verified · 5 tx recorded · all immutable
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ====== CARA KERJA ====== */}
      <section className="px-6 py-16 bg-zinc-50 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold tracking-tight text-zinc-900">
            How It Works
          </h2>
          <p className="mt-3 text-center text-lg leading-relaxed text-zinc-600">
            Two simple steps for responders and families.
          </p>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: <DataIcon />,
                t: 'Fill data once',
                d: 'Allergies, medications, emergency contacts. Saved on your phone.',
              },
              {
                icon: <PasteIcon />,
                t: 'Attach QR',
                d: 'Print an ATM-size card. Keep it in your wallet or phone.',
              },
              {
                icon: <ScanIcon />,
                t: 'Responder scans',
                d: '2 taps, critical data opens. Family is notified.',
              },
            ].map((s) => (
              <div
                key={s.t}
                className="group rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-teal-100 text-teal-700 transition-transform duration-200 group-hover:scale-110">
                  {s.icon}
                </div>
                <h3 className="mt-6 text-lg font-semibold text-zinc-900">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== STATS ====== */}
      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-[2rem] bg-teal-600 px-6 py-16 text-white shadow-lg sm:px-16">
            <div
              aria-hidden="true"
              className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10"
            />
            <div className="relative grid gap-10 text-center sm:grid-cols-3">
              <div>
                <p className="text-5xl font-bold tracking-tight">2</p>
                <p className="mt-2 text-sm font-medium text-teal-100">taps to open data</p>
              </div>
              <div>
                <p className="text-5xl font-bold tracking-tight">&lt; 30 detik</p>
                <p className="mt-2 text-sm font-medium text-teal-100">open time</p>
              </div>
              <div>
                <p className="text-5xl font-bold tracking-tight">100%</p>
                <p className="mt-2 text-sm font-medium text-teal-100">recorded on-chain</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== FOOTER ====== */}
      <footer className="px-6 pb-10 sm:pb-16">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2">
              <img
                src="/logoNadipass.png"
                alt="NadiPass"
                className="h-10 w-auto"
              />
            </div>

            <nav className="flex flex-wrap justify-center gap-6 text-sm">
              <Link
                to="/"
                className="font-medium text-zinc-600 transition-colors duration-200 hover:text-teal-700"
              >
                Beranda
              </Link>
              <Link
                to="/daftar"
                className="font-medium text-zinc-600 transition-colors duration-200 hover:text-teal-700"
              >
                Daftar
              </Link>
              <Link
                to="/qr"
                className="font-medium text-zinc-600 transition-colors duration-200 hover:text-teal-700"
              >
                QR
              </Link>
              <a
                href="https://testnet.monadvision.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-zinc-600 transition-colors duration-200 hover:text-teal-700"
              >
                Monad Explorer
              </a>
              <a
                href="https://github.com/nadipass"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-zinc-600 transition-colors duration-200 hover:text-teal-700"
              >
                GitHub
              </a>
            </nav>
          </div>

          <div className="mt-8 border-t border-zinc-200 pt-8 text-center text-xs text-zinc-400">
            <p>
              NadiPass is not an official medical record. Every access is recorded on Monad
              testnet.
            </p>
            <p className="mt-2">
              {' '}
              © {new Date().getFullYear()} NadiPass · Crafted for Monad
              Metropolis 2026 · Built on testnet
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
