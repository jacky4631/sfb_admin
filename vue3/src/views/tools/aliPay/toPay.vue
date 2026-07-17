<template>
  <div>
    <el-form ref="formRef" :model="form" :rules="rules" style="margin-top: 6px;" size="small" label-width="90px">
      <el-form-item label="商品名称" prop="subject">
        <el-input v-model="form.subject" style="width: 35%" />
      </el-form-item>
      <el-form-item label="商品价格" prop="totalAmount">
        <el-input v-model="form.totalAmount" style="width: 35%" />
        <span style="color: #C0C0C0;margin-left: 10px;">测试允许区间(0,5000]</span>
      </el-form-item>
      <el-form-item label="商品描述" prop="body">
        <el-input v-model="form.body" style="width: 35%" rows="8" type="textarea" />
      </el-form-item>
      <el-form-item label="">
        <el-button :loading="loading" size="medium" type="primary" @click="doSubmit">去支付</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { toAliPay } from '@/api/tools/alipay'

const url = ref('')
const newWin = ref(null)
const loading = ref(false)
const formRef = ref(null)
const form = reactive({
  subject: '',
  totalAmount: '',
  body: ''
})
const rules = {
  subject: [
    { required: true, message: '商品名称不能为空', trigger: 'blur' }
  ],
  totalAmount: [
    { required: true, message: '商品价格不能为空', trigger: 'blur' }
  ],
  body: [
    { required: true, message: '商品描述不能为空', trigger: 'blur' }
  ]
}

watch(url, (newVal) => {
  if (newVal && newWin.value) {
    newWin.value.sessionStorage.clear()
    newWin.value.location.href = newVal
    url.value = ''
    newWin.value = null
  }
})

const doSubmit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      newWin.value = window.open()
      let urlPath = ''
      if (/(Android)/i.test(navigator.userAgent)) {
        urlPath = 'aliPay/toPayAsWeb'
      } else if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        urlPath = 'aliPay/toPayAsWeb'
      } else {
        urlPath = 'aliPay/toPayAsPC'
      }
      toAliPay(urlPath, form).then(res => {
        loading.value = false
        url.value = res
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
</style>
