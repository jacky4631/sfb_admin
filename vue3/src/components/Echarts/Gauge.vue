<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script setup>
import echarts from 'echarts'
import { debounce } from '@/utils'
import { onMounted, onUnmounted, ref } from 'vue'

defineOptions({
  name: 'Gauge'
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

const chart = ref(null)
let __resizeHandler = null

function initChart() {
  chart.value = echarts.init(chartContainer.value, 'macarons')

  chart.value.setOption({
    tooltip: {
      formatter: '{a} <br/>{b} : {c}%'
    },
    toolbox: {
      feature: {
        restore: {},
        saveAsImage: {}
      }
    },
    series: [
      {
        name: '业务指标',
        type: 'gauge',
        detail: { formatter: '{value}%' },
        data: [{ value: 50, name: '完成率' }]
      }
    ]
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
