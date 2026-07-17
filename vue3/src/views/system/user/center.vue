<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="用户名">
        <el-input v-model="form.name" disabled />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="form.email" />
      </el-form-item>
      <el-form-item label="头像">
        <el-input v-model="form.avatar" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const form = reactive({
  name: '',
  email: '',
  avatar: ''
})

onMounted(() => {
  form.name = store.state.user.name || ''
  form.email = store.state.user.email || ''
  form.avatar = store.state.user.avatar || ''
})

const onSubmit = () => {
  // Submit logic here
}
</script>

<style lang="scss" scoped>
.app-container {
  padding: 20px;
}
</style>
