/**
 * Composable para mostrar toasts globalmente.
 * El componente Toast.vue debe estar montado en App.vue y expuesto via provide.
 */
import { inject } from 'vue'

export function useToast() {
  const toast = inject('toast')

  return {
    success(msg) { toast?.add(msg, 'success') },
    error(msg)   { toast?.add(msg, 'error') },
    info(msg)    { toast?.add(msg, 'info') },
  }
}
