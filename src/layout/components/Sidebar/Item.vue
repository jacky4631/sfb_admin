<template>
  <div class="menu-item-wrapper">
    <svg-icon v-if="icon" :icon-class="icon" />
    <span v-if="title">{{ title }}</span>
  </div>
</template>

<script setup>
defineOptions({
  name: 'MenuItem'
})

defineProps({
  icon: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.menu-item-wrapper {
  display: flex;
  align-items: center;
}
</style>
