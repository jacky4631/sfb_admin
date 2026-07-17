import { defineStore } from 'pinia'

export const useContainerStore = defineStore('container', {
  state: () => ({
    activeComponent: {},
    componentsData: []
  }),
  mutations: {
    SET_ACTIVE_COMPONENT: (state, component) => {
      state.activeComponent = component
    },
    SET_COMPONENTS_DATA: (state, data) => {
      state.componentsData = data
    },
    ADD_COMPONENT: (state, component) => {
      state.componentsData.push(component)
    },
    REMOVE_COMPONENT: (state, index) => {
      state.componentsData.splice(index, 1)
    }
  },
  actions: {
    setActiveComponent(component) {
      this.SET_ACTIVE_COMPONENT(component)
    },
    setComponentsData(data) {
      this.SET_COMPONENTS_DATA(data)
    },
    addComponent(component) {
      this.ADD_COMPONENT(component)
    },
    removeComponent(index) {
      this.REMOVE_COMPONENT(index)
    }
  }
})

export default useContainerStore
