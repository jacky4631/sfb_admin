<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="'提现配置'" width="700px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="最低提现金额" label-width="200px">
        <el-input-number v-model="form.minPrice" style="width: 370px;" />元
      </el-form-item>
      <el-form-item label="最高提现金额" label-width="200px">
        <el-input-number v-model="form.maxPrice" style="width: 370px;" />元
      </el-form-item>
      <el-form-item label="每天提现次数" label-width="200px">
        <el-input-number v-model="form.count" style="width: 370px;" />元
      </el-form-item>
      <el-form-item label="自动提现最大金额" label-width="200px">
        <el-input-number v-model="form.autoMax" style="width: 370px;" />元
      </el-form-item>
      <el-form-item label="提现手续费" label-width="200px">
        <el-input-number v-model="form.charge" style="width: 370px;" />%
      </el-form-item>
      <el-form-item label="app端提现文字设置1" label-width="200px">
        <el-input v-model="form.extractIntervalDesc" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="app端提现文字设置2" label-width="200px">
        <el-input v-model="form.extractMinDesc" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="app端提现文字设置3" label-width="200px">
        <el-input v-model="form.extractFeeDesc" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="自动提现" label-width="200px">
        <el-radio v-model="form.auto" :label="1">开启</el-radio>
        <el-radio v-model="form.auto" :label="2">关闭</el-radio>
      </el-form-item>
      <el-form-item label="微信提现" label-width="200px">
        <el-radio v-model="form.weixin" :label="1">开启</el-radio>
        <el-radio v-model="form.weixin" :label="0">关闭</el-radio>
      </el-form-item>

      <el-form-item label="支付宝提现" label-width="200px">
        <el-radio v-model="form.alipay" :label="1">开启</el-radio>
        <el-radio v-model="form.alipay" :label="0">关闭</el-radio>
      </el-form-item>

      <el-form-item label="银行卡提现" label-width="200px">
        <el-radio v-model="form.bank" :label="1">开启</el-radio>
        <el-radio v-model="form.bank" :label="0">关闭</el-radio>
        <p style="color: red">银行卡需要对接银盛支付，app端已经实现银盛绑卡</p>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { editExtractConfig } from '@/api/mwUserExtract'
export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      loading: false, dialog: false,
      form: {
        minPrice: 1,
        maxPrice: 3000,
        count: 1,
        auto: 1,
        autoMax: 3000,
        extractIntervalDesc: '',
        extractMinDesc: '',
        extractFeeDesc: '',
        weixin: 0,
        alipay: 1,
        bank: 0,
        charge: 0,
      },
      rules: {
      }
    }
  },

  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.loading = true
      this.doEdit()
    },
    doEdit() {
      editExtractConfig(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '操作成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.$parent.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = {
        minPrice: 1,
        maxPrice: 3000,
        count: 1,
        auto: 1,
        autoMax: 3000,
        extractIntervalDesc: '',
        extractMinDesc: '',
        extractFeeDesc: '',
        weixin: 0,
        alipay: 1,
        bank: 0,
        charge: 0,
      }
    }
  }
}
</script>

<style scoped>

</style>
