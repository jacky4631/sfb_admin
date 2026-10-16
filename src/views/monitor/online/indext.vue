<template>
  <div class="app-container finance-page">
    <div class="head-container finance-filters crud-toolbar">
      <div class="tool-search" v-if="crud.props.searchToggle">
        <el-input v-model="query.filter" clearable size="small" placeholder="全表模糊搜索" style="width: 200px;"
                  class="filter-item" @keyup.enter="crud.toQuery"/>
        <rrOperation :crud="crud"/>
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
          <el-button
            class="filter-item"
            type="danger"
            size="small"
            :loading="delLoading"
            @click="doDeleteMonth()"
          >
            强退1月
          </el-button>
        </template>
      </crudOperation>
    </div>
    <!--表格渲染-->
    <el-table ref="tableRef" class="finance-table" v-loading="crud.loading" :data="crud.data" style="width: 100%;"
              @selection-change="crud.selectionChangeHandler">
      <el-table-column type="selection" width="55"/>
      <el-table-column v-if="columns.visible('userName')" prop="userName" label="用户名"/>
      <el-table-column v-if="columns.visible('nickName')" prop="nickName" label="用户昵称"/>
      <el-table-column v-if="columns.visible('ip')" prop="ip" label="登录IP"/>
      <el-table-column v-if="columns.visible('address')" :show-overflow-tooltip="true" prop="address" label="登录地点"/>
      <el-table-column v-if="columns.visible('loginTime')" prop="loginTime" label="登录时间">
        <template #default="scope">
          <span>{{ parseTime(scope.row.loginTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="table-action-column" label="操作" width="100px" fixed="right">
        <template #default="scope">
          <el-popover trigger="click"
              :ref="(el) => setPopoverRef(scope.$index, el)"
              placement="top"
              width="180"
          >
            <p>确定强制退出该用户吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="small" link @click="hidePopover(scope.$index)">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="small" @click="delMethod(scope.row, scope.$index)">
                确定
              </el-button>
            </div>
            <template #reference>
              <el-button type="danger" class="table-text-action" v-permission="['admin']" size="small" link>强退</el-button>
            </template>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination class="finance-pagination" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessageBox } from 'element-plus'
import { delM, delT } from '@/api/monitor/online.js'
import CRUD, { presenter, header } from '@/components/Crud/crud.js'
import { parseTime } from '@/utils/index.js'
import rrOperation from '@/components/Crud/RR.operation.vue'
import crudOperation from '@/components/Crud/CRUD.operation.vue'
import pagination from '@/components/Crud/Pagination.vue'

const delLoading = ref(false)
const permission = ref({})
const popoverRefs = {}

const defaultCrud = CRUD({ url: 'auth/online', title: '在线用户', query: { type: 1 } })
const { crud, columns, tableRef, query } = presenter(defaultCrud)

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
  }).catch(() => {
  })
}

const doDeleteMonth = () => {
  ElMessageBox.confirm(`确认强退一个月未登录的用户?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    delMonth()
  }).catch(() => {
  })
}

const delMethod = (data, index) => {
  const ids = []
  if (data instanceof Array) {
    data.forEach(val => {
      ids.push(val.userName + ":" + val.key)
    })
  } else {
    ids.push(data.userName + ":" + data.key)
  }
  delLoading.value = true
  delT(ids).then(() => {
    delLoading.value = false
    crud.dleChangePage(1)
    crud.delSuccessNotify()
    crud.toQuery()
  }).catch(() => {
    delLoading.value = false
  })
}

const delMonth = () => {
  delLoading.value = true
  delM().then(() => {
    delLoading.value = false
    crud.dleChangePage(1)
    crud.delSuccessNotify()
    crud.toQuery()
  }).catch(() => {
    delLoading.value = false
  })
}
</script>
