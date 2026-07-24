<template>
  <span>{{ displayValue }}</span>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

defineOptions({
  name: 'CountUp'
})

const props = defineProps({
  startVal: {
    type: Number,
    default: 0
  },
  endVal: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number,
    default: 2000
  },
  decimals: {
    type: Number,
    default: 0
  },
  prefix: {
    type: String,
    default: ''
  },
  suffix: {
    type: String,
    default: ''
  },
  separator: {
    type: String,
    default: ''
  },
  autoplay: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['started', 'finished'])

const localStartVal = ref(props.startVal)
const displayValue = ref(formatValue(props.startVal))
let rafId = null
let startTime = null
let remainingTime = 0

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)

function formatValue(num) {
  if (props.decimals > 0) {
    return props.prefix + num.toFixed(props.decimals) + props.suffix
  }
  return props.prefix + Math.round(num).toString() + props.suffix
}

function count() {
  const now = performance.now()
  const elapsed = now - startTime
  const progress = Math.min(elapsed / props.duration, 1)
  const easedProgress = easeOutCubic(progress)

  const currentVal = localStartVal.value + (props.endVal - localStartVal.value) * easedProgress
  displayValue.value = formatValue(currentVal)

  if (progress < 1) {
    rafId = requestAnimationFrame(count)
  } else {
    displayValue.value = formatValue(props.endVal)
    emit('finished')
  }
}

function start() {
  localStartVal.value = props.startVal
  startTime = performance.now()
  remainingTime = props.duration
  emit('started')
  rafId = requestAnimationFrame(count)
}

function pause() {
  if (rafId) {
    cancelAnimationFrame(rafId)
    rafId = null
    const elapsed = performance.now() - startTime
    remainingTime = Math.max(props.duration - elapsed, 0)
  }
}

function resume() {
  if (!rafId && remainingTime > 0) {
    localStartVal.value = parseFloat(displayValue.value.replace(props.prefix, '').replace(props.suffix, '')) || 0
    startTime = performance.now()
    rafId = requestAnimationFrame(count)
  }
}

function reset() {
  if (rafId) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
  localStartVal.value = props.startVal
  displayValue.value = formatValue(props.startVal)
  startTime = null
  remainingTime = 0
}

watch(() => props.endVal, () => {
  if (props.autoplay) {
    start()
  }
})

onMounted(() => {
  if (props.autoplay) {
    start()
  }
})

onBeforeUnmount(() => {
  if (rafId) {
    cancelAnimationFrame(rafId)
  }
})

defineExpose({ start, pause, resume, reset })
</script>
