<template>
  <el-dropdown trigger="click" @command="handleSetSize">
    <div>
      <svg-icon class-name="size-icon" icon-class="size" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-for="item of sizeOptions" :key="item.value" :disabled="size===item.value" :command="item.value">
          {{
            item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { computed, nextTick } from 'vue'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'

defineOptions({
  name: 'SizeSelect'
})

const store = useStore()
const route = useRoute()
const router = useRouter()

const sizeOptions = [
  { label: 'Default', value: 'default' },
  { label: 'Medium', value: 'medium' },
  { label: 'Small', value: 'small' },
  { label: 'Mini', value: 'mini' }
]

const size = computed(() => store.getters.size)

const handleSetSize = (size) => {
  window.ELEMENT.size = size
  store.dispatch('app/setSize', size)
  refreshView()
  ElMessage({
    message: '布局设置成功',
    type: 'success'
  })
}

const refreshView = () => {
  store.dispatch('tagsView/delAllCachedViews', route)

  const { fullPath } = route

  nextTick(() => {
    router.replace({
      path: '/redirect' + fullPath
    })
  })
}
</script>
