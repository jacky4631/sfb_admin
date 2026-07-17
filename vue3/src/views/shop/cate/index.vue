<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.cateName" clearable size="small" placeholder="输入分类名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />
      </div>
      <crudOperation :permission="permission" />
    </div>
    <!--表单组件-->
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
        <el-form-item label="分类名称">
          <el-input v-model="form.cateName" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="分类图片">
          <MaterialList v-model="picArr" type="image" :num="1" :width="150" :height="150" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.isShow" style="width: 178px">
            <el-radio :label="1">显示</el-radio>
            <el-radio :label="0">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="form.sort" style="width: 370px;" />
        </el-form-item>
        <el-form-item style="margin-bottom: 0;" label="上级分类" prop="pid">
          <el-tree-select v-model="form.pid" :data="depts" style="width: 370px;" placeholder="选择上级分类" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </template>
    </el-dialog>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" :data="crud.data" row-key="id" @select="crud.selectChange" @select-all="crud.selectAllChange" @selection-change="crud.selectionChangeHandler">
      <el-table-column :selectable="checkboxT" type="selection" width="55" />
      <el-table-column v-if="columns.visible('cateName')" label="名称" prop="cateName" />
      <el-table-column v-if="columns.visible('isShow')" label="状态" align="center" prop="isShow">
        <template #default="scope">
          <div>
            <el-tag v-if="scope.row.isShow === 1" :type="''">显示</el-tag>
            <el-tag v-else :type=" 'info' ">隐藏</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column v-if="columns.visible('sort')" label="排序" prop="sort" sortable/>
      <el-table-column v-permission="['admin','MWSTORECATEGORY_EDIT','MWSTORECATEGORY_DELETE']" label="操作" width="130px" align="center" fixed="right">
        <template #default="scope">
          <udOperation
            :data="scope.row"
            :permission="permission"
            msg="确定删除吗,如果存在下级节点则一并删除，此操作不能撤销！"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import crudDept from '@/api/mwStoreCategory'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import picUpload from '@/components/pic-upload'
import MaterialList from '@/components/material'

defineOptions({ name: 'Dept' })

// crud交由presenter持有
const defaultCrud = CRUD({ title: '分类', url: 'api/mwStoreCategory', sort: 'sort,desc', crudMethod: { ...crudDept }})
const defaultForm = { id: null, cateName: null, pid: 0, isShow: 1 , sort:  1}

const picArr = ref([])
const depts = ref([])
const rules = {
  cateName: [
    { required: true, message: '请输入名称', trigger: 'blur' }
  ]
}
const permission = {
  add: ['admin', 'MWSTORECATEGORY_CREATE'],
  edit: ['admin', 'MWSTORECATEGORY_EDIT'],
  del: ['admin', 'MWSTORECATEGORY_DELETE']
}
const enabledTypeOptions = [
  { key: 'true', display_name: '正常' },
  { key: 'false', display_name: '禁用' }
]

// Use mixin
const { crud, columns, query, form } = (() => {
  const result = presenter(defaultCrud)
  return result
})()

// Need to properly integrate the CRUD presenter
const presenterResult = presenter(defaultCrud)
const presenterCrud = presenterResult.crud

Object.assign(crud, presenterCrud)

watch(picArr, (val) => {
  form.pic = val.join(',')
})

// 新增与编辑前做的操作
crud.HOOK.afterToCU = (form) => {
  picArr.value = []
  if (form.pic && form.id) {
    picArr.value = form.pic.split(',')
  }

  // 获取所有部门
  crudDept.getCates({ isShow: true }).then(res => {
    depts.value = []
    const dept = { id: 0, label: '顶级类目', children: [] }
    dept.children = res.content
    depts.value.push(dept)
  })
}

// 提交前的验证
crud.HOOK.afterValidateCU = () => {
  return true
}

function checkboxT(row, rowIndex) {
  return row.id !== 1
}
</script>

<style scoped>
</style>
