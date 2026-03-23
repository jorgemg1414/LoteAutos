<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[90] flex items-center justify-center p-4"
        @click.self="$emit('update:modelValue', false)"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" />

        <!-- Panel -->
        <div class="relative bg-dark-800 border border-dark-500 rounded-2xl shadow-2xl w-full max-w-md animate-slide-up">
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-dark-600">
            <h3 class="font-syne font-semibold text-white text-lg">{{ title }}</h3>
            <button
              @click="$emit('update:modelValue', false)"
              class="p-1.5 rounded-lg text-metal-400 hover:text-white hover:bg-dark-600 transition-all"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Content -->
          <div class="px-6 py-5">
            <slot />
          </div>

          <!-- Footer slot -->
          <div v-if="$slots.footer" class="px-6 pb-5">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({ modelValue: Boolean, title: { type: String, default: '' } })
defineEmits(['update:modelValue'])
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
