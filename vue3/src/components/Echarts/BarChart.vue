<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script setup>
import echarts from 'echarts'
import { debounce } from '@/utils'
import { onMounted, onUnmounted, ref } from 'vue'

defineOptions({
  name: 'BarChart'
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
const chart = ref(null)
let __resizeHandler = null

function initChart() {
  chart.value = echarts.init(chartContainer.value, 'macarons')

  chart.value.setOption({
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
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
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
      name: 'pageA',
      type: 'bar',
      stack: 'vistors',
      barWidth: '60%',
      data: [79, 52, 200, 334, 390, 330, 220],
      animationDuration
    }, {
      name: 'pageB',
      type: 'bar',
      stack: 'vistors',
      barWidth: '60%',
      data: [80, 52, 200, 334, 390, 330, 220],
      animationDuration
    }, {
      name: 'pageC',
      type: 'bar',
      stack: 'vistors',
      barWidth: '60%',
      data: [30, 52, 200, 334, 390, 330, 220],
      animationDuration
    }]
  })
}

const chartContainer = ref(null)

onMounted(() => {
  initChart()
  __resizeHandler = debounce(() => {
    if (chart.value) {
      chart.value.resize()
    }
  }, 100)
  window.addEventListener('resize', __resizeHandler)
})

onUnmounted(() => {
  if (!chart.value) {
    return
  }
  window.removeEventListener('resize', __resizeHandler)
  chart.value.dispose()
  chart.value = null
})
</script>
