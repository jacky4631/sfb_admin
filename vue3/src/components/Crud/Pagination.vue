<!--分页-->
<template>
  <el-pagination
    :page-size.sync="page.size"
    :total="page.total"
    :current-page.sync="page.page"
    style="margin-top: 8px;"
    layout="total, prev, pager, next, sizes"
    @size-change="crud.sizeChangeHandler($event)"
    @current-change="crud.pageChangeHandler"
  />
</template>
<script setup>
import { pagination } from '@crud/crud'

defineOptions({
  name: 'CrudPagination'
})

const { crud } = pagination()
</script>
