<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input v-model="query.value" clearable placeholder="输入完整的身份证或者手机号" style="width: 250px;" class="filter-item" @keyup.enter.native="toQuery" @clear="toQuery"/>
      <el-input v-model="query.cardName" clearable placeholder="输入用户真实姓名" style="width: 150px;" class="filter-item" @keyup.enter.native="toQuery" @clear="toQuery"/>
      <el-input v-model="query.uid" clearable placeholder="输入用户uid" style="width: 150px;" class="filter-item" @keyup.enter.native="toQuery" @clear="toQuery"/>
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
    <detail ref="formd" />
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column prop="uid" label="用户id" />
      <el-table-column prop="cardName" label="姓名" />
      <el-table-column prop="phone" label="手机号"  width="120"/>
      <el-table-column prop="cardNo" label="身份证" width="150"/>
      <el-table-column ref="table" prop="cardFPath" label="身份证人像面"width="100">
        <template slot-scope="scope">
          <a :href="scope.row.cardFPath" style="color: rgb(64, 158, 255)" target="_blank"><img :src="scope.row.cardFPath" alt="点击打开" class="el-shop"></a>
        </template>
      </el-table-column>

      <el-table-column ref="table" prop="cardBPath" label="身份证国徽面" width="100">
        <template slot-scope="scope">
          <a :href="scope.row.cardBPath" style="color: rgb(64, 158, 255)" target="_blank">
            <img :src="scope.row.cardBPath" alt="点击打开" class="el-shop"></a>
        </template>
      </el-table-column>
      <el-table-column ref="table" prop="contractPath" label="合同地址">
        <template slot-scope="scope">
          <div>
            <el-tag v-if="scope.row.contractPath == null" >无</el-tag>
            <el-tag v-else ><a :href="scope.row.contractPath" style="color: rgb(64, 158, 255)" target="_blank">点击打开</a></el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column ref="table" prop="facePath" label="人脸认证照片" width="100">
        <template slot-scope="scope">
          <a :href="scope.row.facePath" style="color: rgb(64, 158, 255)" target="_blank"><img :src="scope.row.facePath" alt="点击打开" class="el-shop"></a>
        </template>
      </el-table-column>

      <el-table-column prop="cardExpired" label="身份证过期时间" width="150"/>

      <el-table-column  prop="createTime" label="创建日期" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column  prop="updateTime" label="更新日期" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['admin','MWUSER_CARD_ALL','MWUSER_CARD_EDIT','MWUSER_CARD_DELETE'])" label="操作" width="125" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button
            v-permission="['admin','MWUSER_CARD_ALL','MWUSER_CARD_DELETE']"
            size="mini"
            type="danger"
            @click="deleteCard(scope.row.uid)"
          >删除</el-button>
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
import {clearSignature, clearCard, clearCardBank, clearCardPhone} from '@/api/mwUserCard'
import { formatTime } from '@/utils/index'
export default {
  mixins: [initData],
  data() {
    return {
      delLoading: false,
      userType: ''
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
    clearSign(id) {
      this.$confirm(`由于用户签名太过潦草，是否清空签名？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          clearSignature(id).then(({ data }) => {
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
        .catch(() => { })
    },

    deleteCard(id) {
      this.$confirm(`是否删除开店信息`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          clearCard(id).then(({ data }) => {
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
        .catch(() => { })
    },
    deleteCardBank(id) {
      this.$confirm(`是否删除银行卡信息`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          clearCardBank(id).then(({ data }) => {
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
        .catch(() => { })
    },
    deleteCardPhone(id) {
      this.$confirm(`是否删除手机信息`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          clearCardPhone(id).then(({ data }) => {
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
        .catch(() => { })
    },
    beforeInit() {
      this.url = 'api/mwUser/card'
      const sort = 'create_time,desc'
      this.params = { page: this.page, size: this.size, sort: sort, userType: this.userType }
      const query = this.query
      const value = query.value
      if(value) {
        this.params["blurry"] = value
      }
      const uid = query.uid
      if(uid) {
        this.params['uid'] = uid
      }
      const cardName = query.cardName
      if(cardName) {
        this.params['cardName'] = cardName
      }
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
  }
}
</script>

<style scoped>

</style>
