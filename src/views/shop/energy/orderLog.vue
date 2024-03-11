<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input v-model="search" clearable placeholder="输入用户uid或者平台" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery" />
      <el-select v-model="type" clearable placeholder="订单类型" class="filter-item" style="width: 130px">
        <el-option v-for="item in typeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-date-picker
        v-model="createTime"
        :default-time="['00:00:00','23:59:59']"
        type="daterange"
        range-separator=":"
        size="small"
        class="date-item"
        value-format="yyyy-MM-dd HH:mm:ss"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      />
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!-- 新增 -->
      <el-button
        type="danger"
        class="filter-item"
        size="mini"
        icon="el-icon-refresh"
        @click="toQuery"
      >刷新</el-button>


    </div>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column prop="id" label="id" />
      <el-table-column prop="uid" label="用户id" />
      <el-table-column prop="money" label="金额"/>
      <el-table-column prop="count" label="订单数量"/>
      <el-table-column prop="energy" label="用户当前热度"/>
      <el-table-column prop="platform" label="平台">
        <template slot-scope="scope">
          <span v-if="scope.row.platform == 'jd'">京东</span>
          <span v-else-if="scope.row.platform == 'pdd'">拼多多</span>
          <span v-else-if="scope.row.platform == 'dy'">抖音</span>
          <span v-else-if="scope.row.platform == 'vip'">唯品会</span>
          <span v-else>淘宝</span>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="类型">
        <template slot-scope="scope">
          <span v-if="scope.row.type == 0">赠送</span>
          <span v-else>推广</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="addTime" label="创建日期">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      :current-page="page + 1"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, jumper, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"
    />
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/crud'
import { formatTime } from '@/utils/index'
export default {
  mixins: [initData],
  data() {
    return {
      search: '', type: '', createTime: '',
      typeOptions: [
        { key: '0', display_name: '赠送' },
        { key: '1', display_name: '推广' }
      ],
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    formatTime,
    checkPermission,
    beforeInit() {
      this.url = 'api/energy/order/log'
      const sort = 'id,desc'
      this.params = {
        page: this.page,
        size: this.size,
        search: this.search,
        type: this.type,
        createTime: this.createTime,
        sort: sort
      }
      const query = this.query
      const type = query.type
      const value = query.value
      if (type && value) { this.params[type] = value }
      return true
    },
    add() {
      this.isAdd = true
      this.$refs.form.dialog = true
    }
  }
}
</script>

<style scoped>

</style>
