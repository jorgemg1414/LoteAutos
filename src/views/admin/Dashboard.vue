<template>
  <div class="min-h-screen pt-14 bg-dark-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="font-syne font-bold text-2xl text-white">Dashboard</h1>
          <p class="text-metal-500 text-sm mt-1">Resumen del negocio</p>
        </div>
        <RouterLink to="/admin/autos/nuevo" class="btn-primary text-sm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          Agregar auto
        </RouterLink>
      </div>

      <!-- KPIs -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div v-for="kpi in kpis" :key="kpi.label" class="card p-5">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-metal-500 text-xs uppercase tracking-wide mb-1">{{ kpi.label }}</p>
              <p class="font-syne font-bold text-2xl text-white">{{ kpi.value }}</p>
            </div>
            <div class="w-10 h-10 rounded-xl flex items-center justify-center" :class="kpi.bg">
              <span class="text-xl">{{ kpi.icon }}</span>
            </div>
          </div>
          <p class="text-xs mt-2" :class="kpi.color">{{ kpi.sub }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Distribución por tipo (barra CSS) -->
        <div class="lg:col-span-2 card p-6">
          <h2 class="font-syne font-semibold text-white mb-5">Distribución por tipo</h2>
          <div class="space-y-3">
            <div v-for="item in typeDistribution" :key="item.tipo">
              <div class="flex items-center justify-between text-sm mb-1">
                <span class="text-metal-300">{{ item.tipo }}</span>
                <span class="text-metal-500">{{ item.count }} autos</span>
              </div>
              <div class="h-2 bg-dark-600 rounded-full overflow-hidden">
                <div
                  class="h-full bg-amber-500 rounded-full transition-all duration-700"
                  :style="{ width: `${item.pct}%` }"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Autos más vistos -->
        <div class="card p-6">
          <h2 class="font-syne font-semibold text-white mb-5">Más visitados</h2>
          <div class="space-y-3">
            <div
              v-for="(car, i) in topViewed"
              :key="car.id"
              class="flex items-center gap-3"
            >
              <span class="w-6 h-6 rounded-full bg-dark-600 text-xs font-bold text-metal-400 flex items-center justify-center flex-shrink-0">{{ i + 1 }}</span>
              <div class="flex-1 min-w-0">
                <p class="text-white text-sm font-dm line-clamp-1">{{ car.marca }} {{ car.modelo }}</p>
                <p class="text-metal-500 text-xs">{{ car.views }} visitas</p>
              </div>
              <RouterLink :to="`/admin/autos/${car.id}`" class="text-amber-500 hover:text-amber-400 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </RouterLink>
            </div>
            <p v-if="topViewed.length === 0" class="text-metal-500 text-sm">Sin datos de visitas aún.</p>
          </div>
        </div>
      </div>

      <!-- Últimos leads -->
      <div class="card p-6 mt-6">
        <div class="flex items-center justify-between mb-5">
          <h2 class="font-syne font-semibold text-white">Últimos leads</h2>
          <RouterLink to="/admin/leads" class="text-amber-500 hover:text-amber-400 text-sm transition-colors">
            Ver todos →
          </RouterLink>
        </div>
        <div v-if="leadsStore.recent.length === 0" class="text-metal-500 text-sm text-center py-6">
          Sin leads recibidos aún.
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-dark-600">
                <th class="text-left py-2 text-metal-500 font-dm text-xs uppercase tracking-wide">Nombre</th>
                <th class="text-left py-2 text-metal-500 font-dm text-xs uppercase tracking-wide">Teléfono</th>
                <th class="text-left py-2 text-metal-500 font-dm text-xs uppercase tracking-wide hidden md:table-cell">Auto</th>
                <th class="text-left py-2 text-metal-500 font-dm text-xs uppercase tracking-wide">Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="lead in leadsStore.recent" :key="lead.id" class="border-b border-dark-700 last:border-0">
                <td class="py-3 text-white">{{ lead.nombre }}</td>
                <td class="py-3 text-metal-300">{{ lead.telefono }}</td>
                <td class="py-3 text-metal-400 hidden md:table-cell max-w-xs truncate">{{ lead.autoInteres || '—' }}</td>
                <td class="py-3">
                  <span class="badge" :class="lead.estado === 'Atendido' ? 'badge-green' : 'badge-amber'">
                    {{ lead.estado }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useCarsStore } from '@/stores/cars'
import { useLeadsStore } from '@/stores/leads'
import { getAllViews } from '@/utils/storage'

const carsStore = useCarsStore()
const leadsStore = useLeadsStore()

onMounted(() => {
  carsStore.load()
  leadsStore.load()
})

const kpis = computed(() => [
  {
    label: 'Total autos',
    value: carsStore.total,
    icon: '🚗',
    bg: 'bg-amber-500/10',
    color: 'text-amber-400',
    sub: `${carsStore.active.length} activos`
  },
  {
    label: 'Activos',
    value: carsStore.active.length,
    icon: '✅',
    bg: 'bg-green-500/10',
    color: 'text-green-400',
    sub: 'En venta ahora'
  },
  {
    label: 'Vendidos',
    value: carsStore.sold.length,
    icon: '💰',
    bg: 'bg-blue-500/10',
    color: 'text-blue-400',
    sub: 'Total histórico'
  },
  {
    label: 'Leads nuevos',
    value: leadsStore.pendingCount,
    icon: '📬',
    bg: 'bg-purple-500/10',
    color: 'text-purple-400',
    sub: 'Pendientes'
  },
])

const typeDistribution = computed(() => {
  const total = carsStore.active.length || 1
  const grouped = {}
  carsStore.active.forEach(c => {
    grouped[c.tipo] = (grouped[c.tipo] || 0) + 1
  })
  return Object.entries(grouped)
    .map(([tipo, count]) => ({ tipo, count, pct: Math.round((count / total) * 100) }))
    .sort((a, b) => b.count - a.count)
})

const topViewed = computed(() => {
  const views = getAllViews()
  return carsStore.cars
    .map(c => ({ ...c, views: views[c.id] || 0 }))
    .filter(c => c.views > 0)
    .sort((a, b) => b.views - a.views)
    .slice(0, 5)
})
</script>
