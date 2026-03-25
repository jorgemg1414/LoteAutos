import { connectDB } from './lib/db.js'
import Car from './models/Car.js'
import Lead from './models/Lead.js'
import { requireAuth } from './lib/auth.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  const payload = requireAuth(req, res)
  if (!payload) return

  await connectDB()

  const [totalCars, activeCars, soldCars, pendingLeads, topViewed, recentLeads, carsByType] =
    await Promise.all([
      Car.countDocuments(),
      Car.countDocuments({ estado: 'Activo' }),
      Car.countDocuments({ estado: 'Vendido' }),
      Lead.countDocuments({ estado: 'Pendiente' }),
      Car.find({ estado: 'Activo' })
        .sort({ vistas: -1 })
        .limit(5)
        .select('marca modelo año precio vistas imagenes')
        .lean(),
      Lead.find()
        .sort({ fecha: -1 })
        .limit(5)
        .lean(),
      Car.aggregate([
        { $group: { _id: '$tipo', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ])

  const mapId = (doc) => ({ ...doc, id: doc._id.toString(), _id: undefined, __v: undefined })

  return res.status(200).json({
    stats: { totalCars, activeCars, soldCars, pendingLeads },
    topViewed: topViewed.map(mapId),
    recentLeads: recentLeads.map(mapId),
    carsByType: carsByType.map((t) => ({ tipo: t._id, count: t.count })),
  })
}
