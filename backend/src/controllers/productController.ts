import { Request, Response, NextFunction } from 'express'
import {
  getProducts,
  getProductBySlug,
  getFeaturedProducts,
} from '../services/productService'

export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, brand, search, sort, page, limit, minPrice, maxPrice } = req.query

    const result = await getProducts({
      category: category as string | undefined,
      brand: brand as string | undefined,
      search: search as string | undefined,
      sort: sort as 'price_asc' | 'price_desc' | 'name_asc' | 'newest' | undefined,
      page: page ? parseInt(page as string, 10) : 1,
      limit: limit ? parseInt(limit as string, 10) : 12,
      minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
    })

    res.json(result)
  } catch (err) {
    next(err)
  }
}

export const getFeatured = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await getFeaturedProducts()
    res.json(products)
  } catch (err) {
    next(err)
  }
}

export const getBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await getProductBySlug(req.params.slug)
    if (!product) {
      res.status(404).json({ error: true, message: 'Producto no encontrado' })
      return
    }
    res.json(product)
  } catch (err) {
    next(err)
  }
}
