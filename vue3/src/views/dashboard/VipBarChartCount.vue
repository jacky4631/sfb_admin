<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script setup>
import echarts from 'echarts'
import 'echarts/theme/macarons'
import { debounce } from '@/utils'
import { chart } from '@/api/visits'
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

defineOptions({ name: 'VipBarChartCount' })

const chart = ref(null)
const day = ref([])
const num = ref([])
let __resizeHandler

function initChart() {
  chart.value = echarts.init(document.querySelector('.' + props.className), 'macarons')

  chart('vip', 'count').then(res => {
    const _info = res.chart
    const dayArr = []
    const numArr = []
    _info.forEach(function(item) {
      dayArr.push(item.time)
      numArr.push(item.num)
    })

    console.log(dayArr, numArr)
    day.value = dayArr
    num.value = numArr

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
        name: '订单数',
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
    if (chart.value) {
      chart.value.resize()
    }
  }, 100)
  window.addEventListener('resize', __resizeHandler)
})

onBeforeUnmount(() => {
  if (!chart.value) {
    return
  }
  window.removeEventListener('resize', __resizeHandler)
  chart.value.dispose()
  chart.value = null
})
</script>
