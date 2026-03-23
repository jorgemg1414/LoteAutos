<template>
  <div class="min-h-screen pt-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div class="mb-8">
        <h1 class="section-title">Comparador <span class="text-gradient">de autos</span></h1>
        <p class="section-subtitle">Compara hasta 3 vehículos lado a lado</p>
      </div>

      <!-- Estado: sin suficientes autos -->
      <div v-if="selectedCars.length < 2" class="flex flex-col items-center justify-center py-24 text-center">
        <div class="w-20 h-20 bg-dark-700 rounded-full flex items-center justify-center mb-6">
          <svg class="w-10 h-10 text-metal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
          </svg>
        </div>
        <h3 class="font-syne font-semibold text-white text-xl mb-2">
          {{ selectedCars.length === 0 ? 'Comparador vacío' : '¡Un auto más!' }}
        </h3>
        <p class="text-metal-400 mb-6">
          {{ selectedCars.length === 0
            ? 'Agrega al menos 2 autos desde el catálogo para comparar.'
            : 'Agrega un auto más desde el catálogo para comenzar la comparación.' }}
        </p>
        <RouterLink to="/catalogo" class="btn-primary">
          Ir al catálogo
        </RouterLink>
      </div>

      <!-- Tabla comparativa -->
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <!-- Encabezados con foto y acciones -->
          <thead>
            <tr>
              <th class="w-40 text-left py-4 pr-4">
                <button @click="compareStore.clear()" class="text-metal-500 hover:text-red-400 text-xs transition-colors">
                  Limpiar todo
                </button>
              </th>
              <th
                v-for="car in selectedCars"
                :key="car.id"
                class="px-4 py-2 min-w-56"
              >
                <div class="card overflow-hidden">
                  <img
                    :src="car.imagenes?.[0]"
                    :alt="car.marca + ' ' + car.modelo"
                    class="w-full h-32 object-cover"
                  />
                  <div class="p-3">
                    <p class="font-syne font-bold text-white text-sm line-clamp-1">{{ car.marca }} {{ car.modelo }}</p>
                    <p class="text-metal-400 text-xs">{{ car.año }} · {{ car.version }}</p>
                    <p class="text-amber-500 font-bold text-sm mt-1">{{ formatPrice(car.precio) }}</p>
                    <button
                      @click="compareStore.remove(car.id)"
                      class="text-metal-500 hover:text-red-400 text-xs mt-2 transition-colors flex items-center gap-1"
                    >
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                      Quitar
                    </button>
                  </div>
                </div>
              </th>
            </tr>
          </thead>

          <!-- Filas de especificaciones -->
          <tbody>
            <tr
              v-for="row in compareRows"
              :key="row.key"
              class="border-t border-dark-700 hover:bg-dark-800/30 transition-colors"
            >
              <td class="py-3 pr-4 text-metal-500 text-xs uppercase tracking-wide font-dm">{{ row.label }}</td>
              <td
                v-for="car in selectedCars"
                :key="car.id"
                class="px-4 py-3 text-sm font-dm"
                :class="getBestClass(row, car)"
              >
                {{ row.format ? row.format(car[row.key]) : (car[row.key] || '—') }}
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Botones de acción por auto -->
        <div class="flex gap-4 mt-6 justify-end">
          <RouterLink
            v-for="car in selectedCars"
            :key="car.id"
            :to="`/auto/${car.id}`"
            class="btn-primary text-sm"
          >
            Ver {{ car.marca }} {{ car.modelo }}
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useCompareStore } from '@/stores/compare'
import { useCarsStore } from '@/stores/cars'
import { formatPrice, formatKm } from '@/utils/formatters'

const compareStore = useCompareStore()
const carsStore = useCarsStore()

onMounted(() => carsStore.load())

const selectedCars = computed(() =>
  compareStore.ids.map(id => carsStore.getById(id)).filter(Boolean)
)

// Filas de la tabla comparativa
const compareRows = [
  { key: 'condicion', label: 'Condición' },
  { key: 'año', label: 'Año', best: 'max' },
  { key: 'precio', label: 'Precio', best: 'min', format: formatPrice },
  { key: 'kilometraje', label: 'Kilometraje', best: 'min', format: (v) => `${(v || 0).toLocaleString('es-MX')} km` },
  { key: 'hp', label: 'Potencia (HP)', best: 'max', format: (v) => v ? `${v} HP` : '—' },
  { key: 'motor', label: 'Motor' },
  { key: 'transmision', label: 'Transmisión' },
  { key: 'combustible', label: 'Combustible' },
  { key: 'traccion', label: 'Tracción' },
  { key: 'puertas', label: 'Puertas' },
  { key: 'pasajeros', label: 'Pasajeros', best: 'max' },
  { key: 'negociable', label: 'Precio negociable', format: (v) => v ? 'Sí' : 'No' },
]

function getBestClass(row, car) {
  if (!row.best || selectedCars.value.length < 2) return 'text-metal-300'
  const values = selectedCars.value.map(c => Number(c[row.key]) || 0)
  const val = Number(car[row.key]) || 0
  const isBest = row.best === 'max' ? val === Math.max(...values) : val === Math.min(...values)
  // Solo resaltar si no todos son iguales
  const allSame = values.every(v => v === values[0])
  if (allSame) return 'text-metal-300'
  return isBest ? 'text-green-400 font-semibold' : 'text-metal-400'
}
</script>
