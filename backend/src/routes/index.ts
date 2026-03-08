import { Router } from 'express'
import productRoutes from './productRoutes'
import categoryRoutes from './categoryRoutes'
import authRoutes from './authRoutes'
import adminRoutes from './adminRoutes'
import configRoutes from './configRoutes'
import contactRoutes from './contactRoutes'

const router = Router()

router.use('/products', productRoutes)
router.use('/categories', categoryRoutes)
router.use('/auth', authRoutes)
router.use('/admin', adminRoutes)
router.use('/config', configRoutes)
router.use('/contact', contactRoutes)

export { router }
