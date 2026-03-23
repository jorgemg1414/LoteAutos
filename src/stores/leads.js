import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { storage } from '@/utils/storage'
import { seedLeads } from '@/utils/seedData'

export const useLeadsStore = defineStore('leads', () => {
  // Inicializa con seed si está vacío
  function init() {
    const existing = storage.get('leads')
    if (!existing) {
      storage.set('leads', seedLeads)
    }
  }

  const leads = ref([])

  function load() {
    init()
    leads.value = storage.get('leads') || []
  }

  function save(lead) {
    const newLead = {
      id: 'l' + Date.now(),
      fecha: new Date().toISOString(),
      estado: 'Pendiente',
      ...lead,
    }
    leads.value = [newLead, ...leads.value]
    storage.set('leads', leads.value)
    return newLead
  }

  function updateStatus(id, estado) {
    leads.value = leads.value.map(l => l.id === id ? { ...l, estado } : l)
    storage.set('leads', leads.value)
  }

  function remove(id) {
    leads.value = leads.value.filter(l => l.id !== id)
    storage.set('leads', leads.value)
  }

  const pendingCount = computed(() => leads.value.filter(l => l.estado === 'Pendiente').length)
  const recent = computed(() => leads.value.slice(0, 5))

  return { leads, pendingCount, recent, load, save, updateStatus, remove }
})
