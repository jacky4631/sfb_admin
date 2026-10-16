<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          v-permission="['admin','MWWECHATTEMPLATE_ALL','MWWECHATTEMPLATE_CREATE']"
          class="filter-item"
          size="small"
          type="primary"
          :icon="Icons.Plus"
          @click="add"
        >新增</el-button>
      </div>
    </div>
    <!--表单组件-->
    <eForm ref="formRef" :is-add="isAdd" />
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column prop="status" label="消息类型">
        <template #default="scope">
          <div>
            <el-tag v-if="scope.row.type == 'template'" :type="''">模板消息</el-tag>
            <el-tag v-else :type=" 'info' ">订阅消息</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="模板id" />
      <el-table-column prop="tempkey" label="模板编号" />
      <el-table-column prop="name" label="模板名" />
      <el-table-column prop="tempid" label="模板ID" />
      <el-table-column prop="status" label="状态">
        <template #default="scope">
          <div>
            <el-tag v-if="scope.row.status === 1" :type="''">可用</el-tag>
            <el-tag v-else :type=" 'info' ">禁用</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['admin','MWWECHATTEMPLATE_ALL','MWWECHATTEMPLATE_EDIT','MWWECHATTEMPLATE_DELETE'])" label="操作" width="150px" align="center">
        <template #default="scope">
          <el-button v-permission="['admin','MWWECHATTEMPLATE_ALL','MWWECHATTEMPLATE_EDIT']" size="small" type="primary" :icon="Icons.Edit" @click="edit(scope.row)" />
          <el-popover
            :ref="scope.row.id"
            placement="top"
            width="180"
          >
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="small" link @click="$refs[scope.row.id].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="small" @click="subDelete(scope.row.id)">确定</el-button>
            </div>
            <template #reference>
              <el-button v-permission="['admin','MWWECHATTEMPLATE_ALL','MWWECHATTEMPLATE_DELETE']" type="danger" :icon="Icons.Delete" size="small" />
            </template>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      :current-page="page + 1"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElNotification } from 'element-plus'
import checkPermission from '@/utils/permission'
import { del } from '@/api/mwWechatTemplate'
import eForm from './form'
import * as Icons from '@element-plus/icons-vue'

const loading = ref(false)
const isAdd = ref(true)
const delLoading = ref(false)
const page = ref(0)
const size = ref(10)
const total = ref(0)
const data = ref([])
const url = ref('')
const params = ref({})
const formRef = ref(null)

const init = () => {
  loading.value = true
  // Simulate fetching data - replace with actual API call
  loading.value = false
}

const beforeInit = () => {
  url.value = 'api/mwWechatTemplate'
  const sort = 'id,desc'
  params.value = { page: page.value, size: size.value, sort: sort }
  return true
}

onMounted(() => {
  init()
})

const subDelete = (id) => {
  delLoading.value = true
  del(id).then(res => {
    delLoading.value = false
    // Note: popover ref handling differs in Vue 3
    dleChangePage()
    init()
    ElNotification({
      title: '删除成功',
      type: 'success',
      duration: 2500
    })
  }).catch(err => {
    delLoading.value = false
    console.log(err.response?.data?.message || err.message)
  })
}

const add = () => {
  isAdd.value = true
  formRef.value.dialog = true
}

const edit = (rowData) => {
  isAdd.value = false
  const _this = formRef.value
  _this.form = {
    id: rowData.id,
    tempkey: rowData.tempkey,
    name: rowData.name,
    content: rowData.content,
    tempid: rowData.tempid,
    addTime: rowData.addTime,
    status: rowData.status,
    type: rowData.type
  }
  _this.dialog = true
}

const sizeChange = (val) => {
  size.value = val
  init()
}

const pageChange = (val) => {
  page.value = val
  init()
}

const dleChangePage = () => {
  if (total.value % size.value === 0) {
    page.value = Math.max(0, page.value - 1)
  }
}
</script>

<style scoped>

</style>
