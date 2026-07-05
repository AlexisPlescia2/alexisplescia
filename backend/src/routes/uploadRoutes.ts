import { Router, Request, Response, NextFunction } from 'express'
import { auth } from '../middlewares/auth'
import { adminOnly } from '../middlewares/adminOnly'
import { uploadMiddleware, uploadImages } from '../controllers/uploadController'

const router = Router()

router.post(
  '/',
  auth,
  adminOnly,
  (req: Request, res: Response, next: NextFunction) => {
    uploadMiddleware(req, res, (err) => {
      if (err) {
        res.status(400).json({ error: true, message: err.message })
        return
      }
      next()
    })
  },
  uploadImages,
)

export default router
