import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    title: '苏分宝',
    theme: '#1890ff',
    showSettings: false,
    tagsView: true,
    fixedHeader: true,
    sidebarLogo: true,
    showFooter: true,
    footerTxt: '© 2018-2024 MSHOP <a href="http://www.apache.org/licenses/LICENSE-2.0" target="_blank">All Rights Reserved</a>',
    caseNumber: '苏ICP备17030620号-5'
  }),
  actions: {
    changeSetting(data) {
      if (this.hasOwnProperty(data.key)) {
        this[data.key] = data.value
      }
    }
  }
})

export default useSettingsStore
