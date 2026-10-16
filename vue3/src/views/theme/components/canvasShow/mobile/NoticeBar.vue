<template>
  <div class="noticeBar">
    <div class="noticeBar-icon"></div>
    <div class="noticeBar-text">
      {{componentContent.roll[0].info}}
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
.noticeBar {
  display: flex;
  width: 100%;
  box-sizing: border-box;
  flex-direction: row;
  align-items: center;
  padding: math.div(6, 750) * 500px math.div(12, 750) * 500px;
  margin-bottom: math.div(10, 750) * 500px;
  background-color: rgb(255, 251, 232);
  height: math.div(60, 750) * 500px;
  .noticeBar-icon {
    width: math.div(14, 750) * 500px;
    height: math.div(14, 750) * 500px;
    margin-right: math.div(5, 750) * 500px;
  }
  .noticeBar-text {
    flex: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>
