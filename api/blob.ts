export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).end();
  const { path, content, access = 'public' } = req.body || {};
  if (!path || typeof content === 'undefined') return res.status(400).json({ error: 'Missing path or content' });

  try {
    const { put } = await import('@vercel/blob');
    const { url } = await put(path, content, { access });
    return res.status(200).json({ url });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || String(err) });
  }
}
