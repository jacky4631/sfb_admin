<template>
  <div class="app-container" style="position: relative; height: calc(100vh - 117px);">
    <div class="container">

      <el-tabs v-model="status" type="card" @tab-click="handleOrder">
        <el-tab-pane name="">
          <template #label><i class="el-icon-s-order"></i> 全部订单</template>
        </el-tab-pane>
        <el-tab-pane name="12">
          <template #label><i class="el-icon-bank-card"></i> 订单付款</template>
        </el-tab-pane>
        <el-tab-pane name="3">
          <template #label><i class="el-icon-refrigerator"></i> 订单结算</template>
        </el-tab-pane>
        <el-tab-pane name="13">
          <template #label><i class="el-icon-truck"></i> 订单失效</template>
        </el-tab-pane>
        <el-tab-pane name="14">
          <template #label><i class="el-icon-document"></i> 订单成功</template>
        </el-tab-pane>
      </el-tabs>
      <!--工具栏-->
      <div class="head-container">

        <!-- 搜索 -->
        <el-input v-model="query.value" clearable placeholder="输入搜索内容" style="width: 200px;" class="filter-item" @keyup.enter="toQuery" />
        <el-input v-model="query.uid" clearable placeholder="输入用户id" style="width: 200px;" class="filter-item" @keyup.enter="toQuery" />
        <el-select v-model="refundTag" clearable placeholder="是否维权" class="filter-item" style="width: 130px">
          <el-option v-for="item in queryRefundOptions" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
        <el-select v-model="bind" clearable placeholder="是否拆红包" class="filter-item" style="width: 130px">
          <el-option v-for="item in bindOptions" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
        <el-select v-model="innerType" clearable placeholder="订单类型" class="filter-item" style="width: 130px">
          <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
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
      <!--表单组件-->
      <editOrder ref="form3" :is-add="isAdd" @refresh="init" />

      <!--表格渲染-->
      <el-table ref="multipleTable" height="460" v-loading="loading" :data="data" size="small" style="width: 100%;" @selection-change="handleSelectionChange">
        <el-table-column :selectable="checkboxT" type="selection" width="50" />
        <el-table-column prop="tradeParentId" fixed label="订单编号" width="155">
          <template v-slot="scope">
            <div :style="{ color: scope.row.refundTag ==1 ? 'red' : 'black' }">
              {{ scope.row.tradeParentId }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="tkCreateTime" label="创建时间" width="135">
          <template v-slot="scope">
            <span>{{ parseTime(scope.row.tkCreateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="tkStatus" label="订单状态" >
          <template v-slot="scope">
            <el-tag v-if="scope.row.tkStatus === 3" style="cursor: pointer" :type="'success'">{{ tbOrderStatusParse(scope.row.tkStatus) }}</el-tag>
            <el-tag v-else-if="scope.row.tkStatus === 12" style="cursor: pointer" :type=" '' ">{{ tbOrderStatusParse(scope.row.tkStatus) }}</el-tag>
            <el-tag v-else-if="scope.row.tkStatus === 13" style="cursor: pointer" :type="'warning'">{{ tbOrderStatusParse(scope.row.tkStatus) }}</el-tag>
            <el-tag v-else-if="scope.row.tkStatus === 14" style="cursor: pointer" :type=" 'warning' ">{{ tbOrderStatusParse(scope.row.tkStatus) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="bind" label="拆红包" width="120">
          <template v-slot="scope">
            <el-tag v-if="scope.row.bind === 1" style="cursor: pointer" :type="'success'">{{ isBinding(scope.row.bind) }}</el-tag>
            <el-tag v-else-if="scope.row.bind === 0" style="cursor: pointer" :type=" '' ">{{ isBinding(scope.row.bind) }}</el-tag>
            <el-tag v-else style="cursor: pointer" :type="'warning'">{{ isBinding(scope.row.bind) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="pubSharePreFee" label="预估收入" />
        <el-table-column prop="hb" label="拆红包金额" width="100" />
        <el-table-column prop="innerType" label="热度=2" width="135"/>
        <el-table-column prop="uid" label="用户ID" />
        <el-table-column prop="refundTag" label="维权" >
          <template v-slot="scope">
            <span>{{ refundStatus(scope.row.refundTag) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="itemTitle" label="商品标题"  width="255" :show-overflow-tooltip="true"/>
        <el-table-column prop="tkTotalRate" label="实际佣金比率%" width="120" />
        <el-table-column prop="alipayTotalPrice" label="付款金额(元)" width="100" />
        <el-table-column prop="totalCommissionRate" label="佣金比率" />
        <el-table-column prop="tradeId" label="子订单编号" width="155" :show-overflow-tooltip="true"/>

        <el-table-column prop="adzoneName" label="推广位名称"  :show-overflow-tooltip="true" width="100"/>
        <el-table-column prop="relationId" label="渠道关系id" width="125"/>
        <el-table-column prop="siteId" label="pid2" :show-overflow-tooltip="true"/>
        <el-table-column prop="adzoneId" label="pid3"  :show-overflow-tooltip="true"/>
        <el-table-column prop="itemLink" label="商品链接"  :show-overflow-tooltip="true"/>
        <el-table-column prop="itemPrice" label="商品单价" />
        <el-table-column prop="orderType" label="平台类型" />
        <el-table-column prop="sellerShopTitle" label="店铺名"  :show-overflow-tooltip="true"/>
        <el-table-column prop="siteName" label="媒体名"  :show-overflow-tooltip="true"/>
        <el-table-column prop="itemId" label="商品id" width="125" :show-overflow-tooltip="true" />
        <el-table-column prop="totalCommissionFee" label="佣金金额"  :show-overflow-tooltip="true"/>
        <el-table-column prop="specialId" label="会员运营id" />
        <el-table-column prop="modifiedTime" label="订单更新时间"  :show-overflow-tooltip="true" width="200"/>
        <el-table-column prop="itemImg" label="主图" :show-overflow-tooltip="true"/>
        <el-table-column prop="createTime" label="创建时间" :show-overflow-tooltip="true" width="200">
          <template v-slot="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="修改时间" :show-overflow-tooltip="true" width="200">
          <template v-slot="scope">
            <span>{{ parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>

        <el-table-column v-if="checkPermission(['admin','MWSTOREORDER_ALL','MWSTOREORDER_EDIT','MWSTOREORDER_DELETE'])" label="操作" width="200" align="center" fixed="right">
          <template v-slot="scope">
            <el-button
              v-permission="['admin','MWSTOREORDER_ALL','MWSTOREORDER_EDIT']"
              size="mini"
              type="primary"
              @click="editOrder(scope.row)"
            >
              绑定用户</el-button>
            <el-dropdown size="mini" split-button type="primary" trigger="click">
              操作
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item >
                    <el-popover
                      :ref="el => popoverRefs[scope.row.tradeParentId] = el"
                      v-permission="['admin','MWSTOREORDER_ALL','MWSTOREORDER_DELETE']"
                      placement="top"
                      width="180"
                    >
                      <p>确定删除本条数据吗？</p>
                      <div style="text-align: right; margin: 0">
                        <el-button size="mini" type="text" @click="popoverRefs[scope.row.tradeParentId]?.doClose()">取消</el-button>
                        <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete([scope.row.tradeParentId])">确定</el-button>
                      </div>
                      <template #reference>
                        <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
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
import { ref, reactive, onMounted } from 'vue'
import { ElNotification } from 'element-plus'
import checkPermission from '@/utils/permission'
import { initData, download } from '@/api/data'
import { parseTime, downloadFile } from '@/utils/index'
import { del } from '@/api/mailvorTbOrder'
import editOrder from './edit'
import { tbOrderStatusParse, refundStatus, isCash, isBinding } from "@/utils/tk-order-parse";

const status = ref('')
const refundTag = ref('')
const innerType = ref('0')
const search = ref('')
const orderType = ref('0')
const createTime = ref('')
const bind = ref('')
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

const queryRefundOptions = [
  { key: '1', display_name: '是' },
  { key: '0', display_name: '否' },
]
const bindOptions = [
  { key: '0', display_name: '未拆' },
  { key: '1', display_name: '已拆' },
]
const queryTypeOptions = [
  { key: '0', display_name: '用户订单' },
  { key: '2', display_name: '热度订单' },
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
  url.value = 'api/mailvorTbOrder'
  const sort = 'tk_create_time,desc'
  params.value = {
    page: page.value,
    size: size.value,
    sort: sort,
    orderType: orderType.value,
    tkCreateTime: createTime.value,
    listContent: listContent.value
  }
  if(status.value != null && status.value != '' && status.value != 0) {
    params.value.tkStatus = status.value;
  }
  if(refundTag.value != null && refundTag.value != '') {
    params.value.refundTag = refundTag.value;
  }
  if(innerType.value != null && innerType.value != '') {
    params.value.innerType = innerType.value;
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
  status.value = tab.name
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
    popoverRefs[id[0]]?.doClose()
    dleChangePage()
    init()
    ElNotification({
      title: '删除成功',
      type: 'success',
      duration: 2500
    })
  }).catch(err => {
    delLoading.value = false
    popoverRefs[id[0]]?.doClose()
    console.log(err.response?.data?.message)
  })
}

function editOrder(rowData) {
  isAdd.value = false
  const _this = form3.value
  if (_this) {
    _this.form = {
      orderId: rowData.tradeParentId,
      uid: rowData.uid,
    }
    _this.dialog = true
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
  .red {
    color: red !important;
  }

  .black {
    color: #000000 !important;
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
</style>
