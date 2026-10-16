<template>
  <section class="app-main" :style="pageStyle">
    <router-view v-slot="{ Component }">
      <keep-alive :include="cachedViews">
        <component v-if="Component" :is="Component" :key="key" />
      </keep-alive>
    </router-view>
    <div v-if="showFooter" id="el-main-footer">
      <span v-html="footerTxt" />
      <span> ⋅ </span>
      <a href="http://www.beian.miit.gov.cn" target="_blank">{{ caseNumber }}</a>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTagsViewStore } from '@/store/modules/tagsView.js'
import { useSettingsStore } from '@/store/modules/settings.js'

defineOptions({ name: 'AppMain' })

const tagsViewStore = useTagsViewStore()
const settingsStore = useSettingsStore()
const route = useRoute()

const cachedViews = computed(() => tagsViewStore.cachedViews || [])
const key = computed(() => route.path)
const showFooter = computed(() => settingsStore.showFooter)
const pageStyle = computed(() => ({
  '--app-page-height': `calc(100vh - var(--top-tool-height) - ${settingsStore.tagsView ? 'var(--tags-view-height)' : '0px'} - ${settingsStore.showFooter ? '33px' : '0px'})`
}))
const footerTxt = computed(() => settingsStore.footerTxt)
const caseNumber = computed(() => settingsStore.caseNumber)
</script>

<style lang="scss" scoped>
.app-main {
  min-height: calc(100vh - var(--top-tool-height));
  width: 100%;
  position: relative;
  overflow: hidden;
}

.fixed-header+.app-main {
  padding-top: var(--top-tool-height);
}

.hasTagsView {
  .app-main {
    min-height: calc(100vh - var(--top-tool-height) - var(--tags-view-height));
  }

  .fixed-header+.app-main {
    padding-top: calc(var(--top-tool-height) + var(--tags-view-height));
  }
}
</style>

<style lang="scss">
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
