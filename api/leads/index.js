import { connectDB } from '../lib/db.js'
import Lead from '../models/Lead.js'
import { requireAuth } from '../lib/auth.js'

export default async function handler(req, res) {
  await connectDB()

  // GET /api/leads — solo admin
  if (req.method === 'GET') {
    const payload = requireAuth(req, res)
    if (!payload) return

    const leads = await Lead.find().sort({ fecha: -1 }).lean()
    const mapped = leads.map((l) => ({ ...l, id: l._id.toString(), _id: undefined, __v: undefined }))
    return res.status(200).json({ leads: mapped })
  }

  // POST /api/leads — público (formulario de contacto)
  if (req.method === 'POST') {
    const { nombre, telefono, email, autoInteres, mensaje } = req.body ?? {}

    if (!nombre) {
      return res.status(400).json({ error: 'El nombre es requerido' })
    }

    const lead = await Lead.create({ nombre, telefono, email, autoInteres, mensaje })
    return res.status(201).json({ lead: lead.toJSON() })
  }

  return res.status(405).json({ error: 'Método no permitido' })
}
