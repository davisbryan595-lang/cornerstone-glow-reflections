export async function uploadText(path: string, text: string, access: 'public' | 'private' = 'public') {
  const res = await fetch('/api/blob', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path, content: text, access }),
  });

  const payload = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(payload.error || res.statusText || 'Upload failed');
  return payload;
}
