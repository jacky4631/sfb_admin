import { defineStore } from 'pinia'

export const useApiStore = defineStore('api', {
  state: () => ({
    apiObj: {}
  }),
  actions: {
    setApi({ key, value }) {
      this.apiObj[key] = value
    }
  }
})

export default useApiStore
