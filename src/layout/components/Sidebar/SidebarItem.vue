<template>
  <div v-if="!item.hidden" class="menu-wrapper">
    <template v-if="hasOneShowingChild && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">
      <AppLink v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown':!isNest}">
          <Item :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)" :title="onlyOneChild.meta.title" />
        </el-menu-item>
      </AppLink>
    </template>

    <el-sub-menu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
      <template #title>
        <Item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
      </template>
      <SidebarItem
        v-for="(child,index) in item.children"
        :key="index"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-sub-menu>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { resolveUrlPath } from '@/utils/index.js'
import { isExternal } from '@/utils/validate.js'
import Item from './Item.vue'
import AppLink from './Link.vue'
import { useAppStore } from '@/store/modules/app.ts'

defineOptions({
  name: 'SidebarItem'
})

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  isNest: {
    type: Boolean,
    default: false
  },
  basePath: {
    type: String,
    default: ''
  }
})

const subMenu = ref(null)

// FixiOSBug mixin logic
const appStore = useAppStore()
const device = computed(() => appStore.device)

onMounted(() => {
  const $subMenu = subMenu.value
  if ($subMenu) {
    const handleMouseleave = $subMenu.handleMouseleave
    $subMenu.handleMouseleave = (e) => {
      if (device.value === 'mobile') {
        return
      }
      handleMouseleave(e)
    }
  }
})

// Convert render-time mutation to computed properties
// to avoid recursive updates (ref mutation during render triggers re-render)
const showingChildren = computed(() => {
  return (props.item.children || []).filter(item => !item.hidden)
})

const hasOneShowingChild = computed(() => {
  return showingChildren.value.length <= 1
})

const onlyOneChild = computed(() => {
  if (showingChildren.value.length === 1) {
    return showingChildren.value[0]
  }
  return { ...props.item, path: '', noShowingChildren: true }
})

const resolvePath = (routePath) => {
  if (isExternal(routePath)) {
    return routePath
  }
  if (isExternal(props.basePath)) {
    return props.basePath
  }
  return resolveUrlPath(props.basePath, routePath)
}
</script>
