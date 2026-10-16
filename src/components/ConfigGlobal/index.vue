<script setup lang="ts">
import { computed } from 'vue'

defineProps<{
  size?: 'large' | 'default' | 'small'
}>()

const size = computed(() => {
  return 'small'
})
</script>

<template>
  <el-config-provider :size="size">
    <slot />
  </el-config-provider>
</template>
