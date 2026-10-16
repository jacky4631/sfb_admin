<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" v-model="dialog" title="绑定用户" width="500px">
    <el-form ref="formRef" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="订单号">
        <el-input v-model="form.orderId" :disabled="true" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="用户uid">
        <el-input v-model="form.uid" style="width: 370px;" />
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
import { add, editOrder } from '@/api/mwStoreOrder.js'

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
  orderId: '',
  uid: '',
})

const rules = {
  unique: [
    { required: true, message: 'please enter', trigger: 'blur' }
  ]
}

function cancel() {
  resetForm()
}

function doSubmit() {
  if (loading.value) return
  loading.value = true
  if (props.isAdd) {
    doAdd()
  } else {
    doEdit()
  }
}

function doAdd() {
  add(form).then(() => {
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
    console.log(err.response?.data?.message)
  })
}

function doEdit() {
  editOrder(form).then(() => {
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
    console.log(err.response?.data?.message)
  })
}

function resetForm() {
  dialog.value = false
  formRef.value?.resetFields()
  form.id = ''
  form.orderId = ''
  form.uid = ''
}

async function open(data) {
  if (data.orderId === undefined || data.orderId === null || data.orderId === '') {
    ElMessage.error('订单号为空，无法绑定用户')
    return
  }
  Object.assign(form, { id: '', orderId: data.orderId, uid: data.uid ?? '' })
  dialog.value = true
  await nextTick()
  formRef.value?.clearValidate()
}

defineExpose({
  open,
  form,
  dialog
})
</script>

<style scoped>

</style>
