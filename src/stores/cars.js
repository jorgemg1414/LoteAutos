import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { storage } from '@/utils/storage'
import { seedCars } from '@/utils/seedData'

export const useCarsStore = defineStore('cars', () => {
  const cars = ref([])

  // Inicializa con seed data si localStorage está vacío
  function init() {
    const existing = storage.get('cars')
    if (!existing || existing.length === 0) {
      storage.set('cars', seedCars)
    }
  }

  function load() {
    init()
    cars.value = storage.get('cars') || []
  }

  function getById(id) {
    return cars.value.find(c => c.id === id) || null
  }

  function save(car) {
    const views = storage.get('views') || {}
    if (car.id) {
      // Editar existente
      cars.value = cars.value.map(c => c.id === car.id ? { ...car } : c)
    } else {
      // Crear nuevo
      const newCar = {
        ...car,
        id: Date.now().toString(),
        fechaAgregado: new Date().toISOString(),
      }
      cars.value = [newCar, ...cars.value]
    }
    storage.set('cars', cars.value)
  }

  function duplicate(id) {
    const original = getById(id)
    if (!original) return
    const copy = {
      ...original,
      id: Date.now().toString(),
      fechaAgregado: new Date().toISOString(),
      estado: 'Oculto',
      placas: '',
      vin: '',
    }
    cars.value = [copy, ...cars.value]
    storage.set('cars', cars.value)
    return copy
  }

  function remove(id) {
    cars.value = cars.value.filter(c => c.id !== id)
    storage.set('cars', cars.value)
  }

  function setStatus(id, estado) {
    cars.value = cars.value.map(c => c.id === id ? { ...c, estado } : c)
    storage.set('cars', cars.value)
  }

  // Getters computados
  const active = computed(() => cars.value.filter(c => c.estado === 'Activo'))
  const featured = computed(() => cars.value.filter(c => c.destacado && c.estado === 'Activo'))
  const sold = computed(() => cars.value.filter(c => c.estado === 'Vendido'))
  const total = computed(() => cars.value.length)

  // Marcas únicas disponibles
  const brands = computed(() => {
    const b = new Set(cars.value.filter(c => c.estado === 'Activo').map(c => c.marca))
    return Array.from(b).sort()
  })

  // Tipos únicos disponibles
  const types = computed(() => {
    const t = new Set(cars.value.filter(c => c.estado === 'Activo').map(c => c.tipo))
    return Array.from(t).sort()
  })

  // Rango de precios
  const priceRange = computed(() => {
    const prices = cars.value.filter(c => c.estado === 'Activo').map(c => c.precio)
    return { min: Math.min(...prices), max: Math.max(...prices) }
  })

  return {
    cars, active, featured, sold, total, brands, types, priceRange,
    load, getById, save, duplicate, remove, setStatus
  }
})
