import { defineStore } from 'pinia'
import { useCache } from '@/hooks/web/useCache'

interface AppState {
  size: 'large' | 'default' | 'small'
  grey: boolean
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    size: 'small',
    grey: false
  }),
  actions: {
    setSize(size: 'large' | 'default' | 'small') {
      this.size = size
    },
    setGrey(grey: boolean) {
      this.grey = grey
    }
  }
})
