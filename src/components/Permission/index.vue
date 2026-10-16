<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/store/modules/user.ts'

const props = defineProps({
  value: {
    type: Array,
    default: () => []
  }
})

const userStore = useUserStore()
const roles = computed(() => userStore.roles)

const hasPermission = computed(() => {
  if (!props.value || props.value.length === 0) {
    return true
  }
  if (!roles.value || roles.value.length === 0) {
    return false
  }
  return props.value.some(permission => roles.value.includes(permission))
})
</script>

<template>
  <slot v-if="hasPermission" />
</template>
