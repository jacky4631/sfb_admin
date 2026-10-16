<template>
  <span class="trend-badge" :class="`trend-badge--${direction}`">
    <el-icon v-if="direction !== 'flat'" :size="12" class="trend-badge__icon">
      <CaretTop v-if="direction === 'up'" />
      <CaretBottom v-else />
    </el-icon>
    {{ text }}
  </span>
</template>

<script setup>
import { computed } from 'vue'
import { CaretTop, CaretBottom } from '@element-plus/icons-vue'
import { formatTrend } from './statFormat.js'

defineOptions({
  name: 'TrendBadge'
})

const props = defineProps({
  // 环比百分比；null / 非有限值表示不可比
  percent: {
    type: Number,
    default: null
  },
  // 不可比时显示的占位符
  placeholder: {
    type: String,
    default: '—'
  }
})

const comparable = computed(
  () => props.percent !== null && props.percent !== undefined && Number.isFinite(props.percent)
)

const direction = computed(() => {
  if (!comparable.value) {
    return 'flat'
  }
  if (props.percent > 0) {
    return 'up'
  }
  return props.percent < 0 ? 'down' : 'flat'
})

const text = computed(() => (comparable.value ? formatTrend(props.percent) : props.placeholder))
</script>

<style scoped lang="scss">
/* 方向语义沿用项目既有的 .up / .down 定义：红涨绿跌 */
.trend-badge {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  padding: 0 6px;
  border-radius: 3px;
  font-size: 12px;
  /* 与行内文本等高（18px），避免带徽标的卡片比不带的高出 2px */
  line-height: 18px;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.trend-badge__icon {
  margin-right: 1px;
}

.trend-badge--up {
  color: #f5222d;
  background: rgba(245, 34, 45, 0.08);
}

.trend-badge--down {
  color: #39c15b;
  background: rgba(57, 193, 91, 0.08);
}

.trend-badge--flat {
  color: #909399;
  background: #f4f4f5;
}
</style>
