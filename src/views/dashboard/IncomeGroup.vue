<template>
  <div>
    <div class="divBox">
      <el-row :gutter="24" class="baseInfo">
        <el-col :xs="12" :sm="12" :lg="6" class="ivu-mb">
          <el-card :bordered="false" dis-hover :padding="12">
            <div slot="header" class="acea-row row-between-wrapper">
              <span>今日开店收入</span>
              <el-tag type="success">全平台</el-tag>
            </div>
            <div class="content" v-if="income">
              <span class="content-number spBlock mb15">
                <count-to :start-val="0" :end-val="income.todayShopIn" :decimals="2" :duration="2600" class="card-panel-num" />元</span>
              <el-divider></el-divider>
              <div class="acea-row row-between-wrapper">
                <span class="content-time">本月开店收入</span>
                <span>{{ income.monthShopIn.toFixed(2) }}元</span>
              </div>
              <el-divider></el-divider>
              <div class="acea-row row-between-wrapper">
                <span class="content-time">上月开店收入</span>
                <span>{{ income.proMonthShopIn.toFixed(2) }}元</span>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="6" class="ivu-mb">
          <el-card :bordered="false" dis-hover :padding="12">
            <div slot="header" class="acea-row row-between-wrapper">
              <span>今日提现支出</span>
              <el-tag type="success">全平台</el-tag>
            </div>
            <div class="content" v-if="income">
              <span class="content-number spBlock mb15">
                <count-to :start-val="0" :end-val="income.todayExtractOut" :decimals="2" :duration="3000" class="card-panel-num" /> 元</span>
              <el-divider></el-divider>
              <div class="acea-row row-between-wrapper">
                <span class="content-time">本月提现支出</span>
                <span>{{ income.monthExtractOut.toFixed(2) }} 元</span>
              </div>
              <el-divider></el-divider>
              <div class="acea-row row-between-wrapper">
                <span class="content-time">上月提现支出</span>
                <span>{{ income.proMonthExtractOut.toFixed(2) }} 元</span>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="6" class="ivu-mb">
          <el-card :bordered="false" dis-hover :padding="12">
            <div slot="header" class="acea-row row-between-wrapper">
              <span>今日其余支出</span>
              <el-tag type="success">全平台</el-tag>
            </div>
            <div class="content" v-if="income">
              <span class="content-number spBlock mb15">
                <count-to :start-val="0" :end-val="income.todayOtherOut" :decimals="2" :duration="3600" class="card-panel-num" /> 元</span>
              <el-divider></el-divider>
              <div class="acea-row row-between-wrapper">
                <span class="content-time">本月其余支出</span>
                <span>{{ income.monthOtherOut.toFixed(2) }} 元</span>
              </div>
              <el-divider></el-divider>
              <div class="acea-row row-between-wrapper">
                <span class="content-time">上月其余支出</span>
                <span>{{ income.proMonthOtherOut.toFixed(2) }} 元</span>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="6" class="ivu-mb">
          <el-card :bordered="false" dis-hover :padding="12">
            <div slot="header" class="acea-row row-between-wrapper">
              <span>今日净收入</span>
              <el-tag type="success">全平台</el-tag>
            </div>
            <div class="content" v-if="income">
              <span class="content-number spBlock mb15">
                <count-to :start-val="0" :end-val="income.todayIn" :decimals="2" :duration="3200" class="card-panel-num" /> 元</span>
              <el-divider></el-divider>
              <div class="acea-row row-between-wrapper">
                <span class="content-time">本月净收入</span>
                <span>{{ income.monthIn.toFixed(2) }} 元</span>
              </div>
              <el-divider></el-divider>
              <div class="acea-row row-between-wrapper">
                <span class="content-time">上月净收入</span>
                <span>{{ income.proMonthIn.toFixed(2) }} 元</span>
              </div>
            </div>
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>
</template>
<script>
import CountTo from "vue-count-to";
import {getIncomeData, gett} from "@/api/visits";
export default {
  components: {
    CountTo,
  },
  data() {
    return {
      income: {
        todayShopIn: 0,
        monthShopIn: 0,
        proMonthShopIn: 0,
        todayExtractOut: 0,
        monthExtractOut: 0,
        proMonthExtractOut: 0,
        todayOtherOut: 0,
        monthOtherOut: 0,
        proMonthOtherOut: 0,
        todayIn: 0,
        monthIn: 0,
        proMonthIn: 0
      },

    };
  },
  mounted() {
    getIncomeData().then((res) => {
      this.income.todayShopIn = res.todayShopIn;
      this.income.monthShopIn = res.monthShopIn;
      this.income.proMonthShopIn = res.proMonthShopIn;

      this.income.todayExtractOut = res.todayExtractOut;
      this.income.monthExtractOut = res.monthExtractOut;
      this.income.proMonthExtractOut = res.proMonthExtractOut;

      this.income.todayOtherOut = res.todayOtherOut;
      this.income.monthOtherOut = res.monthOtherOut;
      this.income.proMonthOtherOut = res.proMonthOtherOut;

      this.income.todayIn = res.todayIn;
      this.income.monthIn = res.monthIn;
      this.income.proMonthIn = res.proMonthIn;
    });
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3;
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
.baseInfo {
  ::v-deep .el-card__header {
    padding: 15px 20px !important;
  }
}

.ivu-mb {
  margin-bottom: 10px;
}
.up,
.el-icon-caret-top {
  color: #f5222d;
  font-size: 12px;
  opacity: 1 !important;
}

.down,
.el-icon-caret-bottom {
  color: #39c15b;
  font-size: 12px;
  /*opacity: 100% !important;*/
}

.content {
  &-number {
    font-size: 30px;
  }
  &-time {
    font-size: 14px;
    /*color: #8C8C8C;*/
  }
}
.spBlock {
  display: block;
}
</style>
