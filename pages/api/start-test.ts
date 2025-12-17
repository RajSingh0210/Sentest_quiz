import type { NextApiRequest, NextApiResponse } from 'next';
import { generateScenario } from '@/lib/scenarioGenerator';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const scenario = generateScenario();

  // Do not send the exact correct PBO to the client; keep only the internal % change.
  const { 'Correct PBO Under Sensitivity': _ignored, ...response } = scenario;

  res.status(200).json(response);
}
