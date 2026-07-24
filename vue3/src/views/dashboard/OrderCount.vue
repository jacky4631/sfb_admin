<template>
  <div :class="className" ref="chartRef" :style="{ height: height, width: width }" />
</template>

<script setup>
import * as echarts from 'echarts'
import 'echarts/theme/macarons'
import { getOrderCount } from '@/api/visits'
import { debounce } from '@/utils'
import { onMounted, onBeforeUnmount, ref } from 'vue'

defineOptions({
  name: 'OrderCount'
})

const props = defineProps({
  className: {
    type: String,
    default: 'chart'
  },
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '300px'
  }
})

const chartRef = ref(null)
const column = ref([])
const orderCountDatas = ref([])

let resizeHandler

const initChart = () => {
  const chartInstance = echarts.init(chartRef.value, 'macarons')

  chartInstance.setOption({
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)',
    },
    legend: {
      left: 'center',
      bottom: '10',
      data: column.value,
    },
    calculable: true,
    series: [
      {
        name: '商品分类销售占总销售的比例',
        type: 'pie',
        roseType: 'radius',
        radius: [15, 95],
        center: ['50%', '38%'],
        data: orderCountDatas.value,
        animationEasing: 'cubicInOut',
        animationDuration: 2600,
      },
    ],
  })
}

onMounted(() => {
  getOrderCount()
    .then((res) => {
      column.value = res.column
      orderCountDatas.value = res.orderCountDatas
    })
    .then(() => {
      initChart()
    })

  resizeHandler = debounce(() => {
    const chartInstance = echarts.init(chartRef.value, 'macarons')
    chartInstance.resize()
  }, 100)
  window.addEventListener('resize', resizeHandler)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeHandler)
  const chartInstance = echarts.init(chartRef.value, 'macarons')
  chartInstance.dispose()
})
</script>


<style lang="scss" scoped>
  .acea-row{
    :deep(.el-avatar--small) {
      width: 22px;
      height: 22px;
      line-height: 22px;
    }
  }
  .checkTime{
    :deep(.el-radio__input) {
      display: none;
    }
  }
  .ivu-pl-8{
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
  .ivu-mb{
    margin-bottom: 10px;
  }
</style>
