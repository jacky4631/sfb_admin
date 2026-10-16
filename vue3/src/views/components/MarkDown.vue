<template>
  <div class="app-container">
    <p class="warn-content">
      Markdown 基于
      <el-link type="primary" href="https://github.com/hinesboy/mavonEditor" target="_blank">MavonEditor</el-link>
      ，图片上传使用 <el-link type="primary" href="https://sm.ms/" target="_blank">SM.MS</el-link>
    </p>
    <mavon-editor ref="md" :style="'height:' + height" @imgAdd="imgAdd" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { upload } from '@/utils/upload'

const md = ref(null)
const baseUrl = import.meta.env.VITE_BASE_API
const imagesUploadApi = baseUrl + '/api/pictures'
const height = ref(document.documentElement.clientHeight - 200 + 'px')

const imgAdd = (pos, $file) => {
  upload(imagesUploadApi, $file).then(data => {
    md.value.$img2Url(pos, data.data.url)
  })
}

onMounted(() => {
  window.onresize = () => {
    height.value = document.documentElement.clientHeight - 200 + 'px'
  }
})
</script>

<style scoped>
</style>
