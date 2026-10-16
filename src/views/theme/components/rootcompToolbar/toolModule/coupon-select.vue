<template>
  <div class="product-select">
    <el-form :inline="true" :model="formData" class="demo-form-inline">
      <el-form-item label="">
        <el-input v-model="formData.keyword" placeholder="店铺名称/商品ID/商品分组"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      max-height="500"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="name" label="优惠券名称" width="180"></el-table-column>
      <el-table-column prop="productId" label="适用商品"></el-table-column>
      <el-table-column prop="price" label="优惠内容"></el-table-column>
      <el-table-column prop="originalPrice" label="领取人限制" width="100"></el-table-column>
      <el-table-column prop="stockNumber" label="限领次数"></el-table-column>
      <el-table-column prop="number" label="剩余库存"></el-table-column>
      <el-table-column prop="number" label="状态"></el-table-column>
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
import { ref } from 'vue'
import { getProducts } from '@/api/canvasApi.js'

defineOptions({ name: 'coupon-select' })

const tableRadio = ref('')
const formData = ref({
  keyword: '',
  status: '',
  categoryId: ''
})
const currentPage = ref(1)
const total = ref(0)
const pageSize = ref(10)
const multipleSelection = ref([])
const tableData = ref([{
  id: 100,
  name: '测试'
}])

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

// 多选改变
function handleSelectionChange(val) {
  multipleSelection.value = val
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
