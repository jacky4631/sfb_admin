<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="'绑定银行卡'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="uid">
        <el-input v-model="form.uid" :disabled="true" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="用户昵称">
        <el-input v-model="form.nickname" :disabled="true" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="银行卡号">
        <el-input v-model="form.bankNo" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="form.phone" style="width: 370px;" />
        <el-button type="text" @click="getCode">获取验证码</el-button>
      </el-form-item>
      <el-form-item label="验证码">
        <el-input v-model="form.code" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="操作密码">
        <el-input v-model="form.opePwdBak" style="width: 370px;" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getCode, bankBind } from '@/api/mwUser'
import md5 from 'js-md5';
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
        uid: '',
        nickname: '',
        code:"",
        requestNo:'',
        authSn: '',
        bankNo: '',
        phone: '',
        opePwd: '',
        opePwdBak: ''
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
      let opePwd = this.form.opePwdBak;
      let code = this.form.code;
      if(opePwd == null || opePwd === '') {
        this.$notify({
          title: '操作密码不能为空',
          type: 'error',
          duration: 2500
        })
        return
      }
      if(code == null || code === '') {
        this.$notify({
          title: '验证码不能为空',
          type: 'error',
          duration: 2500
        })
        return
      }
      this.loading = true
      this.form.opePwd = md5(this.form.opePwdBak)

      bankBind(this.form.uid, this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '绑定成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.$parent.init()
      }).catch(err => {
        this.loading = false
        this.form.opePwd=''
        console.log(err.response.data.message)
      })

    },
    getCode() {
      let opePwd = this.form.opePwdBak;
      if(opePwd == null || opePwd === '') {
        this.$notify({
          title: '操作密码不能为空',
          type: 'error',
          duration: 2500
        })
        return
      }
      this.loading = true
      this.form.opePwd = md5(this.form.opePwdBak)
      getCode(this.form.uid, this.form).then(res => {
        if(!res.success) {
          this.$notify({
            title: '获取失败:' + res.msg,
            type: 'fail',
            duration: 2500
          })
        } else {
          this.$notify({
            title: '获取成功',
            type: 'success',
            duration: 2500
          })
          this.form.requestNo = res.data.requestNo;
          this.form.authSn = res.data.authSn;
        }
        this.loading = false
        this.$parent.init()
      }).catch(err => {
        this.loading = false
        this.form.opePwd=''
        console.log(err.response.data.message)
      })

    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = {
        uid: '',
        nickname: '',
        phone: '',
        opePwd: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
