<template>
  <div class="icons-container">
    <aside>
      <a href="https://panjiachen.github.io/vue-element-admin-site/guide/advanced/icon.html" target="_blank">Add and use
      </a>
    </aside>
    <el-tabs type="border-card">
      <el-tab-pane label="Icons">
        <div v-for="item of svgIcons" :key="item" @click="handleClipboard(generateIconCode(item),$event)">
          <el-tooltip placement="top">
            <template #content>
              {{ generateIconCode(item) }}
            </template>
            <div class="icon-item">
              <svg-icon :icon-class="item" class-name="disabled" />
              <span>{{ item }}</span>
            </div>
          </el-tooltip>
        </div>
      </el-tab-pane>
      <el-tab-pane label="Element-Plus Icons">
        <div v-for="item of elementIcons" :key="item" @click="handleClipboard(generateElementIconCode(item),$event)">
          <el-tooltip placement="top">
            <template #content>
              {{ generateElementIconCode(item) }}
            </template>
            <div class="icon-item">
              <el-icon><component :is="item" /></el-icon>
              <span>{{ item }}</span>
            </div>
          </el-tooltip>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import clipboard from '@/utils/clipboard'
import svgIcons from './svg-icons'
import elementIcons from './element-icons'

const generateIconCode = (symbol) => {
  return `<svg-icon icon-class="${symbol}" />`
}

const generateElementIconCode = (symbol) => {
  return `<el-icon><${symbol} /></el-icon>`
}

const handleClipboard = (text, event) => {
  clipboard(text, event)
}
</script>

<style lang="scss" scoped>
.icons-container {
  margin: 10px 20px 0;
  overflow: hidden;

  .icon-item {
    margin: 20px;
    height: 85px;
    text-align: center;
    width: 100px;
    float: left;
    font-size: 30px;
    color: #24292e;
    cursor: pointer;
  }

  span {
    display: block;
    font-size: 16px;
    margin-top: 10px;
  }

  .disabled {
    pointer-events: none;
  }
}
</style>
