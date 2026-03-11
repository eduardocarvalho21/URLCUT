// api/redirect.js — GET /:slug
import { kv } from '@vercel/kv'
import { UAParser } from 'ua-parser-js'

export default async function handler(req, res) {
  const slug = req.query.slug
  if (!slug || slug === 'favicon.ico') return res.status(404).end()

  const url = await kv.hgetall(`url:${slug}`)
  if (!url) return res.status(404).json({ error: 'URL não encontrada' })

  // Registra clique
  const ua = new UAParser(req.headers['user-agent'])
  const click = JSON.stringify({
    device: ua.getDevice().type || 'desktop',
    browser: ua.getBrowser().name || 'Desconhecido',
    referer: req.headers.referer || null,
    clickedAt: new Date().toISOString()
  })
  await kv.lpush(`clicks:${url.id}`, click)

  return res.redirect(302, url.original)
}
