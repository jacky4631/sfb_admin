<!--搜索与重置-->
<template>
  <span>
    <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="crud.toQuery">搜索</el-button>
    <el-button class="filter-item" size="mini" type="warning" icon="el-icon-refresh-left" @click="crud.resetQuery()">重置</el-button>
  </span>
</template>
<script setup>
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
