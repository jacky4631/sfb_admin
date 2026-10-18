import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

// Exercise the actual Vue options methods with isolated API/encryption adapters.
const source = await readFile(new URL('../src/views/shop/payset/PayCertificateEditor.vue', import.meta.url), 'utf8')
const script = source.split('<script>')[1].split('</script>')[0]
  .replace(/^import .*$/gm, '').replace('export default', 'return')
function editor(channelKey, api = async () => ({ config: {}, configured: [] })) {
  const encrypted = []
  const options = new Function('ElMessage', 'encrypt', 'getCertificateMetadata', script)(
    { error() {} }, value => { encrypted.push(JSON.parse(value)); return 'ciphertext' }, api)
  const value = { ...options.data(), channelKey }
  for (const [key, getter] of Object.entries(options.computed)) Object.defineProperty(value, key, { get: () => getter.call(value) })
  for (const [key, method] of Object.entries(options.methods)) value[key] = method.bind(value)
  value.encrypted = encrypted
  return value
}

test('native partial edit sends no empty secrets and marks merge mode', async () => {
  const value = editor('alipay', async () => ({ config: { appId: 'existing-app', mode: 2 }, configured: ['privateKey', 'appCertContent'] }))
  await value.load({ id: 1, channelKey: 'alipay' })
  assert.deepEqual(value.buildPayload(), { certProfileE: 'ciphertext', mergeCertProfile: true })
  assert.equal(value.encrypted[0].appId, 'existing-app')
  assert.equal(value.encrypted[0].returnUrl, '')
  assert.equal(Object.hasOwn(value.encrypted[0], 'privateKey'), false)
  assert.equal(Object.hasOwn(value.encrypted[0], 'appCertContent'), false)
  value.config.privateKey = 'new-private-key'
  value.buildPayload()
  assert.equal(value.encrypted[1].privateKey, 'new-private-key')
})

test('switching channel starts clean without fetching another merchant configuration', async () => {
  let calls = 0
  const value = editor('wechatpay', async () => { calls++; return {} })
  await value.load({ id: 1, channelKey: 'alipay' })
  assert.equal(calls, 0)
  assert.equal(value.config.appId, '')
  assert.deepEqual(value.configured, [])
})

test('metadata load failure blocks saving instead of overwriting hidden credentials', async () => {
  const value = editor('alipay', async () => { throw new Error('network unavailable') })
  await value.load({ id: 1, channelKey: 'alipay' })
  assert.throws(() => value.buildPayload(), /尚未准备好/)
})

test('third party JSON keeps old configuration when blank and validates replacement', () => {
  const value = editor('adapay')
  assert.deepEqual(value.buildPayload(), { certProfileE: '', mergeCertProfile: false })
  value.advancedJson = '{bad json'
  assert.throws(() => value.buildPayload(), /JSON 格式/)
  value.advancedJson = '{"apiKey":"test-only"}'
  assert.equal(value.buildPayload().mergeCertProfile, false)
  assert.deepEqual(value.encrypted[0], { apiKey: 'test-only' })
})

test('wechat sends only its own fields and blocks unfinished file reads', () => {
  const value = editor('wechatpay')
  value.config.appId = 'wx-test'
  value.config.mchId = '123'
  value.config.keyContent = 'base64-p12'
  value.config.privateKey = 'not-a-wechat-field'
  value.buildPayload()
  assert.equal(value.encrypted[0].keyContent, 'base64-p12')
  assert.equal(Object.hasOwn(value.encrypted[0], 'privateKey'), false)
  value.reading = 1
  assert.throws(() => value.buildPayload(), /尚未准备好/)
})
