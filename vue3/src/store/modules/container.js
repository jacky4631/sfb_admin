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
      this.activeComponent = component
    },
    setComponentsData(data) {
      this.componentsData = data
    },
    addComponent(component) {
      this.componentsData.push(component)
    },
    removeComponent(index) {
      this.componentsData.splice(index, 1)
    }
  }
})

export default useContainerStore
