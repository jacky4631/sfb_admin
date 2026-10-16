<template>
  <div class="json-editor">
    <textarea ref="textarea" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
// 替换主题这里需修改名称
import 'codemirror/theme/idea.css'
import 'codemirror/mode/yaml/yaml'

defineOptions({
  name: 'YamlEdit'
})

const props = defineProps({
  value: {
    type: String,
    required: true
  },
  height: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['changed', 'input'])

const textarea = ref(null)
let editor = null

watch(() => props.value, (value) => {
  const editorValue = editor.getValue()
  if (value !== editorValue) {
    editor.setValue(props.value)
  }
})

watch(() => props.height, (value) => {
  editor.setSize('auto', value)
})

onMounted(() => {
  editor = CodeMirror.fromTextArea(textarea.value, {
    mode: 'text/x-yaml',
    lineNumbers: true,
    lint: true,
    lineWrapping: true,
    tabSize: 2,
    cursorHeight: 0.9,
    // 替换主题这里需修改名称
    theme: 'idea'
  })
  editor.setSize('auto', props.height)
  editor.setValue(props.value)
  editor.on('change', cm => {
    emit('changed', cm.getValue())
    emit('input', cm.getValue())
  })
})

function getValue() {
  return editor.getValue()
}

defineExpose({
  getValue
})
</script>

<style scoped>
  .json-editor{
    height: 100%;
    margin-bottom: 10px;
  }
  .json-editor :deep(.CodeMirror) {
    font-size: 13px;
    overflow-y:auto;
    font-weight:normal
  }
  .json-editor :deep(.CodeMirror-scroll){
  }
  .json-editor :deep(.cm-s-rubyblue span.cm-string) {
    color: #F08047;
  }
</style>
