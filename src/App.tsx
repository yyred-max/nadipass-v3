import { Link, Routes, Route } from 'react-router-dom';
import logo from './assets/logoNadipass.png';
import mascot from './assets/mascot.png';
import Home from './pages/Home';
import Daftar from './pages/Daftar';
import QRPage from './pages/QR';
import Scan from './pages/Scan';
import Emergency from './pages/Emergency';

export default function App() {
  return (
    <div className="app min-h-screen flex flex-col bg-zinc-50">
      <header className="bg-white border-b border-zinc-200 px-4 py-3">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="NadiPass" className="h-16 w-auto" />
          </Link>
          <nav className="flex gap-4 text-sm">
            <Link to="/" className="text-zinc-700 hover:text-teal-700">
              Home
            </Link>
            <Link to="/daftar" className="text-zinc-700 hover:text-teal-700">
              Register
            </Link>
            <Link to="/qr" className="text-zinc-700 hover:text-teal-700">
              QR Card
            </Link>
            <Link to="/scan" className="text-zinc-700 hover:text-teal-700">
              Scan
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/daftar" element={<Daftar />} />
          <Route path="/qr" element={<QRPage />} />
          <Route path="/scan" element={<Scan />} />
          <Route path="/e/:id" element={<Emergency />} />
        </Routes>
      </main>

      <footer className="bg-white border-t border-zinc-200 px-4 py-4 text-center text-xs text-zinc-400">
        <div className="mx-auto max-w-4xl flex items-center justify-center gap-2">
          <img src={mascot} alt="Nadi" className="h-6 w-6" />
          <span>Track Monad Metropolis 2026</span>
        </div>
      </footer>
    </div>
  );
}