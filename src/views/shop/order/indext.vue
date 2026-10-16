<template>
  <div class="app-container finance-page order-page">

    <div class="finance-filters order-status-filters">
    <el-tabs v-model="status" type="card" @tab-click="handleOrder">
      <el-tab-pane name="-9">
        <template #label><el-icon><List /></el-icon> 全部订单</template>
      </el-tab-pane>
      <el-tab-pane name="0">
        <template #label><el-icon><Wallet /></el-icon> 未支付</template>
      </el-tab-pane>
      <el-tab-pane name="1">
        <template #label><el-icon><Refrigerator /></el-icon> 待核销</template>
      </el-tab-pane>
      <el-tab-pane name="3">
        <template #label><el-icon><Document /></el-icon> 待评价</template>
      </el-tab-pane>
      <el-tab-pane name="4">
        <template #label><el-icon><CircleCheck /></el-icon> 交易完成</template>
      </el-tab-pane>
      <el-tab-pane name="-1">
        <template #label><el-icon><Back /></el-icon> 退款中</template>
      </el-tab-pane>
      <el-tab-pane name="-2">
        <template #label><el-icon><Finished /></el-icon> 已退款</template>
      </el-tab-pane>
    </el-tabs>
    </div>
    <!--工具栏-->
    <div class="head-container finance-filters">
      <!-- 搜索 -->
      <el-input v-model="query.value" clearable placeholder="输入搜索内容" style="width: 200px;" class="filter-item" @keyup.enter="toQuery" />
      <el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 130px">
        <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-select v-model="storeId" clearable placeholder="选择门店" class="filter-item" style="width: 130px">
        <el-option v-for="item in storeList" :key="item.key" :label="item.name" :value="item.id" />
      </el-select>
      <el-button class="filter-item" size="small" type="success" @click="toQuery"><el-icon><Search /></el-icon>搜索</el-button>
      <el-button
        type="danger"
        class="filter-item"
        size="small"
       
        @click="toQuery"
      ><el-icon><Refresh /></el-icon>刷新</el-button>

      <!-- 新增 -->
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd" />
    <eDetail ref="form1" :is-add="isAdd" />
    <eRefund ref="form2" :is-add="isAdd" />
    <editOrder ref="form3" :is-add="isAdd" />
    <eRemark ref="form4" :is-add="isAdd" />
    <!--表格渲染-->
    <el-table class="finance-table order-table" v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column prop="storeName" label="所属门店" />
      <el-table-column prop="orderId" width="180" label="订单号">
        <template #default="scope">
          <span>{{ scope.row.orderId }}</span>
          <p>{{ scope.row.pinkName }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="realName" label="用户姓名" />
      <el-table-column prop="cartInfoList" width="300" label="商品信息">
        <template #default="scope">
          <!-- Vue3 中 v-if 优先级高于 v-for，同元素混用会拿不到 item；须用 template 承载 v-for -->
          <template v-for="(item,index) in scope.row.cartInfoList" :key="index">
            <div v-if="item.cartInfoMap && item.cartInfoMap.productInfo && item.cartInfoMap.productInfo.attrInfo">
              <span>
                <img
                  style="width: 30px;height: 30px;margin:0;cursor: pointer;"
                  :src="item.cartInfoMap.productInfo.attrInfo.image"
                >
              </span>
              <span>{{ item.cartInfoMap.productInfo.storeName }}&nbsp;{{ item.cartInfoMap.productInfo.attrInfo.sku }}</span>
              <span> | ￥{{ item.cartInfoMap.truePrice }}×{{ item.cartInfoMap.cartNum }}</span>
            </div>
            <div v-else>
              <span><img
                style="width: 30px;height: 30px;margin:0;cursor: pointer;"
                :src="item.cartInfoMap.productInfo.image"
              ></span>
              <span>{{ item.cartInfoMap.productInfo.storeName }}</span>
              <span> | ￥{{ item.cartInfoMap.truePrice }}×{{ item.cartInfoMap.cartNum }}</span>
            </div>
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="payIntegral" label="实际支付(积分)" />
      <el-table-column prop="payTypeName" label="支付状态" />
      <el-table-column prop="statusName" label="订单状态">
        <template #default="scope">
          <span v-html="scope.row.statusName"></span>
        </template>
      </el-table-column>
      <el-table-column prop="addTime" width="160" label="创建时间">
        <template #default="scope">
          <span>{{ formatTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="table-icon-column" v-if="checkPermission(['admin','MWSTOREORDER_ALL','MWSTOREORDER_EDIT','MWSTOREORDER_DELETE'])" label="操作" width="200" align="center" fixed="right">
        <template #default="scope">
          <el-button
            v-permission="['admin','MWSTOREORDER_ALL','MWSTOREORDER_EDIT']"
            size="small"
            type="primary"
            @click="detail(scope.row)"
          >
            订单详情</el-button>
          <el-dropdown size="small" split-button type="primary" trigger="click">
            操作
            <template #dropdown><el-dropdown-menu>
              <el-dropdown-item>
                <el-button
                  v-permission="['admin','MWSTOREORDER_ALL','MWSTOREORDER_EDIT']"
                  size="small"
                  type="success"
                  @click="remark(scope.row)"
                >
                  订单备注</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button
                  v-if="scope.row._status == 2"
                  v-permission="['admin','MWSTOREORDER_ALL','MWSTOREORDER_EDIT']"
                  size="small"
                  type="primary"
                  @click="edit(scope.row)"
                >
                  订单核销</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button
                  v-if="scope.row._status == 3"
                  v-permission="['admin','MWSTOREORDER_ALL','MWSTOREORDER_EDIT']"
                  size="small"
                  type="primary"
                  @click="refund(scope.row)"
                >
                  立刻退款</el-button>
              </el-dropdown-item>
              <el-dropdown-item v-if="scope.row._status == 1">
                <el-button
                  v-permission="['admin','MWSTOREORDER_ALL','MWSTOREORDER_EDIT']"
                  size="small"
                  type="primary"
                  @click="editOrder(scope.row)"
                >
                  修改订单</el-button>
              </el-dropdown-item>
              <el-dropdown-item v-if="scope.row._status == 1">
                <el-popover trigger="click"
                  :ref="scope.row.id"
                  placement="top"
                  width="180"
                >
                  <p>确定删除本条数据吗？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="small" link @click="$refs[scope.row.id].hide()">取消</el-button>
                    <el-button :loading="delLoading" type="primary" size="small" @click="subDelete(scope.row.id)">确定</el-button>
                  </div>
                  <template #reference><el-button title="删除" aria-label="删除" class="table-icon-action" v-permission="['admin','MWSTOREORDER_ALL','MWSTOREORDER_DELETE']" type="danger" size="small"><el-icon><Delete /></el-icon></el-button></template>
                </el-popover>
              </el-dropdown-item>
            </el-dropdown-menu>
            </template>
</el-dropdown>

        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      class="finance-pagination"
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
import { ElNotification } from 'element-plus'
import checkPermission from '@/utils/permission.js'
import initData from '@/mixins/crud.js'
import { del } from '@/api/mwStoreOrder.js'
import { getAll } from '@/api/mwSystemStore.js'
import eForm from './formC.vue'
import eDetail from './detail1.vue'
import eRefund from './refund.vue'
import editOrder from './edit.vue'
import eRemark from './remark.vue'
import { formatTime } from '@/utils/index.js'
export default {
  components: { eForm, eDetail, eRefund, editOrder, eRemark },
  mixins: [initData],
  data() {
    return {
      delLoading: false, status: '-9', orderType: '0', storeList: [] , storeId: null,
      queryTypeOptions: [
        { key: 'orderId', display_name: '订单号' },
        { key: 'realName', display_name: '用户姓名' },
        { key: 'userPhone', display_name: '用户电话' }
      ],
      statusOptions: [
        { value: '0', label: '未支付' },
        { value: '1', label: '未发货' },
        { value: '2', label: '待收货' },
        { value: '3', label: '待评价' },
        { value: '4', label: '交易完成' },
        // { value: '5', label: '待核销' },
        { value: '-1', label: '退款中' },
        { value: '-2', label: '已退款' },
        { value: '-4', label: '已删除' }
      ]
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
    this.getStoreAll()
  },
  methods: {
    getStoreAll() {
      getAll().then(res => {
          this.storeList = res
      })
    },
    formatTime,
    checkPermission,
    handleOrder(tab, event) {
      // Element Plus 的 tab-click 回调参数是 pane 上下文，name 在 paneName 上（Vue2 里才是 tab.name）
      this.status = tab.paneName
      this.toQuery()
    },
    beforeInit() {
      this.url = 'api/mwStoreOrder'
      const sort = 'id,desc'
      this.params = { page: this.page, size: this.size, sort: sort, orderStatus: this.status, orderType: 5, storeId: this.storeId }
      const query = this.query
      const type = query.type
      const value = query.value
      if (type && value) { this.params[type] = value }
      return true
    },
    subDelete(id) {
      this.delLoading = true
      del(id).then(res => {
        this.delLoading = false
        this.$refs[id].hide()
        this.dleChangePage()
        this.init()
        ElNotification({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        this.$refs[id].hide()
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
      _this.form = {
        id: data.id,
        orderId: data.orderId,
        uid: data.uid,
        realName: data.realName,
        userPhone: data.userPhone,
        userAddress: data.userAddress,
        cartId: data.cartId,
        freightPrice: data.freightPrice,
        totalNum: data.totalNum,
        totalPrice: data.totalPrice,
        totalPostage: data.totalPostage,
        payPrice: data.payPrice,
        payPostage: data.payPostage,
        deductionPrice: data.deductionPrice,
        couponId: data.couponId,
        couponPrice: data.couponPrice,
        paid: data.paid,
        payTime: data.payTime,
        payType: data.payType,
        addTime: data.addTime,
        status: data.status,
        refundStatus: data.refundStatus,
        refundReasonWapImg: data.refundReasonWapImg,
        refundReasonWapExplain: data.refundReasonWapExplain,
        refundReasonTime: data.refundReasonTime,
        refundReasonWap: data.refundReasonWap,
        refundReason: data.refundReason,
        refundPrice: data.refundPrice,
        deliveryName: data.deliveryName,
        deliveryType: data.deliveryType,
        deliveryId: data.deliveryId,
        gainIntegral: data.gainIntegral,
        useIntegral: data.useIntegral,
        backIntegral: data.backIntegral,
        mark: data.mark,
        isDel: data.isDel,
        unique: data.unique,
        remark: data.remark,
        merId: data.merId,
        isMerCheck: data.isMerCheck,
        combinationId: data.combinationId,
        pinkId: data.pinkId,
        cost: data.cost,
        seckillId: data.seckillId,
        bargainId: data.bargainId,
        verifyCode: data.verifyCode,
        storeId: data.storeId,
        shippingType: data.shippingType,
        isChannel: data.isChannel,
        isRemind: data.isRemind,
        isSystemDel: data.isSystemDel
      }
      _this.dialog = true
    },
    editOrder(data) {
      this.isAdd = false
      const _this = this.$refs.form3
      _this.form = {
        payIntegral: data.payIntegral,
        id: data.id,
        orderId: data.orderId,
        uid: data.uid,
        realName: data.realName,
        userPhone: data.userPhone,
        userAddress: data.userAddress,
        cartId: data.cartId,
        freightPrice: data.freightPrice,
        totalNum: data.totalNum,
        totalPrice: data.totalPrice,
        totalPostage: data.totalPostage,
        payPrice: data.payPrice,
        payPostage: data.payPostage,
        deductionPrice: data.deductionPrice,
        couponId: data.couponId,
        couponPrice: data.couponPrice,
        paid: data.paid,
        payTime: data.payTime,
        payType: data.payType,
        addTime: data.addTime,
        status: data.status,
        refundStatus: data.refundStatus,
        refundReasonWapImg: data.refundReasonWapImg,
        refundReasonWapExplain: data.refundReasonWapExplain,
        refundReasonTime: data.refundReasonTime,
        refundReasonWap: data.refundReasonWap,
        refundReason: data.refundReason,
        refundPrice: data.refundPrice,
        deliveryName: data.deliveryName,
        deliveryType: data.deliveryType,
        deliveryId: data.deliveryId,
        gainIntegral: data.gainIntegral,
        useIntegral: data.useIntegral,
        backIntegral: data.backIntegral,
        mark: data.mark,
        isDel: data.isDel,
        unique: data.unique,
        remark: data.remark,
        merId: data.merId,
        isMerCheck: data.isMerCheck,
        combinationId: data.combinationId,
        pinkId: data.pinkId,
        cost: data.cost,
        seckillId: data.seckillId,
        bargainId: data.bargainId,
        verifyCode: data.verifyCode,
        storeId: data.storeId,
        shippingType: data.shippingType,
        isChannel: data.isChannel,
        isRemind: data.isRemind,
        isSystemDel: data.isSystemDel
      }
      _this.dialog = true
    },
    remark(data) {
      this.isAdd = false
      const _this = this.$refs.form4
      _this.form = {
        id: data.id,
        orderId: data.orderId,
        uid: data.uid,
        realName: data.realName,
        userPhone: data.userPhone,
        userAddress: data.userAddress,
        cartId: data.cartId,
        freightPrice: data.freightPrice,
        totalNum: data.totalNum,
        totalPrice: data.totalPrice,
        totalPostage: data.totalPostage,
        payPrice: data.payPrice,
        payPostage: data.payPostage,
        deductionPrice: data.deductionPrice,
        couponId: data.couponId,
        couponPrice: data.couponPrice,
        paid: data.paid,
        payTime: data.payTime,
        payType: data.payType,
        addTime: data.addTime,
        status: data.status,
        refundStatus: data.refundStatus,
        refundReasonWapImg: data.refundReasonWapImg,
        refundReasonWapExplain: data.refundReasonWapExplain,
        refundReasonTime: data.refundReasonTime,
        refundReasonWap: data.refundReasonWap,
        refundReason: data.refundReason,
        refundPrice: data.refundPrice,
        deliveryName: data.deliveryName,
        deliveryType: data.deliveryType,
        deliveryId: data.deliveryId,
        gainIntegral: data.gainIntegral,
        useIntegral: data.useIntegral,
        backIntegral: data.backIntegral,
        mark: data.mark,
        isDel: data.isDel,
        unique: data.unique,
        remark: data.remark,
        merId: data.merId,
        isMerCheck: data.isMerCheck,
        combinationId: data.combinationId,
        pinkId: data.pinkId,
        cost: data.cost,
        seckillId: data.seckillId,
        bargainId: data.bargainId,
        verifyCode: data.verifyCode,
        storeId: data.storeId,
        shippingType: data.shippingType,
        isChannel: data.isChannel,
        isRemind: data.isRemind,
        isSystemDel: data.isSystemDel
      }
      _this.dialog = true
    },
    refund(data) {
      this.isAdd = false
      const _this = this.$refs.form2
      _this.form = {
        id: data.id,
        orderId: data.orderId,
        uid: data.uid,
        realName: data.realName,
        userPhone: data.userPhone,
        userAddress: data.userAddress,
        cartId: data.cartId,
        freightPrice: data.freightPrice,
        totalNum: data.totalNum,
        totalPrice: data.totalPrice,
        totalPostage: data.totalPostage,
        payPrice: data.payPrice,
        payPostage: data.payPostage,
        deductionPrice: data.deductionPrice,
        couponId: data.couponId,
        couponPrice: data.couponPrice,
        paid: data.paid,
        payTime: data.payTime,
        payType: data.payType,
        addTime: data.addTime,
        status: data.status,
        refundStatus: data.refundStatus,
        refundReasonWapImg: data.refundReasonWapImg,
        refundReasonWapExplain: data.refundReasonWapExplain,
        refundReasonTime: data.refundReasonTime,
        refundReasonWap: data.refundReasonWap,
        refundReason: data.refundReason,
        refundPrice: data.refundPrice,
        deliveryName: data.deliveryName,
        deliveryType: data.deliveryType,
        deliveryId: data.deliveryId,
        gainIntegral: data.gainIntegral,
        useIntegral: data.useIntegral,
        backIntegral: data.backIntegral,
        mark: data.mark,
        isDel: data.isDel,
        unique: data.unique,
        remark: data.remark,
        merId: data.merId,
        isMerCheck: data.isMerCheck,
        combinationId: data.combinationId,
        pinkId: data.pinkId,
        cost: data.cost,
        seckillId: data.seckillId,
        bargainId: data.bargainId,
        verifyCode: data.verifyCode,
        storeId: data.storeId,
        shippingType: data.shippingType,
        isChannel: data.isChannel,
        isRemind: data.isRemind,
        isSystemDel: data.isSystemDel
      }
      _this.dialog = true
    },
    detail(data) {
      this.isAdd = false
      const _this = this.$refs.form1
      _this.form = {
        payIntegral: data.payIntegral,
        id: data.id,
        orderId: data.orderId,
        payTypeName: data.payTypeName,
        statusName: data.statusName,
        uid: data.uid,
        realName: data.realName,
        userPhone: data.userPhone,
        userAddress: data.userAddress,
        cartId: data.cartId,
        freightPrice: data.freightPrice,
        totalNum: data.totalNum,
        totalPrice: data.totalPrice,
        totalPostage: data.totalPostage,
        payPrice: data.payPrice,
        payPostage: data.payPostage,
        deductionPrice: data.deductionPrice,
        couponId: data.couponId,
        couponPrice: data.couponPrice,
        paid: data.paid,
        payTime: data.payTime,
        payType: data.payType,
        createTime: data.createTime,
        status: data.status,
        refundStatus: data.refundStatus,
        refundReasonWapImg: data.refundReasonWapImg,
        refundReasonWapExplain: data.refundReasonWapExplain,
        refundReasonTime: data.refundReasonTime,
        refundReasonWap: data.refundReasonWap,
        refundReason: data.refundReason,
        refundPrice: data.refundPrice,
        deliveryName: data.deliveryName,
        deliveryType: data.deliveryType,
        deliveryId: data.deliveryId,
        gainIntegral: data.gainIntegral,
        useIntegral: data.useIntegral,
        backIntegral: data.backIntegral,
        mark: data.mark,
        isDel: data.isDel,
        unique: data.unique,
        remark: data.remark,
        merId: data.merId,
        isMerCheck: data.isMerCheck,
        combinationId: data.combinationId,
        pinkId: data.pinkId,
        cost: data.cost,
        seckillId: data.seckillId,
        bargainId: data.bargainId,
        verifyCode: data.verifyCode,
        storeId: data.storeId,
        shippingType: data.shippingType,
        isChannel: data.isChannel,
        isRemind: data.isRemind,
        isSystemDel: data.isSystemDel,
        nickname: data.userDTO.nickname
      }
      _this.dialog = true
    }
  }
}
</script>

<style scoped>

</style>
