<template>
  <el-row :gutter="20" class="panel-group">
    <el-col v-for="card in cards" :key="card.title" :xs="24" :sm="12" :md="12" :lg="6" class="panel-group__col">
      <StatCard v-bind="card" />
    </el-col>
  </el-row>
</template>

<script setup>
import { computed, onMounted, reactive } from 'vue'
import { UserFilled, ShoppingCart, Money, Coin } from '@element-plus/icons-vue'
import StatCard from './StatCard.vue'
import { trendPercent, formatAmount, formatInteger } from './statFormat'
import { gett } from '@/api/visits'

defineOptions({
  name: 'PanelGroup'
})

// 接口未返回前的兜底值，保证模板里的格式化与环比计算不炸；
// count 为唯一数据源，字段与 api/data/count 的返回字段一一对应，拉到数据后整体覆盖
const count = reactive({
  todayPrice: 0,
  todayFee: 0,
  todayCount: 0,
  proCount: 0,
  proPrice: 0,
  proFee: 0,
  monthPrice: 0,
  monthFee: 0,
  monthCount: 0,
  proMonthPrice: 0,
  proMonthFee: 0,
  proMonthCount: 0,
  userCount: 0,
  userTodayCount: 0,
  userProCount: 0,
  userMonthCount: 0
})

const cards = computed(() => {
  const s = count
  return [
    {
      title: '会员总数',
      icon: UserFilled,
      color: '#40c9c6',
      value: s.userCount,
      unit: '人',
      trendHint: '',
      rows: [
        {
          label: '今日新增',
          value: formatInteger(s.userTodayCount),
          trend: trendPercent(s.userTodayCount, s.userProCount)
        },
        { label: '昨日新增', value: formatInteger(s.userProCount) },
        { label: '本月新增', value: formatInteger(s.userMonthCount) }
      ]
    },
    {
      title: '今日订单数',
      icon: ShoppingCart,
      color: '#36a3f7',
      value: s.todayCount,
      unit: '单',
      trend: trendPercent(s.todayCount, s.proCount),
      trendHint: '较昨日',
      rows: [
        { label: '昨日订单数', value: `${formatInteger(s.proCount)} 单` },
        {
          label: '本月订单数',
          value: `${formatInteger(s.monthCount)} 单`,
          trend: trendPercent(s.monthCount, s.proMonthCount)
        },
        { label: '上月订单数', value: `${formatInteger(s.proMonthCount)} 单` }
      ]
    },
    {
      title: '今日成交额',
      icon: Money,
      color: '#f4516c',
      value: s.todayPrice,
      unit: '元',
      decimals: 2,
      duration: 3200,
      trend: trendPercent(s.todayPrice, s.proPrice),
      trendHint: '较昨日',
      rows: [
        { label: '昨日成交额', value: `${formatAmount(s.proPrice)} 元` },
        {
          label: '本月成交额',
          value: `${formatAmount(s.monthPrice)} 元`,
          trend: trendPercent(s.monthPrice, s.proMonthPrice)
        },
        { label: '上月成交额', value: `${formatAmount(s.proMonthPrice)} 元` }
      ]
    },
    {
      title: '今日预估佣金',
      icon: Coin,
      color: '#34bfa3',
      value: s.todayFee,
      unit: '元',
      decimals: 2,
      duration: 3600,
      trend: trendPercent(s.todayFee, s.proFee),
      trendHint: '较昨日',
      rows: [
        { label: '昨日预估佣金', value: `${formatAmount(s.proFee)} 元` },
        {
          label: '本月预估佣金',
          value: `${formatAmount(s.monthFee)} 元`,
          trend: trendPercent(s.monthFee, s.proMonthFee)
        },
        { label: '上月预估佣金', value: `${formatAmount(s.proMonthFee)} 元` }
      ]
    }
  ]
})

onMounted(() => {
  gett().then((res) => {
    Object.keys(count).forEach((key) => {
      const value = Number(res?.[key])
      count[key] = Number.isFinite(value) ? value : 0
    })
  })
})
</script>

<style scoped lang="scss">
.panel-group {
  &__col {
    margin-bottom: 20px;
  }
}
</style>
