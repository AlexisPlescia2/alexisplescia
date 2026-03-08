import { Request, Response, NextFunction } from 'express'
import { getAllCategories } from '../services/categoryService'

export const getCategories = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await getAllCategories()
    res.json(categories)
  } catch (err) {
    next(err)
  }
}
