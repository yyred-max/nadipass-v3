import type { EmergencyData } from './types';

const API_BASE = import.meta.env.VITE_API_BASE || '';

export async function savePatient(data: EmergencyData): Promise<void> {
  const res = await fetch(`${API_BASE}/api/patients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to save data');
  }
}

export async function getPatient(id: string): Promise<EmergencyData | null> {
  try {
    const res = await fetch(`${API_BASE}/api/patients/${id}`);
    if (!res.ok) return null;
    const d = await res.json();
    return {
      id: d.id,
      fullName: d.fullName,
      birthYear: d.birthYear,
      bloodType: d.bloodType,
      allergies: d.allergies || [],
      conditions: d.conditions || [],
      meds: d.meds || [],
      contacts: d.contacts || [],
      notes: d.notes,
      createdAt: new Date(d.createdAt).getTime(),
    };
  } catch (err) {
    console.error('[storage] getPatient failed:', err);
    return null;
  }
}

export async function hasPatient(id: string): Promise<boolean> {
  const p = await getPatient(id);
  return p !== null;
}

export async function listPatientIds(): Promise<string[]> {
  return [];
}