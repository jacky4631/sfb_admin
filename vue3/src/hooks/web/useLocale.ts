import { computed } from 'vue'

type Size = 'large' | 'default' | 'small'

export const useLocale = () => {
  const locale = computed(() => 'zh-CN')

  const size = computed<Size>(() => 'small')

  return {
    locale,
    size
  }
}
