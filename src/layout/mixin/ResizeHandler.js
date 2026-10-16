import { useAppStore } from '../../store/modules/app.ts'

const { body } = document
const WIDTH = 992

export default {
  watch: {
    $route(route) {
      if (this.device === 'mobile' && this.sidebar.opened) {
        useAppStore().closeSideBar({ withoutAnimation: false })
      }
    }
  },
  beforeMount() {
    window.addEventListener('resize', this.$_resizeHandler)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.$_resizeHandler)
  },
  mounted() {
    const isMobile = this.$_isMobile()
    if (isMobile) {
      useAppStore().toggleDevice('mobile')
      useAppStore().closeSideBar({ withoutAnimation: true })
    }
  },
  methods: {
    $_isMobile() {
      const rect = body.getBoundingClientRect()
      return rect.width - 1 < WIDTH
    },
    $_resizeHandler() {
      if (!document.hidden) {
        const isMobile = this.$_isMobile()
        useAppStore().toggleDevice(isMobile ? 'mobile' : 'desktop')

        if (isMobile) {
          useAppStore().closeSideBar({ withoutAnimation: true })
        }
      }
    }
  }
}
