<template>
  <div class="videoTool">
    <h3 class="toolTit">视频</h3>
    <div class="toolBox">
      <div class="itemBox">
        <label>视频地址</label>
        <el-input v-model="activeComponent.componentContent.videoUrl" placeholder="请输入内容"></el-input>
      </div>
      <div class="itemBox">
        <label>标题</label>
        <el-input v-model="activeComponent.componentContent.title" placeholder="请输入内容"></el-input>
      </div>
      <div class="itemBox">
        <label>正文</label>
        <QuillEditor
          v-model:content="activeComponent.componentContent.mainBody"
          ref="myQuillEditor"
          :options="editorOption"
          @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
          @text-change="onEditorChange($event)">
        </QuillEditor>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { toolMixin } from '@/mixins/tool.js'

defineOptions({ name: 'videoTool' })

const { activeComponent, onEditorBlur, onEditorFocus, onEditorChange } = toolMixin

const editorOption = ref({
  placeholder: '请输入',
  modules: {
    toolbar: [
      ['bold', 'italic', 'link']
    ]
  }
})
</script>

<style lang="scss" scoped>
.videoTool {
  padding: 20px 20px 0 20px;
  h3 {
    font-size: 18px;
    font-weight: 500;
    height: 35px;
    line-height: 35px;
    color: #333333;
    margin-bottom: 20px;
  }
  .toolBox {
    padding-bottom: 10px;
    .itemBox {
      label {
        font-size: 14px;
        color: #666666;
        height: 40px;
        line-height: 40px;
      }
      margin-bottom: 15px;
    }
  }
  :deep(.ql-container) {
    height: 200px;
  }
}
</style>
