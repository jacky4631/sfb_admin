<template>
  <div>
    <el-upload
      :action="qiNiuUploadApi"
      :headers="headers"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-success="handleUploadSuccess"
      :file-list="imageList"
      :before-upload="beforeAvatarUpload"
    >
      <el-icon><Plus /></el-icon>
    </el-upload>
    <el-dialog v-model="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { getToken } from '@/utils/auth'

defineOptions({
  name: 'MulPicUpload'
})

const props = defineProps({
  modelValue: {
    default: '',
    type: String
  }
})

const emit = defineEmits(['update:modelValue'])

const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const resourcesUrl = ref('')
const headers = ref({
  'Authorization': getToken()
})

const baseUrl = import.meta.env.VITE_APP_BASE_API || ''
const qiNiuUploadApi = computed(() => baseUrl + '/api/qiNiuContent')

const imageList = computed(() => {
  const res = []
  if (props.modelValue) {
    const imageArray = props.modelValue.split(',')
    for (let i = 0; i < imageArray.length; i++) {
      res.push({ url: resourcesUrl.value + imageArray[i], response: imageArray[i] })
    }
  }
  return res
})

// 图片上传
const handleUploadSuccess = (response, file, fileList) => {
  console.log(file)
  console.log(fileList)
  const pics = fileList.map(file => {
    if ((typeof file.response) === 'object') {
      return file.response.data[0]
    } else {
      return file.response
    }
  }).join(',')
  console.log(pics)
  emit('update:modelValue', pics)
}

// 限制图片上传大小
const beforeAvatarUpload = (file) => {
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    ElMessage.error('上传头像图片大小不能超过 2MB!')
  }
  return isLt2M
}

const handleRemove = (file, fileList) => {
  const pics = fileList.map(file => {
    return file.response
  }).join(',')
  emit('update:modelValue', pics)
}

const handlePictureCardPreview = (file) => {
  dialogImageUrl.value = file.url
  dialogVisible.value = true
}
</script>

<style lang="scss">
</style>
