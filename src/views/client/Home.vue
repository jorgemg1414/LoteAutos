<template>
  <div>
    <!-- Hero Section -->
    <section class="relative min-h-screen flex items-center justify-center overflow-hidden">
      <!-- Fondo con grid pattern -->
      <div class="absolute inset-0 bg-grid opacity-30" />
      <div class="absolute inset-0 bg-gradient-to-b from-dark-900/20 via-dark-900/50 to-dark-900" />

      <!-- Círculo de acento -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div class="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <!-- Badge -->
        <div class="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-dm px-4 py-1.5 rounded-full mb-8 animate-fade-in">
          <span class="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
          Tu dealer premium de confianza
        </div>

        <!-- Título -->
        <h1 class="font-syne font-extrabold text-5xl md:text-7xl text-white leading-none tracking-tight animate-slide-up mb-6">
          El auto de tus<br/>
          <span class="text-gradient">sueños te espera</span>
        </h1>

        <p class="text-metal-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 animate-fade-in">
          Más de 120 vehículos certificados. Seminuevos, nuevos y usados con garantía.
          Sin sorpresas, con transparencia total.
        </p>

        <!-- CTAs -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
          <RouterLink to="/catalogo" class="btn-primary text-base px-8 py-4">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            Ver catálogo completo
          </RouterLink>
          <RouterLink to="/contacto" class="btn-secondary text-base px-8 py-4">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
            Contáctanos
          </RouterLink>
        </div>

        <!-- Búsqueda rápida -->
        <div class="mt-14 bg-dark-800/80 backdrop-blur-sm border border-dark-600 rounded-2xl p-4 md:p-6 max-w-3xl mx-auto">
          <p class="text-metal-400 text-sm font-dm mb-4 text-left">Búsqueda rápida</p>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <select v-model="quickSearch.marca" class="input-field text-sm">
                <option value="">Marca</option>
                <option v-for="b in brands" :key="b" :value="b">{{ b }}</option>
              </select>
            </div>
            <div>
              <select v-model="quickSearch.tipo" class="input-field text-sm">
                <option value="">Tipo</option>
                <option v-for="t in tipos" :key="t" :value="t">{{ t }}</option>
              </select>
            </div>
            <div>
              <input type="number" v-model.number="quickSearch.año" placeholder="Año" class="input-field text-sm" :min="2000" :max="2025" />
            </div>
            <div>
              <input type="number" v-model.number="quickSearch.precioMax" placeholder="Precio máx." class="input-field text-sm" step="50000" />
            </div>
          </div>
          <button @click="doSearch" class="btn-primary w-full justify-center mt-3">
            Buscar autos
          </button>
        </div>
      </div>

      <!-- Scroll indicator -->
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-metal-600 animate-bounce">
        <span class="text-xs font-dm">Desplázate</span>
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </div>
    </section>

    <!-- Stats animados -->
    <section class="py-16 bg-dark-800/50 border-y border-dark-600">
      <div class="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        <div v-for="stat in stats" :key="stat.label">
          <div class="font-syne font-extrabold text-4xl text-amber-500 mb-1">{{ stat.value }}</div>
          <div class="text-metal-400 text-sm">{{ stat.label }}</div>
        </div>
      </div>
    </section>

    <!-- Autos destacados -->
    <section class="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between mb-10">
        <div>
          <h2 class="section-title">Autos <span class="text-gradient">destacados</span></h2>
          <p class="section-subtitle">Selección especial del mes</p>
        </div>
        <RouterLink to="/catalogo" class="btn-ghost hidden md:flex">
          Ver todos
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </RouterLink>
      </div>

      <!-- Loading skeleton -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <SkeletonCard v-for="i in 3" :key="i" />
      </div>

      <!-- Grid de autos -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <CarCard v-for="car in featured" :key="car.id" :car="car" />
      </div>

      <RouterLink to="/catalogo" class="btn-secondary w-full justify-center mt-8 md:hidden">
        Ver catálogo completo
      </RouterLink>
    </section>

    <!-- Marcas disponibles -->
    <section class="py-16 border-t border-dark-600">
      <div class="max-w-5xl mx-auto px-4">
        <h2 class="section-title text-center mb-3">Marcas <span class="text-gradient">disponibles</span></h2>
        <p class="section-subtitle text-center mb-10">Las mejores marcas en un solo lugar</p>
        <div class="flex flex-wrap justify-center gap-3">
          <button
            v-for="brand in brands"
            :key="brand"
            @click="searchByBrand(brand)"
            class="px-5 py-2.5 bg-dark-700 hover:bg-dark-600 border border-dark-500 hover:border-amber-500/40 rounded-xl text-metal-300 hover:text-amber-400 font-dm text-sm transition-all duration-200 hover:-translate-y-0.5"
          >
            {{ brand }}
          </button>
        </div>
      </div>
    </section>

    <!-- CTA Final -->
    <section class="py-20 bg-gradient-to-r from-dark-800 via-dark-700 to-dark-800 border-y border-dark-600">
      <div class="max-w-3xl mx-auto px-4 text-center">
        <h2 class="section-title mb-4">¿No encuentras lo que buscas?</h2>
        <p class="section-subtitle mb-8">Cuéntanos qué necesitas y encontramos el auto perfecto para ti.</p>
        <RouterLink to="/contacto" class="btn-primary text-base px-10 py-4">
          Solicitar auto específico
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { RouterLink } from 'vue-router'
import { useCarsStore } from '@/stores/cars'
import CarCard from '@/components/catalog/CarCard.vue'
import SkeletonCard from '@/components/common/SkeletonCard.vue'

const router = useRouter()
const carsStore = useCarsStore()
const loading = ref(true)

const featured = computed(() => carsStore.featured.slice(0, 4))
const brands = computed(() => carsStore.brands)
const tipos = computed(() => carsStore.types)

const quickSearch = reactive({ marca: '', tipo: '', año: null, precioMax: null })

const stats = [
  { value: '120+', label: 'Autos disponibles' },
  { value: '5★', label: 'Años de experiencia' },
  { value: '98%', label: 'Clientes satisfechos' },
  { value: '24/7', label: 'Atención personalizada' },
]

onMounted(() => {
  carsStore.load()
  setTimeout(() => { loading.value = false }, 600)
})

function doSearch() {
  const query = {}
  if (quickSearch.marca) query.marca = quickSearch.marca
  if (quickSearch.tipo) query.tipo = quickSearch.tipo
  if (quickSearch.año) query.año = quickSearch.año
  if (quickSearch.precioMax) query.precioMax = quickSearch.precioMax
  router.push({ name: 'Catalog', query })
}

function searchByBrand(brand) {
  router.push({ name: 'Catalog', query: { marca: brand } })
}
</script>
