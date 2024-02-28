<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="'编辑'" width="650px">
    <el-form ref="form" :model="form" size="small" label-width="100px">
      <el-form-item label="id">
        <el-input v-model="form.id" :disabled="true" style="width: 150px;" />
      </el-form-item>
      <el-form-item label="当前佣金">
        <el-input v-model="form.releaseMoney" style="width: 150px;" />
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

import { edit } from '@/api/mwUserEnergy'
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
        id: '',
        releaseMoney: '',
        opePwd: ''
      },
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
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
      this.doEdit()
    },

    doEdit() {
      this.form.opePwd = md5(this.form.opePwdBak)
      edit(this.form).then(res => {
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
        id: '',
        releaseMoney: '',
        opePwd: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
