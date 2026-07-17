<template>
  <section class="app-main">
    <router-view v-slot="{ Component }">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="cachedViews">
          <component v-if="Component" :is="Component" :key="key" />
        </keep-alive>
      </transition>
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
import { useTagsViewStore } from '@/store/modules/tagsView'
import { useSettingsStore } from '@/store/modules/settings'

const tagsViewStore = useTagsViewStore()
const settingsStore = useSettingsStore()
const route = useRoute()

const cachedViews = computed(() => tagsViewStore.cachedViews || [])
const key = computed(() => route.path)
const showFooter = computed(() => settingsStore.showFooter)
const footerTxt = computed(() => settingsStore.footerTxt)
const caseNumber = computed(() => settingsStore.caseNumber)
</script>

<style lang="scss" scoped>
.app-main {
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}

.fixed-header+.app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    min-height: calc(100vh - 84px);
  }

  .fixed-header+.app-main {
    padding-top: 84px;
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
