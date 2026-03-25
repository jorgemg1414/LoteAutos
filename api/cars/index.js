import { connectDB } from '../lib/db.js'
import Car from '../models/Car.js'
import { requireAuth, getTokenFromRequest, verifyToken } from '../lib/auth.js'

function isAdmin(req) {
  try {
    const token = getTokenFromRequest(req)
    if (!token) return false
    verifyToken(token)
    return true
  } catch {
    return false
  }
}

export default async function handler(req, res) {
  await connectDB()

  // GET /api/cars — público (activos) o admin (todos con ?all=1)
  if (req.method === 'GET') {
    const showAll = req.query.all === '1' && isAdmin(req)
    const filter = showAll ? {} : { estado: 'Activo' }

    const cars = await Car.find(filter).sort({ fechaAgregado: -1 }).lean()

    // lean() omite toJSON transform, así que mapeamos manualmente
    const mapped = cars.map((c) => ({ ...c, id: c._id.toString(), _id: undefined, __v: undefined }))
    return res.status(200).json({ cars: mapped })
  }

  // POST /api/cars — solo admin
  if (req.method === 'POST') {
    const payload = requireAuth(req, res)
    if (!payload) return

    const car = await Car.create(req.body)
    return res.status(201).json({ car: car.toJSON() })
  }

  return res.status(405).json({ error: 'Método no permitido' })
}
