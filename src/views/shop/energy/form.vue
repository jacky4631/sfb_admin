<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" v-model="dialog" :title="'编辑'" width="650px">
    <el-form ref="form" :model="form" size="small" label-width="100px">
      <el-form-item label="id">
        <el-input v-model="form.id" :disabled="true" style="width: 150px;" />
      </el-form-item>
      <el-form-item label="当前佣金">
        <el-input v-model="form.releaseMoney" style="width: 150px;" />
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

import { edit } from '@/api/mwUserEnergy.js'
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
        releaseMoney: ''
      },
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
      edit(this.form).then(res => {
        this.resetForm()
        ElNotification({
          title: '修改成功',
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
        id: '',
        releaseMoney: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
