<template>
  <div class="app-container" style="position: relative; height: calc(100vh - 117px);">
    <div class="container">

      <el-tabs v-model="status" type="card" @tab-click="handleOrder">
        <el-tab-pane name="">
          <span slot="label"><i class="el-icon-s-order"></i> 全部订单</span>
        </el-tab-pane>
        <el-tab-pane name="4">
          <span slot="label"><i class="el-icon-bank-card"></i> 审核失败</span>
        </el-tab-pane>
        <el-tab-pane name="3">
          <span slot="label"><i class="el-icon-refrigerator"></i> 审核成功</span>
        </el-tab-pane>
        <el-tab-pane name="5">
          <span slot="label"><i class="el-icon-truck"></i> 已经结算</span>
        </el-tab-pane>
        <el-tab-pane name="2">
          <span slot="label"><i class="el-icon-document"></i> 确认收货</span>
        </el-tab-pane>
        <el-tab-pane name="-1">
          <span slot="label"><i class="el-icon-refrigerator"></i> 未支付</span>
        </el-tab-pane>
        <el-tab-pane name="1">
          <span slot="label"><i class="el-icon-document"></i> 已成团</span>
        </el-tab-pane>
      </el-tabs>
      <!--工具栏-->
      <div class="head-container">

        <!-- 搜索 -->
        <el-input v-model="query.value" clearable placeholder="输入搜索内容" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery" />
        <el-input v-model="query.uid" clearable placeholder="输入用户id" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery" />
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
      <editOrder ref="form3" :is-add="isAdd" />

      <!--表格渲染-->
      <el-table ref="multipleTable" height="460" v-loading="loading" :data="data" size="small" style="width: 100%;" @selection-change="handleSelectionChange">
        <el-table-column :selectable="checkboxT" type="selection" width="50" />
        <el-table-column prop="orderSn" label="订单编号" fixed width="185" :show-overflow-tooltip="true"/>

        <el-table-column prop="orderCreateTime" label="订单生成时间"  width="150" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.orderCreateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderStatusDesc" label="订单状态" >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.orderStatusDesc !== '审核失败'" :type="'success'">{{ scope.row.orderStatusDesc }}</el-tag>
            <el-tag v-else style="cursor: pointer" :type="'warning'">{{ scope.row.orderStatusDesc }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="bind" label="拆红包" width="120">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.bind === 1" style="cursor: pointer" :type="'success'">{{ isBinding(scope.row.bind) }}</el-tag>
            <el-tag v-else-if="scope.row.bind === 0" style="cursor: pointer" :type=" '' ">{{ isBinding(scope.row.bind) }}</el-tag>
            <el-tag v-else style="cursor: pointer" :type="'warning'">{{ isBinding(scope.row.bind) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="promotionAmount" label="预估佣金">
          <template slot-scope="scope">
            {{ scope.row.promotionAmount/100 }}
          </template>
        </el-table-column>
        <el-table-column prop="hb" label="拆红包金额（元）" width="135" />
        <el-table-column prop="innerType" label="热度=2" width="135"/>
        <el-table-column prop="uid" label="用户ID" />
        <el-table-column prop="priceCompareStatus" label="比价=1" />
        <el-table-column prop="goodsName" label="商品名称"  width="100" :show-overflow-tooltip="true"/>
        <el-table-column prop="orderAmount" label="支付金额" >
          <template slot-scope="scope">
            {{ scope.row.orderAmount/100 }}
          </template>
        </el-table-column>
        <el-table-column prop="customParameters" label="自定义参数"  width="100" :show-overflow-tooltip="true"/>
        <el-table-column prop="orderStatus" label="订单状态" />
        <el-table-column prop="goodsId" label="商品ID"  width="150" :show-overflow-tooltip="true"/>
        <el-table-column prop="goodsPrice" label="单件价格" >
          <template slot-scope="scope">
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
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.orderGroupSuccessTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderModifyAt" label="最后更新时间"  width="100" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.orderModifyAt) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderPayTime" label="支付时间"  width="100" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.orderPayTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderReceiveTime" label="确认收货时间"  width="100" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.orderReceiveTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderSettleTime" label="结算时间"  width="200" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.orderSettleTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderVerifyTime" label="审核时间"  width="200" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.orderVerifyTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="pId" label="推广位ID" />
        <el-table-column prop="platformDiscount" label="平台券元" >
          <template slot-scope="scope">
            {{ scope.row.platformDiscount/100 }}
          </template>
        </el-table-column>
        <el-table-column prop="promotionRate" label="佣金比例%" >
          <template slot-scope="scope">
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
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="修改时间" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>

        <el-table-column v-if="checkPermission(['admin','MWSTOREORDER_ALL','MWSTOREORDER_EDIT','MWSTOREORDER_DELETE'])" label="操作" width="200" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button
              v-permission="['admin','MWSTOREORDER_ALL','MWSTOREORDER_EDIT']"
              size="mini"
              type="primary"
              @click="editOrder(scope.row)"
            >
              绑定用户</el-button>
            <el-dropdown size="mini" split-button type="primary" trigger="click">
              操作
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item >
                  <el-popover
                    :ref="scope.row.orderSn"
                    v-permission="['admin','MWSTOREORDER_ALL','MWSTOREORDER_DELETE']"
                    placement="top"
                    width="180"
                  >
                    <p>确定删除本条数据吗？</p>
                    <div style="text-align: right; margin: 0">
                      <el-button size="mini" type="text" @click="$refs[scope.row.orderSn].doClose()">取消</el-button>
                      <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete([scope.row.orderSn])">确定</el-button>
                    </div>
                    <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                  </el-popover>
                </el-dropdown-item>
              </el-dropdown-menu>
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

<script>
  import checkPermission from '@/utils/permission'
  import initData from '@/mixins/crud'
  import { del } from '@/api/mailvorPddOrder'
  import editOrder from '../mailvorTbOrder/edit'
  import { formatTime } from '@/utils/index'
  import {pddOrderStatusParse, refundStatus, isCash, isBinding} from "@/utils/tk-order-parse";

  export default {
    components: { editOrder },
    mixins: [initData],
    data() {
      return {
        delLoading: false,
        status: '',
        refundTag: '',
        search: '',
        orderType: '0',
        innerType: '0',
        bind: '',
        orderCreateTime: '',
        checkList: [],
        printChecked: false,
        batchHandle: '',
        batchExport: '',
        listContent: [],
        queryTypeOptions: [
          { key: '0', display_name: '用户订单' },
          { key: '2', display_name: '热度订单' },
        ],
        bindOptions: [
          { key: '0', display_name: '未拆' },
          { key: '1', display_name: '已拆' },
        ],
        exportOptions: [
          {value: '', label: '批量导出'},
          {value: '0', label: '导出全部'},
          {value: '1', label: '导出选中'},
        ],

      }
    },
    created() {
      this.$nextTick(() => {
        this.init()
      })
    },
    methods: {
      pddOrderStatusParse,
      refundStatus,
      isCash,
      isBinding,
      formatTime,
      checkPermission,
      handleOrder(tab, event) {
        this.status = tab.name
        this.toQuery()
      },
      beforeInit() {
        this.url = 'api/mailvorPddOrder'
        const sort = 'order_create_time,desc'
        this.params = {
          page: this.page,
          size: this.size,
          sort: sort,
          orderType: this.orderType,
          orderCreateTime: this.orderCreateTime,
          listContent: this.listContent,
          innerType: this.innerType

        }
        if(this.status != null && this.status != '' && this.status != 0) {
          this.params.orderStatus = this.status;
        }
        if(this.refundTag != null && this.status != '') {
          this.params.refundTag = this.refundTag;
        }

        if(this.bind != null && this.bind != '') {
          this.params.bind = this.bind;
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
      editOrder(data) {
        this.isAdd = false
        const _this = this.$refs.form3
        _this.form = {
          orderId: data.orderSn,
          uid: data.uid,
        }
        _this.dialog = true
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

        }else {
          this.printChecked = false;
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
              this.$message({
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
</style>
