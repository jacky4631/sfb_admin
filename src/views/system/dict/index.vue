<template>
  <div class="app-container finance-page system-page dict-page">
    <!--表单组件-->
    <el-dialog v-model="dialog" append-to-body :close-on-click-modal="false" :before-close="cancel" :title="getFormTitle()" width="500px">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
        <el-form-item label="字典名称" prop="name">
          <el-input v-model="form.name" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.remark" style="width: 370px;" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button link @click="cancel">取消</el-button>
          <el-button :loading="loading" type="primary" @click="submitMethod">确认</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 字典列表 -->
    <el-row class="system-grid" :gutter="10">
      <el-col :xs="24" :sm="24" :md="10" :lg="10" :xl="10" >
        <el-card class="box-card system-card">
          <template #header>
            <div class="dict-card-header">
              <strong>字典列表</strong>
              <!-- 新增 -->
              <el-button
                v-permission="['admin','dict:add']"
                class="filter-item"
                size="small"

                type="primary"
                @click="showAddFormDialog"
              >
                <el-icon><Plus /></el-icon>新增字典
              </el-button>
            </div>
          </template>
          <!--工具栏-->
          <div class="head-container finance-filters">
            <!-- 搜索 -->
            <el-input v-model="query.blurry" clearable size="small" placeholder="输入名称或者描述搜索" style="width: 200px;" class="filter-item" @keyup.enter="toQuery" />
            <el-button class="filter-item" size="small" type="success" @click="toQuery">
              <el-icon><Search /></el-icon>搜索
            </el-button>
            <!-- 导出 -->
            <el-button
              :loading="downloadLoading"
              size="small"
              class="filter-item"
              type="warning"
              @click="downloadMethod"
            >
              <el-icon><Download /></el-icon>导出
            </el-button>
          </div>
          <!--表格渲染-->
          <el-table ref="dictTable" class="finance-table" size="small" v-loading="loading" :data="data" highlight-current-row style="width: 100%;" @current-change="handleCurrentChange">
            <el-table-column :show-overflow-tooltip="true" prop="name" label="字典名称" min-width="150" />
            <el-table-column :show-overflow-tooltip="true" prop="remark" label="描述" />
            <el-table-column v-if="checkPermission(['admin','dict:edit','dict:del'])" class-name="table-icon-column" label="操作" width="100px" align="center" fixed="right">
              <template #default="scope">
                <el-button v-permission="['admin','dict:edit']" size="small" type="primary" class="table-icon-action" @click.stop="showEditFormDialog(scope.row)" aria-label="编辑" title="编辑"><el-icon><Edit /></el-icon></el-button>
                <el-popover trigger="click"
                  :ref="scope.row.id"
                  placement="top"
                  width="180"
                >
                  <p>此操作将删除字典与对应的字典详情，确定要删除吗？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="small" link @click="$refs[scope.row.id].hide()">取消</el-button>
                    <el-button :loading="delLoading" type="primary" size="small" @click="delMethod(scope.row.id)">确定</el-button>
                  </div>
                  <template #reference>
                    <el-button v-permission="['admin','dict:del']" type="danger" size="small" class="table-icon-action" @click.stop aria-label="删除" title="删除"><el-icon><Delete /></el-icon></el-button>
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
        </el-card>
      </el-col>
      <!-- 字典详情列表 -->
      <el-col :xs="24" :sm="24" :md="14" :lg="14" :xl="14">
        <el-card class="box-card system-card">
          <template #header>
            <div class="dict-card-header">
              <div>
                <strong>字典详情 <span v-if="currentDictName" class="dict-current-name">{{ currentDictName }}</span></strong>
              </div>
              <el-button
                v-if="checkPermission(['admin','dict:add']) && currentDictName"
                class="filter-item"
                size="small"

                type="primary"
                @click="$refs.dictDetail.showAddFormDialog()"
              >
                <el-icon><Plus /></el-icon>新增字典项
              </el-button>
            </div>
          </template>
          <dictDetail class="system-dict-detail" ref="dictDetail" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { Plus, Delete, Search, Edit, Download } from '@element-plus/icons-vue'
import crud from '@/mixins/crud.js'
import dictDetail from './dictDetail.vue'
import crudDict from '@/api/system/dict.js'
export default {
  name: 'Dict',
  components: { dictDetail, Plus, Delete, Search, Edit, Download },
  mixins: [crud],
  data() {
    return {
      title: '字典',
      crudMethod: { ...crudDict },
      // 当前选中的字典名称：Vue3 中 $refs 不是响应式数据，不能直接在模板里做 v-if 判断
      currentDictName: '',
      currentDictRemark: '',
      previousDictName: '',
      queryTypeOptions: [
        { key: 'name', display_name: '字典名称' },
        { key: 'remark', display_name: '描述' }
      ],
      form: { id: null, name: null, remark: null },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  watch: {
    data: {
      async handler(rows) {
        await this.$nextTick()
        const selected = rows.find(row => row.name === this.previousDictName) || rows[0]
        this.$refs.dictTable?.setCurrentRow(selected || null)
        if (selected) this.handleCurrentChange(selected)
      }
    }
  },
  methods: {
    // 获取数据前设置好接口地址
    beforeInit() {
      this.url = 'api/dict'
      this.previousDictName = this.currentDictName || this.previousDictName
      if (this.$refs.dictDetail) {
        this.$refs.dictDetail.clearDictionary()
      }
      this.currentDictName = ''
      this.currentDictRemark = ''
      return true
    },
    // 选中字典后，设置字典详情数据
    handleCurrentChange(val) {
      if (!val || val.name === this.currentDictName) return
      this.currentDictName = val.name
      this.currentDictRemark = val.remark || ''
      this.$refs.dictDetail.selectDictionary(val)
    }
  }
}
</script>

<style scoped>
.app-container.finance-page.dict-page {
  height: var(--app-page-height, calc(100vh - 117px));
  min-height: 480px;
  overflow: hidden;
}
.dict-page > .system-grid {
  display: grid;
  grid-template-columns: minmax(360px, 40%) minmax(0, 1fr);
  align-items: stretch;
  gap: 12px;
  flex: 1;
  min-height: 0;
  margin: 0 !important;
}
.dict-page > .system-grid > .el-col {
  width: 100%;
  max-width: 100%;
  height: 100%;
  min-height: 0;
  min-width: 0;
  margin: 0;
  padding: 0 !important;
}
.dict-page .system-card { flex: 1; }
.dict-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 32px;
}
.dict-current-name {
  display: inline-block;
  margin-left: 8px;
  padding: 2px 8px;
  border-radius: 4px;
  color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
  font-size: 13px;
  font-weight: normal;
}
.dict-page :deep(.system-card > .el-card__body),
.dict-page :deep(.system-dict-detail),
.dict-page :deep(.system-detail-list) { flex: 1; min-height: 0; }
.app-container.finance-page.dict-page :deep(.finance-table) {
  flex: 1;
  height: 100%;
  min-height: 0;
  padding: 0;
  border: 0;
  border-radius: 0;
  box-shadow: none;
}
.dict-page :deep(.el-table__row) { cursor: pointer; }
.app-container.finance-page.dict-page :deep(.finance-filters),
.app-container.finance-page.dict-page :deep(.finance-pagination) {
  flex: none;
  border: 0;
  border-radius: 0;
  box-shadow: none;
  padding: 0;
}
.app-container.finance-page.dict-page :deep(.finance-pagination) { justify-content: flex-start; }
@media (max-width: 1100px) {
  .app-container.finance-page.dict-page {
    height: auto;
    min-height: var(--app-page-height, calc(100vh - 117px));
    overflow: visible;
  }
  .dict-page > .system-grid { grid-template-columns: minmax(0, 1fr); flex: none; }
  .dict-page > .system-grid > .el-col { height: 480px; }
}
</style>
