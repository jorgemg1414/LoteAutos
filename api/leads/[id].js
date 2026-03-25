import { connectDB } from '../lib/db.js'
import Lead from '../models/Lead.js'
import { requireAuth } from '../lib/auth.js'

export default async function handler(req, res) {
  await connectDB()

  const payload = requireAuth(req, res)
  if (!payload) return

  const { id } = req.query

  // PUT /api/leads/:id — actualizar estado
  if (req.method === 'PUT') {
    const { estado } = req.body ?? {}
    if (!['Pendiente', 'Atendido'].includes(estado)) {
      return res.status(400).json({ error: 'Estado inválido' })
    }

    const lead = await Lead.findByIdAndUpdate(id, { estado }, { new: true })
    if (!lead) return res.status(404).json({ error: 'Lead no encontrado' })
    return res.status(200).json({ lead: lead.toJSON() })
  }

  // DELETE /api/leads/:id
  if (req.method === 'DELETE') {
    const lead = await Lead.findByIdAndDelete(id)
    if (!lead) return res.status(404).json({ error: 'Lead no encontrado' })
    return res.status(200).json({ ok: true })
  }

  return res.status(405).json({ error: 'Método no permitido' })
}
