<template>
  <div class="product-select">
    <el-form :inline="true" :model="formData" class="demo-form-inline">
      <el-form-item label="">
        <el-input v-model="formData.keyword" placeholder="店铺名称/商品ID/商品分组"></el-input>
      </el-form-item>
      <el-form-item label="上架状态">
        <el-select v-model="formData.status" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="上架" value="1"></el-option>
          <el-option label="下架" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="官方分类">
        <el-cascader
          ref="cascader"
          v-model="formData.categoryId"
          :options="categoryList"
          :props="{ checkStrictly: true,label: 'categoryName',value: 'id',children: 'childs' }"
          clearable></el-cascader>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      max-height="500"
      border
      style="width: 100%">
      <el-table-column label="" width="35" align="center">
        <template #default="scope">
          <el-radio v-model="tableRadio" :value="scope.row"><i></i></el-radio>
        </template>
      </el-table-column>
      <el-table-column label="产品主图" width="180" align="center">
        <template #default="scope">
          <el-image
            style="width: 80px; height: 80px"
            :src="scope.row.image"
            fit="contain"></el-image>
        </template>
      </el-table-column>
      <el-table-column
        prop="productName"
        label="产品名称"
        width="180"></el-table-column>
      <el-table-column
        prop="productId"
        label="产品ID"></el-table-column>
      <el-table-column
        prop="price"
        label="售价"></el-table-column>
      <el-table-column
        prop="originalPrice"
        label="原价"></el-table-column>
      <el-table-column
        prop="stockNumber"
        label="库存"></el-table-column>
      <el-table-column
        prop="number"
        label="销量"></el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :hide-on-single-page="true"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { checkEmptyChild } from '@/mixins/tool.js'
import { getClassify, getProducts } from '@/api/canvasApi.js'

defineOptions({ name: 'product-select' })

const tableRadio = ref('')
const formData = ref({
  keyword: '',
  status: '',
  categoryId: ''
})
const currentPage = ref(1)
const total = ref(0)
const pageSize = ref(10)
const categoryList = ref([])
const tableData = ref([])

const cascader = ref(null)

onMounted(() => {
  getCategory()
  getTableData()
})

// 获取类别
function getCategory() {
  getClassify().then(res => {
    categoryList.value = res.data
    checkEmptyChild(categoryList.value)
  })
}

// 获取产品信息
function getTableData() {
  const params = {
    page: currentPage.value,
    pageSize: pageSize.value
  }
  if (formData.value.keyword) {
    params.search = formData.value.keyword
  }
  if (formData.value.status) {
    params.shelveState = formData.value.status
  }
  const nodesObj = cascader.value?.getCheckedNodes()
  if (nodesObj && nodesObj.length !== 0) {
    params.classifyId = nodesObj[0].value
  }
  getProducts(params).then(res => {
    tableData.value = res.data.list
    total.value = res.data.total
  })
}

// 搜索
function onSubmit() {
  getTableData()
}

// 每页条数改变
function handleSizeChange(val) {
  pageSize.value = val
  getTableData()
}

// 当前页改变
function handleCurrentChange(val) {
  currentPage.value = val
  getTableData()
}
</script>

<style lang="scss" scoped>
.product-select{
  .el-pagination{
    padding: 0px;
    margin-top: 30px;
  }
  .el-table{
    .img{
      width: 80px;
      height: 80px;
    }
  }
}
</style>
