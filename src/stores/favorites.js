import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { storage } from '@/utils/storage'

export const useFavoritesStore = defineStore('favorites', () => {
  const ids = ref(storage.get('favorites') || [])

  const count = computed(() => ids.value.length)

  function isFavorite(id) {
    return ids.value.includes(id)
  }

  function toggle(id) {
    if (isFavorite(id)) {
      ids.value = ids.value.filter(i => i !== id)
    } else {
      ids.value = [...ids.value, id]
    }
    storage.set('favorites', ids.value)
  }

  function remove(id) {
    ids.value = ids.value.filter(i => i !== id)
    storage.set('favorites', ids.value)
  }

  function clear() {
    ids.value = []
    storage.set('favorites', [])
  }

  return { ids, count, isFavorite, toggle, remove, clear }
})
