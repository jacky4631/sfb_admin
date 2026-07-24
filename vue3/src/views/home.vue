<template>
  <div class="dashboard-container">
    <div class="dashboard-editor-container">
      <panel-group />
      <income-group />

      <div class="divBox">
        <el-card :bordered="false" dis-hover>
          <template #header>
            <div class="acea-row row-middle">
              <el-avatar
                :icon="Operation"
                size="small"
                style="color: #1890ff; background: #e6f7ff; font-size: 13px"
              />
              <span class="ivu-pl-8">统计</span>
            </div>
          </template>
          <el-row :gutter="24">
            <el-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24" class="ivu-mb mb10 dashboard-console-visit">
              <span class="ivu-pl-8">淘宝近30天订单数</span>
              <count-chart />
            </el-col>
            <el-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24" class="ivu-mb mb10 dashboard-console-visit">
              <span class="ivu-pl-8">淘宝近30天成交额</span>
              <price-chart />
            </el-col>
            <el-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24" class="ivu-mb mb10 dashboard-console-visit">
              <span class="ivu-pl-8">淘宝近30天预估佣金</span>
              <fee-chart />
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24" class="ivu-mb mb10 dashboard-console-visit">
              <span class="ivu-pl-8">京东近30天订单数</span>
              <jd-count-chart />
            </el-col>
            <el-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24" class="ivu-mb mb10 dashboard-console-visit">
              <span class="ivu-pl-8">京东近30天成交额</span>
              <jd-price-chart />
            </el-col>
            <el-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24" class="ivu-mb mb10 dashboard-console-visit">
              <span class="ivu-pl-8">京东近30天预估佣金</span>
              <jd-fee-chart />
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24" class="ivu-mb mb10 dashboard-console-visit">
              <span class="ivu-pl-8">拼多多近30天订单数</span>
              <pdd-count-chart />
            </el-col>
            <el-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24" class="ivu-mb mb10 dashboard-console-visit">
              <span class="ivu-pl-8">拼多多近30天成交额</span>
              <pdd-price-chart />
            </el-col>
            <el-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24" class="ivu-mb mb10 dashboard-console-visit">
              <span class="ivu-pl-8">拼多多近30天预估佣金</span>
              <pdd-fee-chart />
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24" class="ivu-mb mb10 dashboard-console-visit">
              <span class="ivu-pl-8">抖音近30天订单数</span>
              <dy-count-chart />
            </el-col>
            <el-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24" class="ivu-mb mb10 dashboard-console-visit">
              <span class="ivu-pl-8">抖音近30天成交额</span>
              <dy-price-chart />
            </el-col>
            <el-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24" class="ivu-mb mb10 dashboard-console-visit">
              <span class="ivu-pl-8">抖音近30天预估佣金</span>
              <dy-fee-chart />
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24" class="ivu-mb mb10 dashboard-console-visit">
              <span class="ivu-pl-8">唯品会近30天订单数</span>
              <vip-count-chart />
            </el-col>
            <el-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24" class="ivu-mb mb10 dashboard-console-visit">
              <span class="ivu-pl-8">唯品会近30天成交额</span>
              <vip-price-chart />
            </el-col>
            <el-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24" class="ivu-mb mb10 dashboard-console-visit">
              <span class="ivu-pl-8">唯品会近30天预估佣金</span>
              <vip-fee-chart />
            </el-col>
          </el-row>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Operation } from '@element-plus/icons-vue'
import PanelGroup from './dashboard/PanelGroup.vue'
import IncomeGroup from './dashboard/IncomeGroup.vue'
import CountChart from './dashboard/BarChartCount.vue'
import FeeChart from './dashboard/BarChartFee.vue'
import PriceChart from './dashboard/BarChartPrice.vue'
import JdCountChart from './dashboard/JdBarChartCount.vue'
import JdFeeChart from './dashboard/JdBarChartFee.vue'
import JdPriceChart from './dashboard/JdBarChartPrice.vue'
import PddCountChart from './dashboard/PddBarChartCount.vue'
import PddFeeChart from './dashboard/PddBarChartFee.vue'
import PddPriceChart from './dashboard/PddBarChartPrice.vue'
import DyCountChart from './dashboard/DyBarChartCount.vue'
import DyFeeChart from './dashboard/DyBarChartFee.vue'
import DyPriceChart from './dashboard/DyBarChartPrice.vue'
import VipCountChart from './dashboard/VipBarChartCount.vue'
import VipFeeChart from './dashboard/VipBarChartFee.vue'
import VipPriceChart from './dashboard/VipBarChartPrice.vue'
import OrderCount from './dashboard/OrderCount.vue'
import { count } from '@/api/visits'

defineOptions({
  name: 'Dashboard'
})

/**
 * 记录访问，只有页面刷新或者第一次加载才会记录
 */
count().then((res) => {})
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 18px 22px 22px 22px;
  background-color: rgb(240, 242, 245);

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

.acea-row {
  :deep(.el-avatar--small) {
    width: 22px;
    height: 22px;
    line-height: 22px;
  }
}
.checkTime {
  :deep(.el-radio__input) {
    display: none;
  }
}
.ivu-pl-8 {
  margin-left: 8px;
  font-size: 14px;
}
.divBox {
  // padding: 0 20px !important;
}
.dashboard-console-visit {
  :deep(.el-card__header) {
    padding: 14px 20px !important;
  }
  ul {
    li {
      list-style-type: none;
      margin-top: 12px;
    }
  }
}
.ivu-mb {
  margin-bottom: 10px;
}
</style>
