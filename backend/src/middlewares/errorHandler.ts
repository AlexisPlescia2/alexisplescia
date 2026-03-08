import { Request, Response, NextFunction } from 'express'

export interface AppError extends Error {
  statusCode?: number
}

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const statusCode = err.statusCode || 500
  const message = err.message || 'Error interno del servidor'

  console.error(`[Error] ${statusCode} — ${message}`)

  res.status(statusCode).json({
    error: true,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}
