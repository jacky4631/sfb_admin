<!--搜索与重置-->
<template>
  <span class="crud-query-actions">
    <el-button class="filter-item" size="small" type="success" :icon="Search" @click="crud.toQuery">搜索</el-button>
    <el-button class="filter-item" size="small" type="warning" :icon="RefreshLeft" @click="crud.resetQuery()">重置</el-button>
  </span>
</template>
<script setup>
import { Search, RefreshLeft } from '@element-plus/icons-vue'

defineOptions({
  name: 'RROperation'
})

defineProps({
  crud: {
    type: Object,
    required: true
  },
  itemClass: {
    type: String,
    required: false,
    default: ''
  }
})
</script>

<style scoped>
.crud-query-actions {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.crud-query-actions .el-button + .el-button {
  margin-left: 0;
}
</style>
