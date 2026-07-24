<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script setup>
import * as echarts from 'echarts'
import 'echarts-gl'
import { debounce } from '@/utils'
import { onMounted, onUnmounted, ref } from 'vue'

defineOptions({
  name: 'Line3D'
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
  const data = []
  for (let t = 0; t < 25; t += 0.001) {
    const x = (1 + 0.25 * Math.cos(75 * t)) * Math.cos(t)
    const y = (1 + 0.25 * Math.cos(75 * t)) * Math.sin(t)
    const z = t + 2.0 * Math.sin(75 * t)
    data.push([x, y, z])
  }
  chart.value.setOption({
    tooltip: {},
    backgroundColor: '#fff',
    visualMap: {
      show: false,
      dimension: 2,
      min: 0,
      max: 30,
      inRange: {
        color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
      }
    },
    xAxis3D: {
      type: 'value'
    },
    yAxis3D: {
      type: 'value'
    },
    zAxis3D: {
      type: 'value'
    },
    grid3D: {
      viewControl: {
        projection: 'orthographic'
      }
    },
    series: [{
      type: 'line3D',
      data: data,
      lineStyle: {
        width: 4
      }
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
