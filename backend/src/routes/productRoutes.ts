import { Router } from 'express'
import { getAllProducts, getFeatured, getBySlug, getSummary } from '../controllers/productController'

const router = Router()

router.get('/', getAllProducts)
router.get('/featured', getFeatured)   // Must come BEFORE /:slug
router.get('/summary', getSummary)     // Must come BEFORE /:slug
router.get('/:slug', getBySlug)

export default router
