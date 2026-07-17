<template>
  <div>
    <div ref="editorRef" style="text-align:left;margin: 5px;width: 700px" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import E from 'wangeditor'
import { getToken } from '@/utils/auth'

const props = defineProps({
  value: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['change', 'update:value'])

const editor = ref(null)
const editorRef = ref(null)
const baseUrl = import.meta.env.VITE_APP_BASE_API

const uploadApi = computed(() => baseUrl + '/api/upload')

const headers = {
  'Authorization': getToken()
}

watch(() => props.value, (val) => {
  if (editor.value) {
    editor.value.txt.html(val)
  }
})

onMounted(() => {
  editor.value = new E(editorRef.value)
  editor.value.customConfig = editor.value.customConfig ? editor.value.customConfig : editor.value.config
  editor.value.customConfig.uploadImgShowBase64 = true
  editor.value.customConfig.uploadImgHeaders = headers
  editor.value.customConfig.uploadFileName = 'file'
  editor.value.customConfig.uploadImgServer = uploadApi.value
  editor.value.customConfig.uploadImgHooks = {
    customInsert: function(insertImg, result, editor) {
      var url = result.link
      insertImg(url)
    }
  }
  editor.value.customConfig.onchange = (html) => {
    emit('change', html)
    emit('update:value', html)
  }
  editor.value.create()
  editor.value.txt.html(props.value)
})
</script>

<style scoped>
  .editor-content{
    padding-left: 5px;
  }
</style>
