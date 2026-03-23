import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Credenciales hardcodeadas del admin
const ADMIN_USER = 'admin'
const ADMIN_PASS = 'tepa2024'

export const useAuthStore = defineStore('auth', () => {
  const session = ref(sessionStorage.getItem('loteautos_admin') === 'true')

  const isAuthenticated = computed(() => session.value)

  function login(user, pass) {
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      session.value = true
      sessionStorage.setItem('loteautos_admin', 'true')
      return true
    }
    return false
  }

  function logout() {
    session.value = false
    sessionStorage.removeItem('loteautos_admin')
  }

  return { isAuthenticated, login, logout }
})
