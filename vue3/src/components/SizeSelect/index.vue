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
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/store/modules/app'
import { useTagsViewStore } from '@/store/modules/tagsView'

defineOptions({
  name: 'SizeSelect'
})

const appStore = useAppStore()
const tagsViewStore = useTagsViewStore()
const route = useRoute()
const router = useRouter()

const sizeOptions = [
  { label: 'Default', value: 'default' },
  { label: 'Medium', value: 'medium' },
  { label: 'Small', value: 'small' },
  { label: 'Mini', value: 'mini' }
]

const size = computed(() => appStore.size)

const handleSetSize = (size) => {
  window.ELEMENT.size = size
  appStore.setSize(size)
  refreshView()
  ElMessage({
    message: '布局设置成功',
    type: 'success'
  })
}

const refreshView = () => {
  tagsViewStore.DEL_ALL_CACHED_VIEWS()

  const { fullPath } = route

  nextTick(() => {
    router.replace({
      path: '/redirect' + fullPath
    })
  })
}
</script>
