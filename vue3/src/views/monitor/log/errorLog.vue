<template>
  <div class="app-container">
    <div class="head-container">
      <Search />
      <crudOperation>
        <template #left>
          <el-button
            class="filter-item"
            type="danger"
            icon="el-icon-delete"
            size="small"
            :loading="crud.delAllLoading"
            @click="confirmDelAll()"
          >
            清空
          </el-button>
        </template>
      </crudOperation>
    </div>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
      <el-table-column type="expand">
        <template #default="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="请求方法">
              <span>{{ props.row.method }}</span>
            </el-form-item>
            <el-form-item label="请求参数">
              <span>{{ props.row.params }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column v-if="columns.visible('username')" prop="username" label="用户名" />
      <el-table-column v-if="columns.visible('requestIp')" prop="requestIp" label="IP" />
      <el-table-column v-if="columns.visible('address')" :show-overflow-tooltip="true" prop="address" label="IP来源" />
      <el-table-column v-if="columns.visible('description')" prop="description" label="描述" />
      <el-table-column v-if="columns.visible('browser')" prop="browser" label="浏览器" />
      <el-table-column v-if="columns.visible('createTime')" prop="createTime" label="创建日期">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="异常详情" width="100px">
        <template #default="scope">
          <el-button size="small" link @click="info(scope.row.id)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="dialog" title="异常详情" append-to-body top="30px" width="85%">
      <pre v-highlightjs="errorInfo"><code class="java" /></pre>
    </el-dialog>
    <!--分页组件-->
    <pagination />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { getErrDetail, delAllError } from '@/api/monitor/log'
import Search from './search.vue'
import CRUD, { presenter } from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'

const errorInfo = ref('')
const dialog = ref(false)

const defaultCrud = CRUD({ title: '异常日志', url: 'api/logs/error' })
const { crud, columns } = presenter(defaultCrud)

onMounted(() => {
  crud.optShow = {
    add: false,
    edit: false,
    del: false,
    download: true
  }
})

const info = (id) => {
  dialog.value = true
  getErrDetail(id).then(res => {
    errorInfo.value = res.exception
  })
}

const confirmDelAll = () => {
  ElMessageBox.confirm(`确认清空所有异常日志吗?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    crud.delAllLoading = true
    delAllError().then(res => {
      crud.delAllLoading = false
      crud.dleChangePage(1)
      crud.delSuccessNotify()
      crud.toQuery()
    }).catch(err => {
      crud.delAllLoading = false
      console.log(err.response.data.message)
    })
  }).catch(() => {
  })
}
</script>

<style scoped>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 70px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}
.demo-table-expand .el-form-item__content {
  font-size: 12px;
}
:deep(.el-dialog__body) {
  padding: 0 20px 10px 20px !important;
}
.java.hljs {
  color: #444;
  background: #ffffff !important;
  height: 630px !important;
}
</style>
