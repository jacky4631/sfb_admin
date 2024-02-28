<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="650px">
    <el-form ref="form" :model="form" size="small" label-width="100px">
      <el-form-item label="uid">
        <el-input v-model="form.uid" :disabled="isAdd ? false : true" style="width: 150px;" />
      </el-form-item>
      <el-form-item label="体验倍数">
        <el-input v-model="form.expScale" style="width: 150px;" />
      </el-form-item>
      <el-form-item label="月卡倍数">
        <el-input v-model="form.monthScale" style="width: 150px;" />
      </el-form-item>
      <el-form-item label="体验有效期">
        <el-input v-model="form.expInvalidDay" style="width: 150px;" />
      </el-form-item>
      <el-form-item label="月卡有效期">
        <el-input v-model="form.monthInvalidDay" style="width: 150px;" />
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

import { editScale, addScale } from '@/api/mwUserEnergy'
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
        expScale: 3.0,
        expInvalidDay: 15,
        monthScale: 2.0,
        monthInvalidDay: 60,
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
      if(this.isAdd) {
        this.doAdd();
      } else {
        this.doEdit()
      }

    },
    doAdd() {
      this.form.opePwd = md5(this.form.opePwdBak)
      addScale(this.form).then(res => {
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
    doEdit() {
      this.form.opePwd = md5(this.form.opePwdBak)
      editScale(this.form).then(res => {
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
        expScale: 3.0,
        expInvalidDay: 15,
        monthScale: 2.0,
        monthInvalidDay: 60,
        opePwd: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
