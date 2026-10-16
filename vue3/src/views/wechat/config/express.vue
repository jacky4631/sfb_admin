<template>
  <div class="app-container">
    <el-form ref="formRef" :model="form" :rules="rules" size="small" label-width="150px">
      <el-form-item label="开启">
        <el-radio v-model="form.exp_enable" :value="1">开启</el-radio>
        <el-radio v-model="form.exp_enable" :value="2">关闭</el-radio>
      </el-form-item>
      <el-form-item label="appId">
        <el-input v-model="form.exp_appId" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="appKey">
        <el-input v-model="form.exp_appKey" style="width: 370px;" type="password" />
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
  exp_enable: 2,
  exp_appId: '',
  exp_appKey: ''
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

    form.exp_enable = parseInt(form.exp_enable)
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
