import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/utils/api'

export const useAuthStore = defineStore('auth', () => {
  const _authenticated = ref(false)
  const _initialized = ref(false)
  const _loading = ref(false)

  const isAuthenticated = computed(() => _authenticated.value)
  const loading = computed(() => _loading.value)

  /** Verifica sesión actual contra el servidor (lee cookie httpOnly). */
  async function init() {
    if (_initialized.value) return
    try {
      const data = await api.get('/auth/me')
      _authenticated.value = data.authenticated === true
    } catch {
      _authenticated.value = false
    } finally {
      _initialized.value = true
    }
  }

  /** Inicia sesión. Lanza Error si las credenciales son incorrectas. */
  async function login(username, password) {
    _loading.value = true
    try {
      await api.post('/auth/login', { username, password })
      _authenticated.value = true
      _initialized.value = true
    } finally {
      _loading.value = false
    }
  }

  async function logout() {
    await api.post('/auth/logout').catch(() => {})
    _authenticated.value = false
    _initialized.value = false
  }

  return { isAuthenticated, loading, init, login, logout }
})
