<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel"
             v-model="dialog" :title="isAdd ? '新增' : '编辑'" width="750px">
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
        <el-select v-model="form.channelKey" @change="loadCertificate" clearable class="filter-item" style="width: 40%">
          <el-option v-for="item in channelKeyOptions" :key="item.key" :label="item.label" :value="item.key"
                     :disabled="item.parent.indexOf(form.type)<0"/>
        </el-select>
      </el-form-item>
      <el-form-item label="通道开关">
        <el-radio v-model="form.status" :value="8">开</el-radio>
        <el-radio v-model="form.status" :value="0" style="width: 200px;">关</el-radio>
      </el-form-item>

      <PayCertificateEditor ref="certificateEditor" :channel-key="form.channelKey || ''" />
    </el-form>
    <template #footer><div class="dialog-footer">
      <!--<el-input v-model="form.groupName" />-->
      <el-button link @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </template>
</el-dialog>
</template>

<script>
import { ElNotification, ElMessage } from 'element-plus'
import { add, edit } from '@/api/mwPaySet.js'
import PayCertificateEditor from './PayCertificateEditor.vue'
import {getChannelKeyOptions, getTypeOptions} from "@/utils/tk-order-parse.js";
export default {
  components: { PayCertificateEditor },
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
      loading: false, dialog: false, originalRow: {},
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
      this.loadCertificate()
    },
    cancel() {
      this.resetForm()
    },
    async open(row = {}) {
      this.resetForm()
      this.originalRow = { ...row }
      this.form = { ...this.form, ...row, certProfileE: '', certProfileEnc: '' }
      this.dialog = true
      await this.$nextTick()
      await this.loadCertificate()
    },
    async loadCertificate() {
      await this.$nextTick()
      await this.$refs.certificateEditor?.load(this.originalRow)
    },
    async doSubmit() {
      if (this.loading) return
      try {
        const certificate = this.$refs.certificateEditor.buildPayload()
        this.loading = true
        const payload = { ...this.form, ...certificate }
        if (this.isAdd) await add(payload)
        else await edit(payload)
        this.resetForm()
        ElNotification({ title: this.isAdd ? '添加成功' : '修改成功', type: 'success', duration: 2500 })
        this.$parent.init()
      } catch (error) {
        ElMessage.error(error.response?.data?.message || error.message || '保存失败')
      } finally { this.loading = false }
    },
    resetForm() {
      this.dialog = false
      this.$refs['form']?.resetFields()
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
