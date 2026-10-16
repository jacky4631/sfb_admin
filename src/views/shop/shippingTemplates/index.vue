<template>
  <div class="app-container finance-page">
    <!--工具栏-->
    <div class="head-container finance-filters">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />

      <add />
    </div>
    <el-table ref="table" class="finance-table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column v-if="columns.visible('id')" prop="id" label="模板ID" />
        <el-table-column v-if="columns.visible('name')" prop="name" label="模板名称" />
        <el-table-column v-if="columns.visible('type')" prop="type" label="计费方式">
          <template #default="scope">
            <span v-if="scope.row.type == 1">按件数</span>
            <span v-else-if="scope.row.type == 2">按重量</span>
            <span v-else>按体积</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('appoint')" prop="appoint" label="指定包邮开关">
          <template #default="scope">
            <span v-if="scope.row.appoint == 1">开启</span>
            <span v-else>关闭</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('createTime')" prop="createTime" label="添加时间">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('sort')" prop="sort" label="排序" />
        <el-table-column v-if="checkPermission(['admin','mwShippingTemplates:edit','mwShippingTemplates:del'])" label="操作" width="150px" align="center">
          <template #default="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
          </template>
        </el-table-column>
    </el-table>
      <!--分页组件-->
    <pagination class="finance-pagination" />
  </div>
</template>

<script>
import checkPermission from '@/utils/permission.js'
import crudMwShippingTemplates from '@/api/mwShippingTemplates.js'
import CRUD, { presenter, header, form, crud } from '@/components/Crud/crud.js'
import rrOperation from '@/components/Crud/RR.operation.vue'
import crudOperation from '@/components/Crud/CRUD.operation.vue'
import udOperation from '@/components/Crud/UD.operation.vue'
import pagination from '@/components/Crud/Pagination.vue'
import MaterialList from "@/components/material/index.vue";
import add from './form.vue'

// crud交由presenter持有
const defaultCrud = CRUD({ title: '运费模板', url: 'api/mwShippingTemplates', sort: 'id,desc', crudMethod: { ...crudMwShippingTemplates }})
const defaultForm = { id: null, name: null, type: null, regionInfo: null, appoint: null, appointInfo: null, createTime: null, updateTime: null, isDel: null, sort: null }
export default {
  name: 'MwShippingTemplates',
  components: { pagination, crudOperation, rrOperation, udOperation ,MaterialList ,add},
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {

      permission: {
        add: ['admin', 'mwShippingTemplates:add'],
        edit: ['admin', 'mwShippingTemplates:edit'],
        del: ['admin', 'mwShippingTemplates:del']
      },
      rules: {
      }    }
  },
  watch: {
  },
  methods: {
    checkPermission,
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      return true
    }, // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
    },
  }
}



</script>

<style scoped>
  .table-img {
    display: inline-block;
    text-align: center;
    background: #ccc;
    color: #fff;
    white-space: nowrap;
    position: relative;
    overflow: hidden;
    vertical-align: middle;
    width: 32px;
    height: 32px;
    line-height: 32px;
  }
</style>
