<template>
  <el-table :data="formatData" :row-style="showRow" v-bind="$attrs">
    <el-table-column v-if="columns.length===0" width="150">
      <template #default="scope">
        <span v-for="space in scope.row._level" :key="space" class="ms-tree-space" />
        <span v-if="iconShow(0,scope.row)" class="tree-ctrl" @click="toggleExpanded(scope.$index)">
          <el-icon v-if="!scope.row._expanded"><Plus /></el-icon>
          <el-icon v-else><Minus /></el-icon>
        </span>
        {{ scope.$index }}
      </template>
    </el-table-column>
    <el-table-column v-for="(column, index) in columns" v-else :key="column.value" :label="column.text" :width="column.width">
      <template #default="scope">
        <!-- Todo -->
        <!-- eslint-disable-next-line vue/no-confusing-v-for-v-if -->
        <span v-for="space in scope.row._level" v-if="index === 0" :key="space" class="ms-tree-space" />
        <span v-if="iconShow(index,scope.row)" class="tree-ctrl" @click="toggleExpanded(scope.$index)">
          <el-icon v-if="!scope.row._expanded"><Plus /></el-icon>
          <el-icon v-else><Minus /></el-icon>
        </span>
        {{ scope.row[column.value] }}
      </template>
    </el-table-column>
    <slot />
  </el-table>
</template>

<script setup>
/**
  Auth: Lei.j1ang
  Created: 2018/1/19-13:59
*/
import { computed } from 'vue'
import treeToArray from './eval'

defineOptions({
  name: 'TreeTable'
})

const props = defineProps({
  /* eslint-disable */
  data: {
    type: [Array, Object],
    required: true
  },
  columns: {
    type: Array,
    default: () => []
  },
  evalFunc: Function,
  evalArgs: Array,
  expandAll: {
    type: Boolean,
    default: false
  }
})

// 格式化数据源
const formatData = computed(() => {
  let tmp
  if (!Array.isArray(props.data)) {
    tmp = [props.data]
  } else {
    tmp = props.data
  }
  const func = props.evalFunc || treeToArray
  const args = props.evalArgs ? Array.concat([tmp, props.expandAll], props.evalArgs) : [tmp, props.expandAll]
  return func.apply(null, args)
})

const showRow = (row) => {
  const show = (row.row.parent ? (row.row.parent._expanded && row.row.parent._show) : true)
  row.row._show = show
  return show ? '' : 'display:none;'
  //return show ? 'animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;' : 'display:none;'
}

// 切换下级是否展开
const toggleExpanded = (trIndex) => {
  console.log(trIndex)
  const record = formatData.value[trIndex]
  console.log(record._expanded)
  record._expanded = !record._expanded
}

// 图标显示
const iconShow = (index, record) => {
  return (index === 0 && record.children && record.children.length > 0)
}
</script>
<style rel="stylesheet/css">
  @keyframes treeTableShow {
    from {opacity: 0;}
    to {opacity: 1;}
  }
  @-webkit-keyframes treeTableShow {
    from {opacity: 0;}
    to {opacity: 1;}
  }
</style>

<style lang="scss" rel="stylesheet/scss" scoped>
  $color-blue: #2196F3;
  $space-width: 18px;
  .ms-tree-space {
    position: relative;
    top: 1px;
    display: inline-block;
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    width: $space-width;
    height: 14px;
    &::before {
      content: ""
    }
  }
  .processContainer{
    width: 100%;
    height: 100%;
  }
  table td {
    line-height: 26px;
  }

  .tree-ctrl{
    position: relative;
    cursor: pointer;
    color: $color-blue;
    margin-left: -$space-width;
  }
</style>
