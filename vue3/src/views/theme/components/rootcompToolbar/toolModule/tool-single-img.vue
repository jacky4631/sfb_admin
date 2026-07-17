<template>
  <div class="module-box single-img">
    <div class="single-img__box">
      <el-upload
        drag
        :action="fileUploadURL"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
        :show-file-list="false"
      >
        <img
          v-if="imageUrl"
          :src="imageUrl"
          class="single-img__img"
        >
        <i
          v-else
          class="el-icon-upload"
        >
          <div class="el-upload__text"><em>选择图片</em></div>
          <div
            class="el-upload__tip"
          >{{tip.label}}</div>
        </i>
      </el-upload>
      <div
        class="overlay"
        v-if="imageUrl"
      >
      </div>
    </div>
    <el-dialog
      title="图片展示"
      v-model="dialogVisible"
    >
      <img
        width="100%"
        :src="dialogImageUrl"
        alt=""
      >
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  imageUrl: {
    type: String,
    default: ''
  },
  tip: {
    type: Object,
    default:()=>({}),
  }
})

defineOptions({ name: 'tool-single-img' })

const emit = defineEmits(['update:imageUrl'])

const dialogVisible = ref(false)
const dialogImageUrl = ref('')
const fileUploadURL = ref('')

onMounted(() => {
  fileUploadURL.value = import.meta.env.VITE_APP_BASE_API + '/api/canvas/upload?name=demo&type=console'
})

function handleAvatarSuccess(res, file) {
  emit('update:imageUrl', res.link)
}

function beforeAvatarUpload(file) {
  const isLt1M = file.size / 1024 / 1024 < 1
  if (!isLt1M) {
    ElMessage.error('上传图片大小不能超过 1MB!')
  }
  return isLt1M
}

function showImage() {
  dialogImageUrl.value = props.imageUrl
  dialogVisible.value = true
}

function delImage() {
  emit('update:imageUrl', '')
}
</script>

<style lang="scss" scoped>
.single-img {
  &__box {
    position: relative;
    :deep(.el-upload) {
      width: 100%;
    }
    :deep(.el-upload-dragger) {
      width: 100%;
      .el-upload__text {
        line-height: 40px;
      }
      .el-upload__tip {
        line-height: 1em;
      }
    }
    .overlay {
      display: none;
    }
    &:hover .overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.3);
      color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      .iconfont {
        padding: 5px;
        margin: 0 5px;
        font-size: 20px;
        cursor: pointer;
      }
    }
  }
  &__img {
    position: absolute;
    max-width: 100%;
    height: 100%;
    max-height: 100%;
    margin: auto;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
}
</style>
