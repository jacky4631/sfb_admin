<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" v-model="dialog" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="formRef" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="状态">
        <el-radio v-model="form.type" :value="'template'">模板消息</el-radio>
        <el-radio v-model="form.type" :value="'subscribe'">订阅消息</el-radio>
      </el-form-item>
      <el-form-item label="模板编号">
        <el-input v-model="form.tempkey" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="模板名">
        <el-input v-model="form.name" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="模板ID">
        <el-input v-model="form.tempid" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="状态">
        <el-radio v-model="form.status" :value="1">可用</el-radio>
        <el-radio v-model="form.status" :value="0">禁用</el-radio>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button link @click="cancel">取消</el-button>
        <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue'
import { ElNotification, ElMessage } from 'element-plus'
import { add, edit } from '@/api/mwWechatTemplate.js'

const props = defineProps({
  isAdd: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['refresh'])

const loading = ref(false)
const dialog = ref(false)
const formRef = ref(null)
const form = reactive({
  id: '',
  tempkey: '',
  name: '',
  content: '',
  tempid: '',
  addTime: '',
  status: 1,
  type: 'template'
})
const rules = {
}

const cancel = () => {
  resetForm()
}

const doSubmit = () => {
  if (loading.value) return
  loading.value = true
  if (props.isAdd) {
    doAdd()
  } else doEdit()
}

const doAdd = () => {
  add(form).then(res => {
    resetForm()
    ElNotification({
      title: '添加成功',
      type: 'success',
      duration: 2500
    })
    loading.value = false
    emit('refresh')
  }).catch(err => {
    loading.value = false
    ElMessage.error(err.response?.data?.message || '保存失败，请重试')
  })
}

const doEdit = () => {
  edit(form).then(res => {
    resetForm()
    ElNotification({
      title: '修改成功',
      type: 'success',
      duration: 2500
    })
    loading.value = false
    emit('refresh')
  }).catch(err => {
    loading.value = false
    ElMessage.error(err.response?.data?.message || '保存失败，请重试')
  })
}

const defaultForm = JSON.parse(JSON.stringify(form))
const resetForm = () => {
  dialog.value = false
  for (const key of Object.keys(form)) delete form[key]
  Object.assign(form, JSON.parse(JSON.stringify(defaultForm)))
  formRef.value?.clearValidate()
}

const open = async (row = null) => {
  resetForm()
  if (row) Object.assign(form, JSON.parse(JSON.stringify(row)))
  dialog.value = true
  await nextTick()
  formRef.value?.clearValidate()
}

defineExpose({ open })

</script>

<style scoped>

</style>
