<script setup lang="ts">
import { ElTag } from 'element-plus'

defineProps<{
  dictData: any[]
  value: string | number
}>()
</script>

<template>
  <template v-for="item in dictData" :key="item.value">
    <el-tag v-if="item.value === value" :type="item.cssClass">
      {{ item.label }}
    </el-tag>
  </template>
</template>
