import multer from 'multer'
import { Request, Response } from 'express'
import { uploadToStorage } from '../services/storageService'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE = 5 * 1024 * 1024 // 5 MB

export const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE, files: 10 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error(`Tipo de archivo no permitido: ${file.mimetype}`))
    }
  },
}).array('images', 10)

export async function uploadImages(req: Request, res: Response): Promise<void> {
  const files = req.files as Express.Multer.File[] | undefined
  if (!files?.length) {
    res.status(400).json({ error: true, message: 'No se recibieron archivos' })
    return
  }

  const urls = await Promise.all(
    files.map((f) => uploadToStorage(f.buffer, f.originalname, f.mimetype)),
  )
  res.json({ urls })
}
