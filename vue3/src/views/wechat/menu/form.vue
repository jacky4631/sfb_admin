<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" v-model="dialog" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="formRef" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="缓存数据">
        <el-input v-model="form.result" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="缓存时间">
        <el-input v-model="form.addTime" style="width: 370px;" />
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
import { ref, reactive } from 'vue'
import { ElNotification } from 'element-plus'
import { add, edit } from '@/api/mwWechatMenu'

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
  key: '',
  result: '',
  addTime: ''
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
    key: '',
    result: '',
    addTime: ''
  })
}
</script>

<style scoped>

</style>
