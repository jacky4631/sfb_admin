<template>
  <div class="layout hom-layout">
    <div
      class="list-group-item"
      v-for="(item, index) in componentsData"
      :key="index"
    >
      <component
        :is="componentMap[terminal - 1].get(item.type)"
        :componentContent="item.componentContent"
        :terminal="terminal"
      ></component>
    </div>
  </div>
</template>

<script>
import componentMap from './componentMap.js'
import { useContainerStore } from '@/store/modules/container.js'
import { getCanvasData, getProducts } from '@/api/canvasApi.js'
export default {
  name: 'canvasPage',
  data () {
    return {
      terminal: 3,
      componentsData: [],
      activeComponent: -1,
      componentMap: componentMap
    }
  },
  mounted () {
    this.canvasGet()
  },
  methods: {
    setComponentsData(data) {
      useContainerStore().setComponentsData(data)
    },
    // 读取画布
    async canvasGet () {
      const res = await getCanvasData({'terminal': this.terminal})
      // 后端 getCanvas 直接返回 StoreCanvas 扁平对象（无 data 包裹）；未保存过画布时为空 body，需判空
      if (res && res.json) {
        this.canvasId = res.canvasId
        this.componentsData = JSON.parse(res.json)
        var componentsData = this.componentsData
        for (let i = 0; i < componentsData.length; i++) {
          if (componentsData[i].type === 'productList') {
            if (componentsData[i].componentContent.categoryId) {
              let params = {
                page: 1,
                pageSize: 20,
                classifyId: componentsData[i].componentContent.categoryId
              }
              getProducts(params).then(rres => {
                componentsData[i].componentContent.imgTextData = rres.list
              })
            }
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.hom-layout {
  background-color: #f5f5f5;
}
</style>

<style lang="scss">
.warp {
  width: 1252px;
  margin: 0 auto;
  max-width: 96%;
}
.flex-box {
  display: flex;
}
</style>
