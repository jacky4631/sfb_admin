<template>
  <div>
    <el-button v-permission="permission.edit" :disabled="disabledEdit" size="small" type="primary" :icon="textActions ? undefined : Edit" :link="textActions" @click="crud.toEdit(data)">{{ textActions ? '编辑' : '' }}</el-button>
    <slot name="between" />
    <el-popover ref="popoverRef" :visible="pop" placement="top" width="180" trigger="click">
      <p>{{ msg }}</p>
      <div style="text-align: right; margin: 0">
        <el-button size="small" link @click="doCancel">取消</el-button>
        <el-button :loading="crud.dataStatus[data.id]?.delete === 2" type="primary" size="small" @click="doDelete">确定</el-button>
      </div>
      <template #reference>
        <el-button v-permission="permission.del" :disabled="disabledDle" type="danger" :icon="textActions ? undefined : Delete" :link="textActions" size="small" @click.stop="toDelete">{{ textActions ? '删除' : '' }}</el-button>
      </template>
    </el-popover>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import { crud as crudComposable } from '@/components/Crud/crud.js'

defineOptions({
  name: 'UDOperation'
})

const props = defineProps({
  textActions: { type: Boolean, default: false },
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
const popoverRef = ref(null)

const doCancel = () => {
  pop.value = false
  crud.cancelDelete(props.data)
}

const toDelete = () => {
  pop.value = true
}

// 删除成功后关闭当前行的确认弹窗
const doDelete = () => {
  crud.doDelete(props.data).then(() => {
    pop.value = false
  })
}
</script>
