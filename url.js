// api/url.js — DELETE /api/urls/:slug
import { kv } from '@vercel/kv'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  if (req.method !== 'DELETE') return res.status(405).json({ error: 'Método não permitido' })

  const slug = req.query.slug
  const url = await kv.hgetall(`url:${slug}`)
  if (!url) return res.status(404).json({ error: 'URL não encontrada' })

  await kv.del(`url:${slug}`)
  await kv.del(`clicks:${url.id}`)
  await kv.srem('slugs', slug)

  return res.json({ message: 'URL removida com sucesso' })
}
