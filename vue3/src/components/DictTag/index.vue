<script setup lang="ts">
import { computed } from 'vue'
import { ElTag } from 'element-plus'

const props = defineProps<{
  dictData: any[]
  value: string | number
}>()

// el-tag 仅接受 primary/success/info/warning/danger，空串或非法值（如 null、色值）回退为 primary
const VALID_TYPES = ['primary', 'success', 'info', 'warning', 'danger']

const currentTag = computed(() => {
  const item = props.dictData?.find((d: any) => d.value === props.value)
  if (!item) return null
  return VALID_TYPES.includes(item.cssClass) ? item : { ...item, cssClass: 'primary' }
})
</script>

<template>
  <template v-if="currentTag">
    <el-tag :type="currentTag.cssClass">{{ currentTag.label }}</el-tag>
  </template>
</template>
