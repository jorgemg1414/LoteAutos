/**
 * Utilidades de formateo para moneda, fechas, números, etc.
 */

// Formatea precio en pesos mexicanos
export function formatPrice(value) {
  if (!value && value !== 0) return 'Precio a consultar'
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

// Formatea kilometraje
export function formatKm(value) {
  if (!value && value !== 0) return '—'
  return new Intl.NumberFormat('es-MX').format(value) + ' km'
}

// Formatea fecha relativa (hace X días)
export function formatRelativeDate(dateString) {
  if (!dateString) return '—'
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Hoy'
  if (diffDays === 1) return 'Ayer'
  if (diffDays < 7) return `Hace ${diffDays} días`
  if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`
  if (diffDays < 365) return `Hace ${Math.floor(diffDays / 30)} meses`
  return `Hace ${Math.floor(diffDays / 365)} años`
}

// Formatea fecha completa
export function formatDate(dateString) {
  if (!dateString) return '—'
  return new Intl.DateTimeFormat('es-MX', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateString))
}

// Formatea fecha corta
export function formatDateShort(dateString) {
  if (!dateString) return '—'
  return new Intl.DateTimeFormat('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(dateString))
}

// Verifica si un auto fue agregado hace menos de N días
export function isNewlyAdded(dateString, days = 7) {
  if (!dateString) return false
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffDays = diffMs / (1000 * 60 * 60 * 24)
  return diffDays <= days
}

// Calcula mensualidad estimada
export function calcMensualidad(precio, enganche, meses, tasaAnual = 0.15) {
  const monto = precio - enganche
  if (monto <= 0 || meses <= 0) return 0
  const tasaMensual = tasaAnual / 12
  const mensualidad = (monto * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -meses))
  return Math.round(mensualidad)
}

// Genera mensaje de WhatsApp prellenado
export function whatsappLink(phone, auto) {
  const msg = auto
    ? `Hola, me interesa el ${auto.marca} ${auto.modelo} ${auto.año}. ¿Sigue disponible?`
    : 'Hola, me gustaría obtener más información sobre sus autos.'
  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`
}

// Trunca texto a N caracteres
export function truncate(text, max = 100) {
  if (!text) return ''
  return text.length > max ? text.substring(0, max) + '...' : text
}

// Capitaliza primera letra
export function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

// Color de condición del auto
export function conditionColor(condicion) {
  const map = {
    'Nuevo': 'badge-green',
    'Seminuevo': 'badge-amber',
    'Usado': 'badge-blue',
  }
  return map[condicion] || 'badge-blue'
}

// Color de estado del auto (admin)
export function statusColor(estado) {
  const map = {
    'Activo': 'text-green-400',
    'Vendido': 'text-red-400',
    'Reservado': 'text-amber-400',
    'Oculto': 'text-metal-500',
  }
  return map[estado] || 'text-metal-400'
}
