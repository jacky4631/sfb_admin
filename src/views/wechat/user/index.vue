<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          v-permission="['admin','MWWECHATUSER_ALL','MWWECHATUSER_CREATE']"
          class="filter-item"
          size="small"
          type="primary"
          :icon="Icons.Plus"
          @click="add"
        >新增</el-button>
      </div>
    </div>
    <!--表单组件-->
    <eForm ref="formRef" :is-add="isAdd" />
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column prop="uid" label="微信用户id" />
      <el-table-column prop="unionid" label="只有在用户将公众号绑定到微信开放平台帐号后，才会出现该字段" />
      <el-table-column prop="openid" label="用户的标识，对当前公众号唯一" />
      <el-table-column prop="routineOpenid" label="小程序唯一身份ID" />
      <el-table-column prop="nickname" label="用户的昵称" />
      <el-table-column prop="headimgurl" label="用户头像" />
      <el-table-column prop="sex" label="用户的性别，值为1时是男性，值为2时是女性，值为0时是未知" />
      <el-table-column prop="city" label="用户所在城市" />
      <el-table-column prop="language" label="用户的语言，简体中文为zh_CN" />
      <el-table-column prop="province" label="用户所在省份" />
      <el-table-column prop="country" label="用户所在国家" />
      <el-table-column prop="remark" label="公众号运营者对粉丝的备注，公众号运营者可在微信公众平台用户管理界面对粉丝添加备注" />
      <el-table-column prop="groupid" label="用户所在的分组ID（兼容旧的用户分组接口）" />
      <el-table-column prop="tagidList" label="用户被打上的标签ID列表" />
      <el-table-column prop="subscribe" label="用户是否订阅该公众号标识" />
      <el-table-column prop="subscribeTime" label="关注公众号时间" />
      <el-table-column prop="addTime" label="添加时间" />
      <el-table-column prop="stair" label="一级推荐人" />
      <el-table-column prop="second" label="二级推荐人" />
      <el-table-column prop="orderStair" label="一级推荐人订单" />
      <el-table-column prop="orderSecond" label="二级推荐人订单" />
      <el-table-column prop="nowMoney" label="佣金" />
      <el-table-column prop="sessionKey" label="小程序用户会话密匙" />
      <el-table-column prop="userType" label="用户类型" />
      <el-table-column v-if="checkPermission(['admin','MWWECHATUSER_ALL','MWWECHATUSER_EDIT','MWWECHATUSER_DELETE'])" label="操作" width="150px" align="center">
        <template #default="scope">
          <el-button v-permission="['admin','MWWECHATUSER_ALL','MWWECHATUSER_EDIT']" size="small" type="primary" :icon="Icons.Edit" @click="edit(scope.row)" />
          <el-popover trigger="click"
            :ref="scope.row.uid"
            placement="top"
            width="180"
          >
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="small" link @click="$refs[scope.row.uid].hide()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="small" @click="subDelete(scope.row.uid)">确定</el-button>
            </div>
            <template #reference>
              <el-button v-permission="['admin','MWWECHATUSER_ALL','MWWECHATUSER_DELETE']" type="danger" :icon="Icons.Delete" size="small" />
            </template>
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

<script setup>
import { ref, onMounted } from 'vue'
import { ElNotification } from 'element-plus'
import checkPermission from '@/utils/permission.js'
import { del } from '@/api/mwWechatUser.js'
import eForm from './form.vue'
import * as Icons from '@element-plus/icons-vue'

const loading = ref(false)
const isAdd = ref(true)
const delLoading = ref(false)
const page = ref(0)
const size = ref(10)
const total = ref(0)
const data = ref([])
const url = ref('')
const params = ref({})
const formRef = ref(null)

const init = () => {
  loading.value = true
  // Simulate fetching data - replace with actual API call
  loading.value = false
}

const beforeInit = () => {
  url.value = 'api/mwWechatUser'
  const sort = 'uid,desc'
  params.value = { page: page.value, size: size.value, sort: sort }
  return true
}

onMounted(() => {
  init()
})

const subDelete = (uid) => {
  delLoading.value = true
  del(uid).then(res => {
    delLoading.value = false
    dleChangePage()
    init()
    ElNotification({
      title: '删除成功',
      type: 'success',
      duration: 2500
    })
  }).catch(err => {
    delLoading.value = false
    console.log(err.response?.data?.message || err.message)
  })
}

const add = () => {
  isAdd.value = true
  formRef.value.dialog = true
}

const edit = (rowData) => {
  isAdd.value = false
  const _this = formRef.value
  _this.form = {
    uid: rowData.uid,
    unionid: rowData.unionid,
    openid: rowData.openid,
    routineOpenid: rowData.routineOpenid,
    nickname: rowData.nickname,
    headimgurl: rowData.headimgurl,
    sex: rowData.sex,
    city: rowData.city,
    language: rowData.language,
    province: rowData.province,
    country: rowData.country,
    remark: rowData.remark,
    groupid: rowData.groupid,
    tagidList: rowData.tagidList,
    subscribe: rowData.subscribe,
    subscribeTime: rowData.subscribeTime,
    addTime: rowData.addTime,
    stair: rowData.stair,
    second: rowData.second,
    orderStair: rowData.orderStair,
    orderSecond: rowData.orderSecond,
    nowMoney: rowData.nowMoney,
    sessionKey: rowData.sessionKey,
    userType: rowData.userType
  }
  _this.dialog = true
}

const sizeChange = (val) => {
  size.value = val
  init()
}

const pageChange = (val) => {
  page.value = val
  init()
}

const dleChangePage = () => {
  if (total.value % size.value === 0) {
    page.value = Math.max(0, page.value - 1)
  }
}
</script>

<style scoped>

</style>
