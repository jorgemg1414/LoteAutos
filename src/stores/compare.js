import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { storage } from '@/utils/storage'

const MAX_COMPARE = 3

export const useCompareStore = defineStore('compare', () => {
  const ids = ref(storage.get('compare') || [])

  const count = computed(() => ids.value.length)
  const isFull = computed(() => ids.value.length >= MAX_COMPARE)

  function isInCompare(id) {
    return ids.value.includes(id)
  }

  function add(id) {
    if (isFull.value || isInCompare(id)) return false
    ids.value = [...ids.value, id]
    storage.set('compare', ids.value)
    return true
  }

  function remove(id) {
    ids.value = ids.value.filter(i => i !== id)
    storage.set('compare', ids.value)
  }

  function toggle(id) {
    if (isInCompare(id)) {
      remove(id)
      return false
    } else {
      return add(id)
    }
  }

  function clear() {
    ids.value = []
    storage.set('compare', [])
  }

  return { ids, count, isFull, isInCompare, add, remove, toggle, clear }
})
