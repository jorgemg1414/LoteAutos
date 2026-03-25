import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/utils/api'

export const useCarsStore = defineStore('cars', () => {
  const cars = ref([])
  const loading = ref(false)
  const saving = ref(false)

  /**
   * Carga autos desde la API.
   * @param {boolean} all  true = todos los estados (admin), false = solo Activo (público)
   */
  async function load(all = false) {
    loading.value = true
    try {
      const url = all ? '/cars?all=1' : '/cars'
      const data = await api.get(url)
      cars.value = data.cars ?? []
    } finally {
      loading.value = false
    }
  }

  function getById(id) {
    return cars.value.find((c) => c.id === id) ?? null
  }

  /** Obtiene un auto por ID desde la API (incrementa vistas). */
  async function fetchById(id) {
    const data = await api.get(`/cars/${id}`)
    return data.car
  }

  /**
   * Crea o actualiza un auto.
   * @param {object} car  Si tiene `id`, actualiza; si no, crea.
   */
  async function save(car) {
    saving.value = true
    try {
      if (car.id) {
        const data = await api.put(`/cars/${car.id}`, car)
        cars.value = cars.value.map((c) => (c.id === car.id ? data.car : c))
        return data.car
      } else {
        const data = await api.post('/cars', car)
        cars.value = [data.car, ...cars.value]
        return data.car
      }
    } finally {
      saving.value = false
    }
  }

  async function duplicate(id) {
    const original = getById(id)
    if (!original) return
    const copy = {
      ...original,
      id: undefined,
      estado: 'Oculto',
      placas: '',
      vin: '',
      fechaAgregado: undefined,
    }
    return save(copy)
  }

  async function remove(id) {
    await api.delete(`/cars/${id}`)
    cars.value = cars.value.filter((c) => c.id !== id)
  }

  async function setStatus(id, estado) {
    const data = await api.put(`/cars/${id}`, { estado })
    cars.value = cars.value.map((c) => (c.id === id ? data.car : c))
  }

  // ── Computed ─────────────────────────────────────────────────────────────────

  const active      = computed(() => cars.value.filter((c) => c.estado === 'Activo'))
  const featured    = computed(() => cars.value.filter((c) => c.destacado && c.estado === 'Activo'))
  const sold        = computed(() => cars.value.filter((c) => c.estado === 'Vendido'))
  const total       = computed(() => cars.value.length)

  const brands = computed(() => {
    const b = new Set(cars.value.filter((c) => c.estado === 'Activo').map((c) => c.marca))
    return Array.from(b).sort()
  })

  const types = computed(() => {
    const t = new Set(cars.value.filter((c) => c.estado === 'Activo').map((c) => c.tipo))
    return Array.from(t).sort()
  })

  const priceRange = computed(() => {
    const prices = cars.value.filter((c) => c.estado === 'Activo').map((c) => c.precio)
    if (!prices.length) return { min: 0, max: 0 }
    return { min: Math.min(...prices), max: Math.max(...prices) }
  })

  return {
    cars, loading, saving,
    active, featured, sold, total, brands, types, priceRange,
    load, getById, fetchById, save, duplicate, remove, setStatus,
  }
})
