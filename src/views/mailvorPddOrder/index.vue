<template>
  <div class="app-container order-page">
    <div class="container order-content">

      <el-tabs v-model="status" type="card" class="order-tabs" @tab-click="handleOrder">
        <el-tab-pane name="">
          <template #label><el-icon><Tickets /></el-icon> 全部订单</template>
        </el-tab-pane>
        <el-tab-pane name="4">
          <template #label><el-icon><CreditCard /></el-icon> 审核失败</template>
        </el-tab-pane>
        <el-tab-pane name="3">
          <template #label><el-icon><Refrigerator /></el-icon> 审核成功</template>
        </el-tab-pane>
        <el-tab-pane name="5">
          <template #label><el-icon><Van /></el-icon> 已经结算</template>
        </el-tab-pane>
        <el-tab-pane name="2">
          <template #label><el-icon><Document /></el-icon> 确认收货</template>
        </el-tab-pane>
        <el-tab-pane name="-1">
          <template #label><el-icon><Refrigerator /></el-icon> 未支付</template>
        </el-tab-pane>
        <el-tab-pane name="1">
          <template #label><el-icon><Document /></el-icon> 已成团</template>
        </el-tab-pane>
      </el-tabs>
      <!--工具栏-->
      <div class="head-container order-filters">

        <!-- 搜索 -->
        <el-input v-model="query.value" clearable placeholder="输入搜索内容" style="width: 200px;" class="filter-item" @keyup.enter="toQuery" />
        <el-input v-model="query.uid" clearable placeholder="输入用户id" style="width: 200px;" class="filter-item" @keyup.enter="toQuery" />
        <el-select v-model="innerType" clearable placeholder="订单类型" class="filter-item" style="width: 130px">
          <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
        <el-select v-model="bind" clearable placeholder="是否拆红包" class="filter-item" style="width: 130px">
          <el-option v-for="item in bindOptions" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
        <el-date-picker
          v-model="orderCreateTime"
          :default-time="['00:00:00','23:59:59']"
          type="daterange"
          range-separator=":"
          size="small"
          class="date-item"
          value-format="YYYY-MM-DD HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
        <el-button class="filter-item" size="small" type="success" :icon="Search" @click="toQuery">搜索</el-button>
        <!-- 新增 -->
        <el-button
          type="danger"
          class="filter-item"
          size="small"
          :icon="Refresh"
          @click="toQuery"
        >刷新</el-button>
      </div>
      <!--表单组件-->
      <editOrder ref="form3" :is-add="isAdd" @refresh="init" />

      <!--表格渲染-->
      <el-table ref="multipleTable" height="100%" class="order-table" v-loading="loading" :data="data" size="small" style="width: 100%;" @selection-change="handleSelectionChange">
        <el-table-column :selectable="checkboxT" type="selection" width="50" />
        <el-table-column prop="orderSn" label="订单编号" fixed width="185" :show-overflow-tooltip="true"/>

        <el-table-column prop="orderCreateTime" label="订单生成时间"  width="150" :show-overflow-tooltip="true">
          <template #default="scope">
            <span>{{ parseTime(scope.row.orderCreateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderStatusDesc" label="订单状态" width="90" >
          <template #default="scope">
            <el-tag v-if="scope.row.orderStatusDesc !== '审核失败'" :type="'success'">{{ scope.row.orderStatusDesc }}</el-tag>
            <el-tag v-else style="cursor: pointer" :type="'warning'">{{ scope.row.orderStatusDesc }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="bind" label="拆红包" width="120">
          <template #default="scope">
            <el-tag v-if="scope.row.bind === 1" style="cursor: pointer" :type="'success'">{{ isBinding(scope.row.bind) }}</el-tag>
            <el-tag v-else-if="scope.row.bind === 0" style="cursor: pointer" type="primary">{{ isBinding(scope.row.bind) }}</el-tag>
            <el-tag v-else style="cursor: pointer" :type="'warning'">{{ isBinding(scope.row.bind) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="promotionAmount" label="预估佣金">
          <template #default="scope">
            {{ scope.row.promotionAmount/100 }}
          </template>
        </el-table-column>
        <el-table-column prop="hb" label="拆红包金额（元）" width="135" />
        <el-table-column prop="innerType" label="热度=2" width="135"/>
        <el-table-column prop="uid" label="用户ID" />
        <el-table-column prop="priceCompareStatus" label="比价=1" />
        <el-table-column prop="goodsName" label="商品名称"  width="100" :show-overflow-tooltip="true"/>
        <el-table-column prop="orderAmount" label="支付金额" >
          <template #default="scope">
            {{ scope.row.orderAmount/100 }}
          </template>
        </el-table-column>
        <el-table-column prop="customParameters" label="自定义参数"  width="100" :show-overflow-tooltip="true"/>
        <el-table-column prop="orderStatus" label="订单状态" />
        <el-table-column prop="goodsId" label="商品ID"  width="150" :show-overflow-tooltip="true"/>
        <el-table-column prop="goodsPrice" label="单件价格" >
          <template #default="scope">
            {{ scope.row.goodsPrice/100 }}
          </template>
        </el-table-column>
        <el-table-column prop="goodsQuantity" label="商品数量" />
        <el-table-column prop="goodsSign" label="goodsSign"  width="100" :show-overflow-tooltip="true"/>
        <el-table-column prop="goodsThumbnailUrl" label="商品缩略图"  width="100" :show-overflow-tooltip="true"/>
        <el-table-column prop="groupId" label="成团编号"  width="170" :show-overflow-tooltip="true"/>
        <el-table-column prop="mallId" label="店铺id"  width="100" :show-overflow-tooltip="true"/>
        <el-table-column prop="mallName" label="店铺名称" width="100" :show-overflow-tooltip="true"/>
        <el-table-column prop="isDirect" label="直推=1" />
        <el-table-column prop="authDuoId" label="多客工具id" />
        <el-table-column prop="bandanRiskConsult" label="代购订单" />
        <el-table-column prop="batchNo" label="结算批次" />
        <el-table-column prop="cashGiftId" label="礼金活动Id" />
        <el-table-column prop="cpaNew" label="新用户=1" />
        <el-table-column prop="failReason" label="失败原因" width="100" :show-overflow-tooltip="true"/>
        <el-table-column prop="goodsCategoryName" label="一级类目"  width="100" :show-overflow-tooltip="true"/>
        <el-table-column prop="noSubsidyReason" label="非补贴原因" />

        <el-table-column prop="orderGroupSuccessTime" label="成团时间"  width="100" :show-overflow-tooltip="true">
          <template #default="scope">
            <span>{{ parseTime(scope.row.orderGroupSuccessTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderModifyAt" label="最后更新时间"  width="100" :show-overflow-tooltip="true">
          <template #default="scope">
            <span>{{ parseTime(scope.row.orderModifyAt) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderPayTime" label="支付时间"  width="100" :show-overflow-tooltip="true">
          <template #default="scope">
            <span>{{ parseTime(scope.row.orderPayTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderReceiveTime" label="确认收货时间"  width="100" :show-overflow-tooltip="true">
          <template #default="scope">
            <span>{{ parseTime(scope.row.orderReceiveTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderSettleTime" label="结算时间"  width="200" :show-overflow-tooltip="true">
          <template #default="scope">
            <span>{{ parseTime(scope.row.orderSettleTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderVerifyTime" label="审核时间"  width="200" :show-overflow-tooltip="true">
          <template #default="scope">
            <span>{{ parseTime(scope.row.orderVerifyTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="pId" label="推广位ID" />
        <el-table-column prop="platformDiscount" label="平台券元" >
          <template #default="scope">
            {{ scope.row.platformDiscount/100 }}
          </template>
        </el-table-column>
        <el-table-column prop="promotionRate" label="佣金比例%" >
          <template #default="scope">
            {{ scope.row.promotionRate/10 }}
          </template>
        </el-table-column>
        <el-table-column prop="redPacketType" label="超红补贴类型" />
        <el-table-column prop="sepDuoId" label="直播推广duoId" />
        <el-table-column prop="sepMarketFee" label="直播推广佣金" />
        <el-table-column prop="sepParameters" label="直播自定参数" />
        <el-table-column prop="sepPid" label="直播间推广位"   width="100" :show-overflow-tooltip="true"/>
        <el-table-column prop="sepRate" label="直播间佣金比" />
        <el-table-column prop="shareAmount" label="招商服务费分" />
        <el-table-column prop="shareRate" label="招商服务费千分比" />
        <el-table-column prop="subsidyAmount" label="渠道补贴金额分" />
        <el-table-column prop="subsidyDuoAmountLevel" label="等级补贴分" />
        <el-table-column prop="subsidyDuoAmountTenMillion" label="官方补贴金额分" />
        <el-table-column prop="subsidyOrderRemark" label="补贴订单备注" />
        <el-table-column prop="subsidyType" label="订单补贴类型" />
        <el-table-column prop="type" label="下单场景类型" />
        <el-table-column prop="zsDuoId" label="招商多多客id" />
        <el-table-column prop="createTime" label="创建时间" :show-overflow-tooltip="true">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="修改时间" :show-overflow-tooltip="true">
          <template #default="scope">
            <span>{{ parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>

        <el-table-column class-name="table-dropdown-actions" v-if="checkPermission(['admin','MWSTOREORDER_ALL','MWSTOREORDER_EDIT','MWSTOREORDER_DELETE'])" label="操作" width="240" align="center" fixed="right">
          <template #default="scope">
            <el-button
              v-permission="['admin','MWSTOREORDER_ALL','MWSTOREORDER_EDIT']"
              size="small"
              type="primary"
              @click="handleEditOrder(scope.row)"
            >
              绑定用户</el-button>
            <el-dropdown size="small" split-button type="primary" trigger="click">
              操作
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item >
                    <el-popover trigger="click"
                      :ref="el => popoverRefs[scope.row.orderSn] = el"
                      placement="top"
                      width="180"
                    >
                      <p>确定删除本条数据吗？</p>
                      <div style="text-align: right; margin: 0">
                        <el-button size="small" link @click="popoverRefs[scope.row.orderSn]?.hide()">取消</el-button>
                        <el-button :loading="delLoading" type="primary" size="small" @click="subDelete([scope.row.orderSn])">确定</el-button>
                      </div>
                      <template #reference>
                        <el-button title="删除" aria-label="删除"  v-permission="['admin','MWSTOREORDER_ALL','MWSTOREORDER_DELETE']" type="danger" :icon="Delete" size="small">删除</el-button>
                      </template>
                    </el-popover>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>

          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-footer class="footer-contains">
      <div class="footer-search">
        <el-checkbox v-model="printChecked" @change="batchSelection" style="margin-right: 20px;"></el-checkbox>
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
        layout="total, prev, pager, next, jumper, sizes"
        @size-change="sizeChange"
        @current-change="pageChange" />
    </el-footer>
  </div>
</template>

<script setup>
import { Search, Refresh, Delete } from '@element-plus/icons-vue'
import { ref, reactive, onMounted } from 'vue'
import { ElNotification } from 'element-plus'
import checkPermission from '@/utils/permission.js'
import { initData, download } from '@/api/data.js'
import { parseTime, downloadFile } from '@/utils/index.js'
import { del } from '@/api/mailvorPddOrder.js'
import editOrder from '../mailvorTbOrder/edit.vue'
import { pddOrderStatusParse, refundStatus, isCash, isBinding } from "@/utils/tk-order-parse.js";

const status = ref('')
const refundTag = ref('')
const search = ref('')
const orderType = ref('0')
const innerType = ref('0')
const bind = ref('')
const orderCreateTime = ref('')
const checkList = ref([])
const printChecked = ref(false)
const batchHandle = ref('')
const batchExport = ref('')
const listContent = ref([])

const delLoading = ref(false)
const loading = ref(true)
const data = ref([])
const page = ref(0)
const size = ref(10)
const total = ref(0)
const url = ref('')
const params = ref({})
const query = ref({})
const isAdd = ref(false)

const multipleTable = ref(null)
const form3 = ref(null)
const popoverRefs = reactive({})

const queryTypeOptions = [
  { key: '0', display_name: '用户订单' },
  { key: '2', display_name: '热度订单' },
]
const bindOptions = [
  { key: '0', display_name: '未拆' },
  { key: '1', display_name: '已拆' },
]
const exportOptions = [
  {value: '', label: '批量导出'},
  {value: '0', label: '导出全部'},
  {value: '1', label: '导出选中'},
]

onMounted(() => {
  init()
})

async function init() {
  if (!await beforeInit()) {
    return
  }
  loading.value = true
  initData(url.value, getQueryParame()).then(res => {
    total.value = res.totalElements
    data.value = res.content
    setTimeout(() => {
      loading.value = false
    }, 50)
  }).catch(() => {
    loading.value = false
  })
}

function beforeInit() {
  url.value = 'api/mailvorPddOrder'
  const sort = 'order_create_time,desc'
  params.value = {
    page: page.value,
    size: size.value,
    sort: sort,
    orderType: orderType.value,
    orderCreateTime: orderCreateTime.value,
    listContent: listContent.value,
    innerType: innerType.value
  }
  if(status.value != null && status.value != '' && status.value != 0) {
    params.value.orderStatus = status.value;
  }
  if(refundTag.value != null && status.value != '') {
    params.value.refundTag = refundTag.value;
  }

  if(bind.value != null && bind.value != '') {
    params.value.bind = bind.value;
  }
  const type = query.value.type
  const value = query.value.value
  if (type && value) { params.value[type] = value }
  return Promise.resolve(true)
}

function getQueryParame() {
  return {
    page: page.value,
    size: size.value,
    sort: ['id,desc'],
    ...query.value,
    ...params.value
  }
}

function handleOrder(tab) {
  // Element Plus 的 tab-click 回调参数是 pane 上下文，name 在 paneName 上（Vue2 里才是 tab.name）
  status.value = tab.paneName
  toQuery()
}

function toQuery() {
  page.value = 0
  init()
}

function pageChange(e) {
  page.value = e - 1
  init()
}

function sizeChange(e) {
  page.value = 0
  size.value = e
  init()
}

function dleChangePage(sizeVal) {
  if (sizeVal === undefined) {
    sizeVal = 1
  }
  if (data.value.length === sizeVal && page.value !== 0) {
    page.value = page.value - 1
  }
}

function subDelete(id) {
  delLoading.value = true
  del(id).then(() => {
    delLoading.value = false
    popoverRefs[id[0]]?.hide()
    dleChangePage()
    init()
    ElNotification({
      title: '删除成功',
      type: 'success',
      duration: 2500
    })
  }).catch(err => {
    delLoading.value = false
    popoverRefs[id[0]]?.hide()
    console.log(err.response?.data?.message)
  })
}

function handleEditOrder(rowData) {
  isAdd.value = false
  const _this = form3.value
  if (_this) {
    _this.open({
      orderId: rowData.orderSn,
      uid: rowData.uid,
    })
  }
}

function handleSelectionChange(val) {
  checkList.value = val;
  if(val.length != 0){
    printChecked.value = true;
  }else {
    printChecked.value = false;
  }
}

function batchSelection(val){
  const rows = data.value;
  if (val) {
    rows.forEach(row => {
      multipleTable.value?.toggleRowSelection(row);
    });
  } else {
    multipleTable.value?.clearSelection();
  }
}

function handleExportOption(val){
  const list = checkList.value;
  page.value = 0;
  size.value = 10000;
  switch (val) {
    case "0":
      listContent.value = "";
      beforeInit();
      downloadMethod();
      break;
    case "1":
      if(list.length == 0){
        ElNotification({
          message: '请选择订单',
          type: 'warning'
        });
      }else {
        listContent.value = [];
        list.forEach((item) => {
          listContent.value.push(item.orderId);
        })
        listContent.value = JSON.stringify(listContent.value);
        beforeInit();
        downloadMethod();
      }
      break;
    default:
      break;
  }
  batchExport.value = "";
}

function checkboxT(row, rowIndex) {
  return row.id !== 1
}

function downloadMethod() {
  beforeInit()
  download(url.value + '/download', params.value).then(result => {
    downloadFile(result, '' + '数据', 'xlsx')
  }).catch(() => {
  })
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

  .order-page { display:flex; flex-direction:column; gap:10px; height:var(--app-page-height, calc(100vh - 117px)); box-sizing:border-box; padding:12px; background:#f4f6f9; }
  .order-page .order-content { position:static; display:flex; flex:1; flex-direction:column; gap:10px; width:100%; height:auto; min-height:0; overflow:hidden; }
  .order-page :deep(.order-tabs), .order-page .order-filters, .order-page :deep(.order-table) { background:#fff; border:1px solid #e8edf4; border-radius:10px; box-shadow:0 2px 8px rgba(31,45,61,.04); }
  .order-page :deep(.order-tabs) { flex:none; margin:0; padding:0 12px; }
  .order-page :deep(.order-tabs .el-tabs__header) { margin:0; border-bottom:0; }
  .order-page :deep(.order-tabs .el-tabs__nav) { border:0; }
  .order-page :deep(.order-tabs .el-tabs__item) { height:42px; border:0; color:#667085; }
  .order-page :deep(.order-tabs .el-tabs__item.is-active) { color:#409eff; font-weight:600; }
  .order-page :deep(.order-tabs .el-tabs__content) { display:none; }
  .order-page .order-filters { display:flex; flex:none; flex-wrap:wrap; align-items:center; gap:8px; margin:0; padding:10px; }
  .order-page .order-filters :deep(.filter-item), .order-page .order-filters :deep(.date-item) { margin:0; }
  .order-page :deep(.order-table) { flex:1; min-height:380px; overflow:hidden; padding:4px 12px 12px; box-sizing:border-box; }
  .order-page :deep(.order-table .el-table__inner-wrapper::before) { display:none; }
  .order-page :deep(.order-table th.el-table__cell) { height:40px; background:#f7f9fc; color:#667085; font-weight:600; }
  .order-page :deep(.order-table td.el-table__cell) { padding:4px 0; }
  .order-page .footer-contains { position:static; flex:none; min-height:48px; border:1px solid #e8edf4; border-radius:10px; background:#fff; box-shadow:0 2px 8px rgba(31,45,61,.04); }

  .order-page { width: 100% !important; max-width: none !important; }
  .order-page .order-content,
  .order-page .footer-contains { width: 100% !important; max-width: none !important; }

  @media (max-width:768px) { .order-page{height:auto;min-height:var(--app-page-height, calc(100vh - 117px));padding:10px}.order-page .order-content{overflow:visible}.order-page :deep(.order-table){min-height:420px}.order-page .footer-contains{flex-wrap:wrap;gap:8px;padding:10px} }
</style>
