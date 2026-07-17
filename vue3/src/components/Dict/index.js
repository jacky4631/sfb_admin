import Dict from './Dict'

export default {
  install(app) {
    app.mixin({
      data() {
        if (this.$options.dicts instanceof Array) {
          const dict = {
            dict: {},
            label: {}
          }
          return { dict }
        }
        return {}
      },
      created() {
        if (this.$options.dicts instanceof Array) {
          const dictObj = new Dict(this.dict)
          dictObj.init(this.$options.dicts, () => {
            this.$nextTick(() => {
              this.$emit('dictReady')
            })
          })
        }
      }
    })
  }
}
