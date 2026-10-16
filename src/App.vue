<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/store/modules/app.ts'
import { useDesign } from '@/hooks/web/useDesign'

defineOptions({
  name: 'APP'
})

const appStore = useAppStore()
const { getPrefixCls } = useDesign()
const prefixCls = getPrefixCls('app')
const currentSize = computed(() => appStore.size)
const greyMode = computed(() => appStore.grey)
</script>

<template>
  <ConfigGlobal :size="currentSize">
    <div :class="greyMode ? `${prefixCls}-grey-mode` : ''">
      <RouterView />
    </div>
  </ConfigGlobal>
</template>

<style lang="scss">
$prefix-cls: v-app;

.size {
  width: 100%;
  height: 100%;
}

html,
body {
  @extend .size;

  padding: 0 !important;
  margin: 0;
  // 不锁死 overflow：el-admin 布局靠文档（body）滚动

  #app {
    @extend .size;
  }
}

.#{$prefix-cls}-grey-mode {
  filter: grayscale(100%);
}
</style>
