<template>
  <div>
    <el-upload
      class="pic-uploader-component"
      :action="qiNiuUploadApi"
      :headers="headers"
      :show-file-list="false"
      :on-success="handleUploadSuccess"
      :before-upload="beforeAvatarUpload"
    >
      <img v-if="modelValue" :src="resourcesUrl + modelValue" class="pic">
      <el-icon class="pic-uploader-icon" v-else><Plus /></el-icon>
    </el-upload>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { getToken } from '@/utils/auth'

defineOptions({
  name: 'PicUpload'
})

const props = defineProps({
  modelValue: {
    default: '',
    type: String
  }
})

const emit = defineEmits(['update:modelValue'])

const resourcesUrl = ref('')
const headers = ref({
  'Authorization': getToken()
})

const baseUrl = import.meta.env.VITE_BASE_API || ''
const qiNiuUploadApi = computed(() => baseUrl + '/api/qiNiuContent')

// 图片上传
const handleUploadSuccess = (response, file, fileList) => {
  console.log(file)
  emit('update:modelValue', file.response.data[0])
}

// 限制图片上传大小
const beforeAvatarUpload = (file) => {
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    ElMessage.error('上传头像图片大小不能超过 2MB!')
  }
  return isLt2M
}
</script>

<style lang="scss">
  .pic-uploader-component .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    .pic-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }
    .pic {
      width: 178px;
      height: 178px;
      display: block;
    }
  }
  .pic-uploader-component .el-upload:hover {
    border-color: #409EFF;
  }

</style>
