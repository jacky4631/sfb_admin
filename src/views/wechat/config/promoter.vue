<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="200px">
      <el-form-item label="多会员开关">
        <el-radio v-model="form.store_multi_vip_open" :label="1">开启</el-radio>
        <el-radio v-model="form.store_multi_vip_open" :label="2">关闭</el-radio>
        <p style="color: red">我的特权多会员</p>
      </el-form-item>
      <el-form-item label="分销开关">
        <el-radio v-model="form.store_brokerage_open" :label="1">开启</el-radio>
        <el-radio v-model="form.store_brokerage_open" :label="2">关闭</el-radio>
        <p style="color: red">订单分销和会员升级分销</p>
      </el-form-item>
      <el-form-item label="登录强制邀请码开关">
        <el-radio v-model="form.login_must_code" :label="1">开启</el-radio>
        <el-radio v-model="form.login_must_code" :label="2">关闭</el-radio>
        <p style="color: red">先放这里，后期移位置</p>
      </el-form-item>
      <el-form-item label="淘宝扣除服务费后比例">
        <el-input v-model="form.tk_tb_rebate_scale" style="width: 170px;" />%
        <p style="color: red">推荐设置80-90</p>
      </el-form-item>
      <el-form-item label="【拆红包】比例">
        <el-input v-model="form.tk_hb_rebate_scale" style="width: 170px;" />%
        <p style="color: red">推荐设置70，如果上面设置90，最终比例就是70*90=63%，优先取会员等级的比例</p>
      </el-form-item>
      <el-form-item label="【拆红包】显示倍数区间">
        <el-input v-model="form.tk_hb_min_times" style="width: 80px;" />倍-
        <el-input v-model="form.tk_hb_max_times" style="width: 80px;" />倍
        <p style="color: red">推荐设置0.5-10，APP端显示的拆红包金额区间</p>
      </el-form-item>
      <el-form-item label="【会员升级】分红(实时)">
        一级:<el-input v-model="form.store_brokerage_ratio" style="width: 170px;" />%

        &nbsp;二级:<el-input v-model="form.store_brokerage_two" style="width: 170px;" />%
        <p style="color: red">app"我的特权"会员升级返佣</p>
      </el-form-item>
      <el-form-item label="提现最低金额">
        <el-input v-model="form.user_extract_min_price" style="width: 170px;" />元,提现最高金额<el-input v-model="form.user_extract_max_price" style="width: 170px;" />元,每天提现次数
        <el-input v-model="form.user_extract_count" style="width: 170px;" />次
        <p style="color: red">提现最低金额</p>
      </el-form-item>
      <el-form-item label="自动提现">
        <el-radio v-model="form.user_extract_auto" :label="1">开启</el-radio>
        <el-radio v-model="form.user_extract_auto" :label="2">关闭</el-radio>
        最大金额
        <el-input v-model="form.user_extract_max" style="width: 170px;" />元
        <p style="color: red">开启提现自动到账，如余额不够会提现失败，需要手动审核</p>
        <p style="color: red">超过最大金额手动审核->财务管理->提现管理</p>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="doSubmit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/crud'
import { del, add, get } from '@/api/mwSystemConfig'
import eForm from './form'
import picUpload from '@/components/pic-upload'
import { Message } from 'element-ui'
export default {
  components: { eForm, picUpload },
  mixins: [initData],
  data() {
    return {
      delLoading: false,
      form: {
        tk_hb_min_times: 0.5,
        tk_hb_max_times: 10,
        tk_hb_rebate_scale:50,
        tk_tb_rebate_scale: 90,
        store_multi_vip_open: 2,
        store_brokerage_open: 2,
        login_must_code: 2,
        store_brokerage_ratio: 0,
        store_brokerage_two: 0,
        user_extract_min_price: 1,
        user_extract_max_price: 2000,
        user_extract_count: 1,
        user_extract_auto: 2,
        user_extract_max: 50,
      },
      rules: {
      }
    }
  },
  created() {
    get().then(rese => {
      const that = this;
      rese.content.map(function(key, value) {
        const keyName = key.menuName
        const newValue = key.value
        if(keyName in that.form){
          that.form[keyName] = newValue
        }
      })

      this.form.store_multi_vip_open = parseInt(this.form.store_multi_vip_open)
      this.form.store_brokerage_open = parseInt((this.form.store_brokerage_open))

      this.form.user_extract_auto = parseInt(this.form.user_extract_auto)
      this.form.login_must_code = parseInt((this.form.login_must_code))
    })
  },
  methods: {
    checkPermission,
    doSubmit() {
      add(this.form).then(res => {
        Message({ message: '设置成功', type: 'success' })
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
