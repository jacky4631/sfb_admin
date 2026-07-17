<template>
  <div>
    <el-button v-permission="permission.edit" :disabled="disabledEdit" size="small" type="primary" :icon="Edit" @click="crud.toEdit(data)" />
    <el-popover v-model="pop" v-permission="permission.del" placement="top" width="180" trigger="manual" @show="onPopoverShow" @hide="onPopoverHide">
      <p>{{ msg }}</p>
      <div style="text-align: right; margin: 0">
        <el-button size="small" link @click="doCancel">取消</el-button>
        <el-button :loading="crud.dataStatus[data.id].delete === 2" type="primary" size="small" @click="crud.doDelete(data)">确定</el-button>
      </div>
      <template #reference>
        <el-button :disabled="disabledDle" type="danger" :icon="Delete" size="small" @click="toDelete" />
      </template>
    </el-popover>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import CRUD, { crud as crudComposable } from '@crud/crud'

defineOptions({
  name: 'UDOperation'
})

const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  permission: {
    type: Object,
    required: true
  },
  disabledEdit: {
    type: Boolean,
    default: false
  },
  disabledDle: {
    type: Boolean,
    default: false
  },
  msg: {
    type: String,
    default: '确定删除本条数据吗？'
  }
})

const { crud } = crudComposable()

const pop = ref(false)

const doCancel = () => {
  pop.value = false
  crud.cancelDelete(props.data)
}

const toDelete = () => {
  pop.value = true
}

// 注册 afterDelete 钩子：删除完成后自动关闭弹窗
const hookRef = crud.HOOK || CRUD.HOOK
hookRef[CRUD.HOOK.afterDelete] = (crudInst, data) => {
  if (data === props.data) {
    pop.value = false
  }
}

const onPopoverShow = () => {
  setTimeout(() => {
    document.addEventListener('click', handleDocumentClick)
  }, 0)
}

const onPopoverHide = () => {
  document.removeEventListener('click', handleDocumentClick)
}

const handleDocumentClick = () => {
  pop.value = false
}
</script>
