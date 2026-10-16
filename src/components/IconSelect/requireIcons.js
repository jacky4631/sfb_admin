// Vite equivalent of require.context for SVG icons
const modules = import.meta.glob('../../assets/icons/svg/*.svg', { eager: true })

const icons = Object.keys(modules).map(key => {
  const re = /\.\/(.*)\.svg$/
  const match = key.match(re)
  return match ? match[1] : null
}).filter(Boolean)

export default icons
