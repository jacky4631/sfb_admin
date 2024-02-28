<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <el-button
        v-permission="['admin','MWUSEREXTRACT_ALL','MWUSEREXTRACT_EDIT']"
        type="danger"
        class="filter-item"
        size="mini"
        icon="el-icon-promotion"
        :disabled="this.dataSelections.length === 0"
        @click="doExtract"
      >批量提现</el-button>
      <!-- 搜索 -->
      <el-input v-model="query.value" clearable placeholder="输入搜索内容" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery" @clear="toQuery" />
      <el-input v-model="query.uid" clearable placeholder="输入uid" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery" @clear="toQuery" />
      <el-select v-model="query.status" clearable placeholder="审核状态" class="filter-item" style="width: 130px" @clear="toQuery">
        <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!-- 新增 -->
      <el-button
        type="danger"
        class="filter-item"
        size="mini"
        icon="el-icon-refresh"
        @click="toQuery"
      >刷新</el-button>

    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd" />
    <!--表格渲染-->
    <el-table ref="table" v-loading="loading" :data="data" size="small" style="width: 100%;"
              @selection-change="selectionChangeHandler">
      <el-table-column type="selection" width="55" :selectable="checkboxT"/>
      <el-table-column prop="id" label="id" />
      <el-table-column prop="uid" label="uid" />
      <el-table-column prop="name" label="平台简称" />
      <el-table-column prop="extractPrice" label="到账金额" />
      <el-table-column prop="balance" label="提现金额" />
      <el-table-column prop="extractType" label="提现方式" />
      <el-table-column prop="extractType" label="用户详情" style="width: 300px">
        <template slot-scope="scope">
          <div v-if="scope.row.extractType=='weixin'">
            姓名:{{ scope.row.realName }}<br>
            微信号:{{ scope.row.wechat }}
          </div>
          <div v-else-if="scope.row.extractType=='bank'">
          姓名:{{ scope.row.realName }}<br>
          银行卡号:{{ scope.row.bankCode }}
        </div>
          <div v-else>
            姓名:{{ scope.row.realName }}<br>
            支付宝号:{{ scope.row.alipayCode }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="mark" label="备注" />
      <el-table-column prop="createTime" label="提现时间">
        <template slot-scope="scope">
          <span>{{ formatTimeTwo(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="到账时间">
        <template slot-scope="scope">
          <span v-if="scope.row.status==1">{{ formatTimeTwo(scope.row.updateTime) }}</span>
          <span v-else>无</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="审核状态" >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status==1" style="cursor: pointer" :type="'success'">提现通过</el-tag>
          <el-tag v-else-if="scope.row.status==-1" style="cursor: pointer" :type=" 'danger' ">提现未通过</el-tag>
          <el-tag v-else style="cursor: pointer" :type="'warning'">未提现</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="失败原因">
        <template slot-scope="scope">
            失败原因：{{ scope.row.failMsg }}
            <br>
            失败时间：{{ formatTimeTwo(scope.row.failTime) }}
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['admin','MWUSEREXTRACT_ALL','MWUSEREXTRACT_EDIT','MWUSEREXTRACT_DELETE'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button
            v-permission="['admin','MWUSEREXTRACT_ALL','MWUSEREXTRACT_EDIT']"
            size="mini"
            type="primary"
            @click="edit(scope.row)"
          >操作</el-button>
          <!--<el-popover-->
          <!--v-permission="['admin','MWUSEREXTRACT_ALL','MWUSEREXTRACT_DELETE']"-->
          <!--:ref="scope.row.id"-->
          <!--placement="top"-->
          <!--width="180">-->
          <!--<p>确定删除本条数据吗？</p>-->
          <!--<div style="text-align: right; margin: 0">-->
          <!--<el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>-->
          <!--<el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定</el-button>-->
          <!--</div>-->
          <!--<el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"/>-->
          <!--</el-popover>-->
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      :current-page="page + 1"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, jumper, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"
    />
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/crud'
import { del,extracts } from '@/api/mwUserExtract'
import eForm from './form'
import { formatTimeTwo } from '@/utils/index'
import md5 from 'js-md5';
export default {
  components: { eForm},
  mixins: [initData],
  data() {
    return {
      dataSelections: [],
      delLoading: false,
      queryTypeOptions: [
        { key: '1', display_name: '审核通过' },
        { key: '0', display_name: '未提现' },
        { key: '-1', display_name: '审核未通过' }
      ]
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    checkboxT(row) {
      return row.status != 1
    },
    selectionChangeHandler (val) {
      this.dataSelections = val
    },
    formatTimeTwo,
    checkPermission,
    beforeInit() {
      this.url = 'api/mwUserExtract'
      const sort = 'id,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
      const query = this.query
      const type = query.type
      const value = query.value
      if(query.uid) {
        this.params['uid'] = query.uid;
      }
      if (type && value) { this.params[type] = value }
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
        uid: data.uid,
        name: data.name,
        realName: data.realName,
        extractType: data.extractType,
        bankCode: data.bankCode,
        bankAddress: data.bankAddress,
        alipayCode: data.alipayCode,
        extractPrice: data.extractPrice,
        mark: data.mark,
        balance: data.balance,
        failMsg: data.failMsg,
        failTime: data.failTime,
        addTime: data.addTime,
        status: data.status,
        wechat: data.wechat
      }
      _this.dialog = true
    },
    doExtract() {
      this.$confirm(`确认提现选中的${this.dataSelections.length}条记录?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showInput: true,
        inputPlaceholder: '请输入操作密码',
        closeOnClickModal: false,
        type: 'warning'
      }).then((res) => {
        this.extractMethod(res.value)
      }).catch(() => {
        this.form.opePwd=''
      })
    },
    extractMethod(opePwd) {
      if(opePwd == null || opePwd === '') {
        alert('操作密码不能为空');
        return
      }
      this.delLoading = true
      //提交
      for(let i = 0; i< this.dataSelections.length; i++){
        this.dataSelections[i].status=1;
      }
      extracts({'extracts': this.dataSelections, 'opePwd': md5(opePwd)}).then(() => {
        this.$notify({
          title: '操作成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.init()
      }).catch(err => {
        this.loading = false
        this.form.opePwd=''
        console.log(err.response.data.message)
      })
    }
  }
}
</script>

<style scoped>

</style>
