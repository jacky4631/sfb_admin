<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script setup>
import * as echarts from 'echarts'
import { debounce } from '@/utils/index.js'
import { onMounted, onUnmounted, ref } from 'vue'

defineOptions({
  name: 'Sunburst'
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
  const data = [{
    name: 'Grandpa',
    children: [{
      name: 'Uncle Leo',
      value: 15,
      children: [{
        name: 'Cousin Jack',
        value: 2
      }, {
        name: 'Cousin Mary',
        value: 5,
        children: [{
          name: 'Jackson',
          value: 2
        }]
      }, {
        name: 'Cousin Ben',
        value: 4
      }]
    }, {
      name: 'Father',
      value: 10,
      children: [{
        name: 'Me',
        value: 5
      }, {
        name: 'Brother Peter',
        value: 1
      }]
    }]
  }, {
    name: 'Nancy',
    children: [{
      name: 'Uncle Nike',
      children: [{
        name: 'Cousin Betty',
        value: 1
      }, {
        name: 'Cousin Jenny',
        value: 2
      }]
    }]
  }]
  chart.value.setOption({
    series: {
      type: 'sunburst',
      data: data,
      radius: [0, '90%'],
      label: {
        rotate: 'radial'
      }
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
