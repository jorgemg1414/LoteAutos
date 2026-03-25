<template>
  <div class="min-h-screen pt-20" v-if="car">
    <!-- Breadcrumb -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
      <nav class="flex items-center gap-2 text-sm text-metal-500">
        <RouterLink to="/" class="hover:text-amber-500 transition-colors">Inicio</RouterLink>
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        <RouterLink to="/catalogo" class="hover:text-amber-500 transition-colors">Catálogo</RouterLink>
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        <span class="text-metal-300">{{ car.marca }} {{ car.modelo }}</span>
      </nav>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Columna izquierda: galería + specs -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Galería de imágenes -->
          <div class="card overflow-hidden">
            <!-- Imagen principal -->
            <div class="relative overflow-hidden bg-dark-700" style="aspect-ratio: 16/9">
              <img
                :src="car.imagenes?.[activeImg] || 'https://placehold.co/800x600/1a1a24/f59e0b?text=Sin+Imagen'"
                :alt="`${car.marca} ${car.modelo}`"
                class="w-full h-full object-cover cursor-pointer"
                @click="lightbox = true"
              />
              <!-- Flechas navegación -->
              <button v-if="(car.imagenes?.length || 0) > 1" @click="prevImg" class="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-dark-900/70 hover:bg-dark-700 rounded-full flex items-center justify-center text-white transition-all">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
              </button>
              <button v-if="(car.imagenes?.length || 0) > 1" @click="nextImg" class="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-dark-900/70 hover:bg-dark-700 rounded-full flex items-center justify-center text-white transition-all">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </button>
              <!-- Badges -->
              <div class="absolute top-3 left-3 flex gap-2">
                <span :class="conditionBadge" class="badge">{{ car.condicion }}</span>
                <span v-if="isNew" class="badge bg-purple-500/20 text-purple-300 border border-purple-500/30">🆕 Recién llegado</span>
                <span v-if="car.precioAnterior" class="badge bg-red-500/20 text-red-300 border border-red-500/30">🔥 Precio reducido</span>
              </div>
              <!-- Botón fullscreen -->
              <button @click="lightbox = true" class="absolute bottom-3 right-3 p-1.5 bg-dark-900/70 hover:bg-dark-700 rounded-lg text-white transition-all">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/></svg>
              </button>
            </div>
            <!-- Miniaturas -->
            <div v-if="(car.imagenes?.length || 0) > 1" class="flex gap-2 p-3 overflow-x-auto hide-scrollbar">
              <button
                v-for="(img, i) in car.imagenes"
                :key="i"
                @click="activeImg = i"
                class="flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all"
                :class="activeImg === i ? 'border-amber-500' : 'border-dark-500 opacity-60 hover:opacity-100'"
              >
                <img :src="img" :alt="`Imagen ${i + 1}`" class="w-full h-full object-cover" />
              </button>
            </div>
          </div>

          <!-- Especificaciones técnicas -->
          <div class="card p-6">
            <h2 class="font-syne font-bold text-white text-xl mb-6">Especificaciones</h2>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div v-for="spec in specs" :key="spec.label" class="bg-dark-700/50 rounded-xl p-3.5">
                <p class="text-metal-500 text-xs uppercase tracking-wide mb-1">{{ spec.label }}</p>
                <p class="text-white font-dm font-medium text-sm">{{ spec.value }}</p>
              </div>
            </div>
          </div>

          <!-- Equipamiento -->
          <div v-if="(car.equipamiento?.length || 0) > 0" class="card p-6">
            <h2 class="font-syne font-bold text-white text-xl mb-5">Equipamiento y extras</h2>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="item in car.equipamiento"
                :key="item"
                class="inline-flex items-center gap-1.5 bg-dark-700 border border-dark-500 text-metal-300 text-xs px-3 py-1.5 rounded-full"
              >
                <svg class="w-3 h-3 text-amber-500" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
                {{ item }}
              </span>
            </div>
          </div>

          <!-- Descripción -->
          <div v-if="car.descripcion" class="card p-6">
            <h2 class="font-syne font-bold text-white text-xl mb-4">Descripción</h2>
            <p class="text-metal-300 text-sm leading-relaxed">{{ car.descripcion }}</p>
          </div>

          <!-- Historial de servicio -->
          <div v-if="car.historialServicio" class="card p-6">
            <h2 class="font-syne font-bold text-white text-xl mb-4">Historial de servicio</h2>
            <p class="text-metal-300 text-sm leading-relaxed">{{ car.historialServicio }}</p>
          </div>
        </div>

        <!-- Columna derecha: precio + contacto -->
        <div class="space-y-5">
          <!-- Info principal sticky -->
          <div class="card p-6 lg:sticky lg:top-24">
            <!-- Nombre y año -->
            <div class="mb-4">
              <div class="flex items-center gap-2 mb-2">
                <span :class="conditionBadge" class="badge">{{ car.condicion }}</span>
                <span v-if="car.negociable" class="badge badge-blue">Precio negociable</span>
              </div>
              <h1 class="font-syne font-bold text-2xl text-white">{{ car.marca }} {{ car.modelo }}</h1>
              <p class="text-metal-400 mt-1">{{ car.version }} · {{ car.año }}</p>
            </div>

            <!-- Precio -->
            <div class="py-4 border-y border-dark-600 mb-4">
              <div class="flex items-baseline gap-3">
                <span class="font-syne font-extrabold text-3xl text-amber-500">{{ formatPrice(car.precio) }}</span>
                <span v-if="car.precioAnterior" class="text-metal-500 line-through text-lg">{{ formatPrice(car.precioAnterior) }}</span>
              </div>
              <p v-if="car.enganche" class="text-metal-400 text-sm mt-1">
                Enganche desde {{ formatPrice(car.enganche) }}
                <span v-if="car.mensualidades"> · {{ formatPrice(car.mensualidades) }}/mes</span>
              </p>
            </div>

            <!-- Vistas -->
            <p class="text-metal-500 text-xs mb-4">👁 {{ viewCount }} visitas a este anuncio</p>

            <!-- Acciones rápidas -->
            <div class="space-y-3">
              <a :href="waLink" target="_blank" class="btn-primary w-full justify-center">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Consultar por WhatsApp
              </a>
              <button @click="toggleFav" class="btn-secondary w-full justify-center">
                <svg class="w-4 h-4 transition-colors" :fill="isFav ? 'currentColor' : 'none'" :class="isFav ? 'text-red-400' : ''" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                {{ isFav ? 'En favoritos' : 'Agregar a favoritos' }}
              </button>
              <button @click="copyLink" class="btn-ghost w-full justify-center text-sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg>
                Copiar enlace
              </button>
            </div>
          </div>

          <!-- Formulario de contacto rápido -->
          <div class="card p-6">
            <h3 class="font-syne font-semibold text-white mb-4">¿Te interesa este auto?</h3>
            <form @submit.prevent="submitContact" class="space-y-3">
              <div>
                <label class="label">Nombre</label>
                <input v-model="form.nombre" type="text" class="input-field" placeholder="Tu nombre" required />
              </div>
              <div>
                <label class="label">Teléfono</label>
                <input v-model="form.telefono" type="tel" class="input-field" placeholder="55 1234 5678" required />
              </div>
              <div>
                <label class="label">Mensaje</label>
                <textarea v-model="form.mensaje" class="input-field resize-none" rows="3" placeholder="¿Tienes alguna pregunta?" />
              </div>
              <button type="submit" class="btn-primary w-full justify-center">
                Enviar consulta
              </button>
            </form>
          </div>

          <!-- Calculadora de financiamiento -->
          <div class="card p-6">
            <h3 class="font-syne font-semibold text-white mb-4">Calculadora de financiamiento</h3>
            <div class="space-y-3">
              <div>
                <label class="label">Enganche</label>
                <input v-model.number="calc.enganche" type="number" class="input-field" :placeholder="`Mín. ${formatPrice(car.precio * 0.1)}`" step="5000" />
              </div>
              <div>
                <label class="label">Plazo (meses)</label>
                <select v-model.number="calc.meses" class="input-field">
                  <option :value="12">12 meses</option>
                  <option :value="24">24 meses</option>
                  <option :value="36">36 meses</option>
                  <option :value="48">48 meses</option>
                  <option :value="60">60 meses</option>
                </select>
              </div>
              <div class="bg-dark-700/50 rounded-xl p-4 text-center">
                <p class="text-metal-400 text-xs mb-1">Mensualidad estimada</p>
                <p class="font-syne font-bold text-2xl text-amber-500">{{ formatPrice(mensualidad) }}</p>
                <p class="text-metal-500 text-xs mt-1">*Tasa referencial 15% anual</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Autos similares -->
      <div v-if="similar.length > 0" class="mt-16">
        <h2 class="section-title mb-8">Autos <span class="text-gradient">similares</span></h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <CarCard v-for="s in similar" :key="s.id" :car="s" />
        </div>
      </div>
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="lightbox"
          class="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4"
          @click.self="lightbox = false"
        >
          <button @click="lightbox = false" class="absolute top-4 right-4 p-2 bg-dark-700 hover:bg-dark-600 rounded-lg text-white transition-all">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
          <button @click="prevImg" class="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-dark-700 hover:bg-dark-600 rounded-lg text-white transition-all">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <img
            :src="car.imagenes?.[activeImg]"
            class="max-w-full max-h-full object-contain rounded-xl"
            style="max-height: 85vh"
          />
          <button @click="nextImg" class="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-dark-700 hover:bg-dark-600 rounded-lg text-white transition-all">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      </Transition>
    </Teleport>
  </div>

  <!-- Estado de carga -->
  <div v-else-if="loading" class="min-h-screen pt-20 flex items-center justify-center">
    <div class="text-center">
      <div class="w-12 h-12 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p class="text-metal-400">Cargando...</p>
    </div>
  </div>

  <!-- Auto no encontrado -->
  <div v-else class="min-h-screen pt-20 flex items-center justify-center">
    <div class="text-center">
      <h2 class="font-syne font-bold text-2xl text-white mb-4">Auto no encontrado</h2>
      <RouterLink to="/catalogo" class="btn-primary">Ver catálogo</RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useCarsStore } from '@/stores/cars'
import { useFavoritesStore } from '@/stores/favorites'
import { useToast } from '@/components/common/useToast'
import CarCard from '@/components/catalog/CarCard.vue'
import { formatPrice, conditionColor, isNewlyAdded, whatsappLink, calcMensualidad } from '@/utils/formatters'

const route = useRoute()
const carsStore = useCarsStore()
const favStore = useFavoritesStore()
const toast = useToast()

const car = ref(null)
const loading = ref(true)
const activeImg = ref(0)
const lightbox = ref(false)
const viewCount = ref(0)

const isFav = computed(() => car.value ? favStore.isFavorite(car.value.id) : false)
const conditionBadge = computed(() => car.value ? conditionColor(car.value.condicion) : '')
const isNew = computed(() => car.value ? isNewlyAdded(car.value.fechaAgregado, 7) : false)
const waLink = computed(() => car.value ? whatsappLink('525512345678', car.value) : '#')

// Especificaciones en formato tabla
const specs = computed(() => {
  if (!car.value) return []
  const c = car.value
  return [
    { label: 'Año', value: c.año },
    { label: 'Kilometraje', value: c.kilometraje === 0 ? '0 km (Nuevo)' : `${(c.kilometraje || 0).toLocaleString('es-MX')} km` },
    { label: 'Motor', value: c.motor || '—' },
    { label: 'Transmisión', value: c.transmision || '—' },
    { label: 'Combustible', value: c.combustible || '—' },
    { label: 'Potencia', value: c.hp ? `${c.hp} HP` : '—' },
    { label: 'Tracción', value: c.traccion || '—' },
    { label: 'Color exterior', value: c.colorInterior || '—' },
    { label: 'Color interior', value: c.colorInterior || '—' },
    { label: 'Puertas', value: c.puertas || '—' },
    { label: 'Pasajeros', value: c.pasajeros || '—' },
    { label: 'Dueños previos', value: c.dueñosPrevios !== undefined ? c.dueñosPrevios : '—' },
  ]
})

// Autos similares (misma categoría o rango precio ±30%)
const similar = computed(() => {
  if (!car.value) return []
  const c = car.value
  return carsStore.active
    .filter(s => s.id !== c.id && (s.tipo === c.tipo || Math.abs(s.precio - c.precio) / c.precio < 0.3))
    .slice(0, 4)
})

// Calculadora
const calc = reactive({ enganche: 0, meses: 24 })
const mensualidad = computed(() => {
  if (!car.value) return 0
  const eng = calc.enganche || car.value.enganche || 0
  return calcMensualidad(car.value.precio, eng, calc.meses)
})

// Formulario de contacto
const form = reactive({ nombre: '', telefono: '', mensaje: '' })

function submitContact() {
  leadsStore.save({
    nombre: form.nombre,
    telefono: form.telefono,
    email: '',
    mensaje: form.mensaje,
    autoInteres: `${car.value.marca} ${car.value.modelo} ${car.value.version} ${car.value.año}`,
  })
  toast.success('¡Consulta enviada! Te contactaremos pronto.')
  form.nombre = ''
  form.telefono = ''
  form.mensaje = ''
}

function toggleFav() {
  favStore.toggle(car.value.id)
  toast.info(isFav.value ? 'Agregado a favoritos' : 'Quitado de favoritos')
}

function prevImg() {
  const len = car.value?.imagenes?.length || 1
  activeImg.value = (activeImg.value - 1 + len) % len
}

function nextImg() {
  const len = car.value?.imagenes?.length || 1
  activeImg.value = (activeImg.value + 1) % len
}

function copyLink() {
  navigator.clipboard.writeText(window.location.href)
  toast.success('Enlace copiado al portapapeles')
}

onMounted(async () => {
  const id = route.params.id
  try {
    // fetchById llama GET /api/cars/:id que incrementa vistas en el servidor
    const fetched = await carsStore.fetchById(id)
    car.value = fetched
    viewCount.value = fetched.vistas
    document.title = `${fetched.marca} ${fetched.modelo} ${fetched.año} — LoteAutos`
    calc.enganche = fetched.enganche || Math.round(fetched.precio * 0.2)
  } catch {
    car.value = null
  } finally {
    loading.value = false
  }
})

// Reset imagen al cambiar de auto
watch(() => route.params.id, async (id) => {
  activeImg.value = 0
  try {
    const fetched = await carsStore.fetchById(id)
    car.value = fetched
    viewCount.value = fetched.vistas
    document.title = `${fetched.marca} ${fetched.modelo} ${fetched.año} — LoteAutos`
  } catch {
    car.value = null
  }
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
