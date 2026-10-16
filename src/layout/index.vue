<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile' && sidebarState.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div :class="{ hasTagsView: needTagsView }" class="main-container">
      <div :class="{ 'fixed-header': fixedHeader }">
        <navbar />
        <tags-view v-if="needTagsView" />
      </div>
      <app-main />
      <right-panel v-if="showSettings">
        <settings />
      </right-panel>
    </div>
  </div>
</template>

<script setup>
import { computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import RightPanel from '@/components/RightPanel/index.vue'
import { AppMain, Navbar, Settings, Sidebar, TagsView } from './components/index.js'
import { useAppStore } from '@/store/modules/app.ts'
import { useSettingsStore } from '@/store/modules/settings.js'

defineOptions({ name: 'Layout' })

const route = useRoute()
const appStore = useAppStore()
const settingsStore = useSettingsStore()

// 注意：变量名不能叫 sidebar，否则模板中 <sidebar> 会误匹配到该 computed 而非导入的 Sidebar 组件
const sidebarState = computed(() => appStore.sidebar)
const device = computed(() => appStore.device)
const showSettings = computed(() => settingsStore.showSettings)
const needTagsView = computed(() => settingsStore.tagsView)
const fixedHeader = computed(() => settingsStore.fixedHeader)

const classObj = computed(() => ({
  hideSidebar: !sidebarState.value.opened,
  openSidebar: sidebarState.value.opened,
  withoutAnimation: sidebarState.value.withoutAnimation,
  mobile: device.value === 'mobile'
}))

const handleClickOutside = () => {
  appStore.closeSideBar(false)
}

// 响应式布局处理（移植自原 ResizeHandler mixin）
const WIDTH = 992
const isMobile = () => document.body.getBoundingClientRect().width - 1 < WIDTH
const resizeHandler = () => {
  if (!document.hidden) {
    const mobile = isMobile()
    appStore.toggleDevice(mobile ? 'mobile' : 'desktop')
    if (mobile) {
      appStore.closeSideBar(true)
    }
  }
}

onMounted(() => {
  if (isMobile()) {
    appStore.toggleDevice('mobile')
    appStore.closeSideBar(true)
  }
  window.addEventListener('resize', resizeHandler, false)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeHandler)
})

// 移动端切换路由后自动收起侧边栏
watch(() => route.path, () => {
  if (device.value === 'mobile' && sidebarState.value.opened) {
    appStore.closeSideBar(false)
  }
})
</script>

<style lang="scss" scoped>
.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;

  &::after {
    content: '';
    display: table;
    clear: both;
  }

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - 200px);
  transition: width 0.28s;
  padding: 0;
}

.hideSidebar .fixed-header {
  width: calc(100% - 64px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
