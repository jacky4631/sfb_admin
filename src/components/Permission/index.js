import permission from './permission.js'

const install = function(app) {
  app.directive('permission', permission)
}

permission.install = install
export default permission
