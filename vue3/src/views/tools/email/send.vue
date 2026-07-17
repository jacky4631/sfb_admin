<template>
  <div>
    <el-form ref="formRef" :model="form" :rules="rules" style="margin-top: 6px;margin-bottom:46px" size="small" label-width="100px">
      <el-form-item label="邮件标题" prop="subject">
        <el-input v-model="form.subject" style="width: 646px"/>
      </el-form-item>
      <el-form-item
          v-for="(domain, index) in tos"
          :key="domain.key"
          :label="'收件邮箱' + (index === 0 ? '': index)"
      >
        <el-input v-model="domain.value" style="width: 550px"/>
        <el-button icon="el-icon-plus" @click="addDomain"/>
        <el-button style="margin-left:0;" icon="el-icon-minus" @click.prevent="removeDomain(domain)"/>
      </el-form-item>
      <el-form-item label="邮件内容">
        <ueditor-wrap v-model="form.content" :config="myConfig" @beforeInit="addCustomDialog"
                      style="width: 90%;"></ueditor-wrap>
      </el-form-item>

      <!-- <div ref="editor" class="editor"/> -->
      <el-form-item label="">
      <el-button :loading="loading"  size="medium" type="primary" @click="doSubmit">发送邮件
      </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { send } from '@/api/tools/email'
import { upload } from '@/utils/upload'
import { validEmail } from '@/utils/validate'
import UeditorWrap from 'vue-ueditor-wrap'

const loading = ref(false)
const formRef = ref(null)
const myConfig = {
  autoHeightEnabled: false,
  initialFrameHeight: 500,
  initialFrameWidth: '100%',
  UEDITOR_HOME_URL: '/UEditor/',
  serverUrl: ''
}
const form = reactive({
  subject: '',
  tos: [],
  content: ''
})
const tos = ref([{
  value: ''
}])
const rules = {
  subject: [
    { required: true, message: '标题不能为空', trigger: 'blur' }
  ]
}

const removeDomain = (item) => {
  const index = tos.value.indexOf(item)
  if (index !== -1 && tos.value.length !== 1) {
    tos.value.splice(index, 1)
  } else {
    ElMessage.warning('请至少保留一位联系人')
  }
}

const addDomain = () => {
  tos.value.push({
    value: '',
    key: Date.now()
  })
}

const doSubmit = () => {
  formRef.value.validate((valid) => {
    form.tos = []
    if (valid) {
      let sub = false
      tos.value.forEach(function(data) {
        if (data.value === '') {
          ElMessage.warning('收件邮箱不能为空')
          sub = true
        } else if (validEmail(data.value)) {
          form.tos.push(data.value)
        } else {
          ElMessage.warning('收件邮箱格式错误')
          sub = true
        }
      })
      if (sub) {
        return false
      }
      loading.value = true
      send(form).then(res => {
        ElMessage.success('发送成功')
        loading.value = false
      }).catch(err => {
        loading.value = false
        console.log(err.response.data.message)
      })
    } else {
      return false
    }
  })
}
</script>

<style scoped>
.editor {
  text-align: left;
  margin: 20px;
  width: 730px;
}

:deep(.w-e-text-container) ) {
  height: 360px !important;
}
</style>
