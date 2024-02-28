<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="'重置退款次数'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="uid">
        <el-input v-model="form.uid" :disabled="true" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="用户昵称">
        <el-input v-model="form.nickname" :disabled="true" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="form.phone" :disabled="true" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="操作密码">
        <el-input v-model="form.opePwd" style="width: 370px;" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { resetRefund } from '@/api/mwUser'
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
        phone: '',
        opePwd: ''
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
      let opePwd = this.form.opePwd;
      if(opePwd == null || opePwd === '') {
        this.$notify({
          title: '操作密码不能为空',
          type: 'error',
          duration: 2500
        })
        return
      }
      this.loading = true
      this.form.opePwd = md5(this.form.opePwd)
      this.resetRefund()

    },
    resetRefund() {
      resetRefund(this.form.uid, this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '修改成功',
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
