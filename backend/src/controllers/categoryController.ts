import { Request, Response, NextFunction } from 'express'
import { getAllCategories } from '../services/categoryService'

export const getCategories = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await getAllCategories()
    // Igual que los productos: el navegador/CDN puede reutilizar la respuesta 5 min
    res.set('Cache-Control', 'public, max-age=300')
    res.json(categories)
  } catch (err) {
    next(err)
  }
}
