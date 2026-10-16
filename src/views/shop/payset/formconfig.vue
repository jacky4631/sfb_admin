<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" v-model="dialog" :title="'APP支付开关'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">

      <el-form-item label="支付宝支付" label-width="200px">
        <el-radio v-model="form.alipay" :value="`1`">开启</el-radio>
        <el-radio v-model="form.alipay" :value="`0`">关闭</el-radio>
      </el-form-item>
      <el-form-item label="微信支付" label-width="200px">
        <el-radio v-model="form.wechat" :value="`1`">开启</el-radio>
        <el-radio v-model="form.wechat" :value="`0`">关闭</el-radio>
      </el-form-item>

      <el-form-item label="银行卡支付" label-width="200px">
        <el-radio v-model="form.bank" :value="`1`">开启</el-radio>
        <el-radio v-model="form.bank" :value="`0`">关闭</el-radio>
      </el-form-item>

      <el-form-item label="银行卡绑卡支付" label-width="200px">
        <el-radio v-model="form.bankBind" :value="`1`">开启</el-radio>
        <el-radio v-model="form.bankBind" :value="`0`">关闭</el-radio>
      </el-form-item>

      <el-form-item label="支付宝支付减免" label-width="200px">
        <el-radio v-model="form.ac" :value="`1`">开启</el-radio>
        <el-radio v-model="form.ac" :value="`0`">关闭</el-radio>
      </el-form-item>

      <el-form-item label="微信支付减免" label-width="200px">
        <el-radio v-model="form.wc" :value="`1`">开启</el-radio>
        <el-radio v-model="form.wc" :value="`0`">关闭</el-radio>
      </el-form-item>

      <el-form-item label="银行卡支付减免" label-width="200px">
        <el-radio v-model="form.bc" :value="`1`">开启</el-radio>
        <el-radio v-model="form.bc" :value="`0`">关闭</el-radio>
      </el-form-item>

      <el-form-item label="银行卡绑卡支付减免" label-width="200px">
        <el-radio v-model="form.bbc" :value="`1`">开启</el-radio>
        <el-radio v-model="form.bbc" :value="`0`">关闭</el-radio>
      </el-form-item>

    </el-form>
    <template #footer><div class="dialog-footer">
      <el-button link @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </template>
</el-dialog>
</template>

<script>
import { ElNotification } from 'element-plus'
import { setAppPayConfig } from '@/api/mwPaySet.js'
export default {
  props: {
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
        ElNotification({
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
