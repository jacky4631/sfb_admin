<!--分页-->
<template>
  <el-pagination
    :page-size="crud.page.size"
    :total="crud.page.total"
    :current-page="crud.page.page"
    style="margin-top: 8px;"
    layout="total, prev, pager, next, sizes"
    @size-change="crud.sizeChangeHandler"
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
