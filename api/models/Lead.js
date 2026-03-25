import mongoose from 'mongoose'

const LeadSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    telefono: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    autoInteres: { type: String, trim: true },
    mensaje: String,
    estado: {
      type: String,
      enum: ['Pendiente', 'Atendido'],
      default: 'Pendiente',
    },
    fecha: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

LeadSchema.set('toJSON', {
  transform(doc, ret) {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
    return ret
  },
})

export default mongoose.models.Lead || mongoose.model('Lead', LeadSchema)
