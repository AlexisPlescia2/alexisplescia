import { Request, Response, NextFunction } from 'express'

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    res.status(403).json({ error: true, message: 'Acceso restringido a administradores' })
    return
  }
  next()
}
