import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export { useAppStore } from './modules/app.ts'
export { useUserStore } from './modules/user.ts'
export { usePermissionStore } from './modules/permission.ts'
export { useDictStore } from './modules/dict.ts'

export default pinia
