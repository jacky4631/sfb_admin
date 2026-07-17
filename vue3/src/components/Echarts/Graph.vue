<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script setup>
import echarts from 'echarts'
import { debounce } from '@/utils'
import { onMounted, onUnmounted, ref } from 'vue'

defineOptions({
  name: 'Graph'
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
  const axisData = ['周一', '周二', '周三', '很长很长的周四', '周五', '周六', '周日']
  const data = axisData.map(function(item, i) {
    return Math.round(Math.random() * 1000 * (i + 1))
  })
  const links = data.map(function(item, i) {
    return {
      source: i,
      target: i + 1
    }
  })
  links.pop()
  chart.value.setOption({
    title: {
      text: '笛卡尔坐标系上的 Graph'
    },
    tooltip: {},
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: axisData
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        type: 'graph',
        layout: 'none',
        coordinateSystem: 'cartesian2d',
        symbolSize: 40,
        label: {
          normal: {
            show: true
          }
        },
        edgeSymbol: ['circle', 'arrow'],
        edgeSymbolSize: [4, 10],
        data: data,
        links: links,
        lineStyle: {
          normal: {
            color: '#2f4554'
          }
        }
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
