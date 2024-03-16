<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input v-model="query.value" clearable placeholder="输入搜索内容" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery" @clear="toQuery"/>
      <el-input v-model="query.uid" clearable placeholder="输入用户uid" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery" @clear="toQuery"/>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!-- 新增 -->
      <el-button
        type="danger"
        class="filter-item"
        size="mini"
        icon="el-icon-refresh"
        @click="toQuery"
      >刷新</el-button>

      <el-button class="filter-item" size="mini" type="warning" icon="el-icon-document" @click="editHbUnlockConfig">订单解锁配置</el-button>


      <el-button class="filter-item" size="mini" type="warning" icon="el-icon-document" @click="editAppDataConfig">APP基础信息配置</el-button>
      <el-button class="filter-item" size="mini" type="warning" icon="el-icon-document" @click="editAppShareConfig">APP分享图配置</el-button>
      <el-button class="filter-item" size="mini" type="warning" icon="el-icon-document" @click="editAppLoginWhitelistConfig">APP登录白名单配置</el-button>

    </div>
    <!--表单组件-->
    <hbUnlockConfigForm ref="formhbunlockconfig" />
    <appDataConfigForm ref="formappdataconfig" />
    <appShareConfigForm ref="formappshareconfig" />
    <appLoginWhitelistConfigForm ref="formapploginwhitelistconfig" />
    <eForm ref="form" :is-add="isAdd" />
    <pForm ref="formp" :is-add="isAdd" />
    <energyForm ref="forme" :is-add="isAdd" />
    <iForm ref="formi" :is-add="isAdd" />
    <wForm ref="formw" :is-add="isAdd" />
    <rForm ref="formr" :is-add="isAdd" />
    <bankForm ref="formBank" :is-add="isAdd" />
    <extractForm ref="formExtract" :is-add="isAdd" />
    <detail ref="formd" />
    <userExtra ref="formUserExtra" />
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column prop="uid" label="用户id" />
      <el-table-column prop="additionalNo" label="追单号" />
      <el-table-column prop="nickname" label="用户昵称" width="150"/>
      <el-table-column prop="code" label="邀请码"  width="120"/>
      <el-table-column ref="table" prop="avatar" label="用户头像">
        <template slot-scope="scope">
          <a :href="scope.row.avatar" style="color: rgb(64, 158, 255)" target="_blank"><img :src="scope.row.avatar" alt="点击打开" class="el-avatar"></a>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="手机号码" width="140"/>
      <el-table-column prop="realName" label="真实姓名" />
      <el-table-column prop="nowMoney" label="用户余额" />
      <el-table-column prop="spreadUid" label="推荐人" />
      <el-table-column label="淘店级别" align="center">
        <template slot-scope="scope">
          <div>
            <el-tag v-if="scope.row.level == 5" style="background-color: #8A77C5; color: white">店主</el-tag>
            <el-tag v-else  style="background-color: #B68567; color: white">普通</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column  prop="expired" label="淘店有效期" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.expired }}</span>
        </template>
      </el-table-column>
      <el-table-column label="京店级别" align="center" width="140">
        <template slot-scope="scope">
          <div>
            <el-tag v-if="scope.row.levelJd == 5" style="background-color: #8A77C5; color: white">店主</el-tag>
            <el-tag v-else  style="background-color: #B68567; color: white">普通</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column  prop="expiredJd" label="京店有效期" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.expiredJd }}</span>
        </template>
      </el-table-column>
      <el-table-column label="多店级别" align="center" width="140">
        <template slot-scope="scope">
          <div>
            <el-tag v-if="scope.row.levelPdd == 5" style="background-color: #8A77C5; color: white">店主</el-tag>
            <el-tag v-else  style="background-color: #B68567; color: white">普通</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column  prop="expiredPdd" label="多店有效期" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.expiredPdd }}</span>
        </template>
      </el-table-column>
      <el-table-column label="抖店级别" align="center" width="140">
        <template slot-scope="scope">
          <div>
            <el-tag v-if="scope.row.levelDy == 5" style="background-color: #8A77C5; color: white">店主</el-tag>
            <el-tag v-else  style="background-color: #B68567; color: white">普通</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column  prop="expiredDy" label="抖店有效期" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.expiredDy }}</span>
        </template>
      </el-table-column>
      <el-table-column label="唯店级别" align="center">
        <template slot-scope="scope">
          <div>
            <el-tag v-if="scope.row.levelVip == 5" style="background-color: #8A77C5; color: white">店主</el-tag>
            <el-tag v-else  style="background-color: #B68567; color: white">普通</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column  prop="expiredVip" label="唯店有效期" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.expiredVip }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="tbPid" label="淘宝pid" width="140" :show-overflow-tooltip="true"/>
      <el-table-column prop="jdPid" label="京东pid" width="140" :show-overflow-tooltip="true"/>
      <el-table-column prop="pddPid" label="拼多多pid" width="140" :show-overflow-tooltip="true"/>
      <el-table-column prop="mark" label="备注" />
      <el-table-column prop="integral" label="用户积分" />
      <el-table-column label="支付宝授权" align="center" width="100" >
        <template slot-scope="scope">
            <el-tag v-if="scope.row.aliProfile != null" style="cursor: pointer" :type="''">是</el-tag>
            <el-tag v-else style="cursor: pointer" :type=" 'info' ">否</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="微信授权" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.wxProfile != null" style="cursor: pointer" :type="''">是</el-tag>
          <el-tag v-else style="cursor: pointer" :type=" 'info' ">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column  prop="updateTime" label="最后登录" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column  prop="createTime" label="创建日期" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <div @click="onStatus(scope.row.uid,scope.row.status)">
            <el-tag v-if="scope.row.status == 1" style="cursor: pointer" :type="''">正常</el-tag>
            <el-tag v-else style="cursor: pointer" :type=" 'info' ">禁用</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['admin','MWUSER_ALL','MWUSER_EDIT','MWUSER_DELETE'])" label="操作" width="315" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button
            v-permission="['admin','MWUSER_ALL','MWUSER_EDIT']"
            size="mini"
            type="danger"
            @click="editD(scope.row)"
          >查看下级</el-button>
          <el-button
            v-permission="['admin','MWUSER_ALL']"
            size="mini"
            type="danger"
            @click="getUserExtra(scope.row)"
          >更多信息</el-button>
          <el-dropdown size="mini" split-button type="primary" trigger="click">
            操作
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-button
                  v-permission="['admin','MWUSER_ALL','MWUSER_EDIT']"
                  size="mini"
                  type="primary"
                  @click="edit(scope.row)"
                >修改用户</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button
                  v-permission="['admin','MWUSER_ALL','MWUSER_EDIT']"
                  size="mini"
                  type="primary"
                  @click="editP(scope.row)"
                >修改余额</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button
                  v-permission="['admin','MWUSER_ALL','MWUSER_EDIT']"
                  size="mini"
                  type="primary"
                  @click="editE(scope.row)"
                >修改热度</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button
                  v-permission="['admin','MWUSER_ALL','MWUSER_EDIT']"
                  size="mini"
                  type="primary"
                  @click="deleteAli(scope.row)"
                >清空支付宝授权</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button
                  v-permission="['admin','MWUSER_ALL','MWUSER_EDIT']"
                  size="mini"
                  type="primary"
                  @click="deleteWechat(scope.row)"
                >清空微信授权</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button
                  v-permission="['admin','MWUSER_ALL','MWUSER_EDIT']"
                  size="mini"
                  type="primary"
                  @click="resetRefund(scope.row)"
                >重置退款次数</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button
                  v-permission="['admin','MWUSER_ALL','MWUSER_EDIT']"
                  size="mini"
                  type="primary"
                  @click="bankBind(scope.row)"
                >绑定银行卡</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button
                  v-permission="['admin','MWUSER_ALL','MWUSER_EDIT']"
                  size="mini"
                  type="primary"
                  @click="extract(scope.row)"
                >提   现</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
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
import { del, onStatus, getHbUnlockConfig } from '@/api/mwUser'
import hbUnlockConfigForm from './formhbunlockconfig'
import appDataConfigForm from './formappdataconfig'
import appShareConfigForm from './formappshareconfig'
import appLoginWhitelistConfigForm from './formapploginwhitelistconfig'
import eForm from './form'
import pForm from './formp'
import energyForm from './forme'
import iForm from './formi'
import wForm from './formw'
import rForm from './formr'
import bankForm from './formBank'
import extractForm from './formExtract.vue'
import detail from './detail'
import userExtra from './userExtra'
import { formatTime } from '@/utils/index'
import {getAppDataConfig, getAppShareConfig, getAppLoginWhitelistConfig} from "../../../api/mwUser";
export default {
  name: 'Member',
  components: {eForm, pForm, energyForm, iForm, wForm, rForm, bankForm, extractForm, detail,
    userExtra, hbUnlockConfigForm, appDataConfigForm, appShareConfigForm, appLoginWhitelistConfigForm},
  mixins: [initData],
  data() {
    return {
      delLoading: false,
      userType: '',
      queryTypeOptions: [
        {key: 'nickname', display_name: '用户昵称'},
        {key: 'phone', display_name: '手机号码'}
      ],
      statusOptions: [
        {value: 'routine', label: '小程序'},
        {value: 'wechat', label: '公众号'},
        {value: 'H5', label: 'H5'}
      ]
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    formatTime,
    checkPermission,
    onStatus(id, status) {
      this.$confirm(`确定进行[${status ? '禁用' : '开启'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          onStatus(id, {status: status}).then(({data}) => {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1000,
              onClose: () => {
                this.init()
              }
            })
          })
        })
        .catch(() => {
        })
    },
    beforeInit() {
      this.url = 'api/mwUser'
      const sort = 'uid,desc'
      this.params = {page: this.page, size: this.size, sort: sort, userType: this.userType}
      const query = this.query
      const value = query.value
      if (value) {
        this.params["blurry"] = value
      }
      const uid = query.uid
      if (uid) {
        this.params['uid'] = uid
      }
      // if (type && value) { this.params[type] = value }
      return true
    },
    subDelete(uid) {
      this.delLoading = true
      del(uid).then(res => {
        this.delLoading = false
        this.$refs[uid].doClose()
        this.dleChangePage()
        this.init()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        this.$refs[uid].doClose()
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
        uid: data.uid,
        account: data.account,
        realName: data.realName,
        birthday: data.birthday,
        cardId: data.cardId,
        mark: data.mark,
        partnerId: data.partnerId,
        groupId: data.groupId,
        nickname: data.nickname,
        avatar: data.avatar,
        phone: data.phone,
        addTime: data.addTime,
        addIp: data.addIp,
        lastTime: data.lastTime,
        lastIp: data.lastIp,
        nowMoney: data.nowMoney,
        brokeragePrice: data.brokeragePrice,
        integral: data.integral,
        signNum: data.signNum,
        status: data.status,
        level: data.level,
        levelJd: data.levelJd,
        levelPdd: data.levelPdd,
        levelDy: data.levelDy,
        levelVip: data.levelVip,
        spreadUid: data.spreadUid,
        spreadTime: data.spreadTime,
        userType: data.userType,
        isPromoter: data.isPromoter,
        payCount: data.payCount,
        spreadCount: data.spreadCount,
        cleanTime: data.cleanTime,
        addres: data.addres,
        adminid: data.adminid,
        loginType: data.loginType,
        expired: data.expired,
        expiredJd: data.expiredJd,
        expiredPdd: data.expiredPdd,
        expiredDy: data.expiredDy,
        expiredVip: data.expiredVip,
        tbPid: data.tbPid,
        additionalNo: data.additionalNo,
        jdPid: data.jdPid,
        pddPid: data.pddPid,
        code: data.code,
        aliProfile: data.aliProfile,
        wxProfile: data.wxProfile,
        opePwd: data.opePwd
      }
      _this.dialog = true
    },
    editP(data) {
      this.isAdd = false
      const _this = this.$refs.formp
      _this.form = {
        uid: data.uid,
        nickname: data.nickname,
        ptype: 1,
        money: 0
      }
      _this.dialog = true
    },
    async editHbUnlockConfig() {
      const _this = this.$refs.formhbunlockconfig
      _this.form = await getHbUnlockConfig();
      _this.dialog = true
    },
    async editAppDataConfig() {
      const _this = this.$refs.formappdataconfig
      _this.form = await getAppDataConfig();
      _this.dialog = true
    },
    async editAppShareConfig() {
      const _this = this.$refs.formappshareconfig
      _this.form = await getAppShareConfig();
      _this.dialog = true
    },
    async editAppLoginWhitelistConfig() {
      const _this = this.$refs.formapploginwhitelistconfig
      _this.whitelistStr = await getAppLoginWhitelistConfig();
      _this.dialog = true
    },
    editE(data) {
      this.isAdd = false
      const _this = this.$refs.forme
      _this.form = {
        uid: data.uid,
        nickname: data.nickname,
        ptype: 1,
        energy: 0,
        platform: 'tb',
        type: 1
      }
      _this.dialog = true
    },
    deleteWechat(data) {
      this.isAdd = true
      const _this = this.$refs.formw
      _this.form = {
        uid: data.uid,
        nickname: data.nickname,
        phone: data.phone
      }
      _this.dialog = true
    },
    resetRefund(data) {
      this.isAdd = true
      const _this = this.$refs.formr
      _this.form = {
        uid: data.uid,
        nickname: data.nickname,
        phone: data.phone
      }
      _this.dialog = true
    },
    bankBind(data) {
      this.isAdd = true
      const _this = this.$refs.formBank
      _this.form = {
        uid: data.uid,
        nickname: data.nickname,
        phone: data.phone
      }
      _this.dialog = true
    },
    extract(data) {
      this.isAdd = true
      const _this = this.$refs.formExtract
      _this.form = {
        uid: data.uid,
        nickname: data.nickname,
        phone: data.phone
      }
      _this.dialog = true
    },
    deleteAli(data) {
      this.isAdd = false
      const _this = this.$refs.formw
      _this.form = {
        uid: data.uid,
        nickname: data.nickname,
        phone: data.phone
      }
      _this.dialog = true
    },
    editD(data) {
      const _this = this.$refs.formd
      _this.form = {
        uid: data.uid,
        nickname: data.nickname
      }
      _this.dialog = true
      _this.spread(data.uid)
    },
    getUserExtra(data) {
      const _this = this.$refs.formUserExtra
      _this.form = {
        uid: data.uid,
        nickname: data.nickname
      }
      _this.dialog = true
      _this.getUserExtra(data.uid)
    }
  }
}
</script>

<style scoped>

</style>
