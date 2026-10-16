<template>
  <div class="menu-tab-box">
    <div class="tab-list" v-for="(item,index) in componentContent.menus" :key="index">
      <div class="tab-img Shop-selector-circular">
        <img :src="item.pic" />
        <!---->
      </div>
      <p class="Shop-selector-rect">
        <span>{{item.name}}</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    componentContent: {
      type: Object
    }
  }
}
</script>

<style lang="scss" scoped>
@use 'sass:math';
.menu-tab-box {
  display: grid;
  grid-template-columns: repeat(4, 25%);
  grid-template-rows: repeat(2, math.div(170, 750) * 500px);
  text-align: center;
  .tab-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .tab-img {
    border-radius: math.div(26, 750) * 500px;
    margin-bottom: math.div(10, 750) * 500px;
    width: math.div(96, 750) * 500px;
    img {
      width: 100%;
      height: auto;
    }
  }
  p {
    display: block;
    text-align: center;
  }
}
</style>
