<template>
  <div>
    <div v-if="dictName === ''">
      <el-empty description="选择左侧字典后，在这里管理字典项" :image-size="80" />
    </div>
    <div v-else class="system-detail-list">
      <!--工具栏-->
      <div class="head-container finance-filters">
        <!-- 搜索 -->
        <el-input v-model="query.label" clearable size="small" placeholder="输入字典标签查询" style="width: 200px;" class="filter-item" @keyup.enter="toQuery" />
        <el-button class="filter-item" size="small" type="success" @click="toQuery">
          <el-icon class="el-button--default"><Search /></el-icon>搜索
        </el-button>
      </div>
      <!--表单组件-->
      <el-dialog v-model="dialog" append-to-body :close-on-click-modal="false" :before-close="cancel" :title="getFormTitle()" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="字典标签" prop="label">
            <el-input v-model="form.label" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="字典值">
            <el-input v-model="form.value" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input-number v-model.number="form.sort" :min="0" :max="999" controls-position="right" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button link @click="cancel">取消</el-button>
            <el-button :loading="loading" type="primary" @click="submitMethod">确认</el-button>
          </div>
        </template>
      </el-dialog>
      <!--表格渲染-->
      <el-table empty-text="当前字典暂无字典项，可点击右上角新增" class="finance-table" size="small" v-loading="loading" :data="data" style="width: 100%;">
        <el-table-column prop="label" label="字典标签" />
        <el-table-column prop="value" label="字典值" />
        <el-table-column prop="sort" label="排序" />
        <el-table-column v-if="checkPermission(['admin','dict:edit','dict:del'])" class-name="table-action-column" label="操作" width="100px" align="center" fixed="right">
          <template #default="scope">
            <el-button v-permission="['admin','dict:edit']" size="small" type="primary" link class="table-text-action" @click="showEditFormDialog(scope.row)">
              编辑
            </el-button>
            <el-popover trigger="click"
              :ref="scope.row.id"
              placement="top"
              width="180"
            >
              <p>确定删除本条数据吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="small" link @click="$refs[scope.row.id].hide()">取消</el-button>
                <el-button :loading="delLoading" type="primary" size="small" @click="delMethod(scope.row.id)">确定</el-button>
              </div>
              <template #reference>
                <el-button v-permission="['admin','dict:del']" type="danger" size="small" link class="table-text-action">
                  删除
                </el-button>
              </template>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <el-pagination
            class="finance-pagination"
        :total="total"
        :current-page="page + 1"
        style="margin-top: 8px;"
        layout="total, prev, pager, next, sizes"
        @size-change="sizeChange"
        @current-change="pageChange"
      />
    </div>
  </div>
</template>

<script>
import { Edit, Delete, Search } from '@element-plus/icons-vue'
import crud from '@/mixins/crud.js'
import { initData } from '@/api/data.js'
import { ElMessage } from 'element-plus'
import crudDictDetail from '@/api/system/dictDetail.js'
export default {
  components: { Edit, Delete, Search },
  mixins: [crud],
  data() {
    return {
      title: '字典详情',
      sort: ['sort,asc', 'id,desc'],
      crudMethod: { ...crudDictDetail },
      dictName: '',
      requestVersion: 0,
      form: { id: null, label: null, value: null, dict: { id: null }, sort: 999 },
      rules: {
        label: [
          { required: true, message: '请输入字典标签', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '请输入序号', trigger: 'blur', type: 'number' }
        ]
      }
    }
  },
  methods: {
    clearDictionary() {
      this.requestVersion++
      this.dictName = ''
      this.data = []
      this.total = 0
      this.loading = false
      this.dialog = false
    },
    async init() {
      if (!this.dictName || !this.beforeInit()) return
      const version = ++this.requestVersion
      this.loading = true
      try {
        const result = await initData(this.url, this.getQueryParame())
        if (version !== this.requestVersion) return
        this.data = result.content
        this.total = result.totalElements
        return result
      } catch (err) {
        if (version === this.requestVersion) ElMessage.error('字典项加载失败，请重试')
      } finally {
        if (version === this.requestVersion) this.loading = false
      }
    },
    selectDictionary(dict) {
      this.dialog = false
      this.dictName = dict.name
      this.page = 0
      this.query = {}
      this.data = []
      this.total = 0
      this.form = { id: null, label: null, value: null, dict: { id: dict.id }, sort: 999 }
      this.init()
    },
    // 获取数据前设置好接口地址
    beforeInit() {
      this.url = 'api/dictDetail'
      if (this.dictName) {
        this.params['dictName'] = this.dictName
      }
      return true
    }
  }
}
</script>

<style lang="scss" scoped>
  :deep(.el-input-number .el-input__inner) {
    text-align: left;
  }
</style>
