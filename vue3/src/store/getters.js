const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  size: state => state.app.size,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  email: state => state.user.email,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routers,
  loadMenus: state => state.permission.loadMenus,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  showSettings: state => state.settings.showSettings,
  title: state => state.settings.title,
  tagsView: state => state.settings.tagsView,
  fixedHeader: state => state.settings.fixedHeader,
  sidebarLogo: state => state.settings.sidebarLogo,
  footerTxt: state => state.settings.footerTxt,
  caseNumber: state => state.settings.caseNumber
}

export default getters
