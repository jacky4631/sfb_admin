<template>
  <span>{{ currentVal }}</span>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

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
    default: 3000
  },
  decimals: {
    type: Number,
    default: 0
  }
})

const currentVal = ref(props.startVal)
let rafId = null

function animate() {
  const startTime = performance.now()
  const startValue = props.startVal
  const endValue = props.endVal
  const duration = props.duration

  function update(currentTime) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)

    // Ease out quad
    const easeProgress = 1 - (1 - progress) * (1 - progress)
    const newVal = startValue + (endValue - startValue) * easeProgress

    currentVal.value = Number(newVal.toFixed(props.decimals))

    if (progress < 1) {
      rafId = requestAnimationFrame(update)
    }
  }

  rafId = requestAnimationFrame(update)
}

onMounted(() => {
  animate()
})

watch(() => props.endVal, () => {
  if (rafId) cancelAnimationFrame(rafId)
  animate()
})
</script>
