<template>
  <div>
    <el-upload
      :action="uploadApi"
      :headers="headers"
      :on-remove="handleRemove"
      :on-success="handleUploadSuccess"
      :before-remove="beforeRemove"
      :file-list="fileList"
      multiple
      :limit="1"
    >
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getToken } from '@/utils/auth'

defineOptions({
  name: 'FileUpload'
})

const props = defineProps({
  modelValue: {
    default: '',
    type: String
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const resourcesUrl = ref('')
const headers = ref({
  'Authorization': getToken()
})

const baseUrl = import.meta.env.VITE_BASE_API || ''
const uploadApi = computed(() => baseUrl + '/api/upload')

const fileList = computed(() => {
  const res = []
  if (props.modelValue) {
    res.push({ name: props.modelValue, url: resourcesUrl.value + props.modelValue, response: props.modelValue })
  }
  console.log('res' + res)
  return res
})

// 图片上传
const handleUploadSuccess = (response, file, fileList) => {
  emit('update:modelValue', file.response.link)
}

const handleRemove = (file, fileList) => {
  emit('change', file)
}

const beforeRemove = (file, fileList) => {
  return ElMessageBox.confirm(`确定移除 ${file.name}？`)
}
</script>

<style lang="scss">
</style>
