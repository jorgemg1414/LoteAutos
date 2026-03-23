<template>
  <div class="space-y-6">
    <!-- Marcas -->
    <div>
      <h4 class="label">Marca</h4>
      <div class="space-y-2 max-h-40 overflow-y-auto pr-1">
        <label
          v-for="brand in brands"
          :key="brand"
          class="flex items-center gap-2 cursor-pointer group"
        >
          <div class="relative w-4 h-4 flex-shrink-0">
            <input
              type="checkbox"
              :value="brand"
              v-model="localFilters.marcas"
              class="sr-only peer"
            />
            <div class="w-4 h-4 rounded border border-dark-400 peer-checked:bg-amber-500 peer-checked:border-amber-500 transition-all group-hover:border-amber-500/50" />
            <svg class="absolute inset-0 w-4 h-4 text-dark-900 opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <span class="text-sm text-metal-400 group-hover:text-white transition-colors">{{ brand }}</span>
        </label>
      </div>
    </div>

    <!-- Tipo -->
    <div>
      <h4 class="label">Tipo de vehículo</h4>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="tipo in tipos"
          :key="tipo"
          @click="toggleTipo(tipo)"
          class="px-3 py-1.5 rounded-full text-xs font-dm border transition-all duration-200"
          :class="localFilters.tipos.includes(tipo)
            ? 'bg-amber-500/20 border-amber-500 text-amber-400'
            : 'border-dark-500 text-metal-400 hover:border-amber-500/50 hover:text-metal-300'"
        >
          {{ tipo }}
        </button>
      </div>
    </div>

    <!-- Rango de precio -->
    <div>
      <h4 class="label">Precio máximo</h4>
      <div class="space-y-2">
        <input
          type="range"
          v-model.number="localFilters.precioMax"
          :min="priceRange.min"
          :max="priceRange.max"
          :step="10000"
          class="w-full accent-amber-500"
        />
        <div class="flex justify-between text-xs text-metal-500">
          <span>{{ formatPrice(priceRange.min) }}</span>
          <span class="text-amber-400 font-semibold">{{ formatPrice(localFilters.precioMax) }}</span>
        </div>
      </div>
    </div>

    <!-- Año -->
    <div>
      <h4 class="label">Año</h4>
      <div class="flex gap-2 items-center">
        <input type="number" v-model.number="localFilters.añoDesde" placeholder="Desde" class="input-field text-xs py-2" :min="2000" :max="currentYear" />
        <span class="text-metal-500 text-xs">—</span>
        <input type="number" v-model.number="localFilters.añoHasta" placeholder="Hasta" class="input-field text-xs py-2" :min="2000" :max="currentYear" />
      </div>
    </div>

    <!-- Kilometraje máximo -->
    <div>
      <h4 class="label">Kilometraje máximo</h4>
      <input type="number" v-model.number="localFilters.kmMax" placeholder="Ej: 50000" class="input-field" step="5000" />
    </div>

    <!-- Transmisión -->
    <div>
      <h4 class="label">Transmisión</h4>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="trans in transmisiones"
          :key="trans"
          @click="toggleTransmision(trans)"
          class="px-3 py-1.5 rounded-full text-xs font-dm border transition-all duration-200"
          :class="localFilters.transmisiones.includes(trans)
            ? 'bg-amber-500/20 border-amber-500 text-amber-400'
            : 'border-dark-500 text-metal-400 hover:border-amber-500/50 hover:text-metal-300'"
        >
          {{ trans }}
        </button>
      </div>
    </div>

    <!-- Combustible -->
    <div>
      <h4 class="label">Combustible</h4>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="comb in combustibles"
          :key="comb"
          @click="toggleCombustible(comb)"
          class="px-3 py-1.5 rounded-full text-xs font-dm border transition-all duration-200"
          :class="localFilters.combustibles.includes(comb)
            ? 'bg-amber-500/20 border-amber-500 text-amber-400'
            : 'border-dark-500 text-metal-400 hover:border-amber-500/50 hover:text-metal-300'"
        >
          {{ comb }}
        </button>
      </div>
    </div>

    <!-- Condición -->
    <div>
      <h4 class="label">Condición</h4>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="cond in condiciones"
          :key="cond"
          @click="toggleCondicion(cond)"
          class="px-3 py-1.5 rounded-full text-xs font-dm border transition-all duration-200"
          :class="localFilters.condiciones.includes(cond)
            ? 'bg-amber-500/20 border-amber-500 text-amber-400'
            : 'border-dark-500 text-metal-400 hover:border-amber-500/50 hover:text-metal-300'"
        >
          {{ cond }}
        </button>
      </div>
    </div>

    <!-- Botones -->
    <div class="flex gap-2 pt-2">
      <button @click="apply" class="btn-primary flex-1 justify-center text-sm py-2">
        Aplicar
      </button>
      <button @click="reset" class="btn-secondary flex-1 justify-center text-sm py-2">
        Limpiar
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'
import { formatPrice } from '@/utils/formatters'

const props = defineProps({
  filters: { type: Object, required: true },
  brands: { type: Array, default: () => [] },
  tipos: { type: Array, default: () => [] },
  priceRange: { type: Object, default: () => ({ min: 0, max: 2000000 }) },
})

const emit = defineEmits(['update:filters', 'apply', 'reset'])

const currentYear = new Date().getFullYear()

const transmisiones = ['Automática', 'Manual', 'CVT', 'Semiautomática']
const combustibles = ['Gasolina', 'Diésel', 'Híbrido', 'Eléctrico', 'Gas']
const condiciones = ['Nuevo', 'Seminuevo', 'Usado']

const localFilters = reactive({ ...props.filters })

// Sync cuando cambian los filtros externamente
watch(() => props.filters, (v) => Object.assign(localFilters, v), { deep: true })

function toggleTipo(t) {
  const idx = localFilters.tipos.indexOf(t)
  if (idx >= 0) localFilters.tipos.splice(idx, 1)
  else localFilters.tipos.push(t)
}
function toggleTransmision(t) {
  const idx = localFilters.transmisiones.indexOf(t)
  if (idx >= 0) localFilters.transmisiones.splice(idx, 1)
  else localFilters.transmisiones.push(t)
}
function toggleCombustible(c) {
  const idx = localFilters.combustibles.indexOf(c)
  if (idx >= 0) localFilters.combustibles.splice(idx, 1)
  else localFilters.combustibles.push(c)
}
function toggleCondicion(c) {
  const idx = localFilters.condiciones.indexOf(c)
  if (idx >= 0) localFilters.condiciones.splice(idx, 1)
  else localFilters.condiciones.push(c)
}

function apply() {
  emit('update:filters', { ...localFilters })
  emit('apply')
}

function reset() {
  Object.assign(localFilters, {
    marcas: [],
    tipos: [],
    precioMax: props.priceRange.max,
    añoDesde: null,
    añoHasta: null,
    kmMax: null,
    transmisiones: [],
    combustibles: [],
    condiciones: [],
  })
  emit('update:filters', { ...localFilters })
  emit('reset')
}
</script>
