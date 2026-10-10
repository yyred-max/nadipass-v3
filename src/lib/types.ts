export type EmergencyContact = {
  name: string;
  phone: string;
};

export type EmergencyData = {
  id: string;
  fullName: string;
  birthYear?: number;
  bloodType: string;
  allergies: string[];
  conditions: string[];
  meds: string[];
  contacts: EmergencyContact[];
  notes?: string;
  createdAt: number;
};

export type BreakGlassReason = 'IGD' | 'AMBULANS' | 'EVENT' | 'LAINNYA';

export const BLOOD_TYPES = [
  'A Rh+',
  'A Rh-',
  'B Rh+',
  'B Rh-',
  'AB Rh+',
  'AB Rh-',
  'O Rh+',
  'O Rh-',
] as const;

export type BloodType = (typeof BLOOD_TYPES)[number];

export function generateId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < 10; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}