
import { sql } from '../db.js';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'ID required' });

  try {
    const rows = await sql`
      SELECT id, full_name as "fullName", birth_year as "birthYear",
             blood_type as "bloodType", allergies, conditions, meds,
             contacts, notes, created_at as "createdAt"
      FROM patients
      WHERE id = ${id}
      LIMIT 1
    `;
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json(rows[0]);
  } catch (err) {
    console.error('[api] select failed:', err);
    return res.status(500).json({ error: 'Database error' });
  }
}