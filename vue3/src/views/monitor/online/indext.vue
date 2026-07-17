<template>
  <div class="app-container">
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <el-input v-model="query.filter" clearable size="small" placeholder="全表模糊搜索" style="width: 200px;"
                  class="filter-item" @keyup.enter.native="crud.toQuery"/>
        <rrOperation :crud="crud"/>
      </div>
      <crudOperation>
        <el-button
            slot="left"
            class="filter-item"
            type="danger"
            icon="el-icon-delete"
            size="mini"
            :loading="delLoading"
            :disabled="crud.selections.length === 0"
            @click="doDelete(crud.selections)"
        >
          强退
        </el-button>
        <el-button
          slot="left"
          class="filter-item"
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :loading="delLoading"
          @click="doDeleteMonth()"
        >
          强退1月
        </el-button>
      </crudOperation>
    </div>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;"
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
      <el-table-column label="操作" width="100px" fixed="right">
        <template #default="scope">
          <el-popover
              :ref="scope.$index"
              v-permission="['admin']"
              placement="top"
              width="180"
          >
            <p>确定强制退出该用户吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.$index].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="delMethod(scope.row, scope.$index)">
                确定
              </el-button>
            </div>
            <el-button slot="reference" size="mini" type="text">强退</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination/>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessageBox } from 'element-plus'
import { delM, delT } from '@/api/monitor/online'
import CRUD, { presenter, header, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'

const delLoading = ref(false)
const permission = ref({})

const defaultCrud = CRUD({ url: 'auth/online', title: '在线用户', query: { type: 1 } })
const { crud, columns } = presenter(defaultCrud)

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
    if (index && this.$refs[index]) {
      this.$refs[index].doClose()
    }
    crud.dleChangePage(1)
    crud.delSuccessNotify()
    crud.toQuery()
  }).catch(() => {
    delLoading.value = false
    if (index && this.$refs[index]) {
      this.$refs[index].doClose()
    }
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
