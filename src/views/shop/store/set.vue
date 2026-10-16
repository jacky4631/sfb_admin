<template>
  <div class="app-container finance-page">
    <div class="finance-settings">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="150px">
      <el-form-item label="开启门店自提">
        <el-radio v-model="form.store_self_mention" :value="1">开启</el-radio>
        <el-radio v-model="form.store_self_mention" :value="2">关闭</el-radio>
      </el-form-item>
      <el-form-item label="腾讯地图KEY">
        <el-input v-model="form.tengxun_map_key" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="doSubmit">提交</el-button>
      </el-form-item>

    </el-form>
    </div>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission.js'
import initData from '@/mixins/crud.js'
import { del, add, get } from '@/api/mwSystemConfig.js'

import { ElMessage } from 'element-plus'

export default {
  mixins: [initData],
  data() {
    return {
      delLoading: false,
      form: {
        store_self_mention: 1,
        tengxun_map_key: ''
      },
      rules: {
      }
    }
  },
  created() {
    get().then(rese => {
      const that = this
      rese.content.map(function(key, value) {
        const keyName = key.menuName
        const newValue = key.value
        if(keyName in that.form){
          that.form[keyName] = newValue
        }
      })
      this.form.store_self_mention = parseInt(this.form.store_self_mention)
    })
  },
  methods: {
    checkPermission,
    doSubmit() {
      add(this.form).then(res => {
        ElMessage.success('设置成功')
      }).catch(err => {
        // this.loading = false
        console.log(err.response.data.message)
      })
    }

  }
}
</script>

<style scoped>

</style>
