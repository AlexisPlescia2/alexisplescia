import { Request, Response } from 'express'
import { prisma } from '../config/prisma'

export async function sendContactMessage(req: Request, res: Response) {
  try {
    const { name, email, message, phone } = req.body
    if (!name || !email || !message) {
      return res.status(400).json({ error: true, message: 'Nombre, email y mensaje son requeridos' })
    }
    // Guardar en DB
    await prisma.contactMessage.create({
      data: { name, email, message, phone: phone || null }
    })
    res.json({ ok: true, message: 'Mensaje recibido correctamente' })
  } catch (err) {
    console.error('[contact] Error:', err)
    res.status(500).json({ error: true, message: 'Error al procesar el mensaje' })
  }
}
