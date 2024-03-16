<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="'APP登录白名单配置'" width="800px">
    <el-form size="small" label-width="80px">

      <el-form-item label="登录白名单手机号" label-width="200px" placeholder="英文逗号(,)分隔">
        <el-input v-model="whitelistStr" style="width: 370px;" />
        <p style="color: red">用于应用市场上架审核，默认登录验证码1234</p>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="handleSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { setAppLoginWhitelistConfig, getAppLoginWhitelistConfig } from '@/api/mwUser'

import MaterialList from '@/components/material'
export default {
  components: { MaterialList },
  data() {
    return {
      dialog: false,
      whitelistStr: '',
      loading: false,
    }
  },

  // mounted () {
  //   this.getInfo();
  // },
  methods: {
    // 详情
    async getInfo () {
      let that = this;
      let whitelistStr = await getAppLoginWhitelistConfig()
      console.log('data:'+whitelistStr)
      that.whitelistStr = whitelistStr;
    },

    // 提交
    handleSubmit (name) {
      setAppLoginWhitelistConfig(this.whitelistStr).then(async res => {
        this.resetForm()
        this.$notify({
          title: '操作成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.$parent.init()
      }).catch(res => {

      })
    },

    cancel() {
      this.resetForm()
    },

    resetForm() {
      this.dialog = false
      this.whitelistStr = ''
    }
  }
}
</script>
