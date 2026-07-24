import { ref, onMounted } from 'vue'
import { useDictStore } from '@/store/modules/dict'

export const useDict = (...dictNames: string[]) => {
  const dictStore = useDictStore()
  const loading = ref(false)
  const initialized = ref(false)

  const init = async () => {
    if (initialized.value) return
    loading.value = true
    try {
      // 模拟加载字典数据
      // const res = await getDictData(dictNames)
      // dictNames.forEach((name, index) => {
      //   dictStore.setDict(name, res[index]?.content || [])
      // })
      initialized.value = true
    } finally {
      loading.value = false
    }
  }

  const getDictLabel = (dictName: string, value: string | number) => {
    return dictStore.getDictLabel(dictName, value)
  }

  onMounted(() => {
    init()
  })

  return {
    loading,
    initialized,
    init,
    getDictLabel
  }
}
