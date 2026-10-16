import { computed } from 'vue'
import { useContainerStore } from '@/store/modules/container.js'

export const toolMixin = {
  computed: {
    activeComponent: () => useContainerStore().activeComponent,
    componentsData: () => useContainerStore().componentsData
  },
  methods: {
    setComponentsData(data) {
      useContainerStore().setComponentsData(data)
    }
  }
}

export function checkEmptyChild(arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].childs && arr[i].childs.length === 0) {
      arr[i].childs = ''
    } else if (arr[i].childs && arr[i].childs.length > 0) {
      checkEmptyChild(arr[i].childs)
    }
  }
}
