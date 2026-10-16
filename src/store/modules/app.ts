import { defineStore } from 'pinia'

interface SidebarState {
  opened: boolean
  withoutAnimation: boolean
}

interface AppState {
  sidebar: SidebarState
  device: 'desktop' | 'mobile'
  size: 'large' | 'default' | 'small'
  grey: boolean
}

// 唯一权威的 app store（原 app.js 冗余副本已删除，侧栏折叠/移动端逻辑合并于此）
export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    sidebar: {
      opened: true,
      withoutAnimation: false
    },
    device: 'desktop',
    size: 'small',
    grey: false
  }),
  actions: {
    toggleSideBar() {
      this.sidebar.opened = !this.sidebar.opened
      this.sidebar.withoutAnimation = false
    },
    closeSideBar(withoutAnimation: boolean) {
      this.sidebar.opened = false
      this.sidebar.withoutAnimation = withoutAnimation
    },
    toggleDevice(device: 'desktop' | 'mobile') {
      this.device = device
    },
    setSize(size: 'large' | 'default' | 'small') {
      this.size = size
    },
    setGrey(grey: boolean) {
      this.grey = grey
    }
  }
})
