<template>
  <div class="app-container finance-page">
    <!--工具栏-->
    <div class="head-container finance-filters">
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
    <eForm ref="formRef" :is-add="isAdd" @refresh="handleSaved" />
    <!--表格渲染-->
    <el-table class="finance-table" v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column prop="status" label="消息类型">
        <template #default="scope">
          <div>
            <el-tag v-if="scope.row.type == 'template'" type="primary">模板消息</el-tag>
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
            <el-tag v-if="scope.row.status === 1" type="primary">可用</el-tag>
            <el-tag v-else :type=" 'info' ">禁用</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column class-name="table-icon-column" v-if="checkPermission(['admin','MWWECHATTEMPLATE_ALL','MWWECHATTEMPLATE_EDIT','MWWECHATTEMPLATE_DELETE'])" label="操作" width="150px" align="center">
        <template #default="scope">
          <el-button title="编辑" aria-label="编辑" class="table-icon-action" v-permission="['admin','MWWECHATTEMPLATE_ALL','MWWECHATTEMPLATE_EDIT']" size="small" type="primary" :icon="Icons.Edit" @click="edit(scope.row)" />
          <el-popover trigger="click"
            :ref="el => setPopoverRef(scope.row.id, el)"
            placement="top"
            width="180"
          >
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="small" link @click="hidePopover(scope.row.id)">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="small" @click="subDelete(scope.row.id)">确定</el-button>
            </div>
            <template #reference>
              <el-button title="删除" aria-label="删除" class="table-icon-action" v-permission="['admin','MWWECHATTEMPLATE_ALL','MWWECHATTEMPLATE_DELETE']" type="danger" :icon="Icons.Delete" size="small" />
            </template>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      class="finance-pagination"
      :page-size="size"
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
import { ref, onMounted, onActivated } from 'vue'
import { ElMessage, ElNotification } from 'element-plus'
import checkPermission from '@/utils/permission.js'
import { del } from '@/api/mwWechatTemplate.js'
import eForm from './form.vue'
import { initData } from '@/api/data.js'
import * as Icons from '@element-plus/icons-vue'

const loading = ref(false)
const isAdd = ref(true)
const delLoading = ref(false)
const page = ref(0)
const size = ref(10)
const total = ref(0)
const data = ref([])
const formRef = ref(null)

let requestVersion = 0
const init = async () => {
  const version = ++requestVersion
  loading.value = true
  try {
    const result = await initData('api/mwWechatTemplate', { page: page.value, size: size.value, sort: 'id,desc' })
    if (version !== requestVersion) return
    data.value = result.content
    total.value = result.totalElements
  } catch (err) {
    if (version === requestVersion) ElMessage.error(err.response?.data?.message || '列表加载失败，请重试')
  } finally {
    if (version === requestVersion) loading.value = false
  }
}
const handleSaved = () => { page.value = 0; init() }
onMounted(init)
let firstActivation = true
onActivated(() => {
  if (firstActivation) { firstActivation = false; return }
  init()
})
const popoverRefs = new Map()
const setPopoverRef = (id, el) => {
  if (el) popoverRefs.set(id, el)
  else popoverRefs.delete(id)
}
const hidePopover = id => popoverRefs.get(id)?.hide()

const subDelete = (id) => {
  delLoading.value = true
  del(id).then(res => {
    delLoading.value = false
    hidePopover(id)
    dleChangePage()
    init()
    ElNotification({
      title: '删除成功',
      type: 'success',
      duration: 2500
    })
  }).catch(err => {
    delLoading.value = false
    ElMessage.error(err.response?.data?.message || '删除失败，请重试')
  })
}

const add = () => {
  isAdd.value = true
  formRef.value.open()
}
const edit = row => {
  isAdd.value = false
  formRef.value.open(row)
}

const sizeChange = (val) => {
  size.value = val
  page.value = 0
  init()
}

const pageChange = (val) => {
  page.value = val - 1
  init()
}

const dleChangePage = () => {
  if (data.value.length === 1 && page.value > 0) {
    page.value = Math.max(0, page.value - 1)
  }
}
</script>

<style scoped>

</style>
