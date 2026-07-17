<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
    <div v-if="$store.state.settings.showFooter" id="el-main-footer">
      <span v-html="$store.state.settings.footerTxt" />
      <span> ⋅ </span>
      <a href="http://www.beian.miit.gov.cn" target="_blank">{{ $store.state.settings.caseNumber }}</a>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

const store = useStore()
const route = useRoute()

const cachedViews = computed(() => store.state.tagsView?.cachedViews || [])
const key = computed(() => route.path)
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
