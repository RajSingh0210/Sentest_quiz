import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    routes: [
      '/api',
      '/api/start-test',
      '/api/validate',
      '/api/qr',
      '/api/routes',
      '/test'
    ]
  });
}
