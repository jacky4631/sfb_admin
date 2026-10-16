<template>
  <!-- 不能包外层 div：sidebar.scss 折叠规则用的是直接子选择器（.el-sub-menu__title > span），
       多包一层会导致折叠时文字无法隐藏 -->
  <svg-icon v-if="icon" :icon-class="icon" />
  <span v-if="title">{{ title }}</span>
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
