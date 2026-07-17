<template>
  <div ref="chartRef" :class="className" :style="{height:height,width:width}" />
</template>

<script setup>
import * as echarts from 'echarts'
import 'echarts/theme/macarons'
import { debounce } from '@/utils'
import { chart } from '@/api/visits'
import { onMounted, onBeforeUnmount, ref } from 'vue'

defineOptions({
  name: 'DyBarChartFee'
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

const animationDuration = 6000
const chartRef = ref(null)
const day = ref([])
const num = ref([])

let resizeHandler

const initChart = () => {
  const chartInstance = echarts.init(chartRef.value, 'macarons')

  chart('dy', 'fee').then(res => {
    const _info = res.chart
    const dayData = []
    const numData = []
    _info.forEach(function(item) {
      dayData.push(item.time)
      numData.push(item.num.toFixed(2))
    })

    console.log(dayData, numData)

    chartInstance.setOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        top: 10,
        left: '2%',
        right: '2%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [{
        type: 'category',
        data: dayData,
        axisTick: {
          alignWithLabel: true
        }
      }],
      yAxis: [{
        type: 'value',
        axisTick: {
          show: false
        }
      }],
      series: [{
        name: '预估佣金',
        type: 'line',
        stack: 'vistors',
        barWidth: '60%',
        data: numData,
        animationDuration
      }]
    })
  })

  console.log('day:' + day.value)
}

onMounted(() => {
  initChart()
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
