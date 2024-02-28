<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
        <!-- 搜索 -->
        <el-input v-model="query.blurry" clearable placeholder="输入昵称或订单号" style="width: 200px;" class="filter-item"
                  @keyup.enter.native="toQuery" @clear="toQuery"/>
        <el-input v-model="query.uid" clearable placeholder="输入uid" style="width: 100px;" class="filter-item"
                  @keyup.enter.native="toQuery" @clear="toQuery"/>
      <el-select v-model="query.type" clearable placeholder="加盟类型" class="filter-item" style="width: 100px" @clear="toQuery">
        <el-option v-for="item in typeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-select v-model="query.paid" clearable placeholder="是否支付" class="filter-item" style="width: 130px" @clear="toQuery">
        <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
        <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
        <el-button
          type="danger"
          class="filter-item"
          size="mini"
          icon="el-icon-refresh"
          @click="toQuery"
        >刷新</el-button>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <!--表单组件-->
      <!--表格渲染-->
      <el-table ref="table" v-loading="loading" :data="data" size="small" style="width: 100%;">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="id" width="75px" />
        <el-table-column prop="nickname" label="昵称" width="100px" />
        <el-table-column prop="uid" label="uid" width="100px" />
        <el-table-column prop="oid" label="代付uid" width="100px" />
        <el-table-column prop="orderId" label="订单号" width="200px" />
        <el-table-column prop="platform" label="平台" width="100px"/>
        <el-table-column prop="paid" label="加盟类型" width="100px">
          <template slot-scope="scope">
            <div>
              <el-tag v-if="scope.row.type === 1">体验</el-tag>
              <el-tag v-else-if="scope.row.type === 2">月卡</el-tag>
              <el-tag v-else>年卡</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="充值金额" width="100px" />
        <el-table-column prop="rechargeType" label="充值类型" width="100px" />
        <el-table-column prop="paid" label="是否支付" width="100px">
          <template slot-scope="scope">
            <div>
              <el-tag v-if="scope.row.paid === 1" style="cursor: pointer" :type="'success'">是</el-tag>
              <span v-else>否</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="channelId" label="通道id" width="100px" />
        <el-table-column prop="payTime" label="支付时间" width="200px" >
          <template slot-scope="scope">
            <span>{{ formatTimeTwo(scope.row.payTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="200px" >
          <template slot-scope="scope">
            <span>{{ formatTimeTwo(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="result" label="支付结果" width="350px"  >
          <template slot-scope="scope">
            <div>
              <el-tag v-if="scope.row.result == null" >无</el-tag>
              <el-tag v-else ><a :href="scope.row.result" style="color: #42b983" target="_blank">{{ scope.row.result }}</a></el-tag>
            </div>
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
  </div>
</template>

<script>

import { formatTimeTwo } from '@/utils/index'

import initData from '@/mixins/crud'
import checkPermission from "@/utils/permission";

// crud交由presenter持有
export default {

  mixins: [initData],
  data() {
    return {
      queryTypeOptions: [
        { key: '1', display_name: '已支付' },
        { key: '0', display_name: '未支付' },
      ],
      typeOptions: [
        { key: '0', display_name: '年卡' },
        { key: '2', display_name: '月卡' },
        { key: '1', display_name: '体验' },
      ]
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    checkPermission,
    beforeInit() {
      this.url = 'api/mwUserRecharge'
      const sort = 'create_time,desc'
      this.params = { page: this.page, size: this.size, sort: sort, blurry: this.query.blurry, uid: this.query.uid, paid: this.query.paid, type: this.query.type}
      return true
    },
    formatTimeTwo,
  }
}
</script>

<style scoped>

</style>
