# NadiPass v3

**Identitas darurat pasien. Petugas scan QR, data kritis muncul, keluarga langsung tahu.**

Hybrid Web2 + Web3 untuk 5 menit pertama saat pasien tidak sadar.

## Fitur

- Pasien isi data kritis sekali (alergi, obat, kontak) → tersimpan di localStorage
- QR berisi ID saja (bukan data medis)
- Petugas scan → 2 tap pecah kaca → data kritis terbuka
- Setiap akses tercatat di Monad testnet (hash audit)
- Data medis tidak on-chain — privasi terjaga

## Stack

- **Frontend:** Vite + React + TypeScript + Tailwind v4
- **Web3:** viem + Monad testnet
- **Storage:** localStorage (tanpa backend)
- **Kontrak:** Solidity 0.8.20 (`NadiPassRegistry`)

## Halaman

| Route | Fungsi |
|-------|--------|
| `/` | Beranda |
| `/daftar` | Form data kritis |
| `/qr` | Kartu QR + list pasien |
| `/e/:id` | Layar pecah kaca (petugas) |

## Setup

```bash
npm install
npm run dev