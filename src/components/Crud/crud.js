import { reactive, onMounted, onBeforeUnmount, provide, inject, ref, getCurrentInstance, hasInjectionContext } from 'vue'
import { initData, download } from '../../api/data.js'
import { parseTime, downloadFile } from '../../utils/index.js'
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
      const formRef = crud.findFormRef()
      if (formRef) {
        formRef.clearValidate()
      }
    },
    submitCU() {
      if (!callVmHook(crud, CRUD.HOOK.beforeValidateCU)) {
        return
      }
      const formRef = crud.findFormRef()
      if (!formRef) {
        console.warn('[CRUD] 未找到表单实例，请确认 <el-form ref="form"> 或 ref="formRef" 已渲染')
        return
      }
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
    // 表单 ref 从未被注册过（el-dialog 内容是懒渲染的，挂不上 mounted 时的 $refs），
    // 这里对齐 vue2 的做法：提交时实时从 VM 上取
    findFormRef() {
      // 优先取 form() 注册的表单 VM（Options API 的 module/form.vue），
      // 再遍历其余 VM：script setup 页面把 <el-form> 直写在页面里，ref 命名有 form / formRef 两种
      const vms = [crud.findVM('form'), ...crud.vms.map(entry => entry && entry.vm)]
      for (const vm of vms) {
        if (!vm) {
          continue
        }
        const ref = vm.$refs.form || vm.$refs.formRef
        if (ref) {
          return ref
        }
      }
      return crud._refs.form || null
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
    const idx = this.vms.findIndex(e => e && e.vm === vm)
    if (idx !== -1) this.vms.splice(idx, 1)
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
  // 使用 CRUD.HOOK 静态属性兜底，避免 reactive proxy 上属性丢失
  const hookRef = crud.HOOK || CRUD.HOOK
  if (typeof hookRef[hook] === 'function') {
    ret = hookRef[hook].apply(null, nargs) !== false && ret
  }
  // 2. 再检查注册的组件实例方法
  const vmSet = new Set()
  crud.vms.forEach(entry => {
    if (entry && entry.vm) vmSet.add(entry.vm)
  })
  // 'afterXxx' 这类 hook 名在实例上未声明时，直接读 proxy 会触发 Vue3 dev 告警，先用 in 探测
  vmSet.forEach(vm => {
    if (vm && (hook in vm) && typeof vm[hook] === 'function') {
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

// 模块级 crud 实例栈，作为 provide/inject 失败时的兜底
const _crudStack = []

/**
 * composable 模式下获取 crud 实例
 * <script setup> 里 presenter() 与 form()/header() 等处于同一组件，
 * 而 Vue 的 inject() 只查父级 provides，注入不到自己 provide 的值，
 * 所以这里用模块级栈兜底（presenter 已先一步入栈）
 */
function resolveInjectedCrud() {
  return inject('crud', null) || (_crudStack.length ? _crudStack[_crudStack.length - 1] : null)
}

/**
 * 解析 crud 实例 - 兼容 Vue 3.5 defineOptions + mixin 场景
 * 在 <script setup> 中通过 defineOptions({ mixins: [...] }) 使用时，
 * mixin 的 inject 绑定不会正确暴露到 this 上，需要多重兜底
 */
function resolveCrud(vm) {
  if (vm.crud) return vm.crud
  // 1. 尝试 inject() API（lifecycle hook 中可调用）
  try {
    const inst = getCurrentInstance()
    if (inst) {
      let crudInst = inject('crud', null)
      if (crudInst) {
        vm.crud = crudInst
        return crudInst
      }
      // 2. 手动遍历组件树的 provides 对象
      let current = inst.parent
      while (current) {
        if (current.provides && current.provides['crud']) {
          crudInst = current.provides['crud']
          vm.crud = crudInst
          return crudInst
        }
        current = current.parent
      }
    }
  } catch (e) {
    // inject 可能在某些场景下不可用，静默降级
  }
  // 3. 最终兜底：使用模块级栈顶实例
  if (_crudStack.length > 0) {
    const crudInst = _crudStack[_crudStack.length - 1]
    vm.crud = crudInst
    return crudInst
  }
  console.warn('[CRUD] 无法解析 crud 实例')
  return undefined
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
      computed: {
        // 对齐 vue2 presenter 的 inject: ['crud']：本组件自己的模板也要直接访问 crud.data / crud.loading。
        // Vue3 中组件无法 inject 到自身的 provide，所以这里直接把闭包内的实例暴露出来。
        crud() {
          return crudInstance
        }
      },
      methods: {
        parseTime
      },
      created() {
        _crudStack.push(crudInstance)
        crudInstance.registerVM('presenter', this, 0)
        if (crudInstance.queryOnPresenterCreated) {
          crudInstance.toQuery()
        }
      },
      beforeUnmount() {
        const idx = _crudStack.lastIndexOf(crudInstance)
        if (idx !== -1) _crudStack.splice(idx, 1)
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
  _crudStack.push(crudInstance)

  // 把宿主组件登记为 presenter VM：脚本式组件没有 form()/header() 子组件，
  // 表单/表格的 ref 全部挂在宿主身上，callVmHook 也需要它才能找到页面里的 hook
  const hostInstance = getCurrentInstance()
  if (hostInstance) {
    crudInstance.registerVM('presenter', hostInstance.proxy, 0)
  }

  const columns = ref({
    visible(col) { return true }
  })
  const tableRef = ref(null)

  onMounted(() => {
    const cols = {}
    const host = hostInstance && hostInstance.proxy
    const table = tableRef.value || (host && (host.$refs.table || host.$refs.tableRef))
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
    crudInstance.registerRef('table', table)
    if (crudInstance.queryOnPresenterCreated) {
      crudInstance.toQuery()
    }
  })

  onBeforeUnmount(() => {
    const idx = _crudStack.lastIndexOf(crudInstance)
    if (idx !== -1) _crudStack.splice(idx, 1)
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
  // mixin 模式：不在 injection context 中，或 inject 未找到 crud 实例
  if (!hasInjectionContext()) {
    return _headerMixin()
  }
  const crudInst = resolveInjectedCrud()
  if (!crudInst) {
    // inject 未找到 provider（如同组件 mixin 场景），回退到 mixin 模式
    return _headerMixin()
  }

  // composable 模式
  onBeforeUnmount(() => {
    crudInst.vms.forEach((vm, i) => {
      if (vm && vm.type === 'header') crudInst.vms[i] = undefined
    })
  })
  return { crud: crudInst, query: crudInst.query }
}

function _headerMixin() {
  return {
    computed: {
      query() {
        return (this.crud || resolveCrud(this) || {}).query || {}
      }
    },
    methods: {
      toQuery() {
        const c = this.crud || resolveCrud(this)
        if (c) c.toQuery()
      }
    },
    created() {
      const c = resolveCrud(this)
      if (c) c.registerVM('header', this, 1)
    },
    beforeUnmount() {
      const c = this.crud || resolveCrud(this)
      if (c) c.unregisterVM(this)
    }
  }
}

/**
 * 分页 - 支持 composable 和 mixin 双模式
 */
function pagination() {
  if (!hasInjectionContext()) return _paginationMixin()
  const crudInst = resolveInjectedCrud()
  if (!crudInst) return _paginationMixin()

  onBeforeUnmount(() => {
    crudInst.vms.forEach((vm, i) => {
      if (vm && vm.type === 'pagination') crudInst.vms[i] = undefined
    })
  })
  return { crud: crudInst }
}

function _paginationMixin() {
  return {
    computed: {
      page() {
        return (this.crud || resolveCrud(this) || {}).page || {}
      }
    },
    created() {
      const c = resolveCrud(this)
      if (c) c.registerVM('pagination', this, 2)
    },
    beforeUnmount() {
      const c = this.crud || resolveCrud(this)
      if (c) c.unregisterVM(this)
    }
  }
}

/**
 * 表单 - 支持 composable 和 mixin 双模式
 */
function form(defaultForm) {
  if (!hasInjectionContext()) return _formMixin(defaultForm)
  const crudInst = resolveInjectedCrud()
  if (!crudInst) return _formMixin(defaultForm)

  crudInst.defaultForm = defaultForm
  crudInst.resetForm()
  onBeforeUnmount(() => {
    crudInst.vms.forEach((vm, i) => {
      if (vm && vm.type === 'form') crudInst.vms[i] = undefined
    })
  })
  return { crud: crudInst, form: crudInst.form }
}

function _formMixin(defaultForm) {
  return {
    computed: {
      form() {
        return (this.crud || resolveCrud(this) || {}).form || {}
      }
    },
    created() {
      const c = resolveCrud(this)
      if (c) {
        c.registerVM('form', this, 3)
        c.defaultForm = defaultForm
        c.resetForm()
      }
    },
    beforeUnmount() {
      const c = this.crud || resolveCrud(this)
      if (c) c.unregisterVM(this)
    }
  }
}

/**
 * crud - 支持 composable 和 mixin 双模式
 */
function crud(options = {}) {
  const defaultOptions = {
    type: undefined
  }
  options = mergeOptions(defaultOptions, options)

  if (!hasInjectionContext()) return _crudMixin(options)
  const crudInst = resolveInjectedCrud()
  if (!crudInst) return _crudMixin(options)

  onBeforeUnmount(() => {
    crudInst.vms.forEach((vm, i) => {
      if (vm && vm.vm === crudInst) crudInst.vms[i] = undefined
    })
  })
  return { crud: crudInst }
}

function _crudMixin(options) {
  return {
    computed: {
      query() {
        return (this.crud || resolveCrud(this) || {}).query || {}
      }
    },
    created() {
      const c = resolveCrud(this)
      if (c) c.registerVM(options.type, this)
    },
    beforeUnmount() {
      const c = this.crud || resolveCrud(this)
      if (c) c.unregisterVM(this)
    }
  }
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
