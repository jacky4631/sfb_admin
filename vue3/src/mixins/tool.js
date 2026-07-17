import { mapGetters, mapMutations } from 'vuex'
import { useContainerStore } from '@/store/modules/container'

export const toolMixin = {
  computed: {
    ...mapGetters([
      'activeComponent',
      'componentsData'
    ])
  },
  methods: {
    ...mapMutations({
      setComponentsData: 'SET_COMPONENTS_DATA'
    })
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
