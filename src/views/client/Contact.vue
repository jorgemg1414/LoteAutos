<template>
  <div class="min-h-screen pt-20">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div class="mb-10 text-center">
        <h1 class="section-title">Contáctanos</h1>
        <p class="section-subtitle">Estamos para ayudarte a encontrar tu auto ideal</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <!-- Formulario -->
        <div class="lg:col-span-3">
          <div class="card p-6">
            <h2 class="font-syne font-semibold text-white text-xl mb-6">Envíanos un mensaje</h2>

            <!-- Éxito -->
            <Transition name="fade">
              <div v-if="sent" class="flex flex-col items-center text-center py-10">
                <div class="w-16 h-16 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center mb-4">
                  <svg class="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                </div>
                <h3 class="font-syne font-bold text-white text-xl mb-2">¡Mensaje enviado!</h3>
                <p class="text-metal-400 mb-6">Nos pondremos en contacto contigo pronto.</p>
                <button @click="sent = false" class="btn-secondary">Enviar otro mensaje</button>
              </div>
            </Transition>

            <form v-if="!sent" @submit.prevent="submit" class="space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="label">Nombre *</label>
                  <input
                    v-model="form.nombre"
                    type="text"
                    class="input-field"
                    :class="{ 'border-red-500/50': errors.nombre }"
                    placeholder="Tu nombre completo"
                  />
                  <p v-if="errors.nombre" class="text-red-400 text-xs mt-1">{{ errors.nombre }}</p>
                </div>
                <div>
                  <label class="label">Email *</label>
                  <input
                    v-model="form.email"
                    type="email"
                    class="input-field"
                    :class="{ 'border-red-500/50': errors.email }"
                    placeholder="tu@email.com"
                  />
                  <p v-if="errors.email" class="text-red-400 text-xs mt-1">{{ errors.email }}</p>
                </div>
              </div>
              <div>
                <label class="label">Teléfono *</label>
                <input
                  v-model="form.telefono"
                  type="tel"
                  class="input-field"
                  :class="{ 'border-red-500/50': errors.telefono }"
                  placeholder="55 1234 5678"
                />
                <p v-if="errors.telefono" class="text-red-400 text-xs mt-1">{{ errors.telefono }}</p>
              </div>
              <div>
                <label class="label">Auto de interés (opcional)</label>
                <input v-model="form.autoInteres" type="text" class="input-field" placeholder="Ej: Toyota RAV4 2023" />
              </div>
              <div>
                <label class="label">Mensaje *</label>
                <textarea
                  v-model="form.mensaje"
                  class="input-field resize-none"
                  :class="{ 'border-red-500/50': errors.mensaje }"
                  rows="5"
                  placeholder="Cuéntanos en qué podemos ayudarte..."
                />
                <p v-if="errors.mensaje" class="text-red-400 text-xs mt-1">{{ errors.mensaje }}</p>
              </div>
              <button type="submit" class="btn-primary w-full justify-center">
                Enviar mensaje
              </button>
            </form>
          </div>
        </div>

        <!-- Info de contacto -->
        <div class="lg:col-span-2 space-y-4">
          <div class="card p-6">
            <h2 class="font-syne font-semibold text-white text-xl mb-5">Información de contacto</h2>
            <ul class="space-y-4">
              <li v-for="info in contactInfo" :key="info.label" class="flex items-start gap-3">
                <div class="w-8 h-8 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <component :is="info.icon" />
                </div>
                <div>
                  <p class="text-metal-500 text-xs uppercase tracking-wide mb-0.5">{{ info.label }}</p>
                  <p class="text-white text-sm">{{ info.value }}</p>
                </div>
              </li>
            </ul>
          </div>

          <a :href="waLink" target="_blank" class="btn-primary w-full justify-center">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            WhatsApp directo
          </a>

          <!-- Mapa placeholder -->
          <div class="card overflow-hidden">
            <div class="bg-dark-700 h-48 flex items-center justify-center">
              <div class="text-center">
                <svg class="w-10 h-10 text-amber-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                <p class="text-metal-400 text-sm">Av. Insurgentes Sur 1234</p>
                <p class="text-metal-500 text-xs">CDMX, México</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, h } from 'vue'
import { useLeadsStore } from '@/stores/leads'
import { whatsappLink } from '@/utils/formatters'

const leadsStore = useLeadsStore()
const sent = ref(false)
const waLink = whatsappLink('525512345678', null)

const form = reactive({ nombre: '', email: '', telefono: '', autoInteres: '', mensaje: '' })
const errors = reactive({ nombre: '', email: '', telefono: '', mensaje: '' })

function validate() {
  errors.nombre = form.nombre.trim() ? '' : 'El nombre es requerido'
  errors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? '' : 'Email inválido'
  errors.telefono = form.telefono.trim().length >= 10 ? '' : 'Teléfono requerido (10 dígitos)'
  errors.mensaje = form.mensaje.trim() ? '' : 'El mensaje es requerido'
  return !Object.values(errors).some(Boolean)
}

async function submit() {
  if (!validate()) return
  await leadsStore.save({ ...form })
  sent.value = true
  form.nombre = ''; form.email = ''; form.telefono = ''; form.autoInteres = ''; form.mensaje = ''
}

// Íconos inline para evitar dependencias adicionales
const IconLocation = { render: () => h('svg', { class: 'w-4 h-4 text-amber-500', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z' })]) }
const IconPhone = { render: () => h('svg', { class: 'w-4 h-4 text-amber-500', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' })]) }
const IconClock = { render: () => h('svg', { class: 'w-4 h-4 text-amber-500', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' })]) }

const contactInfo = [
  { label: 'Dirección', value: 'Av. Insurgentes Sur 1234, CDMX', icon: IconLocation },
  { label: 'Teléfono', value: '55 1234 5678', icon: IconPhone },
  { label: 'Horario', value: 'Lunes a Sábado 9:00 – 19:00', icon: IconClock },
]
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
