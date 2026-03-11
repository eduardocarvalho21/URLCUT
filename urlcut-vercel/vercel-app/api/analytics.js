// api/analytics.js — GET /api/urls/:slug/analytics
import { kv } from '@vercel/kv'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const slug = req.query.slug
  const url = await kv.hgetall(`url:${slug}`)
  if (!url) return res.status(404).json({ error: 'URL não encontrada' })

  const rawClicks = await kv.lrange(`clicks:${url.id}`, 0, -1) || []
  const clicks = rawClicks.map(c => typeof c === 'string' ? JSON.parse(c) : c)

  const byDevice = clicks.reduce((acc, c) => {
    const k = c.device || 'Desconhecido'
    acc[k] = (acc[k] || 0) + 1
    return acc
  }, {})

  const byBrowser = clicks.reduce((acc, c) => {
    const k = c.browser || 'Desconhecido'
    acc[k] = (acc[k] || 0) + 1
    return acc
  }, {})

  return res.json({
    url: {
      ...url,
      shortUrl: `${process.env.BASE_URL}/${slug}`,
      totalClicks: clicks.length
    },
    analytics: {
      byDevice,
      byBrowser,
      recentClicks: clicks.slice(-10).reverse()
    }
  })
}
