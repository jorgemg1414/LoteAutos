<template>
  <div
    class="card group relative cursor-pointer transition-all duration-300 hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-1"
    :class="{ 'flex gap-4 items-start p-3': listView }"
  >
    <!-- Imagen -->
    <div
      class="relative overflow-hidden flex-shrink-0"
      :class="listView ? 'w-48 h-32 rounded-lg' : 'w-full h-48'"
    >
      <img
        :src="car.imagenes?.[0] || 'https://placehold.co/800x600/1a1a24/f59e0b?text=Sin+Imagen'"
        :alt="`${car.marca} ${car.modelo}`"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />

      <!-- Badges superiores -->
      <div class="absolute top-2 left-2 flex flex-col gap-1">
        <span :class="conditionBadge" class="badge text-xs">{{ car.condicion }}</span>
        <span v-if="isNew" class="badge bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs">
          🆕 Recién llegado
        </span>
        <span v-if="car.precioAnterior" class="badge bg-red-500/20 text-red-300 border border-red-500/30 text-xs">
          🔥 Precio reducido
        </span>
      </div>

      <!-- Estado reservado/vendido -->
      <div v-if="car.estado !== 'Activo'" class="absolute inset-0 bg-dark-900/70 flex items-center justify-center">
        <span class="font-syne font-bold text-lg uppercase tracking-widest" :class="statusTextClass">
          {{ car.estado }}
        </span>
      </div>

      <!-- Hover overlay con botón Ver detalles -->
      <div class="absolute inset-0 bg-gradient-to-t from-dark-900/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
        <RouterLink
          :to="`/auto/${car.id}`"
          class="w-full btn-primary justify-center text-sm py-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0"
          @click.stop
        >
          Ver detalles
        </RouterLink>
      </div>
    </div>

    <!-- Contenido -->
    <div :class="listView ? 'flex-1 py-1' : 'p-4'">
      <!-- Nombre -->
      <RouterLink :to="`/auto/${car.id}`" class="block">
        <h3 class="font-syne font-semibold text-white text-base leading-tight group-hover:text-amber-400 transition-colors line-clamp-1">
          {{ car.marca }} {{ car.modelo }}
        </h3>
        <p class="text-metal-500 text-xs mt-0.5 line-clamp-1">{{ car.version }} · {{ car.año }}</p>
      </RouterLink>

      <!-- Precio -->
      <div class="mt-2 flex items-baseline gap-2">
        <span class="font-syne font-bold text-amber-500 text-lg">{{ formatPrice(car.precio) }}</span>
        <span v-if="car.precioAnterior" class="text-metal-500 text-sm line-through">
          {{ formatPrice(car.precioAnterior) }}
        </span>
      </div>

      <!-- Chips -->
      <div class="flex flex-wrap gap-1.5 mt-2">
        <span class="inline-flex items-center gap-1 bg-dark-600 text-metal-300 text-xs px-2 py-0.5 rounded-full">
          <svg class="w-3 h-3 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
          {{ formatKm(car.kilometraje) }}
        </span>
        <span class="inline-flex items-center gap-1 bg-dark-600 text-metal-300 text-xs px-2 py-0.5 rounded-full">
          <svg class="w-3 h-3 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
          </svg>
          {{ car.transmision }}
        </span>
        <span class="inline-flex items-center gap-1 bg-dark-600 text-metal-300 text-xs px-2 py-0.5 rounded-full">
          {{ car.combustible }}
        </span>
      </div>

      <!-- Acciones -->
      <div class="flex items-center gap-2 mt-3" :class="listView ? '' : 'border-t border-dark-600 pt-3'">
        <!-- Favorito -->
        <button
          @click.prevent="toggleFav"
          class="p-2 rounded-lg transition-all duration-200 hover:bg-dark-600"
          :class="isFav ? 'text-red-400' : 'text-metal-500 hover:text-red-400'"
          :title="isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'"
        >
          <svg class="w-4 h-4 transition-transform duration-200" :class="isFav ? 'scale-110' : ''" :fill="isFav ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
        </button>

        <!-- Comparar -->
        <button
          @click.prevent="toggleCompare"
          class="p-2 rounded-lg transition-all duration-200 hover:bg-dark-600"
          :class="inCompare ? 'text-amber-400' : 'text-metal-500 hover:text-amber-400'"
          :title="inCompare ? 'Quitar del comparador' : 'Agregar al comparador'"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
          </svg>
        </button>

        <!-- Ver detalles (en list view siempre visible) -->
        <RouterLink
          v-if="listView"
          :to="`/auto/${car.id}`"
          class="ml-auto btn-primary text-xs py-1.5 px-3"
        >
          Ver detalles
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useFavoritesStore } from '@/stores/favorites'
import { useCompareStore } from '@/stores/compare'
import { formatPrice, formatKm, conditionColor, isNewlyAdded, statusColor } from '@/utils/formatters'

const props = defineProps({
  car: { type: Object, required: true },
  listView: { type: Boolean, default: false },
})

const favStore = useFavoritesStore()
const compareStore = useCompareStore()

const isFav = computed(() => favStore.isFavorite(props.car.id))
const inCompare = computed(() => compareStore.isInCompare(props.car.id))
const isNew = computed(() => isNewlyAdded(props.car.fechaAgregado, 7))
const conditionBadge = computed(() => conditionColor(props.car.condicion))
const statusTextClass = computed(() => statusColor(props.car.estado))

function toggleFav() { favStore.toggle(props.car.id) }
function toggleCompare() { compareStore.toggle(props.car.id) }
</script>
