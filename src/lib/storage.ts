import type { EmergencyData } from './types';

const KEY_PREFIX = 'nadipass:';

export function savePatient(data: EmergencyData): void {
  try {
    localStorage.setItem(KEY_PREFIX + data.id, JSON.stringify(data));
  } catch (err) {
    console.error('[storage] savePatient failed:', err);
    throw err;
  }
}

export function getPatient(id: string): EmergencyData | null {
  try {
    const raw = localStorage.getItem(KEY_PREFIX + id);
    if (!raw) return null;
    return JSON.parse(raw) as EmergencyData;
  } catch (err) {
    console.error('[storage] getPatient failed:', err);
    return null;
  }
}

export function hasPatient(id: string): boolean {
  try {
    return localStorage.getItem(KEY_PREFIX + id) !== null;
  } catch {
    return false;
  }
}

export function deletePatient(id: string): void {
  try {
    localStorage.removeItem(KEY_PREFIX + id);
  } catch (err) {
    console.error('[storage] deletePatient failed:', err);
  }
}

export function listPatientIds(): string[] {
  try {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith(KEY_PREFIX));
    return keys.map((k) => k.slice(KEY_PREFIX.length));
  } catch {
    return [];
  }
}