import { defineStore } from 'pinia'

export const useContainerStore = defineStore('container', {
  state: () => ({
    activeComponent: {},
    componentsData: [],
    terminal: 3
  }),
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
    },
    setTerminal(terminal) {
      this.terminal = terminal
    }
  }
})

export default useContainerStore
