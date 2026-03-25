import { connectDB } from '../lib/db.js'
import Car from '../models/Car.js'
import { requireAuth } from '../lib/auth.js'

export default async function handler(req, res) {
  await connectDB()

  const { id } = req.query

  // GET /api/cars/:id — público, incrementa vistas
  if (req.method === 'GET') {
    const car = await Car.findByIdAndUpdate(
      id,
      { $inc: { vistas: 1 } },
      { new: true }
    )
    if (!car) return res.status(404).json({ error: 'Auto no encontrado' })
    return res.status(200).json({ car: car.toJSON() })
  }

  // PUT /api/cars/:id — solo admin
  if (req.method === 'PUT') {
    const payload = requireAuth(req, res)
    if (!payload) return

    const { _id, __v, id: _id2, ...data } = req.body
    const car = await Car.findByIdAndUpdate(id, data, { new: true, runValidators: true })
    if (!car) return res.status(404).json({ error: 'Auto no encontrado' })
    return res.status(200).json({ car: car.toJSON() })
  }

  // DELETE /api/cars/:id — solo admin
  if (req.method === 'DELETE') {
    const payload = requireAuth(req, res)
    if (!payload) return

    const car = await Car.findByIdAndDelete(id)
    if (!car) return res.status(404).json({ error: 'Auto no encontrado' })
    return res.status(200).json({ ok: true })
  }

  return res.status(405).json({ error: 'Método no permitido' })
}
