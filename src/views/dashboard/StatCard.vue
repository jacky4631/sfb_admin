<template>
  <el-card shadow="hover" class="stat-card">
    <div class="stat-card__head">
      <span class="stat-card__badge" :style="badgeStyle">
        <el-icon :size="16">
          <component :is="icon" />
        </el-icon>
      </span>
      <span class="stat-card__title">{{ title }}</span>
      <slot name="extra" />
    </div>

    <div class="stat-card__value">
      <CountUp
        :start-val="0"
        :end-val="numericValue"
        :decimals="decimals"
        :duration="duration"
      />
      <span v-if="unit" class="stat-card__unit">{{ unit }}</span>
      <!-- 不可比（基期为 0 或负）时连「较昨日」一起隐掉，不留孤立无值的提示文字 -->
      <span v-if="trend !== null" class="stat-card__delta">
        <span v-if="trendHint" class="stat-card__hint">{{ trendHint }}</span>
        <TrendBadge :percent="trend" />
      </span>
    </div>

    <ul class="stat-card__rows">
      <li v-for="row in rows" :key="row.label" class="stat-card__row">
        <span class="stat-card__label">{{ row.label }}</span>
        <span class="stat-card__row-right">
          <span class="stat-card__row-value">{{ row.value }}</span>
          <TrendBadge v-if="row.trend !== undefined && row.trend !== null" :percent="row.trend" />
        </span>
      </li>
    </ul>
  </el-card>
</template>

<script setup>
import { computed } from 'vue'
import CountUp from '@/components/CountUp/index.vue'
import TrendBadge from './TrendBadge.vue'

defineOptions({
  name: 'StatCard'
})

const props = defineProps({
  // 卡片标题，如「今日成交额」
  title: {
    type: String,
    required: true
  },
  // 图标组件（@element-plus/icons-vue 导出的组件）
  icon: {
    type: [Object, Function],
    default: null
  },
  // 徽章主色，须为 6 位 hex，浅色底由它加透明度推导
  color: {
    type: String,
    default: '#409eff'
  },
  // 主数值
  value: {
    type: [Number, String],
    default: 0
  },
  // 主数值单位，如「单」「元」
  unit: {
    type: String,
    default: ''
  },
  decimals: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number,
    default: 2600
  },
  // 主数值的环比百分比，null 表示不可比（基期为 0）
  trend: {
    type: Number,
    default: null
  },
  // 环比的说明文字，如「较昨日」
  trendHint: {
    type: String,
    default: ''
  },
  // 明细行：[{ label, value, trend }]
  rows: {
    type: Array,
    default: () => []
  }
})

// CountUp 的 endVal 要求 Number，接口字段缺失时兜底为 0，避免 NaN 打断动画
const numericValue = computed(() => {
  const num = Number(props.value)
  return Number.isFinite(num) ? num : 0
})

const badgeStyle = computed(() => ({
  color: props.color,
  background: `${props.color}1a`
}))
</script>

<style scoped lang="scss">
.stat-card {
  border-radius: var(--el-card-border-radius);

  :deep(.el-card__body) {
    padding: 18px 20px 16px;
  }
}

.stat-card__head {
  display: flex;
  align-items: center;
}

.stat-card__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  flex-shrink: 0;
}

.stat-card__title {
  margin-left: 8px;
  font-size: 14px;
  color: #606266;
}

.stat-card__value {
  display: flex;
  align-items: baseline;
  margin: 14px 0 4px;
  font-size: 28px;
  font-weight: 600;
  line-height: 1.2;
  color: #303133;
  font-variant-numeric: tabular-nums;
}

.stat-card__unit {
  margin-left: 4px;
  font-size: 14px;
  font-weight: 400;
  color: #909399;
}

.stat-card__delta {
  display: inline-flex;
  align-items: center;
  margin-left: auto;
  gap: 6px;
}

.stat-card__hint {
  font-size: 12px;
  font-weight: 400;
  color: #a8abb2;
  white-space: nowrap;
}

.stat-card__rows {
  margin: 10px 0 0;
  padding: 0;
  list-style: none;
}

.stat-card__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 0;
  font-size: 13px;
  line-height: 1.4;

  & + & {
    border-top: 1px solid #f2f3f5;
  }
}

.stat-card__label {
  color: #909399;
  /* 不让标签被右侧数值+涨跌徽标挤到换行 */
  flex: 0 0 auto;
  white-space: nowrap;
}

.stat-card__row-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-width: 0;
  gap: 6px;
}

.stat-card__row-value {
  color: #303133;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
</style>
