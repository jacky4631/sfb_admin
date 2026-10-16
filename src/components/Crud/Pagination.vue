<!--分页-->
<template>
  <el-pagination
    :page-size="crud.page.size"
    :total="crud.page.total"
    :current-page="crud.page.page"
    background
    layout="total, prev, pager, next, sizes"
    class="crud-pagination"
    @size-change="crud.sizeChangeHandler"
    @current-change="crud.pageChangeHandler"
  />
</template>
<script setup>
import { pagination } from '@/components/Crud/crud.js'

defineOptions({
  name: 'CrudPagination'
})

const { crud } = pagination()
</script>

<style scoped>
.crud-pagination {
  display: flex;
  justify-content: flex-end;
  margin: 15px 0;
}
</style>
