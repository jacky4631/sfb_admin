<template>
  <div class="crud-opts">
    <span class="crud-opts-left">
      <!--左侧插槽-->
      <slot name="left" />
      <el-button
        v-if="crud.optShow.add"
        v-permission="permission.add || []"
        class="filter-item"
        size="small"
        type="primary"
        :icon="Plus"
        @click="crud.toAdd"
      >
        新增
      </el-button>
      <el-button
        v-if="crud.optShow.edit"
        v-permission="permission.edit || []"
        class="filter-item"
        size="small"
        type="success"
        :icon="Edit"
        :disabled="crud.selections.length !== 1"
        @click="crud.toEdit(crud.selections[0])"
      >
        修改
      </el-button>
      <el-button
        v-if="crud.optShow.del"
        v-permission="permission.del || []"
        class="filter-item"
        type="danger"
        :icon="Delete"
        size="small"
        :loading="crud.delAllLoading"
        :disabled="crud.selections.length === 0"
        @click="toDelete(crud.selections)"
      >
        删除
      </el-button>
      <el-button
        v-if="crud.optShow.download"
        :loading="crud.downloadLoading"
        :disabled="!crud.data.length"
        class="filter-item"
        size="small"
        type="warning"
        :icon="Download"
        @click="crud.doExport"
      >导出</el-button>
      <!--右侧-->
      <slot name="right" />
    </span>
    <el-button-group class="crud-opts-right">
      <el-button
        size="small"
        plain
        type="info"
        :icon="Search"
        @click="toggleSearch()"
      />
      <el-button
        size="small"
        :icon="Refresh"
        @click="crud.refresh()"
      />
      <el-popover
        placement="bottom-end"
        width="150"
        trigger="click"
      >
        <template #reference>
          <el-button
            size="small"
            :icon="Grid"
          >
            <i
              class="fa fa-caret-down"
              aria-hidden="true"
            />
          </el-button>
        </template>
        <div class="crud-column-options">
        <el-checkbox
          v-model="allColumnsSelected"
          :indeterminate="allColumnsSelectedIndeterminate"
          @change="handleCheckAllChange"
        >
          全选
        </el-checkbox>
        <el-checkbox
          v-for="item in crud.props.tableColumns"
          :key="item.label"
          v-model="item.visible"
          @change="handleCheckedTableColumnsChange(item)"
        >
          {{ item.label }}
        </el-checkbox>
        </div>
      </el-popover>
    </el-button-group>
  </div>
</template>
<script setup>
import { ref, nextTick } from 'vue'
import { ElMessageBox } from 'element-plus'
import { Plus, Edit, Delete, Download, Search, Refresh, Grid } from '@element-plus/icons-vue'
import CRUD, { crud as crudComposable } from '@/components/Crud/crud.js'

defineOptions({
  name: 'CRUDOperation'
})

const props = defineProps({
  permission: {
    type: Object,
    default: () => ({})
  }
})

const { crud } = crudComposable()

const allColumnsSelected = ref(true)
const allColumnsSelectedIndeterminate = ref(false)

crud.updateProp('searchToggle', true)

const toDelete = (datas) => {
  ElMessageBox.confirm(`确认删除选中的${datas.length}条数据?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    crud.delAllLoading = true
    crud.doDelete(datas)
  }).catch(() => {
  })
}

const handleCheckAllChange = (val) => {
  if (val === false) {
    allColumnsSelected.value = true
    return
  }
  for (const key in crud.props.tableColumns) {
    crud.props.tableColumns[key].visible = val
  }
  allColumnsSelected.value = val
  allColumnsSelectedIndeterminate.value = false
}

const handleCheckedTableColumnsChange = (item) => {
  let totalCount = 0
  let selectedCount = 0
  for (const key in crud.props.tableColumns) {
    ++totalCount
    selectedCount += crud.props.tableColumns[key].visible ? 1 : 0
  }
  if (selectedCount === 0) {
    crud.notify('请至少选择一列', CRUD.NOTIFICATION_TYPE.WARNING)
    nextTick(function() {
      item.visible = true
    })
    return
  }
  allColumnsSelected.value = selectedCount === totalCount
  allColumnsSelectedIndeterminate.value = selectedCount !== totalCount && selectedCount !== 0
}

const toggleSearch = () => {
  crud.props.searchToggle = !crud.props.searchToggle
}
</script>

<style>
  .crud-opts {
    padding: 6px 0;
    display: -webkit-flex;
    display: flex;
    align-items: center;
  }
  .crud-opts .crud-opts-right {
    margin-left: auto;
  }
</style>

<style scoped>
.crud-column-options {
  display: flex;
  flex-direction: column;
  max-height: 360px;
  overflow: auto;
}
.crud-column-options .el-checkbox {
  flex: none;
  margin-right: 0;
}
</style>
