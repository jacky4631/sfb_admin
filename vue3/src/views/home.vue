<template>
  <div class="dashboard-container">
    <div class="dashboard-editor-container">
      <panel-group />
      <income-group />
      <platform-compare />
    </div>
  </div>
</template>

<script setup>
import PanelGroup from './dashboard/PanelGroup.vue'
import IncomeGroup from './dashboard/IncomeGroup.vue'
import PlatformCompare from './dashboard/PlatformCompare.vue'
import { count } from '@/api/visits'

defineOptions({
  name: 'Dashboard'
})

/**
 * 记录访问，只有页面刷新或者第一次加载才会记录
 */
count().then((res) => {})
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: var(--app-content-padding);
  background-color: var(--app-content-bg-color);
}
</style>
