import { reactive, onMounted, onBeforeUnmount, provide, inject, ref, getCurrentInstance } from 'vue'
import { initData, download } from '@/api/data'
import { parseTime, downloadFile } from '@/utils/index'
import { ElNotification } from 'element-plus'

/**
 * CRUD配置 - Vue 3 Composition API 版本
 * @author moxun
 * @param {*} options
 * @return crud instance.
 */
function CRUD(options) {
  const defaultOptions = {
    title: '',
    url: '',
    data: [],
    selections: [],
    query: {},
    params: {},
    form: {},
    defaultForm: () => {},
    sort: ['id,desc'],
    time: 50,
    crudMethod: {
      add: (form) => {},
      delete: (id) => {},
      edit: (form) => {},
      get: (id) => {}
    },
    optShow: {
      add: true,
      edit: true,
      del: true,
      download: true
    },
    props: {},
    queryOnPresenterCreated: true,
    debug: false
  }
  options = mergeOptions(defaultOptions, options)
  const data = {
    ...options,
    dataStatus: {},
    status: {
      add: CRUD.STATUS.NORMAL,
      edit: CRUD.STATUS.NORMAL,
      get cu() {
        if (this.add === CRUD.STATUS.NORMAL && this.edit === CRUD.STATUS.NORMAL) {
          return CRUD.STATUS.NORMAL
        } else if (this.add === CRUD.STATUS.PREPARED || this.edit === CRUD.STATUS.PREPARED) {
          return CRUD.STATUS.PREPARED
        } else if (this.add === CRUD.STATUS.PROCESSING || this.edit === CRUD.STATUS.PROCESSING) {
          return CRUD.STATUS.PROCESSING
        }
        throw new Error('wrong crud\'s cu status')
      },
      get title() {
        return this.add > CRUD.STATUS.NORMAL ? `新增${crud.title}` : this.edit > CRUD.STATUS.NORMAL ? `编辑${crud.title}` : crud.title
      }
    },
    msg: {
      submit: '提交成功',
      add: '新增成功',
      edit: '编辑成功',
      del: '删除成功'
    },
    page: {
      page: 0,
      size: 10,
      total: 0
    },
    loading: true,
    downloadLoading: false,
    delAllLoading: false
  }
  const methods = {
    submitSuccessNotify() {
      crud.notify(crud.msg.submit, CRUD.NOTIFICATION_TYPE.SUCCESS)
    },
    addSuccessNotify() {
      crud.notify(crud.msg.add, CRUD.NOTIFICATION_TYPE.SUCCESS)
    },
    editSuccessNotify() {
      crud.notify(crud.msg.edit, CRUD.NOTIFICATION_TYPE.SUCCESS)
    },
    delSuccessNotify() {
      crud.notify(crud.msg.del, CRUD.NOTIFICATION_TYPE.SUCCESS)
    },
    toQuery() {
      crud.page.page = 1
      crud.refresh()
    },
    refresh() {
      if (!callVmHook(crud, CRUD.HOOK.beforeRefresh)) {
        return
      }
      return new Promise((resolve, reject) => {
        crud.loading = true
        initData(crud.url, crud.getQueryParams()).then(data => {
          crud.page.total = data.totalElements
          crud.data = data.content
          crud.resetDataStatus()
          setTimeout(() => {
            crud.loading = false
            callVmHook(crud, CRUD.HOOK.afterRefresh)
          }, crud.time)
          resolve(data)
        }).catch(err => {
          crud.loading = false
          reject(err)
        })
      })
    },
    toAdd() {
      if (!(callVmHook(crud, CRUD.HOOK.beforeToAdd, crud.form) && callVmHook(crud, CRUD.HOOK.beforeToCU, crud.form))) {
        return
      }
      crud.status.add = CRUD.STATUS.PREPARED
      callVmHook(crud, CRUD.HOOK.afterToAdd, crud.form)
      callVmHook(crud, CRUD.HOOK.afterToCU, crud.form)
    },
    toEdit(data) {
      crud.resetForm(JSON.parse(JSON.stringify(data)))
      if (!(callVmHook(crud, CRUD.HOOK.beforeToEdit, crud.form) && callVmHook(crud, CRUD.HOOK.beforeToCU, crud.form))) {
        return
      }
      crud.status.edit = CRUD.STATUS.PREPARED
      crud.getDataStatus(data.id).edit = CRUD.STATUS.PREPARED
      callVmHook(crud, CRUD.HOOK.afterToEdit, crud.form)
      callVmHook(crud, CRUD.HOOK.afterToCU, crud.form)
    },
    toDelete(data) {
      crud.getDataStatus(data.id).delete = CRUD.STATUS.PREPARED
    },
    cancelDelete(data) {
      if (!callVmHook(crud, CRUD.HOOK.beforeDeleteCancel, data)) {
        return
      }
      crud.getDataStatus(data.id).delete = CRUD.STATUS.NORMAL
      callVmHook(crud, CRUD.HOOK.afterDeleteCancel, data)
    },
    cancelCU() {
      const addStatus = crud.status.add
      const editStatus = crud.status.edit
      if (addStatus === CRUD.STATUS.PREPARED) {
        if (!callVmHook(crud, CRUD.HOOK.beforeAddCancel, crud.form)) {
          return
        }
        crud.status.add = CRUD.STATUS.NORMAL
      }
      if (editStatus === CRUD.STATUS.PREPARED) {
        if (!callVmHook(crud, CRUD.HOOK.beforeEditCancel, crud.form)) {
          return
        }
        crud.status.edit = CRUD.STATUS.NORMAL
        crud.getDataStatus(crud.form.id).edit = CRUD.STATUS.NORMAL
      }
      crud.resetForm()
      if (addStatus === CRUD.STATUS.PREPARED) {
        callVmHook(crud, CRUD.HOOK.afterAddCancel, crud.form)
      }
      if (editStatus === CRUD.STATUS.PREPARED) {
        callVmHook(crud, CRUD.HOOK.afterEditCancel, crud.form)
      }
      // 清除表单验证
      const formRef = crud.getRef('form')
      if (formRef) {
        formRef.clearValidate()
      }
    },
    submitCU() {
      if (!callVmHook(crud, CRUD.HOOK.beforeValidateCU)) {
        return
      }
      const formRef = crud.getRef('form')
      if (!formRef) return
      formRef.validate(valid => {
        if (!valid) {
          return
        }
        if (!callVmHook(crud, CRUD.HOOK.afterValidateCU)) {
          return
        }
        if (crud.status.add === CRUD.STATUS.PREPARED) {
          crud.doAdd()
        } else if (crud.status.edit === CRUD.STATUS.PREPARED) {
          crud.doEdit()
        }
      })
    },
    doAdd() {
      if (!callVmHook(crud, CRUD.HOOK.beforeSubmit)) {
        return
      }
      crud.crudMethod.add(crud.form).then(() => {
        crud.status.add = CRUD.STATUS.NORMAL
        crud.resetForm()
        crud.addSuccessNotify()
        callVmHook(crud, CRUD.HOOK.afterSubmit)
        crud.toQuery()
      }).catch(() => {
        callVmHook(crud, CRUD.HOOK.afterAddError)
      })
    },
    doEdit() {
      if (!callVmHook(crud, CRUD.HOOK.beforeSubmit)) {
        return
      }
      crud.crudMethod.edit(crud.form).then(() => {
        crud.status.edit = CRUD.STATUS.NORMAL
        crud.getDataStatus(crud.form.id).edit = CRUD.STATUS.NORMAL
        crud.editSuccessNotify()
        crud.resetForm()
        callVmHook(crud, CRUD.HOOK.afterSubmit)
        crud.refresh()
      }).catch(() => {
        callVmHook(crud, CRUD.HOOK.afterEditError)
      })
    },
    doDelete(data) {
      let delAll = false
      let dataStatus
      const ids = []
      if (data instanceof Array) {
        delAll = true
        data.forEach(val => {
          ids.push(val.id)
        })
      } else {
        ids.push(data.id)
        dataStatus = crud.getDataStatus(data.id)
      }
      if (!callVmHook(crud, CRUD.HOOK.beforeDelete, data)) {
        return
      }
      if (!delAll) {
        dataStatus.delete = CRUD.STATUS.PROCESSING
      }
      return crud.crudMethod.del(ids).then(() => {
        if (delAll) {
          crud.delAllLoading = false
        } else dataStatus.delete = CRUD.STATUS.PREPARED
        crud.dleChangePage(1)
        crud.delSuccessNotify()
        callVmHook(crud, CRUD.HOOK.afterDelete, data)
        crud.refresh()
      }).catch(() => {
        if (delAll) {
          crud.delAllLoading = false
        } else dataStatus.delete = CRUD.STATUS.PREPARED
      })
    },
    doExport() {
      crud.downloadLoading = true
      download(crud.url + '/download', crud.getQueryParams()).then(result => {
        downloadFile(result, crud.title + '数据', 'xlsx')
        crud.downloadLoading = false
      }).catch(() => {
        crud.downloadLoading = false
      })
    },
    getQueryParams: function() {
      return {
        page: crud.page.page - 1,
        size: crud.page.size,
        sort: crud.sort,
        ...crud.query,
        ...crud.params
      }
    },
    pageChangeHandler(e) {
      crud.page.page = e
      crud.refresh()
    },
    sizeChangeHandler(e) {
      crud.page.size = e
      crud.page.page = 1
      crud.refresh()
    },
    dleChangePage(size) {
      if (crud.data.length === size && crud.page.page !== 1) {
        crud.page.page -= 1
      }
    },
    selectionChangeHandler(val) {
      crud.selections = val
    },
    resetQuery(toQuery = true) {
      const defaultQuery = JSON.parse(JSON.stringify(crud.defaultQuery))
      const query = crud.query
      Object.keys(query).forEach(key => {
        query[key] = defaultQuery[key]
      })
      if (toQuery) {
        crud.toQuery()
      }
    },
    resetForm(data) {
      const form = data || (typeof crud.defaultForm === 'object' ? JSON.parse(JSON.stringify(crud.defaultForm)) : crud.defaultForm())
      const crudFrom = crud.form
      for (const key in form) {
        // Vue 3 reactive 对象直接赋值即可，无需 Vue.set
        crudFrom[key] = form[key]
      }
    },
    resetDataStatus() {
      const dataStatus = {}
      function resetStatus(datas) {
        datas.forEach(e => {
          dataStatus[e.id] = {
            delete: 0,
            edit: 0
          }
          if (e.children) {
            resetStatus(e.children)
          }
        })
      }
      resetStatus(crud.data)
      crud.dataStatus = dataStatus
    },
    getDataStatus(id) {
      return crud.dataStatus[id]
    },
    selectAllChange(selection) {
      if (selection && selection.length === crud.data.length) {
        selection.forEach(val => {
          crud.selectChange(selection, val)
        })
      } else {
        const tableRef = crud.getRef('table')
        if (tableRef) tableRef.clearSelection()
      }
    },
    selectChange(selection, row) {
      if (selection.find(val => { return val.id === row.id })) {
        if (row.children) {
          row.children.forEach(val => {
            const tableRef = crud.getRef('table')
            if (tableRef) tableRef.toggleRowSelection(val, true)
            selection.push(val)
            if (val.children) {
              crud.selectChange(selection, val)
            }
          })
        }
      } else {
        crud.toggleRowSelection(selection, row)
      }
    },
    toggleRowSelection(selection, data) {
      if (data.children) {
        data.children.forEach(val => {
          const tableRef = crud.getRef('table')
          if (tableRef) tableRef.toggleRowSelection(val, false)
          if (val.children) {
            crud.toggleRowSelection(selection, val)
          }
        })
      }
    },
    // Vue 3 组件实例注册系统（替代 vm.$refs）
    registerRef(type, componentRef) {
      crud._refs[type] = componentRef
    },
    getRef(type) {
      return crud._refs[type] || null
    },
    findVM(type) {
      const entry = crud.vms.find(vm => vm && vm.type === type)
      return entry ? entry.vm : null
    },
    notify(title, type = CRUD.NOTIFICATION_TYPE.INFO) {
      // 使用 ElNotification 替代 vm.$notify
      ElNotification({
        title,
        type,
        duration: 2500
      })
    },
    updateProp(name, value) {
      // Vue 3 reactive 对象直接赋值，无需 Vue.set
      crud.props[name] = value
    }
  }
  // 使用 reactive() 替代 Vue.observable()
  const crud = Object.assign(reactive(data), methods)
  // 组件 ref 注册表
  crud._refs = {}
  // 预留4位存储：组件 主页、头部、分页、表单
  crud.vms = Array(4)
  crud.registerVM = function(type, vm, index = -1) {
    const vmObj = { type, vm }
    if (index < 0) {
      this.vms.push(vmObj)
      return
    }
    this.vms.length = Math.max(this.vms.length, index)
    this.vms.splice(index, 1, vmObj)
  }
  crud.unregisterVM = function(vm) {
    this.vms.splice(this.vms.findIndex(e => e && e.vm === vm), 1)
  }
  // 记录初始默认的查询参数
  crud.defaultQuery = JSON.parse(JSON.stringify(data.query))
  // 将 HOOK 常量附加到实例上，供 callVmHook 访问
  crud.HOOK = CRUD.HOOK
  // 移除 Object.freeze，Vue 3 reactive 需要可变对象
  return crud
}

// hook VM - 支持直接回调函数和组件方法两种模式
function callVmHook(crud, hook) {
  if (crud.debug) {
    console.log('callVmHook: ' + hook)
  }
  let ret = true
  const nargs = [crud]
  for (let i = 2; i < arguments.length; ++i) {
    nargs.push(arguments[i])
  }
  // 1. 优先检查直接回调函数（Vue 3 视图常用模式：crud.HOOK.afterToCU = fn）
  if (typeof crud.HOOK[hook] === 'function') {
    ret = crud.HOOK[hook].apply(null, nargs) !== false && ret
  }
  // 2. 再检查注册的组件实例方法
  const vmSet = new Set()
  crud.vms.forEach(vm => vm && vmSet.add(vm.vm))
  vmSet.forEach(vm => {
    if (typeof vm[hook] === 'function') {
      ret = vm[hook].apply(vm, nargs) !== false && ret
    }
  })
  return ret
}

function mergeOptions(src, opts) {
  const optsRet = {
    ...src
  }
  for (const key in src) {
    if (opts.hasOwnProperty(key)) {
      optsRet[key] = opts[key]
    }
  }
  return optsRet
}

/**
 * crud主页 - 支持 composable 和 mixin 双模式
 */
function presenter(crudInstance) {
  // mixin 模式：在模块作用域调用时（Options API mixins），返回 mixin 对象
  if (!getCurrentInstance()) {
    function obColumns(columns) {
      return {
        visible(col) {
          return !columns || !columns[col] ? true : columns[col].visible
        }
      }
    }
    return {
      provide() {
        return {
          crud: crudInstance,
          'crud.query': crudInstance.query,
          'crud.page': crudInstance.page,
          'crud.form': crudInstance.form
        }
      },
      data() {
        return {
          searchToggle: true,
          columns: obColumns()
        }
      },
      methods: {
        parseTime
      },
      created() {
        crudInstance.registerVM('presenter', this, 0)
        if (crudInstance.queryOnPresenterCreated) {
          crudInstance.toQuery()
        }
      },
      beforeUnmount() {
        crudInstance.unregisterVM(this)
      },
      mounted() {
        const columns = {}
        if (this.$refs.table && this.$refs.table.columns) {
          this.$refs.table.columns.forEach(e => {
            if (!e.property || e.type !== 'default') return
            columns[e.property] = { label: e.label, visible: true }
          })
        }
        this.columns = obColumns(columns)
        crudInstance.updateProp('tableColumns', columns)
        crudInstance.registerRef('table', this.$refs.table)
      }
    }
  }

  // composable 模式：在 <script setup> 中调用
  provide('crud', crudInstance)

  const columns = ref({
    visible(col) { return true }
  })
  const tableRef = ref(null)

  onMounted(() => {
    const cols = {}
    const table = tableRef.value
    if (table && table.columns) {
      table.columns.forEach(e => {
        if (!e.property || e.type !== 'default') return
        cols[e.property] = { label: e.label, visible: true }
      })
    }
    columns.value = {
      visible(col) {
        return !cols[col] ? true : cols[col].visible
      }
    }
    crudInstance.updateProp('tableColumns', cols)
    crudInstance.registerRef('table', tableRef.value)
    if (crudInstance.queryOnPresenterCreated) {
      crudInstance.toQuery()
    }
  })

  onBeforeUnmount(() => {
    crudInstance.vms.forEach((vm, i) => {
      if (vm && vm.type === 'presenter') crudInstance.vms[i] = undefined
    })
  })

  return {
    crud: crudInstance,
    columns,
    query: crudInstance.query,
    form: crudInstance.form,
    tableRef
  }
}

/**
 * 头部 - 支持 composable 和 mixin 双模式
 */
function header() {
  // mixin 模式
  if (!getCurrentInstance()) {
    return {
      inject: {
        crud: { from: 'crud' },
        query: { from: 'crud.query' }
      },
      created() {
        this.crud.registerVM('header', this, 1)
      },
      beforeUnmount() {
        this.crud.unregisterVM(this)
      }
    }
  }

  // composable 模式
  const crudInst = inject('crud')
  onBeforeUnmount(() => {
    crudInst.vms.forEach((vm, i) => {
      if (vm && vm.type === 'header') crudInst.vms[i] = undefined
    })
  })
  return { crud: crudInst, query: crudInst.query }
}

/**
 * 分页 - 支持 composable 和 mixin 双模式
 */
function pagination() {
  // mixin 模式
  if (!getCurrentInstance()) {
    return {
      inject: {
        crud: { from: 'crud' },
        page: { from: 'crud.page' }
      },
      created() {
        this.crud.registerVM('pagination', this, 2)
      },
      beforeUnmount() {
        this.crud.unregisterVM(this)
      }
    }
  }

  // composable 模式
  const crudInst = inject('crud')
  onBeforeUnmount(() => {
    crudInst.vms.forEach((vm, i) => {
      if (vm && vm.type === 'pagination') crudInst.vms[i] = undefined
    })
  })
  return { crud: crudInst }
}

/**
 * 表单 - 支持 composable 和 mixin 双模式
 */
function form(defaultForm) {
  // mixin 模式
  if (!getCurrentInstance()) {
    return {
      inject: {
        crud: { from: 'crud' },
        form: { from: 'crud.form' }
      },
      created() {
        this.crud.registerVM('form', this, 3)
        this.crud.defaultForm = defaultForm
        this.crud.resetForm()
      },
      beforeUnmount() {
        this.crud.unregisterVM(this)
      }
    }
  }

  // composable 模式
  const crudInst = inject('crud')
  crudInst.defaultForm = defaultForm
  crudInst.resetForm()
  onBeforeUnmount(() => {
    crudInst.vms.forEach((vm, i) => {
      if (vm && vm.type === 'form') crudInst.vms[i] = undefined
    })
  })
  return { crud: crudInst, form: crudInst.form }
}

/**
 * crud - 支持 composable 和 mixin 双模式
 */
function crud(options = {}) {
  const defaultOptions = {
    type: undefined
  }
  options = mergeOptions(defaultOptions, options)

  // mixin 模式
  if (!getCurrentInstance()) {
    return {
      inject: {
        crud: { from: 'crud' }
      },
      created() {
        this.crud.registerVM(options.type, this)
      },
      beforeUnmount() {
        this.crud.unregisterVM(this)
      }
    }
  }

  // composable 模式
  const crudInst = inject('crud')
  onBeforeUnmount(() => {
    crudInst.vms.forEach((vm, i) => {
      if (vm && vm.vm === crudInst) crudInst.vms[i] = undefined
    })
  })
  return { crud: crudInst }
}

/**
 * CRUD钩子
 */
CRUD.HOOK = {
  beforeRefresh: 'beforeCrudRefresh',
  afterRefresh: 'afterCrudRefresh',
  beforeDelete: 'beforeCrudDelete',
  afterDelete: 'afterCrudDelete',
  beforeDeleteCancel: 'beforeCrudDeleteCancel',
  afterDeleteCancel: 'afterCrudDeleteCancel',
  beforeToAdd: 'beforeCrudToAdd',
  afterToAdd: 'afterCrudToAdd',
  beforeToEdit: 'beforeCrudToEdit',
  afterToEdit: 'afterCrudToEdit',
  beforeToCU: 'beforeCrudToCU',
  afterToCU: 'afterCrudToCU',
  beforeValidateCU: 'beforeCrudValidateCU',
  afterValidateCU: 'afterCrudValidateCU',
  beforeAddCancel: 'beforeCrudAddCancel',
  afterAddCancel: 'afterCrudAddCancel',
  beforeEditCancel: 'beforeCrudEditCancel',
  afterEditCancel: 'afterCrudEditCancel',
  beforeSubmit: 'beforeCrudSubmitCU',
  afterSubmit: 'afterCrudSubmitCU',
  afterAddError: 'afterCrudAddError',
  afterEditError: 'afterCrudEditError'
}

/**
 * CRUD状态
 */
CRUD.STATUS = {
  NORMAL: 0,
  PREPARED: 1,
  PROCESSING: 2
}

/**
 * CRUD通知类型
 */
CRUD.NOTIFICATION_TYPE = {
  SUCCESS: 'success',
  WARNING: 'warning',
  INFO: 'info',
  ERROR: 'error'
}

export default CRUD

export {
  presenter,
  header,
  form,
  pagination,
  crud
}
