import { createPinia } from 'pinia'

const pinia = createPinia()

export default pinia

// Re-export getters for compatibility
export const getters = {
  roles: (state) => state.user?.roles || [],
  loadMenus: (state) => state.permission?.loadMenus || false
}
