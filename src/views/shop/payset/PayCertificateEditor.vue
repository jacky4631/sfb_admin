<template>
  <div v-loading="loading" class="certificate-editor">
    <el-alert v-if="native" title="选择本地证书即可保存，无需上传服务器或填写路径。编辑时留空的私钥和证书会保留原配置。"
              type="info" :closable="false" class="certificate-tip" />
    <template v-if="isAlipay">
      <el-form-item label="应用 APPID"><el-input v-model="config.appId" /></el-form-item>
      <el-form-item label="支付宝商户号"><el-input v-model="config.sysServiceProviderId" /></el-form-item>
      <el-form-item label="网关地址">
        <el-select v-model="config.gatewayUrl" style="width:100%">
          <el-option label="正式环境" value="https://openapi.alipay.com/gateway.do" />
          <el-option label="沙箱环境" value="https://openapi-sandbox.dl.alipaydev.com/gateway.do" />
        </el-select>
      </el-form-item>
      <el-form-item label="公钥类型">
        <el-radio-group v-model="config.mode"><el-radio :value="2">证书模式</el-radio><el-radio :value="1">公钥模式</el-radio></el-radio-group>
      </el-form-item>
      <el-form-item label="应用私钥">
        <el-input v-model="config.privateKey" type="textarea" :rows="3"
                  :placeholder="secretHint('privateKey', '请输入 PKCS8 格式应用私钥，或选择 PEM 文件')" />
        <el-upload :show-file-list="false" :auto-upload="false" accept=".pem,.txt" :on-change="file => readFile(file, 'privateKey')">
          <el-button size="small">选择私钥文件</el-button>
        </el-upload>
      </el-form-item>
      <template v-if="config.mode === 2">
        <el-form-item v-for="item in alipayCertificates" :key="item.key" :label="item.label">
          <el-upload :show-file-list="false" :auto-upload="false" accept=".crt,.pem" :on-change="file => readFile(file, item.key)">
            <el-button>选择证书</el-button>
          </el-upload>
          <span class="file-status">{{ files[item.key] || (configured.includes(item.key) ? '已配置，可选择新证书替换' : '未配置') }}</span>
        </el-form-item>
      </template>
      <el-form-item v-else label="支付宝公钥">
        <el-input v-model="config.publicKey" type="textarea" :rows="3" :placeholder="secretHint('publicKey', '请输入支付宝公钥')" />
      </el-form-item>
      <el-form-item label="同步返回地址"><el-input v-model="config.returnUrl" placeholder="网页支付可选" /></el-form-item>
    </template>
    <template v-else-if="channelKey === 'wechatpay'">
      <el-form-item label="应用 APPID"><el-input v-model="config.appId" /></el-form-item>
      <el-form-item label="微信商户号"><el-input v-model="config.mchId" /></el-form-item>
      <el-form-item label="API v2 密钥">
        <el-input v-model="config.mchKey" type="password" show-password :placeholder="secretHint('mchKey', '请输入微信商户 API v2 密钥')" />
      </el-form-item>
      <el-form-item label="商户证书">
        <el-upload :show-file-list="false" :auto-upload="false" accept=".p12" :on-change="file => readFile(file, 'keyContent', true)">
          <el-button>选择 apiclient_cert.p12</el-button>
        </el-upload>
        <span class="file-status">{{ files.keyContent || (configured.includes('keyContent') ? '已配置，可选择新证书替换' : '未配置') }}</span>
      </el-form-item>
    </template>
    <el-form-item v-else label="证书 JSON">
      <el-input v-model="advancedJson" type="textarea" :rows="6" placeholder="请输入该通道商的完整 JSON 配置；编辑时留空保留原配置" />
    </el-form-item>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus'
import { encryptPaymentProfile as encrypt } from '@/utils/rsaEncrypt.js'
import { getCertificateMetadata } from '@/api/mwPaySet.js'

const defaults = () => ({ appId: '', sysServiceProviderId: '', gatewayUrl: 'https://openapi.alipay.com/gateway.do',
  format: 'json', charset: 'UTF-8', signType: 'RSA2', mode: 2, privateKey: '', publicKey: '', returnUrl: '', mchId: '', mchKey: '' })
export default {
  props: { channelKey: { type: String, default: '' } },
  data: () => ({ config: defaults(), configured: [], files: {}, advancedJson: '', loading: false,
    loadVersion: 0, loadError: false, reading: 0,
    alipayCertificates: [{ key: 'appCertContent', label: '应用公钥证书' },
      { key: 'alipayPublicCertContent', label: '支付宝公钥证书' }, { key: 'rootCertContent', label: '支付宝根证书' }] }),
  computed: {
    isAlipay() { return ['alipay', 'alipayweb'].includes(this.channelKey) },
    native() { return this.isAlipay || this.channelKey === 'wechatpay' }
  },
  methods: {
    async load(row = {}) {
      const version = ++this.loadVersion
      this.config = defaults(); this.configured = []; this.files = {}; this.advancedJson = ''; this.loadError = false
      this.loading = false
      if (!row.id || row.channelKey !== this.channelKey || !this.native) return
      this.loading = true
      try {
        const metadata = await getCertificateMetadata(row.id)
        if (version !== this.loadVersion) return
        this.config = { ...defaults(), ...metadata.config }
        this.configured = metadata.configured || []
      } catch (error) {
        if (version !== this.loadVersion) return
        this.loadError = true
        ElMessage.error('读取支付配置失败，请关闭后重新编辑')
      } finally { if (version === this.loadVersion) this.loading = false }
    },
    secretHint(field, missing) { return this.configured.includes(field) ? '已配置，留空保留原值' : missing },
    async readFile(file, field, binary = false) {
      const raw = file.raw
      const version = this.loadVersion
      if (!raw || raw.size > 32 * 1024) { ElMessage.error('请选择不超过 32KB 的证书或私钥文件'); return }
      const extension = raw.name.toLowerCase().split('.').pop()
      if (!(binary ? ['p12'] : field === 'privateKey' ? ['pem', 'txt'] : ['crt', 'pem']).includes(extension)) {
        ElMessage.error('文件格式不正确，请选择对应的证书文件'); return
      }
      this.reading++
      try {
        const content = await new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(binary ? String(reader.result).split(',')[1] : String(reader.result))
          reader.onerror = () => reject(reader.error)
          binary ? reader.readAsDataURL(raw) : reader.readAsText(raw)
        })
        if (version !== this.loadVersion) return
        if (!binary && field !== 'privateKey' && !content.includes('-----BEGIN CERTIFICATE-----')) throw new Error('invalid certificate')
        this.config[field] = content
        this.files[field] = raw.name
      } catch (error) { ElMessage.error('无法读取文件，请检查证书格式') }
      finally { this.reading-- }
    },
    buildPayload() {
      if (this.loading || this.loadError || this.reading) throw new Error('证书配置尚未准备好，请稍后重试')
      let value
      if (this.native) {
        const allowed = this.isAlipay
          ? ['appId', 'sysServiceProviderId', 'gatewayUrl', 'format', 'charset', 'signType', 'mode', 'privateKey', 'publicKey',
            'appCertContent', 'alipayPublicCertContent', 'rootCertContent', 'returnUrl']
          : ['appId', 'mchId', 'mchKey', 'keyContent']
        const publicFields = ['appId', 'sysServiceProviderId', 'gatewayUrl', 'format', 'charset', 'signType', 'mode', 'returnUrl', 'mchId']
        value = Object.fromEntries(allowed.filter(key => this.config[key] != null &&
          (publicFields.includes(key) || this.config[key] !== '')).map(key => [key, this.config[key]]))
        if (!value.appId) throw new Error('请填写应用 APPID')
      } else {
        if (!this.advancedJson.trim()) return { certProfileE: '', mergeCertProfile: false }
        try { value = JSON.parse(this.advancedJson) } catch { throw new Error('证书 JSON 格式不正确') }
        if (!value || Array.isArray(value) || typeof value !== 'object') throw new Error('证书配置必须是 JSON 对象')
      }
      const encrypted = encrypt(JSON.stringify(value))
      if (!encrypted) throw new Error('支付配置加密失败，请重新尝试')
      return { certProfileE: encrypted, mergeCertProfile: this.native }
    }
  }
}
</script>
<style scoped>
.certificate-tip { margin: 4px 0 18px; }
.file-status { margin-left: 12px; color: var(--el-text-color-secondary); font-size: 12px; }
</style>
