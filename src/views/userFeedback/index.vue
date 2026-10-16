<template>
  <div class="app-container finance-page">
    <!--工具栏-->
    <div class="head-container finance-filters">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.value" clearable placeholder="输入搜索内容" style="width: 200px;" class="filter-item" @keyup.enter="crud.toQuery" />
        <el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 130px">
          <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
    </div>
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" v-model="dialogVisible" :title="crud.status.title" width="500px">
        <el-form ref="formRef" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="用户id" prop="uid">
            <el-input v-model="form.uid" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="反馈内容" prop="feedback">
            <el-input :rows="3" v-model="form.feedback" type="textarea" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button link @click="crud.cancelCU">取消</el-button>
            <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
          </div>
        </template>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="tableRef" class="finance-table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column v-if="columns.visible('id')" prop="id" label="id" />
        <el-table-column v-if="columns.visible('uid')" prop="uid" label="用户id" />
        <el-table-column v-if="columns.visible('feedback')" prop="feedback" label="反馈内容" />
        <el-table-column v-if="columns.visible('createTime')" prop="createTime" label="添加时间">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('updateTime')" prop="updateTime" label="更新时间">
          <template #default="scope">
            <span>{{ parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="checkPermission(['admin','mwUserFeedback:edit','mwUserFeedback:del'])" label="操作" width="150px" align="center">
          <template #default="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination class="finance-pagination" />
  </div>
</template>

<script setup>
import checkPermission from '@/utils/permission.js'
import { ref, reactive, computed, watch } from 'vue'
import crudMwUserFeedback from '@/api/mwUserFeedback.js'
import CRUD, { presenter, header, form as crudForm } from '@/components/Crud/crud.js'
import rrOperation from '@/components/Crud/RR.operation.vue'
import crudOperation from '@/components/Crud/CRUD.operation.vue'
import udOperation from '@/components/Crud/UD.operation.vue'
import pagination from '@/components/Crud/Pagination.vue'
import MaterialList from "@/components/material/index.vue"
import { parseTime } from '@/utils/index.js'

defineOptions({
  name: 'MwUserFeedback'
})

// crud交由presenter持有
const defaultCrud = CRUD({ title: 'userFeedback', url: 'api/mwUserFeedback', sort: 'id,desc', crudMethod: { ...crudMwUserFeedback }})
const defaultForm = { id: null, uid: null, feedback: null, createTime: null, updateTime: null, isDel: null }

const permission = reactive({
  add: ['admin', 'mwUserFeedback:add'],
  edit: ['admin', 'mwUserFeedback:edit'],
  del: ['admin', 'mwUserFeedback:del']
})

const rules = {
  uid: [
    { required: true, message: '用户id不能为空', trigger: 'blur' }
  ],
  feedback: [
    { required: true, message: '反馈内容不能为空', trigger: 'blur' }
  ]
}

const queryTypeOptions = [
  { key: 'uid', display_name: '用户id' }
]

const query = reactive({
  value: '',
  type: ''
})

const tableRef = ref(null)
const formRef = ref(null)

// presenter 返回 { crud, columns, query, tableRef }
const { crud, columns, query: presenterQuery } = presenter(defaultCrud)
// 模板里的 <el-form :model="form"> 必须绑到 crud.form，否则打开弹窗即渲染报错
const { form } = crudForm(defaultForm)

const dialogVisible = computed({
  get: () => crud.status.cu > 0,
  set: (val) => {
    if (!val) {
      crud.status.add = CRUD.STATUS.NORMAL
      crud.status.edit = CRUD.STATUS.NORMAL
    }
  }
})

// Watch for query changes
watch(() => [query.type, query.value], () => {
  // Handle beforeRefresh logic
  if (query.type && query.value) {
    crud.params[query.type] = query.value
  } else {
    delete crud.params.uid
  }
})

// CRUD hooks as functions
const beforeRefresh = () => {
  const q = query
  if (q.type && q.value) {
    crud.params[q.type] = q.value
  } else {
    delete crud.params.uid
  }
  return true
}

const afterToCU = (crudInstance, formData) => {
  // Post-processing after ToCU hook
}

defineExpose({
  crud,
  query,
  columns,
  form: defaultForm
})
</script>

<style scoped>
.table-img {
  display: inline-block;
  text-align: center;
  background: #ccc;
  color: #fff;
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  vertical-align: middle;
  width: 32px;
  height: 32px;
  line-height: 32px;
}
</style>
