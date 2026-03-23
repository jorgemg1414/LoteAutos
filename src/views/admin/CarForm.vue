<template>
  <div class="min-h-screen pt-14 bg-dark-900">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="flex items-center gap-4 mb-8">
        <RouterLink to="/admin/autos" class="p-2 rounded-lg text-metal-400 hover:text-white hover:bg-dark-700 transition-all">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        </RouterLink>
        <div>
          <h1 class="font-syne font-bold text-2xl text-white">{{ isEdit ? 'Editar auto' : 'Agregar nuevo auto' }}</h1>
          <p class="text-metal-500 text-sm">{{ isEdit ? `ID: ${route.params.id}` : 'Completa el formulario' }}</p>
        </div>
      </div>

      <form @submit.prevent="submitForm" class="space-y-6">
        <!-- Sección: Info básica -->
        <div class="card p-6">
          <h2 class="font-syne font-semibold text-white text-lg mb-5">Información básica</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label class="label">Marca *</label>
              <select v-model="form.marca" class="input-field" required>
                <option value="">Seleccionar...</option>
                <option v-for="m in marcasComunes" :key="m">{{ m }}</option>
              </select>
            </div>
            <div>
              <label class="label">Modelo *</label>
              <input v-model="form.modelo" type="text" class="input-field" placeholder="RAV4, Civic, F-150..." required />
            </div>
            <div>
              <label class="label">Versión / Trim</label>
              <input v-model="form.version" type="text" class="input-field" placeholder="Sport, Limited, 4x4..." />
            </div>
            <div>
              <label class="label">Año *</label>
              <input v-model.number="form.año" type="number" class="input-field" :min="2000" :max="2026" required />
            </div>
            <div>
              <label class="label">Tipo *</label>
              <select v-model="form.tipo" class="input-field" required>
                <option value="">Seleccionar...</option>
                <option>SUV</option><option>Sedán</option><option>Hatchback</option>
                <option>Pickup</option><option>Coupé</option><option>Van</option><option>Convertible</option>
              </select>
            </div>
            <div>
              <label class="label">Condición *</label>
              <select v-model="form.condicion" class="input-field" required>
                <option>Nuevo</option><option>Seminuevo</option><option>Usado</option>
              </select>
            </div>
            <div>
              <label class="label">Estado *</label>
              <select v-model="form.estado" class="input-field" required>
                <option>Activo</option><option>Vendido</option><option>Reservado</option><option>Oculto</option>
              </select>
            </div>
            <div class="flex items-center gap-3 pt-5">
              <button
                type="button"
                @click="form.destacado = !form.destacado"
                class="relative w-10 h-6 rounded-full transition-colors"
                :class="form.destacado ? 'bg-amber-500' : 'bg-dark-500'"
              >
                <span class="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all" :class="form.destacado ? 'left-5' : 'left-1'" />
              </button>
              <label class="text-metal-300 text-sm">Destacado en Home</label>
            </div>
          </div>
        </div>

        <!-- Sección: Precio -->
        <div class="card p-6">
          <h2 class="font-syne font-semibold text-white text-lg mb-5">Precio</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label class="label">Precio de venta * (MXN)</label>
              <input v-model.number="form.precio" type="number" class="input-field" placeholder="350000" min="0" step="1000" required />
            </div>
            <div>
              <label class="label">Precio anterior / tachado</label>
              <input v-model.number="form.precioAnterior" type="number" class="input-field" placeholder="400000" min="0" step="1000" />
            </div>
            <div>
              <label class="label">Precio de enganche</label>
              <input v-model.number="form.enganche" type="number" class="input-field" placeholder="70000" min="0" step="1000" />
            </div>
            <div>
              <label class="label">Mensualidades desde</label>
              <input v-model.number="form.mensualidades" type="number" class="input-field" placeholder="5000" min="0" />
            </div>
            <div class="flex items-center gap-3 pt-5">
              <button
                type="button"
                @click="form.negociable = !form.negociable"
                class="relative w-10 h-6 rounded-full transition-colors"
                :class="form.negociable ? 'bg-amber-500' : 'bg-dark-500'"
              >
                <span class="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all" :class="form.negociable ? 'left-5' : 'left-1'" />
              </button>
              <label class="text-metal-300 text-sm">Precio negociable</label>
            </div>
          </div>
        </div>

        <!-- Sección: Especificaciones técnicas -->
        <div class="card p-6">
          <h2 class="font-syne font-semibold text-white text-lg mb-5">Especificaciones técnicas</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label class="label">Kilometraje *</label>
              <input v-model.number="form.kilometraje" type="number" class="input-field" placeholder="35000" min="0" required />
            </div>
            <div>
              <label class="label">Transmisión *</label>
              <select v-model="form.transmision" class="input-field" required>
                <option>Automática</option><option>Manual</option><option>CVT</option><option>Semiautomática</option>
              </select>
            </div>
            <div>
              <label class="label">Combustible</label>
              <select v-model="form.combustible" class="input-field">
                <option>Gasolina</option><option>Diésel</option><option>Híbrido</option><option>Eléctrico</option><option>Gas</option>
              </select>
            </div>
            <div>
              <label class="label">Motor</label>
              <input v-model="form.motor" type="text" class="input-field" placeholder="2.0L Turbo, 3.5L V6..." />
            </div>
            <div>
              <label class="label">Cilindros</label>
              <input v-model.number="form.cilindros" type="number" class="input-field" placeholder="4" min="2" max="16" />
            </div>
            <div>
              <label class="label">Potencia (HP)</label>
              <input v-model.number="form.hp" type="number" class="input-field" placeholder="200" min="0" />
            </div>
            <div>
              <label class="label">Tracción</label>
              <select v-model="form.traccion" class="input-field">
                <option>FWD</option><option>RWD</option><option>AWD</option><option>4x4</option>
              </select>
            </div>
            <div>
              <label class="label">Color exterior</label>
              <div class="flex gap-2 items-center">
                <input type="color" v-model="form.colorExterior" class="w-10 h-10 rounded border border-dark-500 bg-dark-700 cursor-pointer" />
                <input v-model="form.colorExterior" type="text" class="input-field flex-1" placeholder="#ffffff" />
              </div>
            </div>
            <div>
              <label class="label">Color interior</label>
              <input v-model="form.colorInterior" type="text" class="input-field" placeholder="Negro, Beige, Café..." />
            </div>
            <div>
              <label class="label">Número de puertas</label>
              <input v-model.number="form.puertas" type="number" class="input-field" placeholder="4" min="2" max="6" />
            </div>
            <div>
              <label class="label">Capacidad de pasajeros</label>
              <input v-model.number="form.pasajeros" type="number" class="input-field" placeholder="5" min="1" max="9" />
            </div>
            <div>
              <label class="label">Número de dueños previos</label>
              <input v-model.number="form.dueñosPrevios" type="number" class="input-field" placeholder="1" min="0" />
            </div>
            <div>
              <label class="label">VIN</label>
              <input v-model="form.vin" type="text" class="input-field" placeholder="1HGBH41JXMN109186" />
            </div>
            <div>
              <label class="label">Placas actuales</label>
              <input v-model="form.placas" type="text" class="input-field" placeholder="AAA-12-34" />
            </div>
          </div>
        </div>

        <!-- Sección: Equipamiento -->
        <div class="card p-6">
          <h2 class="font-syne font-semibold text-white text-lg mb-5">Equipamiento y extras</h2>
          <div class="space-y-5">
            <div v-for="group in equipGroups" :key="group.label">
              <h3 class="text-metal-400 text-xs uppercase tracking-wide font-dm mb-3">{{ group.label }}</h3>
              <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                <label
                  v-for="item in group.items"
                  :key="item"
                  class="flex items-center gap-2 cursor-pointer group"
                >
                  <div class="relative w-4 h-4 flex-shrink-0">
                    <input type="checkbox" :value="item" v-model="form.equipamiento" class="sr-only peer" />
                    <div class="w-4 h-4 rounded border border-dark-400 peer-checked:bg-amber-500 peer-checked:border-amber-500 transition-all group-hover:border-amber-500/50" />
                    <svg class="absolute inset-0 w-4 h-4 text-dark-900 opacity-0 peer-checked:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                  </div>
                  <span class="text-xs text-metal-400 group-hover:text-metal-200 transition-colors">{{ item }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Sección: Descripción e historial -->
        <div class="card p-6">
          <h2 class="font-syne font-semibold text-white text-lg mb-5">Descripción e historial</h2>
          <div class="space-y-4">
            <div>
              <label class="label">Descripción del auto</label>
              <textarea v-model="form.descripcion" class="input-field resize-none" rows="5" placeholder="Describe el auto, su historia, características especiales..." />
            </div>
            <div>
              <label class="label">Historial de servicio</label>
              <textarea v-model="form.historialServicio" class="input-field resize-none" rows="3" placeholder="Servicios realizados, garantías, revisiones..." />
            </div>
          </div>
        </div>

        <!-- Sección: Imágenes -->
        <div class="card p-6">
          <h2 class="font-syne font-semibold text-white text-lg mb-5">Imágenes</h2>
          <p class="text-metal-500 text-xs mb-4">La primera imagen es la imagen principal. Máximo 10 imágenes.</p>

          <!-- Input de archivo -->
          <label class="flex flex-col items-center justify-center border-2 border-dashed border-dark-500 hover:border-amber-500/50 rounded-xl p-8 cursor-pointer transition-colors mb-4">
            <svg class="w-8 h-8 text-metal-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            <p class="text-metal-400 text-sm">Haz clic para subir imágenes</p>
            <p class="text-metal-600 text-xs mt-1">JPG, PNG, WebP</p>
            <input type="file" multiple accept="image/*" class="hidden" @change="handleImages" />
          </label>

          <!-- Vista previa -->
          <div v-if="form.imagenes.length > 0" class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            <div
              v-for="(img, i) in form.imagenes"
              :key="i"
              class="relative group aspect-video rounded-lg overflow-hidden border-2 transition-colors"
              :class="i === 0 ? 'border-amber-500' : 'border-dark-500'"
            >
              <img :src="img" class="w-full h-full object-cover" />
              <!-- Badge principal -->
              <div v-if="i === 0" class="absolute top-1 left-1 bg-amber-500 text-dark-900 text-xs font-bold px-1.5 py-0.5 rounded">
                Principal
              </div>
              <!-- Controles -->
              <div class="absolute inset-0 bg-dark-900/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                <button v-if="i > 0" @click.prevent="moveImg(i, i-1)" class="p-1 bg-dark-700 rounded text-white hover:bg-dark-600">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
                </button>
                <button v-if="i < form.imagenes.length - 1" @click.prevent="moveImg(i, i+1)" class="p-1 bg-dark-700 rounded text-white hover:bg-dark-600">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                </button>
                <button @click.prevent="removeImg(i)" class="p-1 bg-red-500/80 rounded text-white hover:bg-red-500">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="flex gap-3 justify-end">
          <RouterLink to="/admin/autos" class="btn-secondary">Cancelar</RouterLink>
          <button type="submit" class="btn-primary">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            {{ isEdit ? 'Guardar cambios' : 'Agregar auto' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, computed } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useCarsStore } from '@/stores/cars'
import { useToast } from '@/components/common/useToast'

const route = useRoute()
const router = useRouter()
const carsStore = useCarsStore()
const toast = useToast()

const isEdit = computed(() => !!route.params.id && route.params.id !== 'nuevo')

const marcasComunes = ['Acura','Audi','BMW','Buick','Cadillac','Chevrolet','Chrysler','Dodge','Ford','GMC','Honda','Hyundai','Infiniti','Jaguar','Jeep','Kia','Land Rover','Lexus','Lincoln','Mazda','Mercedes-Benz','Mitsubishi','Nissan','Porsche','RAM','Subaru','Tesla','Toyota','Volkswagen','Volvo','Otro']

const equipGroups = [
  {
    label: 'Seguridad',
    items: ['Bolsas de aire','ABS','Control de estabilidad','Cámara trasera','Sensores de estacionamiento','Alerta de colisión']
  },
  {
    label: 'Confort',
    items: ['A/C','A/C dual','Asientos de cuero','Asientos eléctricos','Calefacción de asientos','Techo solar','Techo panorámico']
  },
  {
    label: 'Tecnología',
    items: ['Pantalla táctil','Apple CarPlay','Android Auto','GPS integrado','Bluetooth','Carga inalámbrica','Sonido premium']
  },
  {
    label: 'Exterior',
    items: ['Rines de aleación','Barras de techo','Faros LED','Faros adaptativos','Vidrios eléctricos']
  },
]

const form = reactive({
  id: null,
  marca: '', modelo: '', version: '', año: new Date().getFullYear(),
  tipo: 'SUV', condicion: 'Seminuevo', estado: 'Activo', destacado: false,
  precio: null, precioAnterior: null, negociable: false, enganche: null, mensualidades: null,
  kilometraje: null, transmision: 'Automática', combustible: 'Gasolina',
  motor: '', cilindros: 4, hp: null, traccion: 'FWD',
  colorExterior: '#1a1a2e', colorInterior: '', puertas: 4, pasajeros: 5,
  dueñosPrevios: 0, vin: '', placas: '',
  equipamiento: [], descripcion: '', historialServicio: '', imagenes: [],
  fechaAgregado: new Date().toISOString(),
})

onMounted(() => {
  carsStore.load()
  if (isEdit.value) {
    const car = carsStore.getById(route.params.id)
    if (car) Object.assign(form, car)
  }
})

// Manejo de imágenes — convierte a base64
function handleImages(e) {
  const files = Array.from(e.target.files)
  const remaining = 10 - form.imagenes.length
  files.slice(0, remaining).forEach(file => {
    const reader = new FileReader()
    reader.onload = (ev) => { form.imagenes.push(ev.target.result) }
    reader.readAsDataURL(file)
  })
}

function removeImg(i) { form.imagenes.splice(i, 1) }
function moveImg(from, to) {
  const imgs = [...form.imagenes]
  const [moved] = imgs.splice(from, 1)
  imgs.splice(to, 0, moved)
  form.imagenes = imgs
}

function submitForm() {
  if (!form.marca || !form.modelo || !form.año || !form.precio) {
    toast.error('Completa los campos requeridos')
    return
  }
  carsStore.save({ ...form })
  toast.success(isEdit.value ? 'Auto actualizado correctamente' : 'Auto agregado exitosamente')
  router.push('/admin/autos')
}
</script>
