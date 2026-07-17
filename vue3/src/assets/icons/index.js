import SvgIcon from '@/components/SvgIcon/index.vue'

// Register globally in app.config.globalProperties
export function registerIcons(app) {
  app.component('svg-icon', SvgIcon)
}

// Auto-import all SVG files using Vite's glob import
const svgFiles = import.meta.glob('./svg/*.svg', { eager: true })

export { svgFiles }
