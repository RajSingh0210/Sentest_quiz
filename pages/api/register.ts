import type { NextApiRequest, NextApiResponse } from 'next';
import { getSupabaseClient } from '@/lib/supabaseClient';

type RegisterBody = {
  fullName?: string;
  organization?: string;
  phone?: string;
  email?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { fullName, organization, phone, email }: RegisterBody = req.body;

  const phonePattern = /^\+?[0-9\s-]{7,15}$/;
  const emailPattern = /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/i;

  if (!fullName || !phone) {
    return res.status(400).json({ error: 'Full name and phone are required' });
  }
  if (!phonePattern.test(phone)) {
    return res.status(400).json({ error: 'Invalid phone number' });
  }
  if (email && !emailPattern.test(email)) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({ error: 'Supabase environment variables are not set' });
  }

  const tableName = process.env.SUPABASE_TABLE || 'registrations';

  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from(tableName)
      .insert({
        full_name: fullName,
        organization,
        phone,
        email,
        // result not known at registration time; will be filled after quiz
        is_correct: null,
      });

    if (error) {
      console.error('Supabase insert error', { message: error.message, details: error.details });
      return res.status(500).json({ error: 'Failed to save registration' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Supabase insert exception', err);
    return res.status(500).json({ error: 'Unexpected error' });
  }
}
