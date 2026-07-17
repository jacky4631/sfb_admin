<template>
  <el-tabs v-model="activeName" type="card">
    <el-tab-pane v-for="item in data" :key="item.name" :lazy="true" :label="item.name" :name="item.name">
      <Java :value="item.content" :height="height" />
    </el-tab-pane>
  </el-tabs>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Java from '@/components/JavaEdit/index'
import { generator } from '@/api/generator/generator'

defineOptions({
  name: 'Preview'
})

const route = useRoute()
const router = useRouter()

const data = ref(null)
const height = ref('')
const activeName = ref('Entity')

onMounted(() => {
  height.value = document.documentElement.clientHeight - 180 + 'px'
  const tableName = route.params.tableName
  generator(tableName, 1).then(resData => {
    data.value = resData
  }).catch(() => {
    router.go(-1)
  })
})
</script>
