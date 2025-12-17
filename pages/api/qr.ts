import type { NextApiRequest, NextApiResponse } from 'next';
import QRCode from 'qrcode';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const testUrl = `${req.headers.origin || 'http://localhost:3000'}/test`;
    const qrCodeDataUrl = await QRCode.toDataURL(testUrl);

    const base64Data = qrCodeDataUrl.replace(/^data:image\/png;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    res.setHeader('Content-Type', 'image/png');
    res.status(200).send(buffer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
}
