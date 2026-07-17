<template>
  <div class="app-container" style="padding: 8px;">
    <!--表单组件-->
    <eForm ref="formRef" />
    <!-- 工具栏 -->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.key" clearable size="small" placeholder="输入文件名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery" />
        <el-date-picker
          v-model="query.c"
          :default-time="['00:00:00','23:59:59']"
          type="daterange"
          range-separator=":"
          size="small"
          class="date-item"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
        <rrOperation :crud="crud" />
      </div>
      <crudOperation :permission="permission">
        <template #left>
          <!-- 上传 -->
          <el-button class="filter-item" size="mini" type="primary" icon="el-icon-upload" @click="dialog = true">上传</el-button>
          <!-- 同步 -->
          <el-button :icon="icon" class="filter-item" size="mini" type="warning" @click="synchronize">同步</el-button>
          <!-- 配置 -->
          <el-button
            class="filter-item"
            size="mini"
            type="success"
            icon="el-icon-s-tools"
            @click="doConfig"
          >配置</el-button>
        </template>
      </crudOperation>
      <!-- 文件上传 -->
      <el-dialog v-model="dialog" :close-on-click-modal="false" append-to-body width="500px" @close="doSubmit">
        <el-upload
          :before-remove="handleBeforeRemove"
          :on-success="handleSuccess"
          :on-error="handleError"
          :file-list="fileList"
          :headers="headers"
          :action="qiNiuUploadApi"
          class="upload-demo"
          multiple
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" style="display: block;" class="el-upload__tip">请勿上传违法文件，且文件不超过15M</div>
        </el-upload>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="doSubmit">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column v-if="columns.visible('name')" prop="name" :show-overflow-tooltip="true" label="文件名">
          <template #default="scope">
            <a href="JavaScript:" class="el-link el-link--primary" target="_blank" type="primary" @click="download(scope.row.id)">{{ scope.row.key }}</a>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('suffix')" :show-overflow-tooltip="true" prop="suffix" label="文件类型" @selection-change="crud.selectionChangeHandler" />
        <el-table-column v-if="columns.visible('bucket')" prop="bucket" label="空间名称" />
        <el-table-column v-if="columns.visible('size')" prop="size" label="文件大小" />
        <el-table-column v-if="columns.visible('type')" prop="type" label="空间类型" />
        <el-table-column v-if="columns.visible('updateTime')" prop="updateTime" label="创建日期">
          <template #default="scope">
            <span>{{ parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { getToken } from '@/utils/auth'
import crudQiNiu from '@/api/tools/qiniu'
import eForm from './form.vue'
import CRUD, { presenter, header, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import { ElMessage } from 'element-plus'

const baseUrl = import.meta.env.VITE_APP_BASE_API || ''
const permission = ref({
  del: ['admin', 'storage:del']
})
const title = ref('文件')
const dialog = ref(false)
const icon = ref('el-icon-refresh')
const url = ref('')
const headers = ref({ 'Authorization': getToken() })
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const fileList = ref([])
const files = ref([])
const newWin = ref(null)

const qiNiuUploadApi = computed(() => baseUrl + '/api/qiNiuContent')

const defaultCrud = CRUD({ title: '七牛云文件', url: 'api/qiNiuContent', crudMethod: { ...crudQiNiu }})
const { crud, columns } = presenter(defaultCrud)

onMounted(() => {
  crud.optShow.add = false
  crud.optShow.edit = false
})

watch(url, (newVal) => {
  if (newVal && newWin.value) {
    newWin.value.sessionStorage.clear()
    newWin.value.location.href = newVal
    url.value = ''
    newWin.value = null
  }
})

const doConfig = () => {
  const formInstance = formRef.value
  formInstance.init()
  formInstance.dialog = true
}

const handleSuccess = (response, file, fileList) => {
  const uid = file.uid
  const id = response.id
  files.value.push({ uid, id })
}

const handleBeforeRemove = (file, fileList) => {
  for (let i = 0; i < files.value.length; i++) {
    if (files.value[i].uid === file.uid) {
      crudQiNiu.del([files.value[i].id]).then(res => {})
      return true
    }
  }
}

const handlePictureCardPreview = (file) => {
  dialogImageUrl.value = file.url
  dialogVisible.value = true
}

const doSubmit = () => {
  fileList.value = []
  dialogVisible.value = false
  dialogImageUrl.value = ''
  dialog.value = false
  crud.toQuery()
}

const handleError = (e, file, fileList) => {
  const msg = JSON.parse(e.message)
  crud.notify(msg.message, CRUD.NOTIFICATION_TYPE.ERROR)
}

const download = (id) => {
  downloadLoading.value = true
  newWin.value = window.open()
  crudQiNiu.download(id).then(res => {
    downloadLoading.value = false
    url.value = res.url
  }).catch(err => {
    downloadLoading.value = false
    console.log(err.response.data.message)
  })
}

const synchronize = () => {
  icon.value = 'el-icon-loading'
  crudQiNiu.sync().then(res => {
    icon.value = 'el-icon-refresh'
    ElMessage.success('数据同步成功')
    crud.toQuery()
  }).catch(err => {
    icon.value = 'el-icon-refresh'
    console.log(err.response.data.message)
  })
}
</script>

<style scoped>
</style>
