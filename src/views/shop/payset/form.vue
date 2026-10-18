<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel"
             v-model="dialog" :title="isAdd ? '新增支付通道' : '编辑支付通道'" width="820px">
    <el-form ref="form" :model="form" :rules="rules" size="default" label-width="100px" class="payset-form">
      <el-divider content-position="left">基本信息</el-divider>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="通道名称" prop="channelName">
            <el-input v-model="form.channelName" placeholder="请输入通道名称" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属主体" prop="companyId">
            <el-select v-model="form.companyId" placeholder="请选择支付主体" filterable clearable :loading="companyLoading" style="width: 100%">
              <el-option v-for="item in companies" :key="item.id" :label="item.company" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="通道类型" prop="type">
            <el-select v-model="form.type" placeholder="请选择通道类型" clearable style="width: 100%" @change="onTypeChange">
              <el-option v-for="item in typeOptions" :key="item.key" :label="item.label" :value="item.key" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="通道商" prop="channelKey">
            <el-select v-model="form.channelKey" placeholder="请选择通道商" clearable style="width: 100%" @change="loadCertificate">
              <el-option v-for="item in channelKeyOptions" :key="item.key" :label="item.label" :value="item.key"
                         :disabled="item.parent.indexOf(form.type)<0" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="通道开关">
            <el-radio-group v-model="form.status">
              <el-radio :value="8">开</el-radio>
              <el-radio :value="0">关</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="可提现">
            <el-select v-model="form.extract" placeholder="请选择" clearable style="width: 100%">
              <el-option v-for="item in extractOptions" :key="item.key" :label="item.display_name" :value="item.key" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-divider content-position="left">额度设置</el-divider>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="最大额度(元)">
            <el-input v-model="form.maxAmount" placeholder="请输入最大额度" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="剩余额度(元)">
            <el-input v-model="form.amount" placeholder="请输入剩余额度" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="重置时间">
            <el-time-picker v-model="form.cycleTime" value-format="HH:mm:ss" placeholder="选择重置时间" style="width: 100%" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-divider content-position="left">回调与证书</el-divider>
      <el-form-item label="回调地址">
        <el-input v-model="form.notifyUrl" type="textarea" :rows="1" placeholder="请输入异步回调地址" />
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
import { get as getCompanyList } from '@/api/mwPayCompany.js'
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
      companies: [], companyLoading: false,
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
        channelName: [{ required: true, message: '请输入通道名称', trigger: 'blur' }],
        companyId: [{ required: true, message: '请选择所属主体', trigger: 'change' }],
        type: [{ required: true, message: '请选择通道类型', trigger: 'change' }],
        channelKey: [{ required: true, message: '请选择通道商', trigger: 'change' }]
      }
    }
  },
  methods: {
    getChannelKeyOptions,
    getTypeOptions,
    async loadCompanies() {
      if (this.companyLoading) return
      this.companyLoading = true
      try {
        const res = await getCompanyList({ page: 0, size: 999, sort: 'id,asc' })
        this.companies = res.content || []
      } catch (error) {
        console.log(error)
      } finally {
        this.companyLoading = false
      }
    },
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
      // 后端 companyId 为字符串，下拉选项 value 为数字，需归一化才能正确回显
      if (this.form.companyId !== '' && this.form.companyId != null && !isNaN(Number(this.form.companyId))) {
        this.form.companyId = Number(this.form.companyId)
      } else {
        this.form.companyId = ''
      }
      this.dialog = true
      this.loadCompanies()
      await this.$nextTick()
      await this.loadCertificate()
    },
    async loadCertificate() {
      await this.$nextTick()
      await this.$refs.certificateEditor?.load(this.originalRow)
    },
    async doSubmit() {
      if (this.loading) return
      const valid = await this.$refs.form.validate().catch(() => false)
      if (!valid) return
      this.loading = true
      try {
        const certificate = this.$refs.certificateEditor.buildPayload()
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
.payset-form :deep(.el-divider--horizontal) { margin: 4px 0 20px; }
.payset-form :deep(.el-divider__text) { font-weight: 600; color: var(--el-text-color-primary); }
.payset-form :deep(.el-form-item) { margin-bottom: 18px; }
</style>
