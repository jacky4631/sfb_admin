<template>
  <div v-if="crud.props.searchToggle">
    <el-input
      v-model="query.blurry"
      clearable
      size="small"
      placeholder="请输入你要搜索的内容"
      style="width: 200px;"
      class="filter-item"
    />
    <el-date-picker
      v-model="query.createTime"
      :default-time="['00:00:00','23:59:59']"
      type="daterange"
      range-separator=":"
      size="small"
      class="date-item"
      value-format="YYYY-MM-DD HH:mm:ss"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
    />
    <rrOperation
      :crud="crud"
    />
  </div>
</template>

<script setup>
import { header } from '@/components/Crud/crud.js'
import rrOperation from '@/components/Crud/RR.operation.vue'

defineOptions({
  components: { rrOperation },
  mixins: [header()]
})
</script>
