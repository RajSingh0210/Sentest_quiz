import type { NextApiRequest, NextApiResponse } from 'next';

interface ValidateRequest {
  scenario_id: string;
  user_pbo: number;
  base_pbo: number;
  internal_pct_change: number;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { scenario_id, user_pbo, base_pbo, internal_pct_change }: ValidateRequest = req.body;

  if (!scenario_id || user_pbo === undefined || base_pbo === undefined || internal_pct_change === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const basePbo = Number(base_pbo);
  const internalPct = Number(internal_pct_change);

  if (!Number.isFinite(basePbo) || !Number.isFinite(internalPct)) {
    return res.status(400).json({ error: 'Invalid scenario values' });
  }

  // Compute the correct PBO using the internal percentage change used when generating the scenario.
  const correct_pbo = Math.round(basePbo * (1 + internalPct / 100));

  // Clamp incoming user_pbo to ±25% of base to align with UI constraints.
  const min = basePbo * 0.75;
  const max = basePbo * 1.25;
  const coercedUserPbo = typeof user_pbo === 'number' ? user_pbo : Number(user_pbo);
  const safeUserPbo = Math.min(Math.max(coercedUserPbo, min), max);

  const pct_diff = Math.abs(safeUserPbo - correct_pbo) / correct_pbo * 100;
  const result = pct_diff <= 0.5 ? 'Correct' : 'Incorrect';

  res.status(200).json({
    result,
    correct_pbo,
    percentage_difference: Math.round(pct_diff * 10000) / 10000,
  });
}
