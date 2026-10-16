<template>
  <elFrame :src="swaggerApi" />
</template>
<script setup>
import { computed } from 'vue'
import elFrame from '@/components/Iframe/index.vue'

const baseUrl = import.meta.env.VITE_BASE_API || ''
const swaggerApi = computed(() => baseUrl + '/swagger-ui/index.html')
</script>
