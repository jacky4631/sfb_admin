<template>
  <div class="app-wrapper">
    <div class="main-container">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'Layout' })
</script>

<style lang="scss" scoped>
.app-wrapper {
  width: 100%;
  height: 100%;
}

.main-container {
  width: 100%;
  height: 100%;
}
</style>
