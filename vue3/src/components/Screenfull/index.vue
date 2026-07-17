<template>
  <div>
    <svg-icon :icon-class="isFullscreen?'exit-fullscreen':'fullscreen'" @click="click" />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import screenfull from 'screenfull'
import { ElMessage } from 'element-plus'

defineOptions({
  name: 'Screenfull'
})

const isFullscreen = ref(false)

const click = () => {
  if (!screenfull.enabled) {
    ElMessage({
      message: 'you browser can not work',
      type: 'warning'
    })
    return false
  }
  screenfull.toggle()
}

const change = () => {
  isFullscreen.value = screenfull.isFullscreen
}

const init = () => {
  if (screenfull.enabled) {
    screenfull.on('change', change)
  }
}

const destroy = () => {
  if (screenfull.enabled) {
    screenfull.off('change', change)
  }
}

onMounted(() => {
  init()
})

onBeforeUnmount(() => {
  destroy()
})
</script>

<style scoped>
.screenfull-svg {
  display: inline-block;
  cursor: pointer;
  fill: #5a5e66;;
  width: 20px;
  height: 20px;
  vertical-align: 10px;
}
</style>
