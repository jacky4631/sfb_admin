<template>
  <div class="app-container">
    <div class="head-container">
      <Search />
      <crudOperation>
        <template #left>
          <el-button
            class="filter-item"
            type="danger"
            :icon="Delete"
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
      <el-table-column v-if="columns.visible('time')" prop="time" label="请求耗时" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.time <= 300">{{ scope.row.time }}ms</el-tag>
          <el-tag v-else-if="scope.row.time <= 1000" type="warning">{{ scope.row.time }}ms</el-tag>
          <el-tag v-else type="danger">{{ scope.row.time }}ms</el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="columns.visible('createTime')" prop="createTime" label="创建日期" width="180px">
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
import { Delete } from '@element-plus/icons-vue'
import { ref, onMounted } from 'vue'
import { ElMessageBox } from 'element-plus'
import Search from './search.vue'
import { delAllInfo } from '@/api/monitor/log'
import CRUD, { presenter } from '@crud/crud'
import { parseTime } from '@/utils/index'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'

const defaultCrud = CRUD({ title: '日志', url: 'api/logs' })
const { crud, columns } = presenter(defaultCrud)

onMounted(() => {
  crud.optShow = {
    add: false,
    edit: false,
    del: false,
    download: true
  }
})

const confirmDelAll = () => {
  ElMessageBox.confirm(`确认清空所有操作日志吗?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    crud.delAllLoading = true
    delAllInfo().then(res => {
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

<style>
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
</style>
