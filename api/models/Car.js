import mongoose from 'mongoose'

const CarSchema = new mongoose.Schema(
  {
    marca: { type: String, required: true, trim: true },
    modelo: { type: String, required: true, trim: true },
    version: { type: String, trim: true },
    año: { type: Number, required: true },
    tipo: { type: String, trim: true },
    condicion: { type: String, trim: true },
    estado: {
      type: String,
      enum: ['Activo', 'Vendido', 'Reservado', 'Oculto'],
      default: 'Activo',
    },
    precio: { type: Number, required: true },
    precioAnterior: Number,
    enganche: Number,
    mensualidad: Number,
    motor: String,
    cilindros: Number,
    hp: Number,
    transmision: String,
    combustible: String,
    traccion: String,
    color: String,
    colorInterior: String,
    puertas: Number,
    pasajeros: Number,
    vin: { type: String, trim: true },
    placas: { type: String, trim: true },
    descripcion: String,
    historialServicio: { type: Boolean, default: false },
    dueñosAnteriores: { type: Number, default: 0 },
    equipamiento: [String],
    imagenes: [String],
    destacado: { type: Boolean, default: false },
    vistas: { type: Number, default: 0 },
    fechaAgregado: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

// Serializar _id como id para compatibilidad con el frontend
CarSchema.set('toJSON', {
  transform(doc, ret) {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
    return ret
  },
})

export default mongoose.models.Car || mongoose.model('Car', CarSchema)
