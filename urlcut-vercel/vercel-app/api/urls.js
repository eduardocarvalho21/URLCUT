// api/urls.js — GET /api/urls  |  POST /api/urls
import { kv } from '@vercel/kv'
import { nanoid } from 'nanoid'

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  // GET — lista todas as URLs
  if (req.method === 'GET') {
    const slugs = await kv.smembers('slugs')
    if (!slugs || slugs.length === 0) return res.json([])

    const items = await Promise.all(
      slugs.map(async slug => {
        const url = await kv.hgetall(`url:${slug}`)
        if (!url) return null
        const totalClicks = await kv.llen(`clicks:${url.id}`) || 0
        return {
          ...url,
          totalClicks,
          shortUrl: `${process.env.BASE_URL}/${slug}`
        }
      })
    )

    return res.json(
      items
        .filter(Boolean)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    )
  }

  // POST — cria URL
  if (req.method === 'POST') {
    const { original, slug } = req.body

    if (!original) return res.status(400).json({ error: 'URL original é obrigatória' })

    try { new URL(original) } catch {
      return res.status(400).json({ error: 'URL inválida' })
    }

    const finalSlug = slug || nanoid(7)

    const exists = await kv.exists(`url:${finalSlug}`)
    if (exists) return res.status(409).json({ error: 'Slug já em uso, escolha outro' })

    const id = crypto.randomUUID()
    const createdAt = new Date().toISOString()

    await kv.hset(`url:${finalSlug}`, { id, slug: finalSlug, original, createdAt })
    await kv.sadd('slugs', finalSlug)

    return res.status(201).json({
      id, slug: finalSlug, original, createdAt,
      shortUrl: `${process.env.BASE_URL}/${finalSlug}`,
      totalClicks: 0
    })
  }

  return res.status(405).json({ error: 'Método não permitido' })
}
