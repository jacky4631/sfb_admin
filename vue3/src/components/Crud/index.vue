<script setup lang="ts">
defineOptions({
  name: 'CrudTable'
})

const props = defineProps<{
  data: any[]
  loading?: boolean
}>()
</script>

<template>
  <el-table v-loading="loading" :data="data" v-bind="$attrs">
    <slot />
  </el-table>
</template>
