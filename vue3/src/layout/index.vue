<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebarState.opened" class="drawer-bg" @click="handleClickOutside" />
    <Sidebar class="sidebar-container" />
    <div :class="{hasTagsView:needTagsView}" class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <Navbar />
        <TagsView v-if="needTagsView" />
      </div>
      <AppMain />
      <RightPanel v-if="showSettings">
        <Settings />
      </RightPanel>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { AppMain, Navbar, Settings, Sidebar, TagsView } from './components'
import RightPanel from '@/components/RightPanel/index.vue'
import { useAppStore } from '@/store/modules/app'
import { useSettingsStore } from '@/store/modules/settings'

defineOptions({ name: 'Layout' })

const appStore = useAppStore()
const settingsStore = useSettingsStore()
const route = useRoute()

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
  appStore.closeSideBar({ withoutAnimation: false })
}
</script>

<style lang="scss" scoped>
@use "@/assets/styles/mixin.scss" as *;
@use "@/assets/styles/variables.scss" as *;

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

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
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
  padding: 0;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px)
}

.mobile .fixed-header {
  width: 100%;
}
</style>
