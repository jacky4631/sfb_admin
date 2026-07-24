import { defineStore } from 'pinia'

interface DictState {
  dict: Record<string, any[]>
  dictLabel: Record<string, Record<string, string>>
}

export const useDictStore = defineStore('dict', {
  state: (): DictState => ({
    dict: {},
    dictLabel: {}
  }),
  actions: {
    setDict(key: string, data: any[]) {
      this.dict[key] = data
    },
    setDictLabel(key: string, label: Record<string, string>) {
      this.dictLabel[key] = label
    },
    getDictLabel(key: string, value: string | number) {
      return this.dictLabel[key]?.[value] || ''
    }
  }
})
