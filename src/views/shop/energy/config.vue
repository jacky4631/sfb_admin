<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="200px">
      <el-form-item label="淘宝加盟">
        自身获得能量值<el-input v-model="form.tbConfig.value" style="width: 170px;" />个,
        一级获得能量值<el-input v-model="form.tbConfig.valueOne" style="width: 170px;" />个,
        二级获得能量值<el-input v-model="form.tbConfig.valueTwo" style="width: 170px;" />个
      </el-form-item>
      <el-form-item label="京东加盟">
        自身获得能量值<el-input v-model="form.jdConfig.value" style="width: 170px;" />个,
        一级获得能量值<el-input v-model="form.jdConfig.valueOne" style="width: 170px;" />个,
        二级获得能量值<el-input v-model="form.jdConfig.valueTwo" style="width: 170px;" />个
      </el-form-item>
      <el-form-item label="拼多多加盟">
        自身获得能量值<el-input v-model="form.pddConfig.value" style="width: 170px;" />个,
        一级获得能量值<el-input v-model="form.pddConfig.valueOne" style="width: 170px;" />个,
        二级获得能量值<el-input v-model="form.pddConfig.valueTwo" style="width: 170px;" />个
      </el-form-item>
      <el-form-item label="抖音加盟">
        自身获得能量值<el-input v-model="form.dyConfig.value" style="width: 170px;" />个,
        一级获得能量值<el-input v-model="form.dyConfig.valueOne" style="width: 170px;" />个,
        二级获得能量值<el-input v-model="form.dyConfig.valueTwo" style="width: 170px;" />个
      </el-form-item>
      <el-form-item label="唯品会加盟">
        自身获得能量值<el-input v-model="form.vipConfig.value" style="width: 170px;" />个,
        一级获得能量值<el-input v-model="form.vipConfig.valueOne" style="width: 170px;" />个,
        二级获得能量值<el-input v-model="form.vipConfig.valueTwo" style="width: 170px;" />个
      </el-form-item>

      <el-form-item label="能量每日扣除">
        赠送<el-input v-model="form.dayEnergy" style="width: 170px;" />，
        推广<el-input v-model="form.dayTuiEnergy" style="width: 170px;" />，
        推广最大值<el-input v-model="form.dayTuiEnergyMax" style="width: 170px;" />
      </el-form-item>
      <el-form-item label="订单解锁时间">
        <el-input v-model="form.unlockMin" style="width: 170px;" />天-
        <el-input v-model="form.unlockMax" style="width: 170px;" />天
      </el-form-item>
      <el-form-item label="推广能量订单">
        <div
          class="list-group-item"
          v-for="(item,index) in form.orderConfigs"
          :key="index">
          能量范围 ><el-input v-model="item.min" style="width: 100px;" /><=<el-input v-model="item.max" style="width: 100px;" />，每天产生
          <el-input v-model="item.countMin" style="width: 100px;" />-<el-input v-model="item.countMax" style="width: 100px;" />条，总提成
          <el-input v-model="item.feeMin" style="width: 100px;" />-<el-input v-model="item.feeMax" style="width: 100px;" />元的订单<br>
        </div>
      </el-form-item>

      <el-form-item label="赠送-淘宝订单">
        <div
          class="list-group-item"
          v-for="(item,index) in form.orderTbConfigs"
          :key="index">
          天数范围 ><el-input v-model="item.min" style="width: 100px;" /><=<el-input v-model="item.max" style="width: 100px;" />，每天产生
          <el-input v-model="item.countMin" style="width: 100px;" />-<el-input v-model="item.countMax" style="width: 100px;" />条，总提成
          <el-input v-model="item.feeMin" style="width: 100px;" />-<el-input v-model="item.feeMax" style="width: 100px;" />元的订单<br>
        </div>
      </el-form-item>
      <el-form-item label="赠送-京东订单">
        <div
          class="list-group-item"
          v-for="(item,index) in form.orderJdConfigs"
          :key="index">
          天数范围 ><el-input v-model="item.min" style="width: 100px;" /><=<el-input v-model="item.max" style="width: 100px;" />，每天产生
          <el-input v-model="item.countMin" style="width: 100px;" />-<el-input v-model="item.countMax" style="width: 100px;" />条，总提成
          <el-input v-model="item.feeMin" style="width: 100px;" />-<el-input v-model="item.feeMax" style="width: 100px;" />元的订单<br>
        </div>
      </el-form-item>
      <el-form-item label="赠送-拼多多订单">
        <div
          class="list-group-item"
          v-for="(item,index) in form.orderPddConfigs"
          :key="index">
          天数范围 ><el-input v-model="item.min" style="width: 100px;" /><=<el-input v-model="item.max" style="width: 100px;" />，每天产生
          <el-input v-model="item.countMin" style="width: 100px;" />-<el-input v-model="item.countMax" style="width: 100px;" />条，总提成
          <el-input v-model="item.feeMin" style="width: 100px;" />-<el-input v-model="item.feeMax" style="width: 100px;" />元的订单<br>
        </div>
      </el-form-item>
      <el-form-item label="赠送-抖音订单">
        <div
          class="list-group-item"
          v-for="(item,index) in form.orderDyConfigs"
          :key="index">
          天数范围 ><el-input v-model="item.min" style="width: 100px;" /><=<el-input v-model="item.max" style="width: 100px;" />，每天产生
          <el-input v-model="item.countMin" style="width: 100px;" />-<el-input v-model="item.countMax" style="width: 100px;" />条，总提成
          <el-input v-model="item.feeMin" style="width: 100px;" />-<el-input v-model="item.feeMax" style="width: 100px;" />元的订单<br>
        </div>
      </el-form-item>
      <el-form-item label="赠送-唯品会订单">
        <div
          class="list-group-item"
          v-for="(item,index) in form.orderVipConfigs"
          :key="index">
          天数范围 ><el-input v-model="item.min" style="width: 100px;" /><=<el-input v-model="item.max" style="width: 100px;" />，每天产生
          <el-input v-model="item.countMin" style="width: 100px;" />-<el-input v-model="item.countMax" style="width: 100px;" />条，总提成
          <el-input v-model="item.feeMin" style="width: 100px;" />-<el-input v-model="item.feeMax" style="width: 100px;" />元的订单<br>
        </div>
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
import { edit, get } from '@/api/mwUserEnergyConfig'
import picUpload from '@/components/pic-upload/index.vue'
import { Message } from 'element-ui'
export default {
  components: { picUpload },
  mixins: [initData],
  data() {
    return {
      delLoading: false,
      form: {
        tbConfig: {value: 2000, valueOne: 400, valueTwo: 200},
        jdConfig: {value: 1400, valueOne: 280, valueTwo: 140},
        pddConfig: {value: 1700, valueOne: 340, valueTwo: 170},
        dyConfig: {value: 1600, valueOne: 320, valueTwo: 160},
        vipConfig: {value: 1000, valueOne: 200, valueTwo: 100},
        dayEnergy: 50,
        dayTuiEnergy: 50,
        dayTuiEnergyMax: 500,
        unlockMin: 7,
        unlockMax: 9,
        orderConfigs: [
          {min:0, max:1000, feeMin:15,feeMax:25,countMin:20,countMax:30},
          {min:1000, max:2000, feeMin:20,feeMax:30,countMin:25,countMax:35},
          {min:2000, max:4000, feeMin:35,feeMax:45,countMin:30,countMax:40},
          {min:4000, max:10000, feeMin:40,feeMax:50,countMin:35,countMax:45},
          {min:10000, max:100000, feeMin:45,feeMax:60,countMin:45,countMax:55}
        ],
        orderTbConfigs: [
          {min:0, max:10, feeMin:30,feeMax:40,countMin:8,countMax:10},
          {min:10, max:20, feeMin:15,feeMax:25,countMin:10,countMax:20},
          {min:20, max:30, feeMin:10,feeMax:20,countMin:15,countMax:25},
          {min:30, max:50, feeMin:5,feeMax:15,countMin:20,countMax:30}
        ],
        orderJdConfigs: [
          {min:0, max:7, feeMin:28,feeMax:40,countMin:5,countMax:10},
          {min:7, max:14, feeMin:15,feeMax:25,countMin:8,countMax:15},
          {min:14, max:21, feeMin:10,feeMax:20,countMin:15,countMax:25},
          {min:21, max:50, feeMin:5,feeMax:15,countMin:20,countMax:25}
        ],
        orderPddConfigs: [
          {min:0, max:9, feeMin:25,feeMax:40,countMin:7,countMax:10},
          {min:9, max:18, feeMin:15,feeMax:20,countMin:7,countMax:15},
          {min:18, max:25, feeMin:10,feeMax:20,countMin:10,countMax:15},
          {min:25, max:50, feeMin:5,feeMax:15,countMin:15,countMax:20}
        ],
        orderDyConfigs: [
          {min:0, max:8, feeMin:26,feeMax:42,countMin:6,countMax:10},
          {min:8, max:16, feeMin:15,feeMax:20,countMin:8,countMax:15},
          {min:16, max:24, feeMin:10,feeMax:20,countMin:13,countMax:25},
          {min:24, max:50, feeMin:5,feeMax:15,countMin:17,countMax:30}
        ],
        orderVipConfigs: [
          {min:0, max:5, feeMin:25,feeMax:40,countMin:5,countMax:10},
          {min:5, max:10, feeMin:15,feeMax:25,countMin:8,countMax:15},
          {min:10, max:15, feeMin:10,feeMax:20,countMin:10,countMax:18},
          {min:15, max:50, feeMin:5,feeMax:15,countMin:13,countMax:20}
        ],
      },
      rules: {
      }
    }
  },
  created() {
    get().then(rese => {
      const that = this;
      // alert(JSON.stringify(rese))
      if(rese !== null && rese !== '') {
        if(rese.tbConfig != null) {
          that.form.tbConfig = rese.tbConfig;
        }
        if(rese.jdConfig != null) {
          that.form.jdConfig = rese.jdConfig;
        }
        if(rese.pddConfig != null) {
          that.form.pddConfig = rese.pddConfig;
        }
        if(rese.dyConfig != null) {
          that.form.dyConfig = rese.dyConfig;
        }
        if(rese.vipConfig != null) {
          that.form.vipConfig = rese.vipConfig;
        }

        if(rese.dayEnergy != null) {
          that.form.dayEnergy = rese.dayEnergy;
        }
        if(rese.dayTuiEnergy != null) {
          that.form.dayTuiEnergy = rese.dayTuiEnergy;
        }
        if(rese.dayTuiEnergyMax != null) {
          that.form.dayTuiEnergyMax = rese.dayTuiEnergyMax;
        }
        if(rese.unlockMin != null) {
          that.form.unlockMin = rese.unlockMin;
        }
        if(rese.unlockMax != null) {
          that.form.unlockMax = rese.unlockMax;
        }
        if(rese.orderConfigs != null) {
          that.form.orderConfigs = rese.orderConfigs;
        }
        if(rese.orderTbConfigs != null) {
          that.form.orderTbConfigs = rese.orderTbConfigs;
        }
        if(rese.orderJdConfigs != null) {
          that.form.orderJdConfigs = rese.orderJdConfigs;
        }
        if(rese.orderPddConfigs != null) {
          that.form.orderPddConfigs = rese.orderPddConfigs;
        }
        if(rese.orderDyConfigs != null) {
          that.form.orderDyConfigs = rese.orderDyConfigs;
        }
        if(rese.orderVipConfigs != null) {
          that.form.orderVipConfigs = rese.orderVipConfigs;
        }

        // that.form = rese;
      }
    })
  },
  methods: {
    checkPermission,
    doSubmit() {
      edit(this.form).then(res => {
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
