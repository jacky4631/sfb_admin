import { initData, download } from '@/api/data'
import { parseTime, downloadFile } from '@/utils/index'
import { useUserStore } from '@/store/modules/user'
import { ElNotification, ElMessageBox } from 'element-plus'

export default {
  data() {
    return {
      cateList: [],
      data: [],
      sort: ['id,desc'],
      page: 0,
      size: 10,
      total: 0,
      url: '',
      params: {},
      query: {},
      time: 50,
      isAdd: false,
      downloadLoading: false,
      loading: true,
      delLoading: false,
      delAllLoading: false,
      dialog: false,
      form: {},
      resetForm: {},
      title: ''
    }
  },
  methods: {
    parseTime,
    downloadFile,
    checkPermission(value) {
      if (value && value instanceof Array && value.length > 0) {
        const roles = useUserStore().roles
        const permissionRoles = value

        const hasPermission = roles.some(role => {
          return permissionRoles.includes(role)
        })

        if (!hasPermission) {
          return false
        }
        return true
      } else {
        console.error(`need roles! Like v-permission="['admin','editor']"`)
        return false
      }
    },
    async init() {
      if (!await this.beforeInit()) {
        return
      }
      return new Promise((resolve, reject) => {
        this.loading = true
        initData(this.url, this.getQueryParame()).then(data => {
          this.cateList = data.cateList
          this.total = data.totalElements
          this.data = data.content
          setTimeout(() => {
            this.loading = false
          }, this.time)
          resolve(data)
        }).catch(err => {
          this.loading = false
          reject(err)
        })
      })
    },
    beforeInit() {
      return true
    },
    getQueryParame() {
      return {
        page: this.page,
        size: this.size,
        sort: this.sort,
        ...this.query,
        ...this.params
      }
    },
    pageChange(e) {
      this.page = e - 1
      this.init()
    },
    sizeChange(e) {
      this.page = 0
      this.size = e
      this.init()
    },
    dleChangePage(size) {
      if (size === undefined) {
        size = 1
      }
      if (this.data.length === size && this.page !== 0) {
        this.page = this.page - 1
      }
    },
    toQuery() {
      this.page = 0
      this.init()
    },
    submitSuccessNotify() {
      ElNotification({
        title: '提交成功',
        type: 'success',
        duration: 2500
      })
    },
    addSuccessNotify() {
      ElNotification({
        title: '新增成功',
        type: 'success',
        duration: 2500
      })
    },
    editSuccessNotify() {
      ElNotification({
        title: '编辑成功',
        type: 'success',
        duration: 2500
      })
    },
    delSuccessNotify() {
      ElNotification({
        title: '删除成功',
        type: 'success',
        duration: 2500
      })
    },
    notify(title, type) {
      ElNotification({
        title: title,
        type: type,
        duration: 2500
      })
    },
    beforeDelMethod() {
      return true
    },
    delMethod(id) {
      if (!this.beforeDelMethod()) {
        return
      }
      this.delLoading = true
      this.crudMethod.del(id).then(() => {
        this.delLoading = false
        if (this.$refs[id]) this.$refs[id].hide()
        this.dleChangePage()
        this.delSuccessNotify()
        this.afterDelMethod()
        this.init()
      }).catch(() => {
        this.delLoading = false
        if (this.$refs[id]) this.$refs[id].hide()
      })
    },
    afterDelMethod() {},
    beforeDelAllMethod() {
      ElMessageBox.confirm('你确定删除选中的数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delAllMethod()
      }).catch(() => {})
    },
    delAllMethod() {
      this.delAllLoading = true
      const data = this.$refs.table?.selection
      if (!data) return
      const ids = []
      for (let i = 0; i < data.length; i++) {
        ids.push(data[i].id)
      }
      this.crudMethod.delAll(ids).then(() => {
        this.delAllLoading = false
        this.dleChangePage(ids.length)
        this.init()
        ElNotification({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
      }).catch(() => {
        this.delAllLoading = false
      })
    },
    beforeShowAddForm() {},
    showAddFormDialog() {
      this.isAdd = true
      this.resetForm = JSON.parse(JSON.stringify(this.form))
      this.beforeShowAddForm()
      this.dialog = true
    },
    beforeShowEditForm(data) {},
    showEditFormDialog(data = '') {
      this.isAdd = false
      if (data) {
        this.resetForm = JSON.parse(JSON.stringify(this.form))
        this.form = JSON.parse(JSON.stringify(data))
      }
      this.beforeShowEditForm(data)
      this.dialog = true
    },
    addMethod() {
      this.crudMethod.add(this.form).then(() => {
        this.addSuccessNotify()
        this.loading = false
        this.afterAddMethod()
        this.cancel()
        this.init()
      }).catch(() => {
        this.loading = false
        this.afterAddErrorMethod()
      })
    },
    afterAddMethod() {},
    afterAddErrorMethod() {},
    editMethod() {
      this.crudMethod.edit(this.form).then(() => {
        this.editSuccessNotify()
        this.loading = false
        this.afterEditMethod()
        this.cancel()
        this.init()
      }).catch(() => {
        this.loading = false
      })
    },
    afterEditMethod() {},
    beforeSubmitMethod() {
      return true
    },
    submitMethod() {
      if (!this.beforeSubmitMethod()) {
        return
      }
      if (this.$refs['form']) {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.loading = true
            if (this.isAdd) {
              this.addMethod()
            } else this.editMethod()
          }
        })
      }
    },
    cancel() {
      this.dialog = false
      if (this.$refs['form']) {
        this.$refs['form'].clearValidate()
        this.form = this.resetForm
      }
    },
    getFormTitle() {
      return this.isAdd ? `新增${this.title}` : `编辑${this.title}`
    },
    downloadMethod() {
      this.beforeInit()
      this.downloadLoading = true
      download(this.url + '/download', this.params).then(result => {
        this.downloadFile(result, this.title + '数据', 'xlsx')
        this.downloadLoading = false
      }).catch(() => {
        this.downloadLoading = false
      })
    }
  }
}
