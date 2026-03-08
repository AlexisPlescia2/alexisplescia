import { Router } from 'express'
import { getConfig, updateConfig } from '../controllers/configController'
import { auth } from '../middlewares/auth'
import { adminOnly } from '../middlewares/adminOnly'

const router = Router()

router.get('/', getConfig)
router.patch('/', auth, adminOnly, updateConfig)

export default router
