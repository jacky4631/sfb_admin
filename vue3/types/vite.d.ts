// Vite 环境变量类型
export interface ViteEnv {
  VITE_APP_TITLE: string
  VITE_PORT: number
  VITE_OPEN: boolean
  VITE_BASE_URL: string
  VITE_BASE_API: string
  VITE_OUT_DIR: string
  VITE_SOURCEMAP: boolean
  VITE_DROP_DEBUGGER: boolean
  VITE_DROP_CONSOLE: boolean
  VITE_USE_IMPORT_MAP: boolean
}