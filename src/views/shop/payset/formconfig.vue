<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="'APP支付开关'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">

      <el-form-item label="支付宝支付" label-width="200px">
        <el-radio v-model="form.alipay" :label="`1`">开启</el-radio>
        <el-radio v-model="form.alipay" :label="`0`">关闭</el-radio>
      </el-form-item>
      <el-form-item label="微信支付" label-width="200px">
        <el-radio v-model="form.wechat" :label="`1`">开启</el-radio>
        <el-radio v-model="form.wechat" :label="`0`">关闭</el-radio>
      </el-form-item>

      <el-form-item label="银行卡支付" label-width="200px">
        <el-radio v-model="form.bank" :label="`1`">开启</el-radio>
        <el-radio v-model="form.bank" :label="`0`">关闭</el-radio>
      </el-form-item>

      <el-form-item label="银行卡绑卡支付" label-width="200px">
        <el-radio v-model="form.bankBind" :label="`1`">开启</el-radio>
        <el-radio v-model="form.bankBind" :label="`0`">关闭</el-radio>
      </el-form-item>

      <el-form-item label="支付宝支付减免" label-width="200px">
        <el-radio v-model="form.ac" :label="`1`">开启</el-radio>
        <el-radio v-model="form.ac" :label="`0`">关闭</el-radio>
      </el-form-item>

      <el-form-item label="微信支付减免" label-width="200px">
        <el-radio v-model="form.wc" :label="`1`">开启</el-radio>
        <el-radio v-model="form.wc" :label="`0`">关闭</el-radio>
      </el-form-item>

      <el-form-item label="银行卡支付减免" label-width="200px">
        <el-radio v-model="form.bc" :label="`1`">开启</el-radio>
        <el-radio v-model="form.bc" :label="`0`">关闭</el-radio>
      </el-form-item>

      <el-form-item label="银行卡绑卡支付减免" label-width="200px">
        <el-radio v-model="form.bbc" :label="`1`">开启</el-radio>
        <el-radio v-model="form.bbc" :label="`0`">关闭</el-radio>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { setAppPayConfig } from '@/api/mwPaySet'
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
        alipay: "1",
        wechat: "0",
        bank: "0",
        bankBind: "0",
        ac:"0",
        wc:"0",
        bc:"0",
        bbc:"0"
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
      setAppPayConfig(this.form).then(res => {
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
        alipay: "1",
        wechat: "0",
        bank: "0",
        bankBind: "0",
        ac:"0",
        wc:"0",
        bc:"0",
        bbc:"0"
      }
    }
  }
}
</script>

<style scoped>

</style>
