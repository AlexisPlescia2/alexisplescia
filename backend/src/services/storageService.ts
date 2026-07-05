import { env } from '../config/env'

const BUCKET = 'products'

export async function uploadToStorage(
  buffer: Buffer,
  originalName: string,
  mimeType: string,
): Promise<string> {
  const ext = originalName.split('.').pop() ?? 'jpg'
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const res = await fetch(`${env.SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': mimeType,
      'x-upsert': 'false',
    },
    body: buffer,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Supabase Storage error (${res.status}): ${text}`)
  }

  return `${env.SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`
}

export async function deleteFromStorage(url: string): Promise<void> {
  const prefix = `${env.SUPABASE_URL}/storage/v1/object/public/${BUCKET}/`
  if (!url.startsWith(prefix)) return

  const path = url.slice(prefix.length)
  await fetch(`${env.SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}` },
  })
}
