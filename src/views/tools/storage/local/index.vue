<template>
  <div class="app-container" style="padding: 8px;">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.blurry" clearable size="small" placeholder="输入内容模糊搜索" style="width: 200px;" class="filter-item" @keyup.enter="crud.toQuery" />
        <el-date-picker
          v-model="query.createTime"
          :default-time="['00:00:00','23:59:59']"
          type="daterange"
          range-separator=":"
          size="small"
          class="date-item"
          value-format="YYYY-MM-DD HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
        <rrOperation :crud="crud" />
      </div>
      <crudOperation :permission="permission">
        <template #left>
          <!-- 新增 -->
          <el-button
            v-permission="['admin','storage:add']"
            class="filter-item"
            size="small"
            type="primary"
            :icon="Upload"
            @click="crud.toAdd"
          >上传
          </el-button>
        </template>
      </crudOperation>
    </div>
    <!--表单组件-->
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" v-model="dialogVisible" :title="crud.status.add ? '文件上传' : '编辑文件'" width="500px">
      <el-form ref="formRef" :model="form" size="small" label-width="80px">
        <el-form-item label="文件名">
          <el-input v-model="form.name" style="width: 370px;" />
        </el-form-item>
        <!--   上传文件   -->
        <el-form-item v-if="crud.status.add" label="上传">
          <el-upload
            ref="uploadRef"
            :limit="1"
            :before-upload="beforeUpload"
            :auto-upload="false"
            :headers="headers"
            :on-success="handleSuccess"
            :on-error="handleError"
            :action="fileUploadApi + '?name=' + form.name"
          >
            <div class="eladmin-upload"><el-icon><Upload /></el-icon> 添加文件</div>
            <template #tip>
              <div class="el-upload__tip">可上传任意格式文件，且不超过100M</div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button link @click="crud.cancelCU">取消</el-button>
          <el-button v-if="crud.status.add" :loading="loading" type="primary" @click="upload">确认</el-button>
          <el-button v-else :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </template>
    </el-dialog>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
      <el-table-column type="selection" width="55" />
      <el-table-column v-if="columns.visible('name')" prop="name" label="文件名">
        <template #default="scope">
          <el-popover
            :content="'file/' + scope.row.type + '/' + scope.row.realName"
            placement="top-start"
            title="路径"
            width="200"
            trigger="hover"
          >
            <template #reference>
              <a
                :href="baseApi + '/file/' + scope.row.type + '/' + scope.row.realName"
                class="el-link--primary"
                style="word-break:keep-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color: #1890ff;font-size: 13px;"
                target="_blank"
              >
                {{ scope.row.name }}
              </a>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column v-if="columns.visible('path')" prop="path" label="预览图">
        <template #default="{row}">
          <el-image
            :src="baseApi + '/file/' + row.type + '/' + row.realName"
            :preview-src-list="[baseApi + '/file/' + row.type + '/' + row.realName]"
            fit="contain"
            lazy
            class="el-avatar"
          >
            <template #error>
              <div>
                <el-icon><Document /></el-icon>
              </div>
            </template>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column v-if="columns.visible('suffix')" prop="suffix" label="文件类型" />
      <el-table-column v-if="columns.visible('type')" prop="type" label="类别" />
      <el-table-column v-if="columns.visible('size')" prop="size" label="大小" />
      <el-table-column v-if="columns.visible('operate')" prop="operate" label="操作人" />
      <el-table-column v-if="columns.visible('createTime')" prop="createTime" label="创建日期">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination />
  </div>
</template>

<script setup>
import { Upload } from '@element-plus/icons-vue'
import { ref, computed, onMounted } from 'vue'
import { getToken } from '@/utils/auth.js'
import crudFile from '@/api/tools/localStorage.js'
import CRUD, { presenter, header, form as crudForm } from '@/components/Crud/crud.js'
import { parseTime } from '@/utils/index.js'
import rrOperation from '@/components/Crud/RR.operation.vue'
import crudOperation from '@/components/Crud/CRUD.operation.vue'
import pagination from '@/components/Crud/Pagination.vue'
import { ElMessage } from 'element-plus'

const baseUrl = import.meta.env.VITE_BASE_API || ''
const loading = ref(false)
const dialogVisible = computed({
  get() { return crud.status.cu > 0 },
  set() { crud.status.cu = 0 }
})
const headers = ref({ 'Authorization': getToken() })
const permission = ref({
  edit: ['admin', 'storage:edit'],
  del: ['admin', 'storage:del']
})
const uploadRef = ref(null)
const formRef = ref(null)

const baseApi = computed(() => baseUrl)
const fileUploadApi = computed(() => baseUrl + '/api/localStorage')

const defaultCrud = CRUD({ title: '文件', url: 'api/localStorage', crudMethod: { ...crudFile }})
const defaultForm = { id: null, name: '' }
const { crud, columns, query } = presenter(defaultCrud)
// 之前模板里的 form 指向的是导入的 form() 函数本身（并非表单数据），这里绑回 crud.form
const { form } = crudForm(defaultForm)

defineExpose({ crud })

onMounted(() => {
  crud.optShow.add = false
})

const upload = () => {
  uploadRef.value.submit()
}

const beforeUpload = (file) => {
  let isLt2M = true
  isLt2M = file.size / 1024 / 1024 < 100
  if (!isLt2M) {
    loading.value = false
    ElMessage.error('上传文件大小不能超过 100MB!')
  }
  form.name = file.name
  return isLt2M
}

const handleSuccess = (response, file, fileList) => {
  crud.notify('上传成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
  uploadRef.value.clearFiles()
  crud.status.add = CRUD.STATUS.NORMAL
  crud.resetForm()
  crud.toQuery()
}

const handleError = (e, file, fileList) => {
  const msg = JSON.parse(e.message)
  ElMessage.error(msg.message)
  loading.value = false
}
</script>

<style scoped>
  :deep(.el-image__error), :deep(.el-image__placeholder) {
    background: none;
  }
  :deep(.el-image-viewer__wrapper) {
    top: 55px;
  }
</style>
