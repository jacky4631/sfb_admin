<template>
  <el-tabs v-model="activeName" style="padding-left: 8px;" @tab-click="tabClick">
    <el-tab-pane label="本地存储" name="first">
      <Local ref="localRef" />
    </el-tab-pane>
    <el-tab-pane label="七牛云存储" name="second">
      <QiNiu ref="qiNiuRef" />
    </el-tab-pane>
  </el-tabs>
</template>

<script setup>
import { ref } from 'vue'
import QiNiu from './qiniu/index.vue'
import Local from './local/index.vue'

const activeName = ref('first')
const localRef = ref(null)
const qiNiuRef = ref(null)

const tabClick = (name) => {
  if (activeName.value === 'first') {
    localRef.value.crud.toQuery()
  } else {
    qiNiuRef.value.crud.toQuery()
  }
}
</script>

<style scoped>
</style>
