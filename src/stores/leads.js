import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/utils/api'

export const useLeadsStore = defineStore('leads', () => {
  const leads = ref([])
  const loading = ref(false)

  async function load() {
    loading.value = true
    try {
      const data = await api.get('/leads')
      leads.value = data.leads ?? []
    } finally {
      loading.value = false
    }
  }

  /** Envía un nuevo lead desde el formulario de contacto (público). */
  async function save(lead) {
    const data = await api.post('/leads', lead)
    return data.lead
  }

  async function updateStatus(id, estado) {
    const data = await api.put(`/leads/${id}`, { estado })
    leads.value = leads.value.map((l) => (l.id === id ? data.lead : l))
  }

  async function remove(id) {
    await api.delete(`/leads/${id}`)
    leads.value = leads.value.filter((l) => l.id !== id)
  }

  const pendingCount = computed(() => leads.value.filter((l) => l.estado === 'Pendiente').length)
  const recent       = computed(() => leads.value.slice(0, 5))

  return { leads, loading, pendingCount, recent, load, save, updateStatus, remove }
})
