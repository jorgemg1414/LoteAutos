<template>
  <div class="min-h-screen pt-14 bg-dark-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="font-syne font-bold text-2xl text-white">Leads / Consultas</h1>
          <p class="text-metal-500 text-sm mt-1">{{ leadsStore.pendingCount }} pendientes de {{ leadsStore.leads.length }} total</p>
        </div>
        <button @click="exportCSV" class="btn-secondary text-sm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          Exportar CSV
        </button>
      </div>

      <!-- Filtros -->
      <div class="flex flex-wrap gap-3 mb-5">
        <div class="relative flex-1 min-w-48 max-w-sm">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-metal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input v-model="search" type="text" placeholder="Buscar por nombre, teléfono..." class="input-field pl-9 text-sm" />
        </div>
        <div class="flex gap-2">
          <button
            v-for="status in ['Todos', 'Pendiente', 'Atendido']"
            :key="status"
            @click="filterStatus = status"
            class="px-3 py-2 rounded-lg text-xs font-dm border transition-all"
            :class="filterStatus === status
              ? 'bg-amber-500/20 border-amber-500 text-amber-400'
              : 'border-dark-500 text-metal-400 hover:border-amber-500/50'"
          >
            {{ status }}
          </button>
        </div>
      </div>

      <!-- Tabla -->
      <div class="card overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-dark-700/50 border-b border-dark-600">
              <tr>
                <th class="text-left px-4 py-3 text-metal-500 font-dm text-xs uppercase tracking-wide">Fecha</th>
                <th class="text-left px-4 py-3 text-metal-500 font-dm text-xs uppercase tracking-wide">Nombre</th>
                <th class="text-left px-4 py-3 text-metal-500 font-dm text-xs uppercase tracking-wide">Teléfono</th>
                <th class="text-left px-4 py-3 text-metal-500 font-dm text-xs uppercase tracking-wide hidden lg:table-cell">Auto de interés</th>
                <th class="text-left px-4 py-3 text-metal-500 font-dm text-xs uppercase tracking-wide hidden md:table-cell">Mensaje</th>
                <th class="text-left px-4 py-3 text-metal-500 font-dm text-xs uppercase tracking-wide">Estado</th>
                <th class="text-right px-4 py-3 text-metal-500 font-dm text-xs uppercase tracking-wide">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="lead in filteredLeads"
                :key="lead.id"
                class="border-b border-dark-700 last:border-0 hover:bg-dark-700/30 transition-colors"
              >
                <td class="px-4 py-3 text-metal-400 text-xs whitespace-nowrap">{{ formatDateShort(lead.fecha) }}</td>
                <td class="px-4 py-3 text-white font-medium">{{ lead.nombre }}</td>
                <td class="px-4 py-3">
                  <a :href="`tel:${lead.telefono}`" class="text-amber-400 hover:text-amber-300 transition-colors">
                    {{ lead.telefono }}
                  </a>
                </td>
                <td class="px-4 py-3 text-metal-400 max-w-xs truncate hidden lg:table-cell">{{ lead.autoInteres || '—' }}</td>
                <td class="px-4 py-3 text-metal-400 max-w-xs truncate hidden md:table-cell">{{ lead.mensaje }}</td>
                <td class="px-4 py-3">
                  <select
                    :value="lead.estado"
                    @change="leadsStore.updateStatus(lead.id, $event.target.value)"
                    class="bg-dark-600 border border-dark-500 text-xs rounded-lg px-2 py-1 outline-none transition-all"
                    :class="lead.estado === 'Atendido' ? 'text-green-400' : 'text-amber-400'"
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="Atendido">Atendido</option>
                  </select>
                </td>
                <td class="px-4 py-3 text-right">
                  <div class="flex items-center justify-end gap-1">
                    <!-- WhatsApp -->
                    <a
                      :href="`https://wa.me/52${lead.telefono}?text=${encodeURIComponent(`Hola ${lead.nombre}, te contactamos de LoteAutos respecto a tu consulta sobre ${lead.autoInteres || 'nuestros autos'}.`)}`"
                      target="_blank"
                      class="p-1.5 rounded-lg text-metal-400 hover:text-green-400 hover:bg-dark-600 transition-all"
                      title="WhatsApp"
                    >
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    </a>
                    <!-- Ver detalle -->
                    <button @click="viewLead(lead)" class="p-1.5 rounded-lg text-metal-400 hover:text-amber-400 hover:bg-dark-600 transition-all" title="Ver detalle">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                    </button>
                    <!-- Eliminar -->
                    <button @click="leadsStore.remove(lead.id)" class="p-1.5 rounded-lg text-metal-400 hover:text-red-400 hover:bg-dark-600 transition-all" title="Eliminar">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-if="filteredLeads.length === 0" class="text-center py-12 text-metal-500">
            Sin leads que coincidan
          </div>
        </div>
      </div>
    </div>

    <!-- Modal detalle lead -->
    <Modal v-model="detailModal" :title="`Lead: ${selectedLead?.nombre}`">
      <div v-if="selectedLead" class="space-y-3 text-sm">
        <div><span class="text-metal-500">Fecha:</span> <span class="text-white ml-2">{{ formatDate(selectedLead.fecha) }}</span></div>
        <div><span class="text-metal-500">Email:</span> <span class="text-white ml-2">{{ selectedLead.email || '—' }}</span></div>
        <div><span class="text-metal-500">Teléfono:</span> <span class="text-amber-400 ml-2">{{ selectedLead.telefono }}</span></div>
        <div><span class="text-metal-500">Auto:</span> <span class="text-white ml-2">{{ selectedLead.autoInteres || 'No especificado' }}</span></div>
        <div>
          <span class="text-metal-500">Mensaje:</span>
          <p class="text-metal-300 mt-1 bg-dark-700/50 rounded-lg p-3">{{ selectedLead.mensaje }}</p>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useLeadsStore } from '@/stores/leads'
import Modal from '@/components/common/Modal.vue'
import { formatDate, formatDateShort } from '@/utils/formatters'

const leadsStore = useLeadsStore()
const search = ref('')
const filterStatus = ref('Todos')
const detailModal = ref(false)
const selectedLead = ref(null)

onMounted(() => leadsStore.load())

const filteredLeads = computed(() => {
  let list = leadsStore.leads
  if (search.value) {
    const q = search.value.toLowerCase()
    list = list.filter(l =>
      l.nombre.toLowerCase().includes(q) ||
      l.telefono.includes(q) ||
      l.email?.toLowerCase().includes(q)
    )
  }
  if (filterStatus.value !== 'Todos') {
    list = list.filter(l => l.estado === filterStatus.value)
  }
  return list
})

function viewLead(lead) {
  selectedLead.value = lead
  detailModal.value = true
}

function exportCSV() {
  const headers = ['Fecha','Nombre','Email','Teléfono','Auto de interés','Mensaje','Estado']
  const rows = leadsStore.leads.map(l => [
    l.fecha, l.nombre, l.email || '', l.telefono, l.autoInteres || '', l.mensaje, l.estado
  ])
  const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `leads_loteautos_${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
</script>
