<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel"
             :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="750px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
      <el-form-item label="通道名称">
        <el-input v-model="form.channelName" style="width: 40%"/>
        主体id

        <el-input v-model="form.companyId" style="width: 40%"/>
      </el-form-item>
<!--      <el-form-item label="app简称">-->
<!--        <el-input v-model="form.name" style="width: 100px"/>-->
<!--      </el-form-item>-->
      <el-form-item label="回调地址">
        <el-input v-model="form.notifyUrl" type="textarea" rows= '1'/>
      </el-form-item>
      <el-form-item label="最大额度(元)">
        <el-input v-model="form.maxAmount" style="width: 150px" clearable/>
        &nbsp;剩余额度(元)
        <el-input v-model="form.amount" style="width: 150px" clearable/>
        重置时间
        <el-time-picker
          v-model="form.cycleTime"
          value-format="HH:mm:ss"
          disabled-date="disabledDateFun"
          placeholder="选择时间"
          style="width: 150px"
        />
      </el-form-item>
      <el-form-item label="可提现">
        <el-select v-model="form.extract" clearable class="filter-item" style="width: 40%">
          <el-option v-for="item in extractOptions" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
      </el-form-item>

      <el-form-item label="通道类型">
        <el-select v-model="form.type" clearable class="filter-item" style="width: 40%" @change="onTypeChange">
          <el-option v-for="item in typeOptions" :key="item.key" :label="item.label" :value="item.key"/>
        </el-select>
      </el-form-item>
      <el-form-item label="通道商">
        <el-select v-model="form.channelKey" clearable class="filter-item" style="width: 40%">
          <el-option v-for="item in channelKeyOptions" :key="item.key" :label="item.label" :value="item.key"
                     :disabled="item.parent.indexOf(form.type)<0"/>
        </el-select>
      </el-form-item>
      <el-form-item label="通道开关">
        <el-radio v-model="form.status" :label="8">开</el-radio>
        <el-radio v-model="form.status" :label="0" style="width: 200px;">关</el-radio>
      </el-form-item>

      <el-form-item label="证书信息">
        <el-input v-model="form.certProfileEnc" type="textarea" rows= '6' style="height: 150px"/>
        <p style="color: red">证书信息不再展示，需要更新通过印笔复制json串保存</p>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <!--<el-input v-model="form.groupName" />-->
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { encrypt } from '@/utils/rsaEncrypt'
import { add, edit } from '@/api/mwPaySet'
import picUpload from '@/components/pic-upload'
import {getChannelKeyOptions, getTypeOptions} from "@/utils/tk-order-parse";
export default {
  components: { picUpload },
  props: {
    isAdd: {
      type: Boolean,
      required: true
    }
  },
  data() {

    return {
      typeOptions: getTypeOptions(),
      channelKeyOptions: getChannelKeyOptions(),

      extractOptions: [
        { key: 1, display_name: '是' },
        { key: 0, display_name: '否' },
      ],
      loading: false, dialog: false,
      form: {
        id: '',
        channelName: '',
        channelKey: '',
        certProfileE: '',
        certProfileEnc: '',
        notifyUrl: '',
        type: '',
        maxAmount: 100000,
        amount: 100000,
        status: 0,
        extract: 0,
        companyId: '',
        cycleTime: '00:00:00'
      },
      rules: {
      }
    }
  },
  methods: {
    getChannelKeyOptions,
    getTypeOptions,
    onTypeChange() {
      this.form.channelKey = ''
    },
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.loading = true
      if (this.isAdd) {
        this.doAdd()
      } else this.doEdit()
    },
    doAdd() {
      const cert = this.form.certProfileEnc;

      this.form.certProfileE = encrypt(cert)
      add(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '添加成功',
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
    doEdit() {
      let cert = this.form.certProfileEnc;
      //如果解析报错，说明是加密内容，不做加密
      try {
        JSON.parse(cert);
        this.form.certProfileE = encrypt(cert)

      }catch (e) {

      }
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
        console.log(err.response.data.message)
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = {
        id: '',
        channelName: '',
        channelKey: '',
        certProfileE: '',
        certProfileEnc: '',
        notifyUrl: '',
        type: '',
        maxAmount: 100000,
        amount: 100000,
        status: 0,
        extract: 0,
        companyId: '',
        cycleTime: '00:00:00'
      }
    }
  }
}
</script>

<style scoped>

</style>
