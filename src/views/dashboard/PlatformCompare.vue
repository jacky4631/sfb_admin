<template>
  <el-card shadow="hover" class="platform-compare">
    <template #header>
      <div class="platform-compare__head">
        <div class="platform-compare__title">
          <el-icon :size="16" class="platform-compare__title-icon"><DataAnalysis /></el-icon>
          <span>近 30 天平台数据对比</span>
        </div>
        <el-radio-group v-model="activeType" size="small" @change="render">
          <el-radio-button v-for="item in TYPES" :key="item.value" :value="item.value">
            {{ item.label }}
          </el-radio-button>
        </el-radio-group>
      </div>
    </template>

    <div v-loading="loading" class="platform-compare__body">
      <div v-show="hasData" ref="chartRef" class="platform-compare__chart" />
      <el-empty v-if="!loading && !hasData" description="近 30 天暂无数据" />
      <div v-if="hasData" class="platform-compare__totals">
        <div
          v-for="item in totals"
          :key="item.key"
          class="platform-compare__tile"
          :style="{ '--tile-color': item.color }"
        >
          <div class="platform-compare__tile-head">
            <span class="platform-compare__tile-name">{{ item.label }}</span>
            <span class="platform-compare__tile-value">{{ item.display }}</span>
          </div>
          <div class="platform-compare__tile-bar">
            <i :style="{ width: `${item.percent}%` }" />
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import * as echarts from 'echarts'
import { DataAnalysis } from '@element-plus/icons-vue'
import { debounce } from '@/utils/index.js'
import { chart } from '@/api/visits.js'
import { formatAmount, formatInteger } from './statFormat.js'

defineOptions({
  name: 'PlatformCompare'
})

const TYPES = [
  { value: 'count', label: '订单数', unit: '单' },
  { value: 'price', label: '成交额', unit: '元' },
  { value: 'fee', label: '预估佣金', unit: '元' }
]

const PLATFORMS = [
  { key: 'tb', label: '淘宝', color: '#5b8ff9' },
  { key: 'jd', label: '京东', color: '#f6903d' },
  { key: 'pdd', label: '拼多多', color: '#5ad8a6' },
  { key: 'dy', label: '抖音', color: '#945fb9' },
  { key: 'vip', label: '唯品会', color: '#1e9493' }
]

const activeType = ref('count')
const loading = ref(false)
const chartRef = ref(null)

// 按指标缓存请求结果。缓存的是 promise 而不是解析后的数据：
// 若只缓存数据，同一指标在请求未回来之前被再次触发（快速反复切 Tab、
// 或组件被重复挂载）会各发一轮请求，命中不了尚未写入的缓存
const cache = new Map()
// 同一指标的 5 个平台并发请求，切走再切回时丢弃过期响应
let requestId = 0

let instance = null
const seriesMap = ref({})
const axisDays = ref([])

const hasData = computed(() => axisDays.value.length > 0)

const currentType = computed(() => TYPES.find((item) => item.value === activeType.value) || TYPES[0])

const formatByType = (value) =>
  activeType.value === 'count' ? formatInteger(value) : formatAmount(value)

const totals = computed(() => {
  const sums = PLATFORMS.map((platform) => {
    const points = seriesMap.value[platform.key] || []
    const sum = points.reduce((acc, item) => acc + (Number(item.num) || 0), 0)
    return { ...platform, sum }
  })
  const max = Math.max(...sums.map((item) => item.sum), 0)
  return sums.map((item) => ({
    key: item.key,
    label: item.label,
    color: item.color,
    display: `${formatByType(item.sum)}${currentType.value.unit}`,
    percent: max > 0 ? (item.sum / max) * 100 : 0
  }))
})

const fetchType = (type) => {
  if (cache.has(type)) {
    return cache.get(type)
  }
  const pending = Promise.all(
    PLATFORMS.map((platform) => chart(platform.key, type).then((res) => res?.chart || []))
  ).then((list) =>
    PLATFORMS.reduce((acc, platform, index) => {
      acc[platform.key] = list[index]
      return acc
    }, {})
  )
  cache.set(type, pending)
  // 失败时清除缓存，下次切回来可以重试，不会永远停在空数据
  pending.catch(() => cache.delete(type))
  return pending
}

/**
 * 汇总各平台返回的日期作为 X 轴
 *
 * 接口只返回有数据的日期（稀疏序列），每个平台的日期集合互不相同，
 * 所以必须取并集；但并集不能按「首次出现顺序」拼接，否则会出现
 * 09-29 → 10-08 → 10-12 → 10-1 这种乱序，曲线会跟着错位。
 *
 * 返回的 time 形如 M-D（不含年份），先按 月*100+日 升序排；
 * 近 30 天的窗口若跨公历年（12 月 → 1 月），升序会把 1 月排到 12 月前面，
 * 此时相邻键之间会出现一个远大于正常月差的跳变（如 0115 → 1201 差 1086），
 * 以该跳变为分界轮转数组即可还原真实时间顺序（正常月差最大约 73）。
 */
const dayKey = (time) => {
  const [month, day] = String(time).split('-').map(Number)
  return Number.isFinite(month) && Number.isFinite(day) ? month * 100 + day : null
}

const buildAxis = (raw) => {
  const seen = new Set()
  const days = []
  Object.values(raw).forEach((points) => {
    points.forEach((item) => {
      if (item.time !== undefined && !seen.has(item.time)) {
        seen.add(item.time)
        days.push(item.time)
      }
    })
  })

  const keyed = days.map((time) => ({ time, key: dayKey(time) }))
  const sortable = keyed.filter((item) => item.key !== null)
  const unknown = keyed.filter((item) => item.key === null)
  sortable.sort((a, b) => a.key - b.key)

  let cut = -1
  let maxGap = 0
  for (let i = 1; i < sortable.length; i++) {
    const gap = sortable[i].key - sortable[i - 1].key
    if (gap > maxGap) {
      maxGap = gap
      cut = i
    }
  }
  // 跳变超过 100 视为跨年分界，从分界处开始即为真实时间顺序
  const ordered = maxGap > 100 && cut > 0
    ? sortable.slice(cut).concat(sortable.slice(0, cut))
    : sortable

  return ordered.map((item) => item.time).concat(unknown.map((item) => item.time))
}

const render = () => {
  const type = activeType.value
  const currentRequest = ++requestId
  loading.value = true

  return fetchType(type)
    .then((raw) => {
      // 已切走则丢弃这次响应，避免旧指标的数据覆盖新图表
      if (currentRequest !== requestId) {
        return
      }
      const days = buildAxis(raw)
      const lookup = {}
      PLATFORMS.forEach((platform) => {
        lookup[platform.key] = new Map(
          (raw[platform.key] || []).map((item) => [item.time, Number(item.num)])
        )
      })

      axisDays.value = days
      seriesMap.value = PLATFORMS.reduce((acc, platform) => {
        acc[platform.key] = raw[platform.key] || []
        return acc
      }, {})

      if (!days.length) {
        return
      }
      return nextTick().then(() => {
        if (!instance) {
          instance = echarts.init(chartRef.value)
        }
        instance.setOption(
          {
            color: PLATFORMS.map((platform) => platform.color),
            tooltip: {
              trigger: 'axis',
              valueFormatter: (value) =>
                value === null || value === undefined ? '—' : `${formatByType(value)}${currentType.value.unit}`
            },
            legend: {
              top: 0,
              right: 0,
              icon: 'roundRect',
              itemWidth: 10,
              itemHeight: 3,
              textStyle: { color: '#606266', fontSize: 12 }
            },
            // 右侧留白：boundaryGap: false 会让最后一个类目贴在绘图区右边缘，
            // 它的居中标签会被砍掉一半（如 10-14 只显示成 10-1）
            grid: { top: 36, left: 8, right: 28, bottom: 8, containLabel: true },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: days,
              axisTick: { show: false },
              axisLine: { lineStyle: { color: '#e4e7ed' } },
              axisLabel: { color: '#909399', hideOverlap: true }
            },
            yAxis: {
              type: 'value',
              axisTick: { show: false },
              axisLine: { show: false },
              splitLine: { lineStyle: { color: '#f2f3f5' } },
              axisLabel: {
                color: '#909399',
                formatter: (value) => (Math.abs(value) >= 10000 ? `${value / 10000}万` : `${value}`)
              }
            },
            series: PLATFORMS.map((platform) => ({
              name: platform.label,
              type: 'line',
              smooth: true,
              showSymbol: false,
              emphasis: { focus: 'series' },
              lineStyle: { width: 2 },
              data: days.map((day) => {
                const value = lookup[platform.key].get(day)
                return Number.isFinite(value) ? value : null
              })
            }))
          },
          true
        )
        instance.resize()
      })
    })
    .finally(() => {
      if (currentRequest === requestId) {
        loading.value = false
      }
    })
}

const handleResize = debounce(() => instance?.resize(), 100)

onMounted(() => {
  render()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  instance?.dispose()
  instance = null
})
</script>

<style scoped lang="scss">
.platform-compare {
  border-radius: 8px;

  :deep(.el-card__header) {
    padding: 14px 20px;
  }
}

.platform-compare__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
}

.platform-compare__title {
  display: flex;
  align-items: center;
  font-size: 15px;
  font-weight: 500;
  color: #303133;
}

.platform-compare__title-icon {
  margin-right: 8px;
  color: #409eff;
}

.platform-compare__body {
  min-height: 320px;
}

.platform-compare__chart {
  width: 100%;
  height: 320px;
}

.platform-compare__totals {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px 20px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f2f3f5;
}

.platform-compare__tile-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.platform-compare__tile-name {
  font-size: 13px;
  color: #909399;
}

.platform-compare__tile-value {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  font-variant-numeric: tabular-nums;
}

.platform-compare__tile-bar {
  height: 4px;
  margin-top: 6px;
  border-radius: 2px;
  background: #f2f3f5;
  overflow: hidden;

  i {
    display: block;
    height: 100%;
    border-radius: 2px;
    background: var(--tile-color);
    transition: width 0.4s ease;
  }
}
</style>
