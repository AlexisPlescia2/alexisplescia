import { Router } from 'express'
import { getAllProducts, getFeatured, getBySlug } from '../controllers/productController'

const router = Router()

router.get('/', getAllProducts)
router.get('/featured', getFeatured)   // Debe ir ANTES de /:slug
router.get('/:slug', getBySlug)

export default router
