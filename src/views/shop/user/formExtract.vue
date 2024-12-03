<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="'提现'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="uid">
        <el-input v-model="form.uid" :disabled="true" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="用户昵称">
        <el-input v-model="form.nickname" :disabled="true" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="提现金额">
        <el-input v-model="form.price" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="form.phone" :disabled="true" style="width: 370px;" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { extract } from '@/api/mwUser'
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
        price: '',
        phone: ''
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
      extract(this.form.uid, this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '提现成功',
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
        uid: '',
        nickname: '',
        phone: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
