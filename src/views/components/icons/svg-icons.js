const modules = import.meta.glob('../../../assets/icons/svg/*.svg')
const svgIcons = Object.keys(modules).map(path => {
  return path.match(/.*\/(.*)\.svg/)[1]
})
export default svgIcons
