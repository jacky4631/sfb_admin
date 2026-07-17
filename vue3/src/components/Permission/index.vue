<script setup>
import { useStore } from 'vuex'
import { computed } from 'vue'

const props = defineProps({
  value: {
    type: Array,
    default: () => []
  }
})

const store = useStore()
const roles = computed(() => store.getters.roles)

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
