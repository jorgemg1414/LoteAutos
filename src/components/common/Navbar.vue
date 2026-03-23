<template>
  <header class="fixed top-0 left-0 right-0 z-50 glass">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <RouterLink to="/" class="flex items-center gap-2 group">
          <div class="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center group-hover:bg-amber-400 transition-colors">
            <svg class="w-5 h-5 text-dark-900" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
            </svg>
          </div>
          <span class="font-syne font-bold text-lg text-white">Lote<span class="text-amber-500">Autos</span></span>
        </RouterLink>

        <!-- Nav desktop -->
        <nav class="hidden md:flex items-center gap-1">
          <RouterLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="px-3 py-2 rounded-lg text-sm font-dm text-metal-400 hover:text-white hover:bg-dark-600 transition-all duration-200"
            active-class="text-amber-500 bg-dark-600"
          >
            {{ link.label }}
          </RouterLink>
        </nav>

        <!-- Acciones -->
        <div class="flex items-center gap-2">
          <!-- Comparador -->
          <RouterLink
            to="/comparar"
            class="relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-metal-400 hover:text-amber-500 hover:bg-dark-600 transition-all text-sm"
            title="Comparador"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
            <span class="hidden sm:block">Comparar</span>
            <span
              v-if="compareCount > 0"
              class="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-dark-900 text-xs font-bold rounded-full flex items-center justify-center"
            >{{ compareCount }}</span>
          </RouterLink>

          <!-- Favoritos -->
          <RouterLink
            to="/favoritos"
            class="relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-metal-400 hover:text-amber-500 hover:bg-dark-600 transition-all text-sm"
            title="Favoritos"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
            <span class="hidden sm:block">Favoritos</span>
            <span
              v-if="favCount > 0"
              class="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-dark-900 text-xs font-bold rounded-full flex items-center justify-center"
            >{{ favCount }}</span>
          </RouterLink>

          <!-- Mobile menu btn -->
          <button
            @click="menuOpen = !menuOpen"
            class="md:hidden p-2 rounded-lg text-metal-400 hover:text-white hover:bg-dark-600 transition-all"
          >
            <svg v-if="!menuOpen" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <Transition name="slide-down">
      <div v-if="menuOpen" class="md:hidden border-t border-dark-600 bg-dark-800">
        <nav class="px-4 py-3 flex flex-col gap-1">
          <RouterLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="px-3 py-2.5 rounded-lg text-sm font-dm text-metal-400 hover:text-white hover:bg-dark-600 transition-all"
            active-class="text-amber-500 bg-dark-600"
            @click="menuOpen = false"
          >
            {{ link.label }}
          </RouterLink>
        </nav>
      </div>
    </Transition>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useFavoritesStore } from '@/stores/favorites'
import { useCompareStore } from '@/stores/compare'
import { computed } from 'vue'

const menuOpen = ref(false)
const favStore = useFavoritesStore()
const compareStore = useCompareStore()

const favCount = computed(() => favStore.count)
const compareCount = computed(() => compareStore.count)

const navLinks = [
  { to: '/', label: 'Inicio' },
  { to: '/catalogo', label: 'Catálogo' },
  { to: '/comparar', label: 'Comparar' },
  { to: '/contacto', label: 'Contacto' },
]
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.2s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
