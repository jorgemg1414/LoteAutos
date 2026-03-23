<template>
  <div class="min-h-screen pt-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="section-title">Mis <span class="text-gradient">favoritos</span></h1>
          <p class="section-subtitle">{{ favoriteCars.length }} autos guardados</p>
        </div>
        <div class="flex gap-3">
          <button v-if="favoriteCars.length > 0" @click="shareList" class="btn-secondary text-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
            Compartir lista
          </button>
          <button v-if="favoriteCars.length > 0" @click="favStore.clear()" class="btn-ghost text-sm text-red-400 hover:text-red-300">
            Limpiar
          </button>
        </div>
      </div>

      <!-- Estado vacío -->
      <div v-if="favoriteCars.length === 0" class="flex flex-col items-center justify-center py-24 text-center">
        <div class="w-20 h-20 bg-dark-700 rounded-full flex items-center justify-center mb-6">
          <svg class="w-10 h-10 text-metal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
        </div>
        <h3 class="font-syne font-semibold text-white text-xl mb-2">Sin favoritos</h3>
        <p class="text-metal-400 mb-6">Aún no has guardado ningún auto. Explora el catálogo y guarda los que te gusten.</p>
        <RouterLink to="/catalogo" class="btn-primary">Explorar catálogo</RouterLink>
      </div>

      <!-- Grid de favoritos -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        <CarCard
          v-for="car in favoriteCars"
          :key="car.id"
          :car="car"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useFavoritesStore } from '@/stores/favorites'
import { useCarsStore } from '@/stores/cars'
import { useToast } from '@/components/common/useToast'
import CarCard from '@/components/catalog/CarCard.vue'

const favStore = useFavoritesStore()
const carsStore = useCarsStore()
const toast = useToast()

onMounted(() => carsStore.load())

const favoriteCars = computed(() =>
  favStore.ids.map(id => carsStore.getById(id)).filter(Boolean)
)

function shareList() {
  const ids = favStore.ids.join(',')
  const url = `${window.location.origin}/favoritos?ids=${ids}`
  navigator.clipboard.writeText(url)
  toast.success('Enlace de favoritos copiado')
}
</script>
