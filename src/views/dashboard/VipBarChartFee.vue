<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script setup>
import * as echarts from 'echarts'
import 'echarts/theme/macarons'
import { debounce } from '@/utils/index.js'
import { chart } from '@/api/visits.js'
import { ref, onMounted, onBeforeUnmount } from 'vue'

const animationDuration = 6000

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

defineOptions({ name: 'VipBarChartFee' })

const chartRef = ref(null)
const day = ref([])
const num = ref([])
let __resizeHandler

function initChart() {
  chartRef.value = echarts.init(document.querySelector('.' + props.className), 'macarons')

  chart('vip', 'fee').then(res => {
    const _info = res.chart
    const dayArr = []
    const numArr = []
    _info.forEach(function(item) {
      dayArr.push(item.time)
      numArr.push(item.num.toFixed(2))
    })

    console.log(dayArr, numArr)
    day.value = dayArr
    num.value = numArr

    chartRef.value.setOption({
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
        data: dayArr,
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
        data: numArr,
        animationDuration
      }]
    })
  })

  console.log('day:' + day.value)
}

onMounted(() => {
  initChart()
  __resizeHandler = debounce(() => {
    if (chartRef.value) {
      chartRef.value.resize()
    }
  }, 100)
  window.addEventListener('resize', __resizeHandler)
})

onBeforeUnmount(() => {
  if (!chartRef.value) {
    return
  }
  window.removeEventListener('resize', __resizeHandler)
  chartRef.value.dispose()
  chartRef.value = null
})
</script>
