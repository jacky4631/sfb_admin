import { defineStore } from 'pinia'

export const useApiStore = defineStore('api', {
  state: () => ({
    apiObj: {}
  }),
  mutations: {
    SET_API: (state, { key, value }) => {
      state.apiObj[key] = value
    }
  },
  actions: {
    setApi({ key, value }) {
      this.SET_API({ key, value })
    }
  }
})

export default useApiStore
