<template>
  <div :class="{'has-logo':showLogo}">
    <Logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="uniqueOpened"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <SidebarItem v-for="route in permission_routers" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Logo from './Logo.vue'
import SidebarItem from './SidebarItem.vue'
import variables from '@/assets/styles/variables.js'
import { usePermissionStore } from '@/store/modules/permission.ts'
import { useAppStore } from '@/store/modules/app.ts'
import { useSettingsStore } from '@/store/modules/settings.js'

defineOptions({
  name: 'Sidebar',
  components: { SidebarItem, Logo }
})

const route = useRoute()
const permissionStore = usePermissionStore()
const appStore = useAppStore()
const settingsStore = useSettingsStore()

const permission_routers = computed(() => permissionStore.routers)
const sidebar = computed(() => appStore.sidebar)
const uniqueOpened = computed(() => settingsStore.uniqueOpened)

const activeMenu = computed(() => {
  const { meta, path } = route
  if (meta.activeMenu) {
    return meta.activeMenu
  }
  return path
})

const showLogo = computed(() => settingsStore.sidebarLogo)

const isCollapse = computed(() => !sidebar.value.opened)
</script>
