<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script setup>
import * as echarts from 'echarts'
import 'echarts/theme/macarons'
import { debounce } from '@/utils'
import { getChartData } from '@/api/visits'
import { onMounted, onBeforeUnmount, ref, reactive } from 'vue'

defineOptions({
  name: 'LineChart'
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
    default: '350px'
  },
  autoResize: {
    type: Boolean,
    default: true
  }
})

const chartRef = ref(null)
let sidebarElm = null
const chartData = reactive({
  visitsData: [],
  ipData: []
})
const weekDays = ref([])

let resizeHandler
let sidebarResizeHandler

const sidebarResizeHandlerFn = (e) => {
  if (e.propertyName === 'width') {
    resizeHandler()
  }
}

const setOptions = ({ visitsData, ipData } = {}) => {
  const chartInstance = echarts.init(chartRef.value, 'macarons')
  chartInstance.setOption({
    xAxis: {
      data: weekDays.value,
      boundaryGap: false,
      axisTick: {
        show: false
      }
    },
    grid: {
      left: 10,
      right: 10,
      bottom: 20,
      top: 30,
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      },
      padding: [5, 10]
    },
    yAxis: {
      axisTick: {
        show: false
      }
    },
    legend: {
      data: ['pv', 'ip']
    },
    series: [{
      name: 'pv', itemStyle: {
        normal: {
          color: '#FF005A',
          lineStyle: {
            color: '#FF005A',
            width: 2
          }
        }
      },
      smooth: true,
      type: 'line',
      data: visitsData || chartData.visitsData,
      animationDuration: 2800,
      animationEasing: 'cubicInOut'
    },
    {
      name: 'ip',
      smooth: true,
      type: 'line',
      itemStyle: {
        normal: {
          color: '#3888fa',
          lineStyle: {
            color: '#3888fa',
            width: 2
          },
          areaStyle: {
            color: '#f3f8ff'
          }
        }
      },
      data: ipData || chartData.ipData,
      animationDuration: 2800,
      animationEasing: 'quadraticOut'
    }]
  })
}

const initChart = () => {
  const chartInstance = echarts.init(chartRef.value, 'macarons')
  setOptions(chartData)
}

onMounted(() => {
  getChartData().then(res => {
    chartData.visitsData = res.visitsData
    chartData.ipData = res.ipData
    weekDays.value = res.weekDays
    initChart()
  })

  if (props.autoResize) {
    resizeHandler = debounce(() => {
      const chartInstance = echarts.init(chartRef.value, 'macarons')
      chartInstance.resize()
    }, 100)
    window.addEventListener('resize', resizeHandler)
  }

  sidebarElm = document.getElementsByClassName('sidebar-container')[0]
  sidebarElm && sidebarElm.addEventListener('transitionend', sidebarResizeHandlerFn)
})

onBeforeUnmount(() => {
  const chartInstance = echarts.init(chartRef.value, 'macarons')
  if (props.autoResize) {
    window.removeEventListener('resize', resizeHandler)
  }

  sidebarElm && sidebarElm.removeEventListener('transitionend', sidebarResizeHandlerFn)

  chartInstance.dispose()
})
</script>
