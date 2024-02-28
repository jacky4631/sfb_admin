<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          v-permission="['admin','MWSYSTEMUSERLEVEL_ALL','MWSYSTEMUSERLEVEL_CREATE']"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add"
        >新增</el-button>
      </div>
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd" />
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column prop="id" label="id" />
      <el-table-column prop="rechargeId" label="充值id 对应 财务管理-充值金额配置"  width="170px"/>
      <el-table-column prop="type" label="类型" >
        <template slot-scope="scope">
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
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isForever === 1" style="cursor: pointer" :type="''">是</el-tag>
          <el-tag v-else style="cursor: pointer" :type=" 'info' ">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="isShow" label="是否显示">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isShow === 1" style="cursor: pointer" :type="''">是</el-tag>
          <el-tag v-else style="cursor: pointer" :type=" 'info' ">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['admin','MWSYSTEMUSERLEVEL_ALL','MWSYSTEMUSERLEVEL_EDIT','MWSYSTEMUSERLEVEL_DELETE'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['admin','MWSYSTEMUSERLEVEL_ALL','MWSYSTEMUSERLEVEL_EDIT']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)" />
          <el-popover
            :ref="scope.row.id"
            v-permission="['admin','MWSYSTEMUSERLEVEL_ALL','MWSYSTEMUSERLEVEL_DELETE']"
            placement="top"
            width="180"
          >
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定</el-button>
            </div>
            <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" />
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
import checkPermission from '@/utils/permission'
import initData from '@/mixins/crud'
import { del } from '@/api/mwSystemUserLevel'
import eForm from './form'
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
        this.$refs[id].doClose()
        this.dleChangePage()
        this.init()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        this.$refs[id].doClose()
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
