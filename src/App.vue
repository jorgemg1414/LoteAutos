<template>
  <div>
    <!-- Layout cliente -->
    <template v-if="!isAdminRoute">
      <Navbar />
      <main>
        <RouterView v-slot="{ Component }">
          <Transition name="page" mode="out-in">
            <component :is="Component" :key="$route.path" />
          </Transition>
        </RouterView>
      </main>
      <Footer />
      <WhatsAppFloat />
    </template>

    <!-- Layout admin (sin footer ni WhatsApp flotante) -->
    <template v-else-if="isAdminRoute && !isLoginRoute">
      <AdminNavbar />
      <main>
        <RouterView />
      </main>
    </template>

    <!-- Login admin (sin navbar) -->
    <template v-else>
      <RouterView />
    </template>

    <!-- Toast global -->
    <Toast ref="toastRef" />
  </div>
</template>

<script setup>
import { ref, computed, provide, onMounted } from 'vue'
import { useRoute, RouterView } from 'vue-router'
import Navbar from '@/components/common/Navbar.vue'
import Footer from '@/components/common/Footer.vue'
import WhatsAppFloat from '@/components/common/WhatsAppFloat.vue'
import AdminNavbar from '@/components/admin/AdminNavbar.vue'
import Toast from '@/components/common/Toast.vue'

const route = useRoute()
const toastRef = ref(null)

const isAdminRoute = computed(() => route.path.startsWith('/admin'))
const isLoginRoute = computed(() => route.path === '/admin')

// Provee el toast a todos los componentes hijos via inject
provide('toast', {
  add(msg, type) { toastRef.value?.add(msg, type) }
})
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
