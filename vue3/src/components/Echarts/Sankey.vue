<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script setup>
import * as echarts from 'echarts'
import { debounce } from '@/utils'
import { onMounted, onUnmounted, ref } from 'vue'

defineOptions({
  name: 'Sankey'
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
    series: {
      type: 'sankey',
      layout: 'none',
      focusNodeAdjacency: 'allEdges',
      data: [{
        name: 'a'
      }, {
        name: 'b'
      }, {
        name: 'a1'
      }, {
        name: 'a2'
      }, {
        name: 'b1'
      }, {
        name: 'c'
      }],
      links: [{
        source: 'a',
        target: 'a1',
        value: 5
      }, {
        source: 'a',
        target: 'a2',
        value: 3
      }, {
        source: 'b',
        target: 'b1',
        value: 8
      }, {
        source: 'a',
        target: 'b1',
        value: 3
      }, {
        source: 'b1',
        target: 'a1',
        value: 1
      }, {
        source: 'b1',
        target: 'c',
        value: 2
      }]
    }
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
