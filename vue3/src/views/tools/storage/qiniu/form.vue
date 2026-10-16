<template>
  <el-dialog v-model="dialog" :close-on-click-modal="false" title="七牛云配置" append-to-body width="580px">
    <el-form ref="formRef" :model="form" :rules="rules" style="margin-top: 6px;" size="small" label-width="110px">
      <el-form-item label="Access Key" prop="accessKey">
        <el-input v-model="form.accessKey" style="width: 95%" placeholder="accessKey，在安全中心，秘钥管理中查看" />
      </el-form-item>
      <el-form-item label="Secret Key" prop="secretKey">
        <el-input v-model="form.secretKey" type="password" style="width: 95%;" placeholder="secretKey，在安全中心，秘钥管理中查看" />
      </el-form-item>
      <el-form-item label="空间名称" prop="bucket">
        <el-input v-model="form.bucket" style="width: 95%;" placeholder="存储空间名称作为唯一的 Bucket 识别符" />
      </el-form-item>
      <el-form-item label="外链域名" prop="host">
        <el-input v-model="form.host" style="width: 95%;" placeholder="外链域名，可自定义，需在七牛云绑定" />
      </el-form-item>
      <el-form-item label="存储区域" prop="port">
        <el-select v-model="form.zone" placeholder="请选择存储区域">
          <el-option
            v-for="item in zones"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="空间类型" prop="host">
        <el-radio v-model="form.type" value="公开">公开</el-radio>
        <el-radio v-model="form.type" value="私有">私有</el-radio>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button link @click="dialog = false">取消</el-button>
        <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { get, update } from '@/api/tools/qiniu'

const dialog = ref(false)
const loading = ref(false)
const formRef = ref(null)
const zones = ['华东', '华北', '华南', '北美', '东南亚']
const form = reactive({
  accessKey: '',
  secretKey: '',
  bucket: '',
  host: '',
  zone: '',
  type: ''
})
const rules = {
  accessKey: [
    { required: true, message: '请输入accessKey', trigger: 'blur' }
  ],
  secretKey: [
    { required: true, message: '请输入secretKey', trigger: 'blur' }
  ],
  bucket: [
    { required: true, message: '请输入空间名称', trigger: 'blur' }
  ],
  host: [
    { required: true, message: '请输入外链域名', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '空间类型不能为空', trigger: 'blur' }
  ]
}

const init = () => {
  get().then(res => {
    if (res) {
      Object.assign(form, res)
    }
  })
}

const doSubmit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      update(form).then(res => {
        ElMessage.success('修改成功')
        dialog.value = false
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
</style>
