<template>
  <div id="tags-view-container" class="tags-view-container">
    <scroll-pane ref="scrollPane" class="tags-view-wrapper">
      <span
        v-for="tag in tagsViewStore.visitedViews"
        :key="tag.path"
        :class="isActive(tag)?'active':''"
        class="tags-view-item"
        @click="navigateTo(tag)"
        @click.middle="closeSelectedTag(tag)"
        @contextmenu.prevent="openMenu(tag,$event)"
      >
        <span>{{ tag.title }}</span>
        <span v-if="!(tag.meta && tag.meta.affix)" class="tags-view-item-close" @click.prevent.stop="closeSelectedTag(tag)"><el-icon><Close /></el-icon></span>
      </span>
    </scroll-pane>
    <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
      <li @click="refreshSelectedTag(selectedTag)">刷新</li>
      <li v-if="!(selectedTag.meta&&selectedTag.meta.affix)" @click="closeSelectedTag(selectedTag)">关闭</li>
      <li @click="closeOthersTags">关闭其他</li>
      <li @click="closeAllTags(selectedTag)">关闭全部</li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Close } from '@element-plus/icons-vue'
import { resolveUrlPath } from '@/utils'
import ScrollPane from './ScrollPane'
import { useTagsViewStore } from '@/store/modules/tagsView'
import { usePermissionStore } from '@/store/modules/permission'

defineOptions({ name: 'TagsView' })

const route = useRoute()
const router = useRouter()
const tagsViewStore = useTagsViewStore()
const permissionStore = usePermissionStore()

const visible = ref(false)
const top = ref(0)
const left = ref(0)
const selectedTag = ref({})
const scrollPane = ref(null)

const isActive = (tag_) => tag_.path === route.path

const navigateTo = (tag) => {
  if (tag.path !== route.path) {
    router.push(tag.fullPath || tag.path)
  }
}

const filterAffixTags = (routes, basePath = '/') => {
  let tags = []
  routes.forEach(route_ => {
    if (route_.meta && route_.meta.affix) {
      const tagPath = resolveUrlPath(basePath, route_.path)
      tags.push({
        fullPath: tagPath,
        path: tagPath,
        name: route_.name,
        meta: { ...route_.meta }
      })
    }
    if (route_.children) {
      const tempTags = filterAffixTags(route_.children, route_.path)
      if (tempTags.length >= 1) {
        tags = [...tags, ...tempTags]
      }
    }
  })
  return tags
}

const initTags = () => {
  const affix = filterAffixTags(permissionStore.routers)
  for (const tag_ of affix) {
    if (tag_.name) {
      tagsViewStore.addAffixView(tag_)
    }
  }
}

const addTags = () => {
  const { name, path, fullPath, query, meta } = route
  if (name) {
    // Pass a plain object to avoid any reactive proxy leaking into the store
    tagsViewStore.addView({
      name,
      path,
      fullPath,
      query: query ? { ...query } : {},
      meta: meta ? { ...meta } : {}
    })
  }
}

const refreshSelectedTag = (view) => {
  tagsViewStore.delCachedView(view)
  const { fullPath } = view
  router.replace({ path: '/redirect' + fullPath })
}

const closeSelectedTag = (view) => {
  tagsViewStore.delView(view).then(({ visitedViews: views }) => {
    if (isActive(view)) {
      toLastView(views, view)
    }
  })
}

const closeOthersTags = () => {
  if (selectedTag.value.fullPath && selectedTag.value.fullPath !== route.fullPath) {
    router.push(selectedTag.value)
  }
  tagsViewStore.delOthersViews(selectedTag.value)
}

const closeAllTags = (view) => {
  tagsViewStore.delAllViews()
  const isAffix = tagsViewStore.visitedViews.some(tag_ => tag_.meta && tag_.meta.affix && tag_.path === view.path)
  if (isAffix) return
  toLastView(tagsViewStore.visitedViews, view)
}

const toLastView = (visitedViews, view) => {
  const latestView = visitedViews.slice(-1)[0]
  if (latestView) {
    router.push(latestView.fullPath || latestView.path)
  } else {
    if (view.name === 'Dashboard') {
      router.replace({ path: '/redirect' + view.fullPath })
    } else {
      router.push('/')
    }
  }
}

const openMenu = (tag_, e) => {
  const menuMinWidth = 105
  const offsetLeft = e.currentTarget.getBoundingClientRect().left
  const offsetWidth = e.currentTarget.offsetWidth
  const maxLeft = offsetWidth - menuMinWidth
  let left_ = e.clientX - offsetLeft + 15

  if (left_ > maxLeft) {
    left_ = maxLeft
  }

  top.value = e.clientY
  left.value = left_
  visible.value = true
  selectedTag.value = tag_
}

const closeMenu = () => {
  if (visible.value) {
    visible.value = false
  }
}

watch(() => route.path, () => {
  addTags()
})

watch(() => visible.value, (val) => {
  if (val) {
    document.body.addEventListener('click', closeMenu)
  } else {
    document.body.removeEventListener('click', closeMenu)
  }
})

onMounted(() => {
  initTags()
  addTags()
})
</script>

<style lang="scss" scoped>
.tags-view-container {
  height: 34px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);
  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;
      &:first-of-type {
        margin-left: 15px;
      }
      &:last-of-type {
        margin-right: 15px;
      }
      &.active {
        background-color: rgb(64, 158, 255);
        color: #fff;
        border-color: rgb(64, 158, 255);
        &::before {
          content: '';
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
    li {
      margin: 0;
      background: #fff;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>

<style lang="scss">
//reset el-icon-close css
.tags-view-wrapper {
  .tags-view-item {
    .tags-view-item-close {
      width: 16px;
      height: 16px;
      vertical-align: 2px;
      border-radius: 50%;
      text-align: center;
      transition: all .3s cubic-bezier(.645, .045, .355, 1);
      transform-origin: 100% 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}
</style>
