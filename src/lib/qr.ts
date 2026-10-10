import QRCode from 'qrcode';

export async function encodeQrDataUrl(
  text: string,
  opts?: { size?: number },
): Promise<string> {
  return QRCode.toDataURL(text, {
    width: opts?.size ?? 300,
    margin: 1,
  });
}

export function buildPatientUrl(id: string): string {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/e/${id}`;
  }
  return `https://nadipass.app/e/${id}`;
}