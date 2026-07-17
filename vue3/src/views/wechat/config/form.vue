<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" v-model="dialog" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="formRef" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="字段名称">
        <el-input v-model="form.menuName" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="类型(文本框,单选按钮...)">
        <el-input v-model="form.type" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="表单类型">
        <el-input v-model="form.inputType" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="配置分类id">
        <el-input v-model="form.configTabId" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="规则 单选框和多选框">
        <el-input v-model="form.parameter" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="上传文件格式1单图2多图3文件">
        <el-input v-model="form.uploadType" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="规则">
        <el-input v-model="form.required" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="多行文本框的宽度">
        <el-input v-model="form.width" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="多行文框的高度">
        <el-input v-model="form.high" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="默认值">
        <el-input v-model="form.value" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="配置名称">
        <el-input v-model="form.info" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="配置简介">
        <el-input v-model="form.desc" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="排序">
        <el-input v-model="form.sort" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="是否隐藏">
        <el-input v-model="form.status" style="width: 370px;" />
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
import { ref, reactive, watch } from 'vue'
import { ElNotification } from 'element-plus'
import { add, edit } from '@/api/mwSystemConfig'

const props = defineProps({
  isAdd: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['refresh'])

const formRef = ref(null)
const loading = ref(false)
const dialog = ref(false)

const form = reactive({
  id: '',
  menuName: '',
  type: '',
  inputType: '',
  configTabId: '',
  parameter: '',
  uploadType: '',
  required: '',
  width: '',
  high: '',
  value: '',
  info: '',
  desc: '',
  sort: '',
  status: ''
})

const rules = {}

const cancel = () => {
  resetForm()
}

const doSubmit = () => {
  loading.value = true
  if (props.isAdd) {
    doAdd()
  } else {
    doEdit()
  }
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
    console.log(err.response?.data?.message)
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
    console.log(err.response?.data?.message)
  })
}

const resetForm = () => {
  dialog.value = false
  formRef.value?.resetFields()
  Object.assign(form, {
    id: '',
    menuName: '',
    type: '',
    inputType: '',
    configTabId: '',
    parameter: '',
    uploadType: '',
    required: '',
    width: '',
    high: '',
    value: '',
    info: '',
    desc: '',
    sort: '',
    status: ''
  })
}

// Expose dialog for parent component control
defineExpose({
  dialog
})
</script>

<style scoped>

</style>
