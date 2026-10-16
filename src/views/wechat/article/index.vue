<template>
  <div class="app-container finance-page">
    <!--工具栏-->
    <div class="head-container finance-filters">
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          v-permission="['admin','MWARTICLE_ALL','MWARTICLE_CREATE']"
          class="filter-item"
          size="small"
          type="primary"
          :icon="Icons.Plus"
                 >
          <router-link :to="'/wechat/artadd'">
            新增
          </router-link>
        </el-button>
      </div>
    </div>
    <!--表单组件-->
    <!--<eForm ref="form" :is-add="isAdd" />-->
    <!--表格渲染-->
    <el-table class="finance-table" v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="author" label="作者" />
      <el-table-column ref="tableRef" prop="imageInput" label="封面">
        <template #default="scope">
          <a :href="scope.row.imageInput" style="color: rgb(64, 158, 255)" target="_blank"><img :src="scope.row.imageInput" alt="点击打开" class="el-avatar"></a>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="createTime" label="创建日期">
        <template #default="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['admin','MWARTICLE_ALL','MWARTICLE_EDIT','MWARTICLE_DELETE'])" label="操作" width="180px" align="center" fixed="right">
        <template #default="scope">
          <div class="article-row-actions">
          <el-button v-permission="['admin','MWARTICLE_ALL','MWARTICLE_EDIT']" size="small"
            type="primary" link class="table-text-action" @click="router.push('/wechat/artadd/' + scope.row.id)">编辑</el-button>
          <el-popover trigger="click"
            :ref="'item' + scope.row.id"
            placement="top"
            width="180"
          >
            <p>确定发布本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="small" link @click="$refs['item' + scope.row.id].hide()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="small" @click="subPublish(scope.row.id)">确定</el-button>
            </div>
            <template #reference>
              <el-button v-permission="['admin','MWARTICLE_ALL','MWARTICLE_DELETE']" type="primary" link class="table-text-action" size="small">发布</el-button>
            </template>
          </el-popover>
          <el-popover trigger="click"
            :ref="'popover-' + scope.row.id"
            placement="top"
            width="180"
          >
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="small" link @click="$refs['popover-' + scope.row.id].hide()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="small" @click="subDelete(scope.row.id)">确定</el-button>
            </div>
            <template #reference>
              <el-button v-permission="['admin','MWARTICLE_ALL','MWARTICLE_DELETE']" type="danger" link class="table-text-action" size="small">删除</el-button>
            </template>
          </el-popover>
          </div>
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
import { useRouter } from 'vue-router'
import { ElNotification, ElMessage } from 'element-plus'
import checkPermission from '@/utils/permission.js'
import { del, publish } from '@/api/mwArticle.js'
import { initData } from '@/api/data.js'
import { formatTime } from '@/utils/index.js'
import * as Icons from '@element-plus/icons-vue'

const router = useRouter()
const loading = ref(false)
const isAdd = ref(true)
const delLoading = ref(false)
const page = ref(0)
const size = ref(10)
const total = ref(0)
const data = ref([])
const tableRef = ref(null)

let requestVersion = 0
const init = async () => {
  const version = ++requestVersion
  loading.value = true
  try {
    const result = await initData('api/mwArticle', { page: page.value, size: size.value, sort: 'id,desc' })
    if (version !== requestVersion) return
    data.value = result.content
    total.value = result.totalElements
  } catch (err) {
    if (version === requestVersion) ElMessage.error(err.response?.data?.message || '图文列表加载失败，请重试')
  } finally {
    if (version === requestVersion) loading.value = false
  }
}

onMounted(init)
let firstActivation = true
onActivated(() => {
  if (firstActivation) {
    firstActivation = false
    return
  }
  page.value = 0
  init()
})

const subDelete = (id) => {
  delLoading.value = true
  del(id).then(res => {
    delLoading.value = false
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

const subPublish = (id) => {
  delLoading.value = true
  publish(id).then(res => {
    delLoading.value = false
    init()
    ElNotification({
      title: '发布成功',
      type: 'success',
      duration: 2500
    })
  }).catch(err => {
    delLoading.value = false
    console.log(err.response?.data?.message || err.message)
  })
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
.article-row-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  white-space: nowrap;
}
.article-row-actions .el-button.is-link {
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
}
</style>
