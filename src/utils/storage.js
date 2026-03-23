/**
 * Helpers para interactuar con localStorage de forma segura
 */

const PREFIX = 'loteautos_'

export const storage = {
  get(key) {
    try {
      const item = localStorage.getItem(PREFIX + key)
      return item ? JSON.parse(item) : null
    } catch (e) {
      console.error(`Error leyendo localStorage [${key}]:`, e)
      return null
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value))
    } catch (e) {
      console.error(`Error escribiendo localStorage [${key}]:`, e)
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(PREFIX + key)
    } catch (e) {
      console.error(`Error eliminando localStorage [${key}]:`, e)
    }
  },

  clear() {
    try {
      Object.keys(localStorage)
        .filter(k => k.startsWith(PREFIX))
        .forEach(k => localStorage.removeItem(k))
    } catch (e) {
      console.error('Error limpiando localStorage:', e)
    }
  }
}

// Helpers específicos para vistas (contador)
export function incrementViewCount(carId) {
  const views = storage.get('views') || {}
  views[carId] = (views[carId] || 0) + 1
  storage.set('views', views)
  return views[carId]
}

export function getViewCount(carId) {
  const views = storage.get('views') || {}
  return views[carId] || 0
}

export function getAllViews() {
  return storage.get('views') || {}
}
