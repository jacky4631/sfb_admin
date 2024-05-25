<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input v-model="query.channelName" clearable placeholder="输入搜索内容" style="width: 200px;"
                class="filter-item" @keyup.enter.native="toQuery" @clear="toQuery"/>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!-- 新增 -->
      <el-button
        type="danger"
        class="filter-item"
        size="mini"
        icon="el-icon-refresh"
        @click="toQuery"
      >刷新</el-button>
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          v-permission="['admin','PAYSET_ALL','PAYSET_CREATE']"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add"
        >新增</el-button>
      </div>

      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          v-permission="['admin','PAYSET_ALL','PAYSET_CREATE']"
          class="filter-item"
          size="mini"
          type="warning"
          icon="el-icon-document"
          @click="config"
        >APP支付开关</el-button>
      </div>
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd" />
    <configForm ref="formconfig"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column prop="id" label="通道id" />
      <el-table-column prop="channelName" label="通道名称" width="250px"/>
<!--      <el-table-column prop="name" label="app简称" width="250px"/>-->
      <el-table-column prop="channelKey" label="通道商" width="150px">
        <template slot-scope="scope">
          <div>
            <el-tag v-if="scope.row.channelKey === 'iospay'" style="cursor: pointer" :type="''">IOS支付</el-tag>
            <el-tag v-else-if="scope.row.channelKey === 'adapay'" style="cursor: pointer" :type="''">汇付天下</el-tag>
            <el-tag v-else-if="scope.row.channelKey === 'allinpay'" style="cursor: pointer" :type="''">通联支付收银宝</el-tag>
            <el-tag v-else-if="scope.row.channelKey === 'alipay'" style="cursor: pointer" :type="''">支付宝</el-tag>
            <el-tag v-else-if="scope.row.channelKey === 'alipayweb'" style="cursor: pointer" :type="''">支付宝网页</el-tag>
            <el-tag v-else-if="scope.row.channelKey === 'wechatpay'" style="cursor: pointer" :type="''">微信</el-tag>
            <el-tag v-else-if="scope.row.channelKey === 'yeepay_bank'" style="cursor: pointer" :type="''">易宝银行卡快捷</el-tag>
            <el-tag v-else-if="scope.row.channelKey === 'ysepay_bank_bind'" style="cursor: pointer" :type="''">银盛银行卡绑卡</el-tag>
            <el-tag v-else-if="scope.row.channelKey === 'ysepay'" style="cursor: pointer" :type="''">银盛支付宝</el-tag>
            <el-tag v-else style="cursor: pointer" :type=" 'warning' ">未知</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="通道类型" align="center" width="140">
        <template slot-scope="scope">
          <div>
            <el-tag v-if="scope.row.type === 0" style="cursor: pointer" :type="''">iOS</el-tag>
            <el-tag v-else-if="scope.row.type === 1" style="cursor: pointer" :type="''">支付宝-原生</el-tag>
            <el-tag v-else-if="scope.row.type === 2" style="cursor: pointer" :type="''">支付宝-三方</el-tag>
            <el-tag v-else-if="scope.row.type === 6" style="cursor: pointer" :type="''">微信支付-原生</el-tag>
            <el-tag v-else-if="scope.row.type === 7" style="cursor: pointer" :type="''">微信支付-三方</el-tag>
            <el-tag v-else-if="scope.row.type === 12" style="cursor: pointer" :type="''">银行卡-快捷支付</el-tag>
            <el-tag v-else-if="scope.row.type === 13" style="cursor: pointer" :type="''">银行卡-绑卡支付</el-tag>
            <el-tag v-else style="cursor: pointer" :type=" 'warning' ">未知</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="通道开关" align="center">
        <template slot-scope="scope">
          <div>
            <el-tag v-if="scope.row.status === 8" style="cursor: pointer" :type="'success'">开</el-tag>
            <el-tag v-else-if="scope.row.status === 1" style="cursor: pointer" :type="'danger'">投诉关闭</el-tag>
            <el-tag v-else-if="scope.row.status === 2" style="cursor: pointer" :type="'info'">临时关闭</el-tag>
            <el-tag v-else style="cursor: pointer" :type=" 'warning' ">关闭</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="maxAmount" label="最大额度(元)" />
      <el-table-column prop="amount" label="剩余额度(元)" >
        <template slot-scope="scope">
          <span>{{ scope.row.amount.toFixed(1) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="extract" label="可提现">
        <template slot-scope="scope">
          <div>
            <el-tag v-if="scope.row.extract === 1" style="cursor: pointer" :type="'success'">是</el-tag>
            <el-tag v-else style="cursor: pointer" :type=" 'warning' ">否</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="notifyUrl" label="回调地址" :show-overflow-tooltip="true" />
      <el-table-column prop="companyId" label="主体id" />
      <el-table-column  prop="updateTime" label="刷新时间" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.cycleTime }}</span>
        </template>
      </el-table-column>
      <el-table-column  prop="createTime" label="创建时间" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column  prop="updateTime" label="更新时间" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['admin','PAYSET_ALL','PAYSET_EDIT','PAYSET_DELETE'])" label="操作" width="150px" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button v-permission="['admin','PAYSET_ALL','PAYSET_EDIT']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)" />
          <el-popover
            :ref="scope.row.id"
            v-permission="['admin','PAYSET_ALL','PAYSET_DELETE']"
            placement="top"
            width="180"
          >
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定</el-button>
            </div>
            <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" />
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      :current-page="page + 1"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"
    />
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/crud'
import { del, getAppPayConfig } from '@/api/mwPaySet'
import eForm from './form'
import configForm from './formconfig'
export default {
  components: { eForm, configForm },
  mixins: [initData],
  data() {
    return {
      channelKeyOptions: [
        { key: 'wechatpay', display_name: '微信' },
        { key: 'alipay', display_name: '支付宝' },
        { key: 'alipayweb', display_name: '支付宝网页' },
        { key: 'adapay', display_name: '汇付天下' },
        { key: 'yeepay_bank', display_name: '易宝银行卡快捷' },
        { key: 'ysepay_bank_bind', display_name: '银盛银行卡绑卡' },
        { key: 'ysepay', display_name: '银盛支付宝' },
        { key: 'iospay', display_name: 'iOS内购（暂不可用）' },
        { key: 'allinpay', display_name: '通联支付收银宝' }
      ],
      delLoading: false,
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
      this.url = 'api/payset'
      const sort = 'create_time,desc'
      this.params = { page: this.page, size: this.size, sort: sort, channelName: this.query.channelName}
      return true
    },
    subDelete(id) {
      this.delLoading = true
      del(id).then(res => {
        this.delLoading = false
        this.$refs[id].doClose()
        this.dleChangePage()
        this.init()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        this.$refs[id].doClose()
        console.log(err.response.data.message)
      })
    },
    add() {
      this.isAdd = true
      this.$refs.form.dialog = true
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.form = data
      _this.dialog = true
    },
    async config() {
      const _this = this.$refs.formconfig
      _this.form = await getAppPayConfig();
      _this.dialog = true
    }
  }
}
</script>

<style scoped>

</style>
