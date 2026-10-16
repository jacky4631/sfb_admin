<template>
  <div class="app-container order-page">
    <div class="container order-content">

      <el-tabs v-model="status" type="card" class="order-tabs" @tab-click="handleOrder">
        <el-tab-pane name="-9">
          <template #label><el-icon><List /></el-icon> 全部订单</template>
        </el-tab-pane>
        <el-tab-pane name="0">
          <template #label><el-icon><Wallet /></el-icon> 未支付</template>
        </el-tab-pane>
        <el-tab-pane name="1">
          <template #label><el-icon><Refrigerator /></el-icon> 未发货</template>
        </el-tab-pane>
        <el-tab-pane name="2">
          <template #label><el-icon><Van /></el-icon> 待收货</template>
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
      <!--工具栏-->
      <div class="head-container order-filters">

        <!-- 搜索 -->
        <el-input v-model="query.value" clearable placeholder="输入搜索内容" style="width: 200px;" class="filter-item" @keyup.enter="toQuery" />
        <el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 130px">
          <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
        <el-select v-model="orderType" clearable placeholder="订单类型" class="filter-item" style="width: 130px">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-date-picker
          v-model="createTime"
          :default-time="['00:00:00','23:59:59']"
          type="daterange"
          range-separator=":"
          size="small"
          class="date-item"
          value-format="YYYY-MM-DD HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
        <el-button class="filter-item" size="small" type="success" @click="toQuery"><el-icon><Search /></el-icon>搜索</el-button>
        <!-- 新增 -->
        <el-button
          type="danger"
          class="filter-item"
          size="small"
         
          @click="toQuery"
        ><el-icon><Refresh /></el-icon>刷新</el-button>
      </div>
      <!--表单组件-->
      <eForm ref="form" :is-add="isAdd" />
      <eDetail ref="form1" :is-add="isAdd" />
      <eRefund ref="form2" :is-add="isAdd" />
      <editOrder ref="form3" :is-add="isAdd" />
      <eRemark ref="form4" :is-add="isAdd" />
      <ePrint ref="form5" :is-add="isAdd" :print-list="checkList" :to-query="toQuery"/>

      <!--订单数据统计-->
      <div class="order-caculate order-summary">
        <a class="caculate-title">订单数 : <span class="caculate-num">{{caculateInfo.orderNum}}</span></a>
        <a class="caculate-title">商品数 : <span class="caculate-num">{{caculateInfo.storeNum}}</span></a>
        <a class="caculate-title">订单金额 : <span class="caculate-num">{{caculateInfo.orderPrice}}</span></a>
        <a class="caculate-title">客户数 : <span class="caculate-num">{{caculateInfo.userNum}}</span></a>
      </div>

      <!--表格渲染-->
      <el-table ref="multipleTable" height="100%" class="order-table" v-loading="loading" :data="data" size="small" style="width: 100%;" @selection-change="handleSelectionChange">
        <el-table-column :selectable="checkboxT" type="selection" width="50" />
        <el-table-column prop="orderId" width="160" label="订单号">
          <template #default="scope">
            <span>{{ scope.row.orderId }}</span>
            <p>{{ scope.row.pinkName }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="realName" label="用户昵称" >
          <template #default="scope">
            <span>{{ scope.row.userDTO.nickname }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="cartInfoList" width="300" label="商品信息">
          <template #default="scope">
            <!-- <div v-for="(item,index) in scope.row.cartInfoList"
            :key="index"
            v-if="item.cartInfoMap.productInfo.attrInfo">
              <span>
                <img style="width: 30px;height: 30px;margin:0;cursor: pointer;"
                  :src="item.cartInfoMap.productInfo.attrInfo.image"
                >
              </span>
              <span>{{ item.cartInfoMap.productInfo.storeName }}&nbsp;{{ item.cartInfoMap.productInfo.attrInfo.suk }}</span>
              <span> | ￥{{ item.cartInfoMap.truePrice }}×{{ item.cartInfoMap.cartNum }}</span>
            </div>
            <div v-else>
              <span>
                <img
                style="width: 30px;height: 30px;margin:0;cursor: pointer;"
                :src="item.cartInfoMap.productInfo.image">
              </span>
              <span>{{ item.cartInfoMap.productInfo.storeName }}</span>
              <span> | ￥{{ item.cartInfoMap.truePrice }}×{{ item.cartInfoMap.cartNum }}</span>
            </div> -->
            <div v-for="(item,index) in scope.row.cartInfoList"
            :key="index">
                <span v-if="item.cartInfoMap.productInfo.attrInfo">
                  <img style="width: 30px;height: 30px;margin:0;cursor: pointer;"
                    :src="item.cartInfoMap.productInfo.attrInfo.image"
                  >
                </span>
                <span v-else>
                  <img
                  style="width: 30px;height: 30px;margin:0;cursor: pointer;"
                  :src="item.cartInfoMap.productInfo.image">
                </span>
                <span>
                  {{ item.cartInfoMap.productInfo.storeName }}
                  <span v-if="item.cartInfoMap.productInfo.attrInfo">&nbsp;{{ item.cartInfoMap.productInfo.attrInfo.sku }}</span>
                </span>
                <span> | ￥{{ item.cartInfoMap.truePrice }}×{{ item.cartInfoMap.cartNum }}</span>
            </div>
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
        <el-table-column v-if="checkPermission(['admin','MWSTOREORDER_ALL','MWSTOREORDER_EDIT','MWSTOREORDER_DELETE'])" label="操作" width="200" align="center" fixed="right">
          <template #default="scope">
            <el-button
              v-permission="['admin','MWSTOREORDER_ALL','MWSTOREORDER_EDIT']"
              size="small"
              type="primary"
              @click="toDetailURL(scope.row.id)"
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
                    去发货</el-button>
                  <el-button
                    v-if="scope.row._status == 4"
                    v-permission="['admin','MWSTOREORDER_ALL','MWSTOREORDER_EDIT']"
                    size="small"
                    type="primary"
                    @click="edit(scope.row)"
                  >
                    修改快递</el-button>
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
                  <el-popover
                    :ref="scope.row.id"
                    placement="top"
                    width="180"
                  >
                    <p>确定删除本条数据吗？</p>
                    <div style="text-align: right; margin: 0">
                      <el-button size="small" link @click="$refs[scope.row.id].hide()">取消</el-button>
                      <el-button :loading="delLoading" type="primary" size="small" @click="subDelete(scope.row.id)">确定</el-button>
                    </div>
                    <template #reference><el-button v-permission="['admin','MWSTOREORDER_ALL','MWSTOREORDER_DELETE']" type="danger" size="small"><el-icon><Delete /></el-icon>删除</el-button></template>
                  </el-popover>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
</el-dropdown>

          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--添加订单打印及订单导出功能 2020.04.13 changxh-->
    <el-footer class="footer-contains">
      <div class="footer-search">
        <el-checkbox v-model="printChecked" @change="batchSelection" style="margin-right: 20px;"></el-checkbox>
        <el-select v-model="batchHandle" @change="handlePrintOption" clearable placeholder="批量操作" class="filter-item" style="width: 130px; margin-right: 8px;">
          <el-option
            v-for="item in handleOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select v-model="batchExport" @change="handleExportOption" clearable placeholder="批量导出" class="filter-item" style="width: 130px">
          <el-option
            v-for="item in exportOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <!--分页组件-->
      <el-pagination
        :total="total"
        :current-page="page + 1"
        style="margin-top: 8px;"
        layout="total, prev, pager, next, sizes"
        @size-change="sizeChange"
        @current-change="pageChange" />
    </el-footer>
  </div>
</template>

<script>
import { ElNotification, ElMessage } from 'element-plus'
  import checkPermission from '@/utils/permission.js'
  import initData from '@/mixins/crud.js'
  import { del } from '@/api/mwStoreOrder.js'
  import eForm from './form.vue'
  import eDetail from './detail1.vue'
  import eRefund from './refund.vue'
  import editOrder from './edit.vue'
  import eRemark from './remark.vue'
  import ePrint from './print.vue'
  import { formatTime } from '@/utils/index.js'
  import { gett } from '@/api/visits.js'

  export default {
    components: { eForm, eDetail, eRefund, editOrder, eRemark, ePrint },
    mixins: [initData],
    data() {
      return {
        delLoading: false,
        status: '-9',
        orderType: '0',
        createTime: '',
        checkList: [],
        printChecked: false,
        batchHandle: '',
        batchExport: '',
        listContent: [],
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
        ],
        typeOptions: [
          { value: '0', label: '所有订单' },
          { value: '1', label: '普通订单' },
          { value: '2', label: '拼团订单' },
          { value: '3', label: '秒杀订单' },
          { value: '4', label: '砍价订单' },
          { value: '5', label: '核销订单' },
          { value: '6', label: '积分订单' }
        ],
        handleOptions: [
          {value: '', label: '批量操作'},
          {value: '0', label: '批量打印'},
        ],
        exportOptions: [
          {value: '', label: '批量导出'},
          {value: '0', label: '导出全部'},
          {value: '1', label: '导出选中'},
        ],
        caculateInfo: {
          orderNum : 0,
          storeNum : 0,
          orderPrice : 0,
          userNum : 0,
        },
      }
    },
    created() {
      this.$nextTick(() => {
        this.init()
      })
    },
    methods: {
      toDetailURL(id){
        this.$router.push({ path: '/order/detail/'+id })
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
        this.params = {
          page: this.page,
          size: this.size,
          sort: sort,
          orderStatus: this.status,
          orderType: this.orderType,
          createTime: this.createTime,
          listContent: this.listContent
        }
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
          deliverySn: data.deliverySn,
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
          _status:data._status
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
          deliverySn: data.deliverySn,
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
      },
      getCaculateInfo(){
        gett().then(res => {
          this.caculateInfo = {
            orderPrice : res.priceCount,
            orderNum : res.orderCount,
            storeNum : res.goodsCount,
            userNum : res.userCount,
          };
        })
      },
      clearCaculateInfo(){
        this.caculateInfo = {
          orderPrice : 0,
          storeNum : 0,
          orderNum : 0,
          userNum : 0,
        };
      },
      handleSelectionChange(val) {
        this.checkList = val;
        let orderPrice = 0, storeNum = 0, orderNum = 0, userNum = 0;
        if(val.length !=0 ){
          this.printChecked = true;
          let user = [];
          val.forEach((item,index)=>{
            orderNum += 1;
            orderPrice += item.totalPrice;
            storeNum += item.totalNum;
            user.push(item.userDTO.nickname);
          })
          user = Array.from(new Set(user));
          this.caculateInfo = {
            orderPrice : orderPrice.toFixed(2),
            storeNum : storeNum,
            orderNum : orderNum,
            userNum : user.length,
          };
        }else {
          this.printChecked = false;
          this.clearCaculateInfo();
          // this.getCaculateInfo();
        }
      },
      batchSelection(val){
        let rows = this.data;
        if (val) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      // 导出选中
      handlePrintOption(val){
        switch (val) {
          case '0':
            this.getPrintList();
            this.batchHandle = '';
            break;
          default:
            break;
        }
      },
      handleExportOption(val){
        let list = this.checkList;
        this.page = 0;
        this.size = 10000;
        switch (val) {
          case "0":
            this.listContent = "";
            this.beforeInit();
            this.downloadMethod();
            break;
          case "1":
            if(list.length == 0){
              ElMessage({
                message: '请选择订单',
                type: 'warning'
              });
            }else {
              this.listContent = [];
              list.forEach((item) => {
                this.listContent.push(item.orderId);
              })
              this.listContent = JSON.stringify(this.listContent);
              this.beforeInit();
              this.downloadMethod();
            }
            break;
          default:
            break;
        }
        this.batchExport = "";
      },
      getPrintList(){
        let list = this.checkList;
        if(list.length == 0){
          ElMessage({
            message: '请选择订单',
            type: 'warning'
          });
        }else {
          const _this = this.$refs.form5;
          _this.dialog = true
        }
      },
      checkboxT(row, rowIndex) {
        return row.id !== 1
      },
    }
  }
</script>

<style scoped lang="scss">
  .container {
    height: calc(100% - 80px);
    position: absolute;
    overflow: auto;
    width: calc(100% - 20px);

    .order-caculate {
      font-size: 14px;
      color: #909399;
      border-top: 1px solid #f0f0f0;
      padding: 20px 10px;
      .caculate-title {
        display: inline-block;
        margin-right: 50px;
      }
      .caculate-num {
        font-size: 20px;
        color: #ff4949;
      }
    }

    .el-table th {
      background-color: #fafafa;
    }
  }

  .footer-contains {
    position: absolute;
    display: -ms-flexbox;
    display: flex;
    background-color: #f6f6f6;
    bottom: 0;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    z-index: 999;
    padding: 0 20px 0 13px;
  }

  /*打印单样式编辑*/
  .order-list {
    /*  height: 297mm;*/
    margin: 0 auto;
    width: 210mm;

    .order-title {
      height: 16mm;
      line-height: 16mm;
      font-size: 8mm;
      font-weight: bolder;
      text-align: center;
    }
    .order-info {
      span {
        display: inline-block;
        padding: 0 0 10px 0;
        font-size: 3mm;
      }
      span.info {
        width: 60mm;
      }
    }
    .el-table--small th, .el-table--small td {
      padding: 4px 0;
    }
  }

  .order-page { display:flex; flex-direction:column; gap:10px; height:calc(100vh - 117px); box-sizing:border-box; padding:12px; background:#f4f6f9; }
  .order-page .order-content { position:static; display:flex; flex:1; flex-direction:column; gap:10px; width:100%; height:auto; min-height:0; overflow:hidden; }
  .order-page :deep(.order-tabs), .order-page .order-filters, .order-page .order-summary, .order-page :deep(.order-table) { background:#fff; border:1px solid #e8edf4; border-radius:10px; box-shadow:0 2px 8px rgba(31,45,61,.04); }
  .order-page :deep(.order-tabs) { flex:none; margin:0; padding:0 12px; }
  .order-page :deep(.order-tabs .el-tabs__header) { margin:0; border-bottom:0; }
  .order-page :deep(.order-tabs .el-tabs__nav) { border:0; }
  .order-page :deep(.order-tabs .el-tabs__item) { height:42px; border:0; color:#667085; }
  .order-page :deep(.order-tabs .el-tabs__item.is-active) { color:#409eff; font-weight:600; }
  .order-page :deep(.order-tabs .el-tabs__content) { display:none; }
  .order-page .order-filters { display:flex; flex:none; flex-wrap:wrap; align-items:center; gap:8px; margin:0; padding:10px; }
  .order-page .order-filters :deep(.filter-item), .order-page .order-filters :deep(.date-item) { margin:0; }
  .order-page .order-summary { flex:none; padding:10px 14px; margin:0; border-top:1px solid #e8edf4; color:#667085; }
  .order-page .order-summary .caculate-title { margin-right:32px; }
  .order-page .order-summary .caculate-num { color:#303133; font-size:18px; font-weight:600; }
  .order-page :deep(.order-table) { flex:1; min-height:380px; overflow:hidden; padding:4px 12px 12px; box-sizing:border-box; }
  .order-page :deep(.order-table .el-table__inner-wrapper::before) { display:none; }
  .order-page :deep(.order-table th.el-table__cell) { height:40px; background:#f7f9fc; color:#667085; font-weight:600; }
  .order-page :deep(.order-table td.el-table__cell) { padding:4px 0; }
  .order-page .footer-contains { position:static; flex:none; min-height:48px; border:1px solid #e8edf4; border-radius:10px; background:#fff; box-shadow:0 2px 8px rgba(31,45,61,.04); }
  @media (max-width:768px) { .order-page{height:auto;min-height:calc(100vh - 117px);padding:10px}.order-page .order-content{overflow:visible}.order-page :deep(.order-table){min-height:420px}.order-page .footer-contains{flex-wrap:wrap;gap:8px;padding:10px} }
</style>
