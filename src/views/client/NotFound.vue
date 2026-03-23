<template>
  <div class="min-h-screen flex items-center justify-center pt-16">
    <div class="text-center px-4">
      <div class="relative inline-block mb-8">
        <div class="text-[10rem] font-syne font-extrabold text-dark-700 leading-none select-none">404</div>
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="text-center">
            <svg class="w-16 h-16 text-amber-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
            </svg>
          </div>
        </div>
      </div>
      <h1 class="font-syne font-bold text-2xl text-white mb-3">Página no encontrada</h1>
      <p class="text-metal-400 mb-8 max-w-md mx-auto">
        La página que buscas no existe o fue movida. Regresa al catálogo para encontrar tu próximo auto.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <RouterLink to="/catalogo" class="btn-primary">
          Ver catálogo
        </RouterLink>
        <RouterLink to="/" class="btn-secondary">
          Ir al inicio
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
