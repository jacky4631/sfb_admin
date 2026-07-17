import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    sidebar: {
      opened: true,
      withoutAnimation: false
    },
    device: 'desktop',
    size: 'small'
  }),
  mutations: {
    TOGGLE_SIDEBAR: (state) => {
      state.sidebar.opened = !state.sidebar.opened
      state.sidebar.withoutAnimation = false
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
      state.sidebar.opened = false
      state.sidebar.withoutAnimation = withoutAnimation
    },
    TOGGLE_DEVICE: (state, device) => {
      state.device = device
    },
    SET_SIZE: (state, size) => {
      state.size = size
    }
  },
  actions: {
    toggleSideBar() {
      this.TOGGLE_SIDEBAR()
    },
    closeSideBar({ withoutAnimation }) {
      this.CLOSE_SIDEBAR(withoutAnimation)
    },
    toggleDevice(device) {
      this.TOGGLE_DEVICE(device)
    },
    setSize(size) {
      this.SET_SIZE(size)
    }
  }
})
