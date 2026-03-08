import { Request, Response, NextFunction } from 'express'
import { prisma } from '../config/prisma'

export const getConfig = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const configs = await prisma.storeConfig.findMany()
    const result: Record<string, string> = {}
    for (const c of configs) {
      result[c.key] = c.value
    }
    res.json(result)
  } catch (err) {
    next(err)
  }
}

export const updateConfig = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updates = req.body as Record<string, string>
    const ops = Object.entries(updates).map(([key, value]) =>
      prisma.storeConfig.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      }),
    )
    await Promise.all(ops)
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
}
