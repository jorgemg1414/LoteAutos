<template>
  <Teleport to="body">
    <div class="fixed top-20 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl shadow-2xl border max-w-sm"
          :class="toastClasses(toast.type)"
        >
          <span class="flex-shrink-0 mt-0.5">
            <svg v-if="toast.type === 'success'" class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            <svg v-else-if="toast.type === 'error'" class="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
            <svg v-else class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </span>
          <p class="text-sm font-dm text-white leading-tight">{{ toast.message }}</p>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'

const toasts = ref([])

function toastClasses(type) {
  const map = {
    success: 'bg-dark-700 border-green-500/30',
    error: 'bg-dark-700 border-red-500/30',
    info: 'bg-dark-700 border-amber-500/30',
  }
  return map[type] || map.info
}

// Expone método para agregar toasts desde cualquier parte
function add(message, type = 'info', duration = 3500) {
  const id = Date.now()
  toasts.value.push({ id, message, type })
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }, duration)
}

defineExpose({ add })
</script>

<style scoped>
.toast-enter-active { transition: all 0.3s ease; }
.toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from { opacity: 0; transform: translateX(100%); }
.toast-leave-to   { opacity: 0; transform: translateX(100%); }
</style>
