<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-dark-800 border-b border-dark-600">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-14">
        <!-- Logo -->
        <RouterLink to="/admin/dashboard" class="flex items-center gap-2">
          <div class="w-7 h-7 bg-amber-500 rounded flex items-center justify-center">
            <svg class="w-4 h-4 text-dark-900" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z"/>
            </svg>
          </div>
          <span class="font-syne font-bold text-sm text-white">Lote<span class="text-amber-500">Autos</span> <span class="text-metal-500 font-normal">Admin</span></span>
        </RouterLink>

        <!-- Nav -->
        <nav class="hidden md:flex items-center gap-1">
          <RouterLink
            v-for="link in adminLinks"
            :key="link.to"
            :to="link.to"
            class="px-3 py-1.5 rounded-lg text-xs font-dm text-metal-400 hover:text-white hover:bg-dark-600 transition-all"
            active-class="text-amber-500 bg-dark-600"
          >
            {{ link.label }}
          </RouterLink>
        </nav>

        <!-- Salir -->
        <div class="flex items-center gap-3">
          <RouterLink to="/" class="text-metal-500 hover:text-metal-300 text-xs transition-colors" target="_blank">
            Ver portal
          </RouterLink>
          <button @click="logout" class="flex items-center gap-1.5 text-metal-400 hover:text-red-400 transition-colors text-xs">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            Salir
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

const adminLinks = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/autos', label: 'Autos' },
  { to: '/admin/leads', label: 'Leads' },
]

function logout() {
  auth.logout()
  router.push('/admin')
}
</script>
