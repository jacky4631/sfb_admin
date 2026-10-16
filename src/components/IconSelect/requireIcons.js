// Vite equivalent of require.context for SVG icons
const modules = import.meta.glob('../../assets/icons/svg/*.svg', { eager: true })

// import.meta.glob 的 key 是相对路径（../../assets/icons/svg/xxx.svg），
// 取文件名作为图标名，与 svg-icon 的 #icon-{name} 符号 id 对应
const icons = Object.keys(modules)
  .map(key => key.replace(/^.*\//, '').replace(/\.svg$/, ''))
  .sort()

export default icons
