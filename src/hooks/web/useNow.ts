import { ref, onMounted, onUnmounted } from 'vue'
import dayjs from 'dayjs'

export const useNow = () => {
  const now = ref(dayjs())

  let timer: any = null

  onMounted(() => {
    timer = setInterval(() => {
      now.value = dayjs()
    }, 1000)
  })

  onUnmounted(() => {
    if (timer) clearInterval(timer)
  })

  return {
    now
  }
}
