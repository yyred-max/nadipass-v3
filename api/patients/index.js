import { sql } from '../db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { id, fullName, birthYear, bloodType, allergies, conditions, meds, contacts, notes } = req.body;

  if (!id || !fullName || !bloodType) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    await sql`
      INSERT INTO patients (id, full_name, birth_year, blood_type, allergies, conditions, meds, contacts, notes)
      VALUES (${id}, ${fullName}, ${birthYear ?? null}, ${bloodType}, ${allergies ?? []}, ${conditions ?? []}, ${meds ?? []}, ${JSON.stringify(contacts ?? [])}, ${notes ?? null})
    `;
    return res.status(201).json({ success: true, id });
  } catch (err) {
    console.error('[api] insert failed:', err);
    return res.status(500).json({ error: 'Database error', detail: String(err) });
  }
}