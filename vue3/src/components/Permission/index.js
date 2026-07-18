import permission from './permission'

const install = function(app) {
  app.directive('permission', permission)
}

permission.install = install
export default permission
