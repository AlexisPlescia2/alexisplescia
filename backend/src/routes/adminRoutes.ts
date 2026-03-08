import { Router } from 'express'
import { auth } from '../middlewares/auth'
import { adminOnly } from '../middlewares/adminOnly'
import * as adminController from '../controllers/adminController'

const router = Router()

router.use(auth, adminOnly)

router.get('/stats', adminController.getStats)

router.get('/products', adminController.getProducts)
router.post('/products', adminController.createProduct)
router.patch('/products/:id', adminController.updateProduct)
router.delete('/products/:id', adminController.deleteProduct)

router.get('/categories', adminController.getCategories)
router.post('/categories', adminController.createCategory)
router.patch('/categories/:id', adminController.updateCategory)
router.delete('/categories/:id', adminController.deleteCategory)

export default router
