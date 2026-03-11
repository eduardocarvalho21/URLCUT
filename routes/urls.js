// routes/urls.js
import { Router } from 'express'
import { createUrl, listUrls, getUrlAnalytics, deleteUrl } from '../controllers/urlController.js'

const router = Router()

router.post('/', createUrl)
router.get('/', listUrls)
router.get('/:slug/analytics', getUrlAnalytics)
router.delete('/:slug', deleteUrl)

export default router
