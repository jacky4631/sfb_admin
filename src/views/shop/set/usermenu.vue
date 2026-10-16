<template>
  <div class="app-container finance-page">
    <!--工具栏-->
    <div class="head-container finance-filters">
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          v-permission="['admin','MWSYSTEMGROUPDATA_ALL','MWSYSTEMGROUPDATA_CREATE']"
          class="filter-item"
          size="small"
          type="primary"
         
          @click="add"
        ><el-icon><Plus /></el-icon>新增</el-button>
      </div>
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd" />
    <!--表格渲染-->
    <el-table class="finance-table" v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="map.name" label="菜单名" />
      <el-table-column prop="map.url" label="链接url" />
      <el-table-column prop="map.uniapp_url" label="uniapp路由" />
      <el-table-column ref="table" label="图标">
        <template #default="scope">
          <a :href="scope.row.map.pic" style="color: rgb(64, 158, 255)" target="_blank">
            <img :src="scope.row.map.pic" alt="点击打开" class="el-avatar">
          </a>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" />
      <el-table-column label="状态" align="center">
        <template #default="scope">
          <div>
            <el-tag v-if="scope.row.status === 1" style="cursor: pointer" type="primary">显示</el-tag>
            <el-tag v-else style="cursor: pointer" :type=" 'info' ">不显示</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column class-name="table-icon-column" v-if="checkPermission(['admin','MWSYSTEMGROUPDATA_ALL','MWSYSTEMGROUPDATA_EDIT','MWSYSTEMGROUPDATA_DELETE'])" label="操作" width="150px" align="center">
        <template #default="scope">
          <el-button title="编辑" aria-label="编辑" class="table-icon-action" v-permission="['admin','MWSYSTEMGROUPDATA_ALL','MWSYSTEMGROUPDATA_EDIT']" size="small" type="primary" @click="edit(scope.row)" ><el-icon><Edit /></el-icon></el-button>
          <el-popover trigger="click"
            :ref="scope.row.id"
            placement="top"
            width="180"
          >
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="small" link @click="$refs[scope.row.id].hide()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="small" @click="subDelete(scope.row.id)">确定</el-button>
            </div>
            <template #reference><el-button title="删除" aria-label="删除" class="table-icon-action" v-permission="['admin','MWSYSTEMGROUPDATA_ALL','MWSYSTEMGROUPDATA_DELETE']" type="danger" size="small" ><el-icon><Delete /></el-icon></el-button></template>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      class="finance-pagination"
      :total="total"
      :current-page="page + 1"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"
    />
  </div>
</template>

<script>
import { ElNotification } from 'element-plus'
import checkPermission from '@/utils/permission.js'
import initData from '@/mixins/crud.js'
import { del } from '@/api/mwSystemGroupData.js'
import eForm from './usermenuform.vue'
export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      delLoading: false
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    checkPermission,
    beforeInit() {
      this.url = 'api/mwSystemGroupData'
      const sort = 'id,desc'
      this.params = { page: this.page, size: this.size, sort: sort, groupName: 'mshop_my_menus' }
      return true
    },
    subDelete(id) {
      this.delLoading = true
      del(id).then(res => {
        this.delLoading = false
        this.$refs[id].hide()
        this.dleChangePage()
        this.init()
        ElNotification({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        this.$refs[id].hide()
        console.log(err.response.data.message)
      })
    },
    add() {
      this.isAdd = true
      this.$refs.form.dialog = true
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.form = {
        id: data.id,
        groupName: data.groupName,
        name: data.map.name,
        url: data.map.url,
        wxapp_url: data.map.wxapp_url,
        uniapp_url: data.map.uniapp_url,
        pic: data.map.pic,
        imageArr: data.map.pic ? data.map.pic.split(',') : [],
        sort: data.sort,
        status: data.status
      }
      _this.dialog = true
    }
  }
}
</script>

<style scoped>

</style>
