<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input v-model="query.company" clearable placeholder="输入搜索内容" style="width: 200px;" class="filter-item" @keyup.enter="toQuery" @clear="toQuery"/>
      <el-button class="filter-item" size="small" type="success" @click="toQuery"><el-icon><Search /></el-icon>搜索</el-button>
      <!-- 新增 -->
      <el-button
        type="danger"
        class="filter-item"
        size="small"
       
        @click="toQuery"
      ><el-icon><Refresh /></el-icon>刷新</el-button>
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          v-permission="['admin','PAYCOMPANY_ALL','PAYCOMPANY_CREATE']"
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
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column prop="id" label="主体id" />
      <el-table-column prop="company" label="主体名称"/>
<!--      <el-table-column ref="table" prop="licenseUrl" label="营业执照">-->
<!--        <template #default="scope">-->
<!--          <div>-->
<!--            <a :href="scope.row.licenseUrl" style="color: rgb(64, 158, 255)" target="_blank">-->
<!--              <img :src="scope.row.licenseUrl" alt="点击打开" class="el-shop">-->
<!--            </a>-->
<!--          </div>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column ref="table" prop="sealUrl" label="公章">-->
<!--        <template #default="scope">-->
<!--          <div>-->
<!--            <a :href="scope.row.sealUrl" style="color: rgb(64, 158, 255)" target="_blank">-->
<!--              <img :src="scope.row.sealUrl" alt="点击打开" class="el-shop">-->
<!--            </a>-->

<!--          </div>-->
<!--        </template>-->
<!--      </el-table-column>-->

<!--      <el-table-column prop="phone" label="手机号码" />-->

      <el-table-column  prop="createTime" label="创建时间" width="140">
        <template #default="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column  prop="updateTime" label="更新时间" width="140">
        <template #default="scope">
          <span>{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['admin','PAYCOMPANY_ALL','PAYCOMPANY_EDIT','PAYCOMPANY_DELETE'])" label="操作" width="150px" align="center">
        <template #default="scope">
          <el-button v-permission="['admin','PAYCOMPANY_ALL','PAYCOMPANY_EDIT']" size="small" type="primary" @click="edit(scope.row)" ><el-icon><Edit /></el-icon></el-button>
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
            <template #reference><el-button v-permission="['admin','PAYCOMPANY_ALL','PAYCOMPANY_DELETE']" type="danger" size="small" ><el-icon><Delete /></el-icon></el-button></template>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
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
import { del } from '@/api/mwPayCompany.js'
import eForm from './companyform.vue'
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
      this.url = 'api/paycompany'
      const sort = 'create_time,desc'
      this.params = { page: this.page, size: this.size, sort: sort, company: this.query.company}
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
      _this.form = data
      _this.dialog = true
    }
  }
}
</script>

<style scoped>

</style>
