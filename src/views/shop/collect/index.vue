<template>
  <div class="app-container finance-page">
    <div class="head-container finance-filters">
      <el-button
        type="danger"
        class="filter-item"
        size="small"
       
        @click="toQuery"
      ><el-icon><Refresh /></el-icon>刷新</el-button>
    </div>
    <!--表格渲染-->
    <el-table class="finance-table" v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="id" />
      <el-table-column prop="uid" label="用户ID" />
      <el-table-column  prop="userName" label="用户名" />
      <el-table-column prop="productId" label="商品ID" />
      <el-table-column prop="title" label="商品名称" />
      <el-table-column prop="category" label="商品类型" />
      <el-table-column ref="table" prop="img" label="商品图片">
        <template #default="scope">
          <a :href="scope.row.img" style="color: rgb(64, 158, 255)" target="_blank"><img :src="scope.row.img" alt="点击打开" class="el-avatar"></a>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="类型">
        <template #default="scope">
          <div>
            <el-tag v-if="scope.row.type == 'collect'" type="primary">收藏</el-tag>
            <el-tag v-else :type=" 'info' ">足迹</el-tag>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="originalProductId" label="商品ID" />
      <el-table-column prop="createTime" label="添加时间">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination class="finance-pagination"
      :total="total"
      :current-page="page + 1"
      :page-size="size"
      :page-sizes="[10, 20, 30, 50, 100]"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"
    />
  </div>
</template>

<script>
import initData from '@/mixins/crud.js'
export default {
  name: 'MwStoreProductRelation',
  mixins: [initData],
  data(){
    return {
      query:{
        type: 'type',
      } }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    beforeInit() {
      this.url = 'api/mwStoreProductRelation'
      const sort = 'create_time,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
      const query = this.query
      this.params[query.type] = 'collect'
      return true
    }
  }
}
</script>

<style scoped>

</style>
