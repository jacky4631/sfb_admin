<template>
  <div class="app-container">
    <el-form ref="formRef" :model="form" :rules="rules" size="small" label-width="150px">
      <el-form-item label="积分抵用比例">
        <el-input v-model="form.integral_ratio" style="width: 370px;" />
        <p style="color: red">积分抵用比例(1积分抵多少金额)</p>
      </el-form-item>
      <el-form-item label="满多少可以抵扣">
        <el-input v-model="form.integral_full" style="width: 370px;" />
        <p style="color: red">消费必须满一定额度才可使用,0代表无限制</p>
      </el-form-item>
      <el-form-item label="单次最大抵扣积分">
        <el-input v-model="form.integral_max" style="width: 370px;" />
        <p style="color: red">限制一次只能使用多少积分,0代表无限制</p>
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
  integral_ratio: '',
  integral_full: 0,
  integral_max: 0
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
