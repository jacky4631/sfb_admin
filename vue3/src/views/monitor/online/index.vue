<template>
  <div class="app-container">
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <el-input v-model="query.filter" clearable size="small" placeholder="全表模糊搜索" style="width: 200px;" class="filter-item" @keyup.enter="crud.toQuery" />
        <rrOperation :crud="crud" />
      </div>
      <crudOperation>
        <template #left>
          <el-button
            class="filter-item"
            type="danger"
            size="small"
            :loading="delLoading"
            :disabled="crud.selections.length === 0"
            @click="doDelete(crud.selections)"
          >
            强退
          </el-button>
        </template>
      </crudOperation>
    </div>
    <!--表格渲染-->
    <el-table ref="tableRef" v-loading="crud.loading" :data="crud.data" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
      <el-table-column type="selection" width="55" />
      <el-table-column v-if="columns.visible('userName')" prop="userName" label="用户名" />
      <el-table-column v-if="columns.visible('nickName')" prop="nickName" label="用户昵称" />
      <el-table-column v-if="columns.visible('job')" prop="job" label="岗位" />
      <el-table-column v-if="columns.visible('ip')" prop="ip" label="登录IP" />
      <el-table-column v-if="columns.visible('address')" :show-overflow-tooltip="true" prop="address" label="登录地点" />
      <el-table-column v-if="columns.visible('browser')" prop="browser" label="浏览器" />
      <el-table-column v-if="columns.visible('loginTime')" prop="loginTime" label="登录时间">
        <template #default="scope">
          <span>{{ parseTime(scope.row.loginTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100px" fixed="right">
        <template #default="scope">
          <el-popover
            :ref="(el) => setPopoverRef(scope.$index, el)"
            v-permission="['admin']"
            placement="top"
            width="180"
          >
            <p>确定强制退出该用户吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="small" link @click="hidePopover(scope.$index)">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="small" @click="delMethod(scope.row.key, scope.$index)">确定</el-button>
            </div>
            <template #reference>
              <el-button size="small" link>强退</el-button>
            </template>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessageBox } from 'element-plus'
import { del } from '@/api/monitor/online'
import CRUD, { presenter, header } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'

const delLoading = ref(false)
const permission = ref({})
const popoverRefs = {}

const defaultCrud = CRUD({ url: 'auth/online', title: '在线用户' })
const { crud, columns, tableRef } = presenter(defaultCrud)

const setPopoverRef = (index, el) => {
  if (el) {
    popoverRefs[index] = el
  }
}

const hidePopover = (index) => {
  if (popoverRefs[index]) {
    popoverRefs[index].hide()
  }
}

onMounted(() => {
  crud.msg.del = '强退成功！'
  crud.optShow = {
    add: false,
    edit: false,
    del: false,
    download: true
  }
})

const doDelete = (datas) => {
  ElMessageBox.confirm(`确认强退选中的${datas.length}个用户?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    delMethod(datas)
  }).catch(() => {})
}

const delMethod = (key, index) => {
  const ids = []
  if (key instanceof Array) {
    key.forEach(val => {
      ids.push(val.key)
    })
  } else ids.push(key)
  delLoading.value = true
  del(ids).then(() => {
    delLoading.value = false
    hidePopover(index)
    crud.dleChangePage(1)
    crud.delSuccessNotify()
    crud.toQuery()
  }).catch(() => {
    delLoading.value = false
    hidePopover(index)
  })
}
</script>
