import { Request, Response, NextFunction } from 'express'
import { ZodSchema, ZodError } from 'zod'

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body)
      next()
    } catch (err) {
      if (err instanceof ZodError) {
        const errors: Record<string, string> = {}
        err.errors.forEach((e) => {
          const field = e.path.join('.')
          errors[field] = e.message
        })
        res.status(400).json({ error: true, message: 'Datos inválidos', errors })
        return
      }
      next(err)
    }
  }
}
