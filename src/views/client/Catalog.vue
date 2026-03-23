<template>
  <div class="min-h-screen pt-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="section-title">Catálogo <span class="text-gradient">completo</span></h1>
        <p class="section-subtitle">{{ filteredCars.length }} autos disponibles</p>
      </div>

      <div class="flex gap-6">
        <!-- Panel de filtros (desktop) -->
        <aside class="hidden lg:block w-64 flex-shrink-0">
          <div class="card p-5 sticky top-24">
            <h3 class="font-syne font-semibold text-white mb-5">Filtros</h3>
            <FilterPanel
              v-model:filters="filters"
              :brands="carsStore.brands"
              :tipos="carsStore.types"
              :price-range="carsStore.priceRange"
              @apply="applyFilters"
              @reset="resetFilters"
            />
          </div>
        </aside>

        <!-- Contenido principal -->
        <main class="flex-1 min-w-0">
          <!-- Barra de herramientas -->
          <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
            <!-- Buscador -->
            <div class="relative flex-1 min-w-48 max-w-sm">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-metal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                v-model="searchText"
                type="text"
                placeholder="Buscar por marca, modelo..."
                class="input-field pl-9 text-sm"
              />
            </div>

            <div class="flex items-center gap-2">
              <!-- Ordenamiento -->
              <select v-model="sortBy" class="input-field text-sm py-2 pr-8 w-auto">
                <option value="">Ordenar</option>
                <option value="precio-asc">Precio: menor a mayor</option>
                <option value="precio-desc">Precio: mayor a menor</option>
                <option value="año-desc">Año: más reciente</option>
                <option value="nuevo">Recién agregados</option>
              </select>

              <!-- Toggle vista mobile filtros -->
              <button
                @click="showFilters = true"
                class="lg:hidden btn-secondary text-sm py-2 px-3 gap-1"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"/>
                </svg>
                Filtros
                <span v-if="activeFilterCount > 0" class="bg-amber-500 text-dark-900 text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {{ activeFilterCount }}
                </span>
              </button>

              <!-- Toggle grid/lista -->
              <div class="flex border border-dark-500 rounded-lg overflow-hidden">
                <button
                  @click="gridView = true"
                  class="p-2 transition-colors"
                  :class="gridView ? 'bg-amber-500 text-dark-900' : 'text-metal-500 hover:text-white'"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z"/>
                  </svg>
                </button>
                <button
                  @click="gridView = false"
                  class="p-2 transition-colors"
                  :class="!gridView ? 'bg-amber-500 text-dark-900' : 'text-metal-500 hover:text-white'"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Contador de resultados -->
          <p class="text-metal-500 text-sm mb-4">
            Mostrando <span class="text-amber-400 font-semibold">{{ paginatedCars.length }}</span>
            de <span class="text-white">{{ filteredCars.length }}</span> autos
          </p>

          <!-- Loading skeletons -->
          <div v-if="loading" :class="gridView ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5' : 'flex flex-col gap-4'">
            <SkeletonCard v-for="i in 6" :key="i" />
          </div>

          <!-- Grid de autos -->
          <div v-else-if="paginatedCars.length > 0" :class="gridView ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5' : 'flex flex-col gap-4'">
            <CarCard
              v-for="car in paginatedCars"
              :key="car.id"
              :car="car"
              :list-view="!gridView"
            />
          </div>

          <!-- Estado vacío -->
          <div v-else class="flex flex-col items-center justify-center py-24 text-center">
            <div class="w-20 h-20 bg-dark-700 rounded-full flex items-center justify-center mb-6">
              <svg class="w-10 h-10 text-metal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 class="font-syne font-semibold text-white text-xl mb-2">Sin resultados</h3>
            <p class="text-metal-400 mb-6">No encontramos autos con esos filtros. Intenta con otros criterios.</p>
            <button @click="resetFilters" class="btn-primary">
              Limpiar filtros
            </button>
          </div>

          <!-- Paginación -->
          <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 mt-10">
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="p-2 rounded-lg border border-dark-500 text-metal-400 hover:text-white hover:border-amber-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <button
              v-for="page in pageNumbers"
              :key="page"
              @click="currentPage = page"
              class="w-9 h-9 rounded-lg text-sm font-dm transition-all"
              :class="currentPage === page
                ? 'bg-amber-500 text-dark-900 font-semibold'
                : 'border border-dark-500 text-metal-400 hover:text-white hover:border-amber-500'"
            >
              {{ page }}
            </button>
            <button
              @click="currentPage++"
              :disabled="currentPage === totalPages"
              class="p-2 rounded-lg border border-dark-500 text-metal-400 hover:text-white hover:border-amber-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </main>
      </div>
    </div>

    <!-- Modal de filtros mobile -->
    <Modal v-model="showFilters" title="Filtros">
      <FilterPanel
        v-model:filters="filters"
        :brands="carsStore.brands"
        :tipos="carsStore.types"
        :price-range="carsStore.priceRange"
        @apply="() => { applyFilters(); showFilters = false }"
        @reset="resetFilters"
      />
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useCarsStore } from '@/stores/cars'
import CarCard from '@/components/catalog/CarCard.vue'
import FilterPanel from '@/components/catalog/FilterPanel.vue'
import SkeletonCard from '@/components/common/SkeletonCard.vue'
import Modal from '@/components/common/Modal.vue'

const route = useRoute()
const carsStore = useCarsStore()

const loading = ref(true)
const gridView = ref(true)
const searchText = ref('')
const sortBy = ref('')
const currentPage = ref(1)
const PER_PAGE = 9
const showFilters = ref(false)

// Filtros con valores por defecto
const filters = reactive({
  marcas: [],
  tipos: [],
  precioMax: 2000000,
  añoDesde: null,
  añoHasta: null,
  kmMax: null,
  transmisiones: [],
  combustibles: [],
  condiciones: [],
})

// Inicializa filtros desde query params (búsqueda rápida del home)
onMounted(() => {
  carsStore.load()
  if (route.query.marca) filters.marcas = [route.query.marca]
  if (route.query.tipo) filters.tipos = [route.query.tipo]
  if (route.query.año) filters.añoDesde = parseInt(route.query.año)
  if (route.query.precioMax) filters.precioMax = parseInt(route.query.precioMax)
  if (carsStore.priceRange.max) filters.precioMax = carsStore.priceRange.max
  setTimeout(() => { loading.value = false }, 500)
})

// Autos filtrados
const filteredCars = computed(() => {
  let list = carsStore.active

  // Búsqueda de texto
  if (searchText.value) {
    const q = searchText.value.toLowerCase()
    list = list.filter(c =>
      c.marca.toLowerCase().includes(q) ||
      c.modelo.toLowerCase().includes(q) ||
      c.version?.toLowerCase().includes(q) ||
      String(c.año).includes(q)
    )
  }

  // Filtros
  if (filters.marcas.length) list = list.filter(c => filters.marcas.includes(c.marca))
  if (filters.tipos.length) list = list.filter(c => filters.tipos.includes(c.tipo))
  if (filters.precioMax) list = list.filter(c => c.precio <= filters.precioMax)
  if (filters.añoDesde) list = list.filter(c => c.año >= filters.añoDesde)
  if (filters.añoHasta) list = list.filter(c => c.año <= filters.añoHasta)
  if (filters.kmMax) list = list.filter(c => c.kilometraje <= filters.kmMax)
  if (filters.transmisiones.length) list = list.filter(c => filters.transmisiones.includes(c.transmision))
  if (filters.combustibles.length) list = list.filter(c => filters.combustibles.includes(c.combustible))
  if (filters.condiciones.length) list = list.filter(c => filters.condiciones.includes(c.condicion))

  // Ordenamiento
  if (sortBy.value === 'precio-asc') list = [...list].sort((a, b) => a.precio - b.precio)
  else if (sortBy.value === 'precio-desc') list = [...list].sort((a, b) => b.precio - a.precio)
  else if (sortBy.value === 'año-desc') list = [...list].sort((a, b) => b.año - a.año)
  else if (sortBy.value === 'nuevo') list = [...list].sort((a, b) => new Date(b.fechaAgregado) - new Date(a.fechaAgregado))

  return list
})

const totalPages = computed(() => Math.ceil(filteredCars.value.length / PER_PAGE))
const pageNumbers = computed(() => Array.from({ length: totalPages.value }, (_, i) => i + 1))
const paginatedCars = computed(() => {
  const start = (currentPage.value - 1) * PER_PAGE
  return filteredCars.value.slice(start, start + PER_PAGE)
})

// Cuenta filtros activos para badge mobile
const activeFilterCount = computed(() => {
  let count = 0
  if (filters.marcas.length) count++
  if (filters.tipos.length) count++
  if (filters.transmisiones.length) count++
  if (filters.combustibles.length) count++
  if (filters.condiciones.length) count++
  if (filters.añoDesde || filters.añoHasta) count++
  if (filters.kmMax) count++
  return count
})

// Reset página al cambiar filtros
watch(filteredCars, () => { currentPage.value = 1 })

function applyFilters() { currentPage.value = 1 }
function resetFilters() {
  filters.marcas = []
  filters.tipos = []
  filters.precioMax = carsStore.priceRange.max || 2000000
  filters.añoDesde = null
  filters.añoHasta = null
  filters.kmMax = null
  filters.transmisiones = []
  filters.combustibles = []
  filters.condiciones = []
  searchText.value = ''
  sortBy.value = ''
  currentPage.value = 1
}
</script>
