<template>
  <div class="min-h-screen flex items-center justify-center bg-dark-900 px-4">
    <div class="w-full max-w-sm">
      <!-- Logo -->
      <div class="text-center mb-10">
        <div class="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-dark-900" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
          </svg>
        </div>
        <h1 class="font-syne font-bold text-2xl text-white">Panel Admin</h1>
        <p class="text-metal-500 text-sm mt-1">LoteAutos</p>
      </div>

      <!-- Card -->
      <div class="card p-6">
        <form @submit.prevent="submit" class="space-y-4">
          <div>
            <label class="label">Usuario</label>
            <input
              v-model="user"
              type="text"
              class="input-field"
              :class="{ 'border-red-500/50': error }"
              placeholder="admin"
              autocomplete="username"
            />
          </div>
          <div>
            <label class="label">Contraseña</label>
            <div class="relative">
              <input
                v-model="pass"
                :type="showPass ? 'text' : 'password'"
                class="input-field pr-10"
                :class="{ 'border-red-500/50': error }"
                placeholder="••••••••"
                autocomplete="current-password"
              />
              <button
                type="button"
                @click="showPass = !showPass"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-metal-500 hover:text-metal-300"
              >
                <svg v-if="!showPass" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
              </button>
            </div>
          </div>

          <!-- Error -->
          <Transition name="fade">
            <div v-if="error" class="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-3 py-2 rounded-lg">
              <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Credenciales incorrectas
            </div>
          </Transition>

          <button type="submit" :disabled="auth.loading" class="btn-primary w-full justify-center mt-2 disabled:opacity-60 disabled:cursor-not-allowed">
            {{ auth.loading ? 'Verificando...' : 'Iniciar sesión' }}
          </button>
        </form>
      </div>

      <RouterLink to="/" class="flex items-center justify-center gap-1.5 text-metal-500 hover:text-metal-300 text-sm mt-6 transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        Volver al portal
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const user = ref('')
const pass = ref('')
const error = ref(false)
const showPass = ref(false)

async function submit() {
  error.value = false
  try {
    await auth.login(user.value, pass.value)
    const redirect = route.query.redirect
    router.push(typeof redirect === 'string' ? redirect : '/admin/dashboard')
  } catch {
    error.value = true
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
