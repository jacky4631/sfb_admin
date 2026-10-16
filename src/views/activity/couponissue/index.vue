<template>
  <div class="app-container finance-page">
    <!--工具栏-->
    <div class="head-container finance-filters">
      <!-- 新增 -->
      <el-button
        type="danger"
        class="filter-item"
        size="small"
        @click="toQuery"
      ><el-icon><Refresh /></el-icon>刷新</el-button>
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd" />
    <!--表格渲染-->
    <el-table class="finance-table" v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column prop="id" label="id" />
      <el-table-column prop="ctype" label="优惠券类型">
        <template #default="scope">
          <div>
            <el-tag v-if="scope.row.ctype === 1" style="cursor: pointer" type="primary">商品券</el-tag>
            <el-tag v-else :type=" 'info' ">普通券</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="cname" label="优惠券名称" />
      <el-table-column label="领取日期" prop="startTime">
        <template #default="scope">
          <p>{{ formatTimeTwo(scope.row.startTime) }}</p>
          <p>{{ formatTimeTwo(scope.row.endTime) }}</p>
        </template>
      </el-table-column>
      <el-table-column label="发布数量" prop="totalCount">
        <template #default="scope">
          <p>发布:{{ scope.row.totalCount }}</p>
          <p>剩余:{{ scope.row.remainCount }}</p>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <div>
            <el-tag v-if="scope.row.status === 1" style="cursor: pointer" type="primary">开启</el-tag>
            <el-tag v-else :type=" 'info' ">关闭</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['admin','MWSTORECOUPONISSUE_ALL','MWSTORECOUPONISSUE_EDIT','MWSTORECOUPONISSUE_DELETE'])" label="操作" width="150px" align="center">
        <template #default="scope">
          <el-button v-permission="['admin','MWSTORECOUPONISSUE_ALL','MWSTORECOUPONISSUE_EDIT']" size="small" type="primary" @click="edit(scope.row)"><el-icon><Edit /></el-icon></el-button>
          <el-popover
            :ref="scope.row.id"
            placement="top"
            width="180"
          >
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="small" link @click="$refs[scope.row.id].hide()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="small" @click="subDelete(scope.row.id)">确定</el-button>
            </div>
            <template #reference><el-button v-permission="['admin','MWSTORECOUPONISSUE_ALL','MWSTORECOUPONISSUE_DELETE']" type="danger" size="small"><el-icon><Delete /></el-icon></el-button></template>
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
import { del } from '@/api/mwStoreCouponIssue.js'
import eForm from './formt.vue'
import { formatTimeTwo } from '@/utils/index.js'
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
    formatTimeTwo,
    checkPermission,
    beforeInit() {
      this.url = 'api/mwStoreCouponIssue'
      const sort = 'id,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
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
        cid: data.cid,
        startTime: data.startTime,
        endTime: data.endTime,
        startTimeDate: data.startTimeDate,
        endTimeDate: data.endTimeDate,
        totalCount: data.totalCount,
        remainCount: data.remainCount,
        isPermanent: data.isPermanent,
        status: data.status,
        isDel: data.isDel,
        addTime: data.addTime
      }
      _this.dialog = true
    }
  }
}
</script>

<style scoped>

</style>
