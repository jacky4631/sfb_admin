<template>
  <div class="app-container">
    <el-form ref="formRef" :model="form" :rules="rules" size="small" label-width="150px">
      <el-form-item label="开启短信">
        <el-radio v-model="form.sms_enable" :value="1">开启</el-radio>
        <el-radio v-model="form.sms_enable" :value="2">关闭</el-radio>
      </el-form-item>
      <el-form-item label="签名">
        <el-input v-model="form.sms_sign" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="模板id">
        <el-input v-model="form.sms_templateId" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="accessKey">
        <el-input v-model="form.sms_access_key" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="accessKeySecret">
        <el-input v-model="form.sms_access_secret" style="width: 370px;" type="password" />
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="doSubmit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { get, add } from '@/api/mwSystemConfig.js'

const formRef = ref(null)
const delLoading = ref(false)

const form = reactive({
  sms_enable: 2,
  sms_sign: '',
  sms_templateId: '',
  sms_access_key: '',
  sms_access_secret: ''
})

const rules = {}

const initData = () => {
  get().then(rese => {
    rese.content.forEach(key => {
      const keyName = key.menuName
      const newValue = key.value
      if (keyName in form) {
        form[keyName] = newValue
      }
    })

    form.sms_enable = parseInt(form.sms_enable)
  })
}

const checkPermission = () => {
  // Permission check logic
}

const doSubmit = () => {
  add(form).then(res => {
    ElMessage({ message: '设置成功', type: 'success' })
  }).catch(err => {
    console.log(err.response?.data?.message)
  })
}

onMounted(() => {
  initData()
})
</script>

<style scoped>

</style>
