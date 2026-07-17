<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
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
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
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
      <el-table-column v-if="checkPermission(['admin','MWARTICLE_ALL','MWARTICLE_EDIT','MWARTICLE_DELETE'])" label="操作" width="220px" align="center">
        <template #default="scope">
          <el-button v-permission="['admin','MWARTICLE_ALL','MWARTICLE_EDIT']" size="small"
                     type="primary" :icon="Icons.Edit"
                     >
            <router-link :to="'/wechat/artadd/'+scope.row.id">
              编辑
            </router-link>
          </el-button>
          <el-popover
            :ref="'popover-' + scope.row.id"
            v-permission="['admin','MWARTICLE_ALL','MWARTICLE_DELETE']"
            placement="top"
            width="180"
          >
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="small" link @click="$refs['popover-' + scope.row.id].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="small" @click="subDelete(scope.row.id)">确定</el-button>
            </div>
            <template #reference>
              <el-button type="danger" :icon="Icons.Delete" size="small" />
            </template>
          </el-popover>
          <el-popover
            :ref="'item' + scope.row.id"
            v-permission="['admin','MWARTICLE_ALL','MWARTICLE_DELETE']"
            placement="top"
            width="180"
          >
            <p>确定发布本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="small" link @click="$refs['item' + scope.row.id].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="small" @click="subPublish(scope.row.id)">确定</el-button>
            </div>
            <template #reference>
              <el-button type="primary" size="small">发布</el-button>
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
import { ElNotification } from 'element-plus'
import checkPermission from '@/utils/permission'
import { del, publish } from '@/api/mwArticle'
import eForm from './form'
import { formatTime } from '@/utils/index'
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
const tableRef = ref(null)

const init = () => {
  loading.value = true
  // Simulate fetching data - replace with actual API call
  loading.value = false
}

const beforeInit = () => {
  url.value = 'api/mwArticle'
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
    dleChangePage()
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
