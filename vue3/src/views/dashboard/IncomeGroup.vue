<template>
  <el-row :gutter="20" class="income-group">
    <el-col v-for="card in cards" :key="card.title" :xs="24" :sm="12" :md="12" :lg="6" class="income-group__col">
      <StatCard v-bind="card" />
    </el-col>
  </el-row>
</template>

<script setup>
import { computed, onMounted, reactive } from 'vue'
import { Wallet, Money, Tickets, TrendCharts } from '@element-plus/icons-vue'
import StatCard from './StatCard.vue'
import { trendPercent, formatAmount } from './statFormat'
import { getIncomeData } from '@/api/visits'

defineOptions({
  name: 'IncomeGroup'
})

// 接口只提供今日/本月/上月三档，没有「昨日」，因此主数值不做日环比，
// 月环比放在「本月」这一行上
const income = reactive({
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
})

const buildCard = (title, icon, color, todayKey, monthKey, proMonthKey) => ({
  title,
  icon,
  color,
  value: income[todayKey],
  unit: '元',
  decimals: 2,
  duration: 2600,
  rows: [
    {
      label: `本月${title.replace('今日', '')}`,
      value: `${formatAmount(income[monthKey])} 元`,
      trend: trendPercent(income[monthKey], income[proMonthKey])
    },
    {
      label: `上月${title.replace('今日', '')}`,
      value: `${formatAmount(income[proMonthKey])} 元`
    }
  ]
})

const cards = computed(() => [
  buildCard('今日开店收入', Wallet, '#34bfa3', 'todayShopIn', 'monthShopIn', 'proMonthShopIn'),
  buildCard('今日提现支出', Money, '#f4516c', 'todayExtractOut', 'monthExtractOut', 'proMonthExtractOut'),
  buildCard('今日其余支出', Tickets, '#e6a23c', 'todayOtherOut', 'monthOtherOut', 'proMonthOtherOut'),
  buildCard('今日净收入', TrendCharts, '#36a3f7', 'todayIn', 'monthIn', 'proMonthIn')
])

onMounted(() => {
  getIncomeData().then((res) => {
    Object.keys(income).forEach((key) => {
      const value = Number(res?.[key])
      income[key] = Number.isFinite(value) ? value : 0
    })
  })
})
</script>

<style scoped lang="scss">
.income-group {
  &__col {
    margin-bottom: 20px;
  }
}
</style>
