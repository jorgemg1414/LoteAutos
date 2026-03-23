<template>
  <div class="min-h-screen pt-14 bg-dark-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="font-syne font-bold text-2xl text-white">Inventario</h1>
          <p class="text-metal-500 text-sm mt-1">{{ filteredCars.length }} vehículos</p>
        </div>
        <RouterLink to="/admin/autos/nuevo" class="btn-primary text-sm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          Nuevo auto
        </RouterLink>
      </div>

      <!-- Filtros de tabla -->
      <div class="flex flex-wrap gap-3 mb-5">
        <div class="relative flex-1 min-w-48 max-w-sm">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-metal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input v-model="search" type="text" placeholder="Buscar por marca, modelo..." class="input-field pl-9 text-sm" />
        </div>
        <select v-model="filterStatus" class="input-field text-sm py-2 w-auto">
          <option value="">Todos los estados</option>
          <option>Activo</option>
          <option>Vendido</option>
          <option>Reservado</option>
          <option>Oculto</option>
        </select>
      </div>

      <!-- Tabla -->
      <div class="card overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-dark-700/50 border-b border-dark-600">
              <tr>
                <th class="text-left px-4 py-3 text-metal-500 font-dm text-xs uppercase tracking-wide">Auto</th>
                <th class="text-left px-4 py-3 text-metal-500 font-dm text-xs uppercase tracking-wide hidden md:table-cell">Año</th>
                <th class="text-left px-4 py-3 text-metal-500 font-dm text-xs uppercase tracking-wide">Precio</th>
                <th class="text-left px-4 py-3 text-metal-500 font-dm text-xs uppercase tracking-wide hidden lg:table-cell">Condición</th>
                <th class="text-left px-4 py-3 text-metal-500 font-dm text-xs uppercase tracking-wide">Estado</th>
                <th class="text-right px-4 py-3 text-metal-500 font-dm text-xs uppercase tracking-wide">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="car in paginatedCars"
                :key="car.id"
                class="border-b border-dark-700 last:border-0 hover:bg-dark-700/30 transition-colors"
              >
                <!-- Auto -->
                <td class="px-4 py-3">
                  <div class="flex items-center gap-3">
                    <img
                      :src="car.imagenes?.[0] || 'https://placehold.co/80x60/1a1a24/f59e0b?text=Auto'"
                      class="w-12 h-9 object-cover rounded-lg flex-shrink-0"
                      :alt="car.marca"
                    />
                    <div>
                      <p class="text-white font-dm font-medium line-clamp-1">{{ car.marca }} {{ car.modelo }}</p>
                      <p class="text-metal-500 text-xs">{{ car.version }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3 text-metal-300 hidden md:table-cell">{{ car.año }}</td>
                <td class="px-4 py-3 text-amber-400 font-semibold">{{ formatPrice(car.precio) }}</td>
                <td class="px-4 py-3 hidden lg:table-cell">
                  <span :class="conditionColor(car.condicion)" class="badge">{{ car.condicion }}</span>
                </td>
                <td class="px-4 py-3">
                  <span class="text-xs font-dm" :class="statusColor(car.estado)">{{ car.estado }}</span>
                </td>
                <!-- Acciones -->
                <td class="px-4 py-3 text-right">
                  <div class="flex items-center justify-end gap-1">
                    <RouterLink
                      :to="`/admin/autos/${car.id}`"
                      class="p-1.5 rounded-lg text-metal-400 hover:text-amber-400 hover:bg-dark-600 transition-all"
                      title="Editar"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                    </RouterLink>
                    <button
                      @click="duplicateCar(car)"
                      class="p-1.5 rounded-lg text-metal-400 hover:text-blue-400 hover:bg-dark-600 transition-all"
                      title="Duplicar"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                    </button>
                    <button
                      v-if="car.estado !== 'Vendido'"
                      @click="carsStore.setStatus(car.id, car.estado === 'Activo' ? 'Oculto' : 'Activo')"
                      class="p-1.5 rounded-lg text-metal-400 hover:text-green-400 hover:bg-dark-600 transition-all"
                      :title="car.estado === 'Activo' ? 'Ocultar' : 'Activar'"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="car.estado === 'Activo' ? 'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21' : 'M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'"/></svg>
                    </button>
                    <button
                      v-if="car.estado !== 'Vendido'"
                      @click="carsStore.setStatus(car.id, 'Vendido')"
                      class="p-1.5 rounded-lg text-metal-400 hover:text-amber-400 hover:bg-dark-600 transition-all"
                      title="Marcar como vendido"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>
                    </button>
                    <button
                      @click="confirmDelete(car)"
                      class="p-1.5 rounded-lg text-metal-400 hover:text-red-400 hover:bg-dark-600 transition-all"
                      title="Eliminar"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-if="filteredCars.length === 0" class="text-center py-12 text-metal-500">
            Sin autos que coincidan con la búsqueda
          </div>
        </div>

        <!-- Paginación -->
        <div v-if="totalPages > 1" class="flex items-center justify-between px-4 py-3 border-t border-dark-600">
          <p class="text-metal-500 text-xs">Página {{ currentPage }} de {{ totalPages }}</p>
          <div class="flex gap-2">
            <button @click="currentPage--" :disabled="currentPage === 1" class="p-1.5 rounded border border-dark-500 text-metal-400 disabled:opacity-30 hover:border-amber-500 transition-all">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <button @click="currentPage++" :disabled="currentPage === totalPages" class="p-1.5 rounded border border-dark-500 text-metal-400 disabled:opacity-30 hover:border-amber-500 transition-all">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal confirmar eliminación -->
    <Modal v-model="deleteModal" title="Confirmar eliminación">
      <p class="text-metal-300">¿Estás seguro de que quieres eliminar <span class="text-white font-semibold">{{ carToDelete?.marca }} {{ carToDelete?.modelo }}</span>? Esta acción no se puede deshacer.</p>
      <template #footer>
        <div class="flex gap-3 justify-end">
          <button @click="deleteModal = false" class="btn-secondary">Cancelar</button>
          <button @click="doDelete" class="bg-red-500 hover:bg-red-400 text-white font-syne font-semibold px-4 py-2 rounded-lg transition-all text-sm">Eliminar</button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useCarsStore } from '@/stores/cars'
import { useToast } from '@/components/common/useToast'
import Modal from '@/components/common/Modal.vue'
import { formatPrice, conditionColor, statusColor } from '@/utils/formatters'

const carsStore = useCarsStore()
const toast = useToast()

const search = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const PER_PAGE = 15
const deleteModal = ref(false)
const carToDelete = ref(null)

onMounted(() => carsStore.load())

const filteredCars = computed(() => {
  let list = carsStore.cars
  if (search.value) {
    const q = search.value.toLowerCase()
    list = list.filter(c =>
      c.marca.toLowerCase().includes(q) ||
      c.modelo.toLowerCase().includes(q) ||
      c.version?.toLowerCase().includes(q)
    )
  }
  if (filterStatus.value) list = list.filter(c => c.estado === filterStatus.value)
  return list
})

const totalPages = computed(() => Math.ceil(filteredCars.value.length / PER_PAGE))
const paginatedCars = computed(() => {
  const s = (currentPage.value - 1) * PER_PAGE
  return filteredCars.value.slice(s, s + PER_PAGE)
})

function duplicateCar(car) {
  carsStore.duplicate(car.id)
  toast.success('Auto duplicado exitosamente')
}

function confirmDelete(car) {
  carToDelete.value = car
  deleteModal.value = true
}

function doDelete() {
  carsStore.remove(carToDelete.value.id)
  toast.info('Auto eliminado')
  deleteModal.value = false
  carToDelete.value = null
}
</script>
