<template>
  <div class="app-container finance-page">
    <elFrame class="finance-settings api-doc-frame" :src="swaggerApi" />
  </div>
</template>
<script setup>
import { computed } from 'vue'
import elFrame from '@/components/Iframe/index.vue'

const baseUrl = import.meta.env.VITE_BASE_API || ''
const swaggerApi = computed(() => baseUrl + '/swagger-ui/index.html')
</script>

<style scoped>
.api-doc-frame {
  height: auto !important;
  padding: 0 !important;
  overflow: hidden !important;
}
.api-doc-frame :deep(iframe) {
  display: block;
}
</style>
