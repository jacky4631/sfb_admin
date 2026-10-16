<template>
  <div class="app-container finance-page">
    <!--工具栏-->
    <div class="head-container finance-filters">
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          v-permission="['admin','MWSYSTEMUSERLEVEL_ALL','MWSYSTEMUSERLEVEL_CREATE']"
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
      <el-table-column prop="id" label="id" />
      <el-table-column prop="rechargeId" label="充值id 对应 财务管理-充值金额配置"  width="170px"/>
      <el-table-column prop="type" label="类型" >
        <template #default="scope">
          <span>{{ parseType(scope.row.type) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="等级名称" />
      <el-table-column prop="grade" label="会员等级" />
      <el-table-column prop="discount" label="自身分佣比例（%）"   width="120px"/>
      <el-table-column prop="discountOne" label="一级分佣比例（%）"  width="150px"/>
      <el-table-column prop="discountTwo" label="二级分佣比例（%）"  width="150px"/>
      <el-table-column prop="validDate" label="有效时间" />
      <el-table-column prop="isForever" label="是否永久">
        <template #default="scope">
          <el-tag v-if="scope.row.isForever === 1" style="cursor: pointer" type="primary">是</el-tag>
          <el-tag v-else style="cursor: pointer" :type=" 'info' ">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="isShow" label="是否显示">
        <template #default="scope">
          <el-tag v-if="scope.row.isShow === 1" style="cursor: pointer" type="primary">是</el-tag>
          <el-tag v-else style="cursor: pointer" :type=" 'info' ">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['admin','MWSYSTEMUSERLEVEL_ALL','MWSYSTEMUSERLEVEL_EDIT','MWSYSTEMUSERLEVEL_DELETE'])" label="操作" width="150px" align="center">
        <template #default="scope">
          <el-button v-permission="['admin','MWSYSTEMUSERLEVEL_ALL','MWSYSTEMUSERLEVEL_EDIT']" size="small" type="primary" @click="edit(scope.row)" ><el-icon><Edit /></el-icon></el-button>
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
            <template #reference><el-button v-permission="['admin','MWSYSTEMUSERLEVEL_ALL','MWSYSTEMUSERLEVEL_DELETE']" type="danger" size="small" ><el-icon><Delete /></el-icon></el-button></template>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination class="finance-pagination"
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
import { del } from '@/api/mwSystemUserLevel.js'
import eForm from './form.vue'
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
    parseType(type){
      switch (type){
        case 'jd':
          return "京东";
        case 'pdd':
          return "拼多多";
        case 'dy':
          return "抖音";
        case 'vip':
          return "唯品会";
        default:
          return '淘宝';
      }
    },
    checkPermission,
    beforeInit() {
      this.url = 'api/mwSystemUserLevel'
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
        type: data.type,
        merId: data.merId,
        name: data.name,
        money: data.money,
        rechargeId: data.rechargeId,
        validDate: data.validDate,
        isForever: data.isForever,
        isPay: data.isPay,
        isShow: data.isShow,
        grade: data.grade,
        discount: data.discount,
        discountOne: data.discountOne,
        discountTwo: data.discountTwo,
        image: data.image,
        icon: data.icon,
        imageArr: data.image ? data.image.split(',') : [],
        iconArr: data.icon ? data.icon.split(',') : [],
        explain: data.explain,
        addTime: data.addTime,
        isDel: data.isDel
      }
      _this.dialog = true
    }
  }
}
</script>

<style scoped>

</style>
