<template>
  <div class="app-container">
    <el-form ref="formRef" :model="form" :rules="rules" size="small" label-width="150px">
      <el-form-item label="AppID">
        <el-input v-model="form.wxapp_appId" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="小程序密钥">
        <el-input v-model="form.wxapp_secret" style="width: 370px;" type="password" />
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
import { get, add } from '@/api/mwSystemConfig'

const formRef = ref(null)
const delLoading = ref(false)

const form = reactive({
  wxapp_appId: '',
  wxapp_secret: '',
  wechat_ma_token: '',
  wechat_ma_encodingaeskey: '',
  wxapi: 'http://你的H5api端域名/api/wxapp/serve'
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
