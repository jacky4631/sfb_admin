<template>
  <div v-loading="loading" :style="'height:'+ height">
    <iframe :src="src" frameborder="no" style="width: 100%;height: 100%" scrolling="auto" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

defineOptions({
  name: 'Iframe'
})

const props = defineProps({
  src: {
    type: String,
    required: true
  }
})

const height = ref(document.documentElement.clientHeight - 94.5 + 'px')
const loading = ref(true)

onMounted(() => {
  setTimeout(() => {
    loading.value = false
  }, 230)

  window.onresize = function temp() {
    height.value = document.documentElement.clientHeight - 94.5 + 'px'
  }
})
</script>
