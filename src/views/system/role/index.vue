<template>
  <div class="app-container finance-page system-page role-page role-drawer-page">
    <!--工具栏-->
    <div class="head-container finance-filters">
      <div v-if="crud.props.searchToggle" class="tool-search">
        <!-- 搜索 -->
        <el-input v-model="query.blurry" size="small" clearable placeholder="输入名称或者描述搜索" style="width: 200px;" class="filter-item" @keyup.enter="crud.toQuery" />
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
        <rrOperation :crud="crud" />
      </div>
      <crudOperation :permission="permission" />
    </div>
    <!-- 表单渲染 -->
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :model-value="crud.status.cu > 0" :title="crud.status.title" width="520px">
      <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="80px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" style="width: 145px;" />
        </el-form-item>
        <el-form-item label="角色权限" prop="permission">
          <el-input v-model="form.permission" style="width: 145px;" />
        </el-form-item>
        <el-form-item label="数据范围" prop="dataScope">
          <el-select v-model="form.dataScope" style="width: 145px" placeholder="请选择数据范围" @change="changeScope">
            <el-option
              v-for="item in dateScopes"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="角色级别" prop="level">
          <el-input-number v-model.number="form.level" :min="1" controls-position="right" style="width: 145px;" />
        </el-form-item>
        <el-form-item v-if="form.dataScope === '自定义'" label="数据权限" prop="depts">
          <el-tree-select v-model="form.depts" :data="depts" multiple style="width: 380px" placeholder="请选择" />
        </el-form-item>
        <el-form-item label="描述信息" prop="remark">
          <el-input v-model="form.remark" style="width: 380px;" :rows="5" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button link @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </template>
    </el-dialog>
    <el-row class="system-grid" :gutter="15">
      <!--角色管理-->
      <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17" >
        <el-card class="box-card system-card" shadow="never">
          <template #header>
            <span class="role-span">角色列表</span>
          </template>
          <el-table class="finance-table" size="small" ref="table" v-loading="crud.loading" style="width: 100%;" :data="crud.data" @selection-change="crud.selectionChangeHandler">
            <el-table-column :selectable="checkboxT" type="selection" width="55" />
            <el-table-column v-if="columns.visible('name')" prop="name" label="名称" />
            <el-table-column v-if="columns.visible('dataScope')" prop="dataScope" label="数据权限" />
            <el-table-column v-if="columns.visible('permission')" prop="permission" label="角色权限" />
            <el-table-column v-if="columns.visible('level')" prop="level" label="角色级别" />
            <el-table-column v-if="columns.visible('remark')" :show-overflow-tooltip="true" prop="remark" label="描述" />
            <el-table-column v-if="columns.visible('createTime')" :show-overflow-tooltip="true" width="180px" prop="createTime" label="创建日期">
              <template #default="scope">
                <span>{{ parseTime(scope.row.createTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="checkPermission(['admin','roles:edit','roles:del'])" label="操作" width="240px" align="center" fixed="right">
              <template #default="scope">
                <div class="role-row-actions">
                  <udOperation
                    text-actions
                    v-if="scope.row.level >= level"
                    :data="scope.row"
                    :permission="permission"
                  >
                    <template #between>
                      <el-button v-permission="['admin','roles:edit']" type="primary" link size="small"
                        @click="openPermissions(scope.row)">菜单权限</el-button>
                    </template>
                  </udOperation>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <!--分页组件-->
          <pagination class="finance-pagination" />
        </el-card>
      </el-col>
    </el-row>
    <el-drawer v-model="permissionDrawer" append-to-body size="min(640px, 100vw)"
      :before-close="beforePermissionClose" @opened="applyMenuSelection" class="role-permission-drawer">
      <template #header>
        <div>
          <strong>分配权限 · {{ activeRole?.name }}</strong>
          <div class="permission-subtitle">角色标识：{{ activeRole?.permission }}</div>
        </div>
      </template>
      <div v-loading="permissionLoading" class="permission-editor">
        <div class="permission-tools">
          <el-input v-model="menuSearch" clearable placeholder="搜索菜单名称" :prefix-icon="Search" />
          <div class="permission-tool-actions">
            <el-checkbox v-model="onlySelected">仅看已选</el-checkbox>
            <el-button link type="primary" @click="toggleExpanded">{{ expanded ? '收起全部' : '展开全部' }}</el-button>
          </div>
        </div>
        <el-tree ref="menu" :data="menus" :props="defaultProps" show-checkbox node-key="id"
          :filter-node-method="filterMenu" :check-on-click-node="false"
          :empty-text="permissionLoading ? '正在加载权限…' : '暂无菜单'"
          @check="onMenuCheck" />
      </div>
      <template #footer>
        <div class="permission-footer">
          <span>{{ permissionDirty ? '有未保存的修改' : '勾选角色可访问的菜单和操作' }}</span>
          <div>
            <el-button :disabled="menuLoading" @click="beforePermissionClose(() => permissionDrawer = false)">取消</el-button>
            <el-button type="primary" :loading="menuLoading" :disabled="permissionLoading || !permissionReady || !permissionDirty" @click="saveMenu">保存权限</el-button>
          </div>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import { Search } from '@element-plus/icons-vue'
import checkPermission from '@/utils/permission.js'
import { ref, onMounted, nextTick, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import crudRoles from '@/api/system/role.js'
import { getDepts } from '@/api/system/dept.js'
import { getMenusTree } from '@/api/system/menu.js'
import CRUD, { presenter } from '@/components/Crud/crud.js'
import { parseTime } from '@/utils/index.js'
import rrOperation from '@/components/Crud/RR.operation.vue'
import crudOperation from '@/components/Crud/CRUD.operation.vue'
import udOperation from '@/components/Crud/UD.operation.vue'
import pagination from '@/components/Crud/Pagination.vue'

defineOptions({ name: 'Role' })

// crud交由presenter持有
const defaultCrud = CRUD({ title: '角色', url: 'api/roles', sort: 'level,asc', crudMethod: { ...crudRoles }})
const defaultForm = { id: null, name: null, depts: [], remark: null, dataScope: '全部', level: 3, permission: null }

const defaultProps = ref({ children: 'children', label: 'label' })
const dateScopes = ref(['全部', '本级', '自定义'])
const currentId = ref(0)
const menuLoading = ref(false)
const permissionDrawer = ref(false)
const permissionLoading = ref(false)
const permissionReady = ref(false)
const activeRole = ref(null)
const permissionDirty = ref(false)
const menuSearch = ref('')
const onlySelected = ref(false)
const expanded = ref(false)
let savedSelection = ''
const menus = ref([])
const menuIds = ref([])
const depts = ref([])
const permission = ref({
  add: ['admin', 'roles:add'],
  edit: ['admin', 'roles:edit'],
  del: ['admin', 'roles:del']
})
const rules = {
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' }
  ],
  permission: [
    { required: true, message: '请输入权限', trigger: 'blur' }
  ]
}

const level = ref(3)

const { crud, columns, query, form } = presenter(defaultCrud)

const menu = ref(null)

onMounted(() => {
  crudRoles.getLevel().then(data => {
    level.value = data.level
    console.log(level.value)
  })
})

function selectionSignature() {
  return JSON.stringify([...(menu.value?.getCheckedKeys() || [])].map(String).sort())
}

async function openPermissions(row) {
  activeRole.value = { ...row }
  currentId.value = row.id
  menuSearch.value = ''
  onlySelected.value = false
  expanded.value = false
  permissionDirty.value = false
  permissionReady.value = false
  permissionLoading.value = true
  menus.value = []
  menuIds.value = []
  permissionDrawer.value = true
  try {
    const [tree, role] = await Promise.all([getMenusTree(), crudRoles.get(row.id)])
    // Ignore an old request if its drawer has already closed or changed roles.
    if (!permissionDrawer.value || currentId.value !== row.id) return
    activeRole.value = role
    menus.value = tree
    const assigned = new Set((role.menus || []).map(item => String(item.id)))
    // Parent IDs are also stored for half-checked nodes; don't cascade them
    // into siblings that this role has never been granted.
    const collect = nodes => nodes.flatMap(node => {
      if (node.children?.length) return collect(node.children)
      return assigned.has(String(node.id)) ? [node.id] : []
    })
    menuIds.value = collect(tree)
    await nextTick()
    applyMenuSelection()
    permissionReady.value = true
  } catch (err) {
    if (permissionDrawer.value && currentId.value === row.id) {
      ElMessage.error('权限加载失败，请关闭后重试')
    }
  } finally {
    if (currentId.value === row.id) permissionLoading.value = false
  }
}

function applyMenuSelection() {
  if (!menu.value || permissionDirty.value) return
  menu.value.setCheckedKeys(menuIds.value)
  savedSelection = selectionSignature()
}

function filterMenu(value, data, node) {
  const matches = String(data.label || '').toLowerCase().includes(menuSearch.value.trim().toLowerCase())
  return matches && (!onlySelected.value || node.checked || node.indeterminate)
}

watch([menuSearch, onlySelected], () => menu.value?.filter(menuSearch.value))

function onMenuCheck() {
  permissionDirty.value = selectionSignature() !== savedSelection
  if (onlySelected.value) menu.value?.filter(menuSearch.value)
}

function toggleExpanded() {
  expanded.value = !expanded.value
  const visit = nodes => nodes.forEach(item => {
    const node = menu.value?.getNode(item.id)
    if (node) node.expanded = expanded.value
    if (item.children) visit(item.children)
  })
  visit(menus.value)
}

async function beforePermissionClose(done) {
  if (menuLoading.value) return
  if (permissionDirty.value) {
    try {
      await ElMessageBox.confirm('权限修改尚未保存，确定放弃修改并关闭吗？', '未保存的修改', {
        confirmButtonText: '放弃修改', cancelButtonText: '继续编辑', type: 'warning'
      })
    } catch { return }
  }
  done()
}

async function saveMenu() {
  if (!permissionReady.value || menuLoading.value) return
  menuLoading.value = true
  const ids = new Set([...menu.value.getHalfCheckedKeys(), ...menu.value.getCheckedKeys()])
  try {
    await crudRoles.editMenu({ id: currentId.value, menus: [...ids].map(id => ({ id })) })
    permissionDirty.value = false
    permissionDrawer.value = false
    crud.notify('权限保存成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
    update()
  } catch (err) {
    ElMessage.error(err.response?.data?.message || '权限保存失败，请重试')
  } finally {
    menuLoading.value = false
  }
}

// 无刷新更新 表格数据
function update() {
  crudRoles.get(currentId.value).then(res => {
    for (let i = 0; i < crud.data.length; i++) {
      if (res.id === crud.data[i].id) {
        crud.data[i] = res
        break
      }
    }
  })
}

// 获取部门数据
function getDeptsData() {
  getDepts({ enabled: true }).then(res => {
    depts.value = res.content
  })
}

// 如果数据权限为自定义则获取部门数据
function changeScope() {
  if (form.dataScope === '自定义') {
    getDeptsData()
  }
}

function checkboxT(row, rowIndex) {
  return row.level >= level.value
}



// 编辑前
crud.HOOK.beforeToEdit = (form) => {
  if (form.dataScope === '自定义') {
    getDeptsData()
  }
  const deptsArr = []
  form.depts.forEach(function(dept, index) {
    deptsArr.push(dept.id)
  })
  form.depts = deptsArr
}

// 提交前做的操作
crud.HOOK.afterValidateCU = (crudRef) => {
  if (crudRef.form.dataScope === '自定义' && crudRef.form.depts.length === 0) {
    ElMessage({
      message: '自定义数据权限不能为空',
      type: 'warning'
    })
    return false
  } else if (crudRef.form.dataScope === '自定义') {
    const deptsArr = []
    crudRef.form.depts.forEach(function(data, index) {
      const dept = { id: data }
      deptsArr.push(dept)
    })
    crudRef.form.depts = deptsArr
  } else {
    crudRef.form.depts = []
  }
  return true
}

crud.HOOK.afterAddError = (crudRef) => {
  afterErrorMethod(crudRef)
}

crud.HOOK.afterEditError = (crudRef) => {
  afterErrorMethod(crudRef)
}

function afterErrorMethod(crudRef) {
  const deptsArr = []
  crudRef.form.depts.forEach(function(dept, index) {
    deptsArr.push(dept.id)
  })
  crudRef.form.depts = deptsArr
}
</script>

<style rel="stylesheet/scss" lang="scss">
  .role-span {
    font-weight: bold;color: #303133;
    font-size: 15px;
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  :deep(.el-input-number .el-input__inner) {
    text-align: left;
  }
</style>

<style scoped>
.role-drawer-page > .system-grid { grid-template-columns: minmax(0, 1fr); }
.permission-editor { min-height: 240px; }
.permission-tools { position: sticky; top: 0; z-index: 1; padding-bottom: 12px; background: #fff; }
.permission-tool-actions, .permission-footer { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.permission-subtitle { margin-top: 8px; color: #909399; font-size: 13px; }
.permission-footer { flex-wrap: wrap; }
.permission-footer > span { color: #909399; font-size: 13px; }
</style>

<style scoped>
.role-row-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  white-space: nowrap;
}
.role-row-actions > :deep(div) {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.role-row-actions :deep(.el-button.is-link) {
  width: auto;
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
}
</style>
