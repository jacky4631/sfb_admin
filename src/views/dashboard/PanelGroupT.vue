<template>
  <div class="divBox">
      <el-row :gutter="24" class="dashboard-console-grid">
        <el-col v-bind="grid" class="ivu-mb">
          <el-card :bordered="false">
            <router-link :to="{ path: '/shop/cate' }">
              <el-icon style="color: #69c0ff"><Goods /></el-icon>
              <p>商品管理</p>
            </router-link>
          </el-card>
        </el-col>
        <el-col v-bind="grid" class="ivu-mb">
          <el-card :bordered="false">
            <router-link :to="{ path: '/member/member' }">
              <el-icon style="color: #95de64"><User /></el-icon>
              <p>会员管理</p>
            </router-link>
          </el-card>
        </el-col>
        <el-col v-bind="grid" class="ivu-mb">
          <el-card :bordered="false">
            <router-link :to="{ path: '/order/mailvorTbOrder' }">
              <el-icon style="color: #ff9c6e"><Tickets /></el-icon>
              <p>订单管理</p>
            </router-link>
          </el-card>
        </el-col>
        <el-col v-bind="grid" class="ivu-mb">
          <el-card :bordered="false">
            <router-link :to="{ path: '/sys-tools/timing' }">
              <el-icon style="color: #b37feb"><Tickets /></el-icon>
              <p>定时任务</p>
            </router-link>
          </el-card>
        </el-col>
        <el-col v-bind="grid" class="ivu-mb">
          <el-card :bordered="false">
            <router-link :to="{ path: '/member/bill' }">
              <el-icon style="color: #ffd666"><Postcard /></el-icon>
              <p>用户账单</p>
            </router-link>
          </el-card>
        </el-col>
        <el-col v-bind="grid" class="ivu-mb">
          <el-card :bordered="false">
            <router-link :to="{ path: '/promoter/promoterconfig' }">
              <el-icon style="color: #5cdbd3"><Notebook /></el-icon>
              <p>分销管理</p>
            </router-link>
          </el-card>
        </el-col>
        <el-col v-bind="grid" class="ivu-mb">
          <el-card :bordered="false">
            <router-link :to="{ path: '/price/extract' }">
              <el-icon style="color: #ff85c0"><Money /></el-icon>
              <p>财务管理</p>
            </router-link>
          </el-card>
        </el-col>
        <el-col v-bind="grid" class="ivu-mb">
          <el-card :bordered="false">
            <router-link :to="{ path: '/system/user' }">
              <el-icon style="color: #ffc069"><OfficeBuilding /></el-icon>
              <p>系统管理</p>
            </router-link>
          </el-card>
        </el-col>
      </el-row>
    </div>
</template>
<script setup>
import { onMounted, reactive } from 'vue'
import { gett } from '@/api/visits.js'

defineOptions({
  name: 'PanelGroupT'
})

const count = reactive({
  todayPrice: 0,
  todayCount: 0,
  proPrice: 0,
  proCount: 0,
  monthPrice: 0,
  monthCount: 0,
  lastWeekCount: 0,
  lastWeekPrice: 0
})

const grid = {
  xl: 3,
  lg: 3,
  md: 6,
  sm: 8,
  xs: 8
}

onMounted(() => {
  gett().then(res => {
    count.todayPrice = res.todayPrice
    count.todayCount = res.todayCount
    count.proCount = res.proCount
    count.proPrice = res.proPrice

    count.monthPrice = res.monthPrice
    count.monthCount = res.monthCount
    count.lastWeekCount = res.lastWeekCount
    count.lastWeekPrice = res.lastWeekPrice
  })
})
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.panel-group {
  margin-top: 18px;
  .card-panel-col{
    margin-bottom: 32px;
  }
  .card-panel {
    height: 108px;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);



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
      color: #34bfa3
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


.ivu-mb {
  margin-bottom: 10px;
}
.divBox {
  // padding: 0 20px !important;
}

.dashboard-console-grid {
  text-align: center;
  .ivu-card-body {
    padding: 0;
  }
  i {
    font-size: 32px;
  }
  a {
    display: block;
    color: inherit;
  }
  p {
    margin-top: 8px;
  }
}
</style>
