<template>
  <div class="app-container finance-page sql-monitor-page">
    <elFrame class="finance-settings sql-monitor-frame" :src="sqlApi" />
  </div>
</template>
<script setup>
import { computed } from 'vue'
import elFrame from '@/components/Iframe/index.vue'

const baseUrl = import.meta.env.VITE_BASE_API || ''
const sqlApi = computed(() => baseUrl + '/druid/index.html')
</script>

<style scoped>
.sql-monitor-page .sql-monitor-frame {
  height: auto !important;
  padding: 0;
  overflow: hidden;
}

.sql-monitor-frame :deep(iframe) {
  display: block;
}
</style>
