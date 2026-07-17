<template>
  <el-color-picker
    v-model="theme"
    :predefine="predefineColors"
    class="theme-picker"
    popper-class="theme-picker-dropdown"
    @change="handleChange"
  />
</template>

<script setup>
import { ref, watch } from 'vue'
import { useSettingsStore } from '@/store/modules/settings'

defineOptions({
  name: 'ThemePicker'
})

const settingsStore = useSettingsStore()

const ORIGINAL_THEME = '#409EFF'
const predefineColors = ['#409EFF', '#1890ff', '#304156', '#212121', '#11a983', '#13c2c2', '#6959CD', '#f5222d']

const theme = ref(settingsStore.theme || ORIGINAL_THEME)

const handleChange = (color) => {
  if (color) {
    settingsStore.changeSetting({ key: 'theme', value: color })
  }
}

watch(() => settingsStore.theme, (newTheme) => {
  theme.value = newTheme || ORIGINAL_THEME
}, { immediate: true })
</script>

<style>
.theme-picker-dropdown {
  z-index: 99999 !important;
}
.theme-picker .el-color-picker__trigger {
  height: 26px !important;
  width: 26px !important;
  padding: 2px;
}
.el-color-dropdown__link-btn {
  display: none;
}
</style>
