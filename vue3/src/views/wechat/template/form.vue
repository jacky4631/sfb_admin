<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" v-model="dialog" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="formRef" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="状态">
        <el-radio v-model="form.type" :label="'template'">模板消息</el-radio>
        <el-radio v-model="form.type" :label="'subscribe'">订阅消息</el-radio>
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
        <el-radio v-model="form.status" :label="1">可用</el-radio>
        <el-radio v-model="form.status" :label="0">禁用</el-radio>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="text" @click="cancel">取消</el-button>
        <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElNotification } from 'element-plus'
import { add, edit } from '@/api/mwWechatTemplate'

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
  status: 1
})
const rules = {
}

const cancel = () => {
  resetForm()
}

const doSubmit = () => {
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
    console.log(err.response?.data?.message || err.message)
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
    console.log(err.response?.data?.message || err.message)
  })
}

const resetForm = () => {
  dialog.value = false
  formRef.value?.resetFields()
  Object.assign(form, {
    id: '',
    tempkey: '',
    name: '',
    content: '',
    tempid: '',
    addTime: '',
    status: ''
  })
}
</script>

<style scoped>

</style>
