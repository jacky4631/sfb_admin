<template>
  <div class="product-select">
    <el-form :inline="true" :model="formData" class="demo-form-inline">
      <el-form-item label="">
        <el-input v-model="formData.keyword" placeholder="店铺名称"></el-input>
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
          <el-radio v-model="tableRadio" :label="scope.row"><i></i></el-radio>
        </template>
      </el-table-column>
      <el-table-column
        prop="shopName"
        label="店铺名称">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="手机号">
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getShops } from '@/api/canvasApi.js'

defineOptions({ name: 'shop-select' })

const props = defineProps({
  categoryList: {
    type: Array,
    default: () => [
      {
        value: '/index',
        label: '首页'
      },
      {
        value: '/category',
        label: '分类页面'
      },
      {
        value: '/shop',
        label: '店辅主页'
      },
      {
        value: '/detail',
        label: '商品详情'
      }
    ]
  }
})

const tableRadio = ref('')
const currentPage = ref(1)
const total = ref(0)
const pageSize = ref(10)
const formData = ref({
  keyword: ''
})
const tableData = ref([])

onMounted(() => {
  getTableData()
})

// 获取店辅信息
function getTableData() {
  const params = {
    page: currentPage.value,
    pageSize: pageSize.value
  }
  if (formData.value.keyword) {
    params.search = formData.value.keyword
  }
  getShops(params).then(res => {
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
}
</style>
