<template>
  <el-cascader style="width: 100%"
    ref="cascader"
    :options="categoryList"
    :props="{ checkStrictly: true,label: 'categoryName',value: 'id',children: 'childs' }"
    clearable></el-cascader>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { checkEmptyChild } from '@/mixins/tool.js'
import { getClassify } from '@/api/canvasApi.js'

defineOptions({ name: 'category-select' })

const categoryList = ref([])
const cascader = ref(null)

onMounted(() => {
  getCategory()
})

// 获取类别
function getCategory() {
  getClassify().then(res => {
    categoryList.value = res.data
    checkEmptyChild(categoryList.value)
  })
}
</script>
