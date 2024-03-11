<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="'订单解锁配置'" width="700px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="普通用户" label-width="400px">
      </el-form-item>
      <el-form-item label="解锁时间" label-width="200px">
        <el-input-number v-model="form.unlock" style="width: 370px;" />天
      </el-form-item>
      <el-form-item label="退款1次解锁时间" label-width="200px">
        <el-input-number v-model="form.unlock1" style="width: 370px;" />天
      </el-form-item>
      <el-form-item label="退款2次解锁时间" label-width="200px">
        <el-input-number v-model="form.unlock2" style="width: 370px;" />天
      </el-form-item>
      <el-form-item label="退款多次解锁时间" label-width="200px">
        <el-input-number v-model="form.unlock3" style="width: 370px;" />天
      </el-form-item>
      <el-form-item label="加盟用户" label-width="400px">
      </el-form-item>
      <el-form-item label="解锁时间" label-width="200px">
        <el-input-number v-model="form.unlockVip" style="width: 370px;" />天
      </el-form-item>
      <el-form-item label="退款1次解锁时间" label-width="200px">
        <el-input-number v-model="form.unlockVip1" style="width: 370px;" />天
      </el-form-item>
      <el-form-item label="退款2次解锁时间" label-width="200px">
        <el-input-number v-model="form.unlockVip2" style="width: 370px;" />天
      </el-form-item>
      <el-form-item label="退款多次解锁时间" label-width="200px">
        <el-input-number v-model="form.unlockVip3" style="width: 370px;" />天
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { setHbUnlockConfig } from '@/api/mwUser'
export default {
  props: {
  },
  data() {
    return {
      loading: false, dialog: false,
      form: {
        unlock: 5,
        unlock1: 10,
        unlock2: 10,
        unlock3: 10,
        unlockVip: 7,
        unlockVip1: 10,
        unlockVip2: 10,
        unlockVip3: 10,
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
      setHbUnlockConfig(this.form).then(res => {
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
        unlock: 5,
        unlock1: 10,
        unlock2: 10,
        unlock3: 10,
        unlockVip: 7,
        unlockVip1: 10,
        unlockVip2: 10,
        unlockVip3: 10,
      }
    }
  }
}
</script>

<style scoped>

</style>
