<template>
  <div class="dashboard-container">
    <div class="dashboard-editor-container">
      <panel-group />
      <income-group />

      <div class="divBox">
        <el-card :bordered="false" dis-hover>
          <div slot="header">
            <div class="acea-row row-middle">
              <el-avatar
                icon="el-icon-s-operation"
                size="small"
                style="color: #1890ff; background: #e6f7ff; font-size: 13px"
              />
              <span class="ivu-pl-8">统计</span>
            </div>
          </div>
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

<script>
import { mapGetters } from "vuex";
import PanelGroup from "./dashboard/PanelGroup";
import IncomeGroup from "./dashboard/IncomeGroup";
import CountChart from "./dashboard/BarChartCount";
import FeeChart from "./dashboard/BarChartFee";
import PriceChart from "./dashboard/BarChartPrice";
import JdCountChart from "./dashboard/JdBarChartCount";
import JdFeeChart from "./dashboard/JdBarChartFee";
import JdPriceChart from "./dashboard/JdBarChartPrice";
import PddCountChart from "./dashboard/PddBarChartCount";
import PddFeeChart from "./dashboard/PddBarChartFee";
import PddPriceChart from "./dashboard/PddBarChartPrice";
import DyCountChart from "./dashboard/DyBarChartCount";
import DyFeeChart from "./dashboard/DyBarChartFee";
import DyPriceChart from "./dashboard/DyBarChartPrice";
import VipCountChart from "./dashboard/VipBarChartCount";
import VipFeeChart from "./dashboard/VipBarChartFee";
import VipPriceChart from "./dashboard/VipBarChartPrice";
import { count } from "@/api/visits";
import OrderCount from "./dashboard/OrderCount";

/**
 * 记录访问，只有页面刷新或者第一次加载才会记录
 */
count().then((res) => {});

export default {
  name: "Dashboard",
  components: {
    PanelGroup,
    IncomeGroup,
    CountChart,
    FeeChart,
    PriceChart,
    JdCountChart,
    JdFeeChart,
    JdPriceChart,
    PddCountChart,
    PddFeeChart,
    PddPriceChart,
    DyCountChart,
    DyFeeChart,
    DyPriceChart,
    VipCountChart,
    VipFeeChart,
    VipPriceChart,
    OrderCount,
  },
  computed: {
    ...mapGetters(["roles"]),
  },
};
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
  ::v-deep.el-avatar--small {
    width: 22px;
    height: 22px;
    line-height: 22px;
  }
}
.checkTime {
  ::v-deep.el-radio__input {
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
  ::v-deep.el-card__header {
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
