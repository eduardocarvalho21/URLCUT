// controllers/urlController.js
import { nanoid } from 'nanoid'
import { UAParser } from 'ua-parser-js'
import { randomUUID } from 'crypto'
import { urls, clicks } from '../store.js'

export function createUrl(req, res) {
  const { original, slug } = req.body

  if (!original) {
    return res.status(400).json({ error: 'URL original é obrigatória' })
  }

  try { new URL(original) } catch {
    return res.status(400).json({ error: 'URL inválida' })
  }

  const finalSlug = slug || nanoid(7)

  if (urls.has(finalSlug)) {
    return res.status(409).json({ error: 'Slug já em uso, escolha outro' })
  }

  const url = { id: randomUUID(), slug: finalSlug, original, createdAt: new Date() }
  urls.set(finalSlug, url)
  clicks.set(url.id, [])

  return res.status(201).json({
    ...url,
    shortUrl: `${process.env.BASE_URL}/${finalSlug}`,
    totalClicks: 0
  })
}

export function listUrls(req, res) {
  const result = [...urls.values()]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map(url => ({
      ...url,
      shortUrl: `${process.env.BASE_URL}/${url.slug}`,
      totalClicks: (clicks.get(url.id) || []).length
    }))

  return res.json(result)
}

export function getUrlAnalytics(req, res) {
  const { slug } = req.params
  const url = urls.get(slug)

  if (!url) return res.status(404).json({ error: 'URL não encontrada' })

  const urlClicks = clicks.get(url.id) || []

  const byDevice = urlClicks.reduce((acc, c) => {
    const key = c.device || 'Desconhecido'
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})

  const byBrowser = urlClicks.reduce((acc, c) => {
    const key = c.browser || 'Desconhecido'
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})

  return res.json({
    url: {
      id: url.id,
      slug: url.slug,
      original: url.original,
      shortUrl: `${process.env.BASE_URL}/${url.slug}`,
      createdAt: url.createdAt,
      totalClicks: urlClicks.length
    },
    analytics: { byDevice, byBrowser, recentClicks: urlClicks.slice(-10).reverse() }
  })
}

export function deleteUrl(req, res) {
  const { slug } = req.params
  const url = urls.get(slug)

  if (!url) return res.status(404).json({ error: 'URL não encontrada' })

  clicks.delete(url.id)
  urls.delete(slug)

  return res.json({ message: 'URL removida com sucesso' })
}

export function redirect(req, res) {
  const { slug } = req.params
  const url = urls.get(slug)

  if (!url) return res.status(404).json({ error: 'URL não encontrada' })

  const ua = new UAParser(req.headers['user-agent'])
  const device = ua.getDevice().type || 'desktop'
  const browser = ua.getBrowser().name || 'Desconhecido'

  const urlClicks = clicks.get(url.id) || []
  urlClicks.push({ device, browser, referer: req.headers.referer || null, clickedAt: new Date() })
  clicks.set(url.id, urlClicks)

  return res.redirect(url.original)
}
