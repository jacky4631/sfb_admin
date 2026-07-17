<template>
  <div class="crud-opts">
    <span class="crud-opts-left">
      <!--左侧插槽-->
      <slot name="left" />
      <el-button
        v-if="crud.optShow.add"
        v-permission="permission.add"
        class="filter-item"
        size="small"
        type="primary"
        icon="el-icon-plus"
        @click="crud.toAdd"
      >
        新增
      </el-button>
      <el-button
        v-if="crud.optShow.edit"
        v-permission="permission.edit"
        class="filter-item"
        size="small"
        type="success"
        icon="el-icon-edit"
        :disabled="crud.selections.length !== 1"
        @click="crud.toEdit(crud.selections[0])"
      >
        修改
      </el-button>
      <el-button
        v-if="crud.optShow.del"
        v-permission="permission.del"
        class="filter-item"
        type="danger"
        icon="el-icon-delete"
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
        icon="el-icon-download"
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
        icon="el-icon-search"
        @click="toggleSearch()"
      />
      <el-button
        size="small"
        icon="el-icon-refresh"
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
            icon="el-icon-s-grid"
          >
            <i
              class="fa fa-caret-down"
              aria-hidden="true"
            />
          </el-button>
        </template>
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
      </el-popover>
    </el-button-group>
  </div>
</template>
<script setup>
import { ref, nextTick } from 'vue'
import { ElMessageBox } from 'element-plus'
import CRUD, { crud } from '@crud/crud'

defineOptions({
  name: 'CRUDOperation'
})

const props = defineProps({
  permission: {
    type: Object,
    default: null
  }
})

const { crud: crudInstance } = crud()

const allColumnsSelected = ref(true)
const allColumnsSelectedIndeterminate = ref(false)

crudInstance.updateProp('searchToggle', true)

const toDelete = (datas) => {
  ElMessageBox.confirm(`确认删除选中的${datas.length}条数据?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    crudInstance.delAllLoading = true
    crudInstance.doDelete(datas)
  }).catch(() => {
  })
}

const handleCheckAllChange = (val) => {
  if (val === false) {
    allColumnsSelected.value = true
    return
  }
  for (const key in crudInstance.props.tableColumns) {
    crudInstance.props.tableColumns[key].visible = val
  }
  allColumnsSelected.value = val
  allColumnsSelectedIndeterminate.value = false
}

const handleCheckedTableColumnsChange = (item) => {
  let totalCount = 0
  let selectedCount = 0
  for (const key in crudInstance.props.tableColumns) {
    ++totalCount
    selectedCount += crudInstance.props.tableColumns[key].visible ? 1 : 0
  }
  if (selectedCount === 0) {
    crudInstance.notify('请至少选择一列', CRUD.NOTIFICATION_TYPE.WARNING)
    nextTick(function() {
      item.visible = true
    })
    return
  }
  allColumnsSelected.value = selectedCount === totalCount
  allColumnsSelectedIndeterminate.value = selectedCount !== totalCount && selectedCount !== 0
}

const toggleSearch = () => {
  crudInstance.props.searchToggle = !crudInstance.props.searchToggle
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
