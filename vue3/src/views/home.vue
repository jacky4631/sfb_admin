<template>
  <div class="dashboard-container">
    <div class="dashboard-text">欢迎使用后台管理系统</div>
  </div>
</template>

<script setup>
defineOptions({
  name: 'Home'
})
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  height: 100%;
}
.dashboard-text {
  font-size: 30px;
  line-height: 46px;
}
</style>
