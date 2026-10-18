import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import vm from 'node:vm'
import { generateKeyPairSync, privateDecrypt, constants } from 'node:crypto'

const require = createRequire(import.meta.url)
const context = vm.createContext({ navigator: { appName: 'Netscape' }, window: {}, console, setTimeout, clearTimeout })
vm.runInContext(await readFile(require.resolve('encryptlong'), 'utf8'), context)
const library = context.JSEncrypt.JSEncrypt || context.JSEncrypt
const source = (await readFile(new URL('../src/utils/rsaEncrypt.js', import.meta.url), 'utf8'))
  .split('export function encryptPaymentProfileWithKey')[1]
const encrypt = new Function('JSEncrypt', 'btoa', 'return function encryptPaymentProfileWithKey' + source)(library,
  value => Buffer.from(value, 'binary').toString('base64'))

test('large certificate profiles retain RSA block boundaries and all JSON content', () => {
  const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' }, privateKeyEncoding: { type: 'pkcs8', format: 'pem' } })
  const value = { appId: '测试应用😀', privateKey: 'test-only', rootCertContent: ('-----BEGIN CERTIFICATE-----\n' + 'A'.repeat(1100) + '\n-----END CERTIFICATE-----\n').repeat(12) }
  // Exercise hundreds of blocks, including ciphertexts whose leading byte is 0.
  for (let repeat = 0; repeat < 4; repeat++) {
    const ciphertext = Buffer.from(encrypt(JSON.stringify(value), publicKey), 'base64')
    assert.equal(ciphertext.length % 256, 0)
    let decoded = ''
    for (let offset = 0; offset < ciphertext.length; offset += 256) {
      const block = privateDecrypt({ key: privateKey, padding: constants.RSA_NO_PADDING }, ciphertext.subarray(offset, offset + 256))
      assert.equal(block[0], 0); assert.equal(block[1], 2)
      const separator = block.indexOf(0, 2)
      assert.ok(separator >= 10)
      decoded += block.subarray(separator + 1).toString('utf8')
    }
    assert.deepEqual(JSON.parse(decoded), value)
  }
})

test('short hexadecimal ciphertext is padded to the full modulus width', () => {
  class ShortBlockEncryptor {
    setPublicKey() {}
    getKey() { return { n: { bitLength: () => 2048 }, encrypt: () => 'ab' } }
  }
  const fixedEncrypt = new Function('JSEncrypt', 'btoa', 'return function encryptPaymentProfileWithKey' + source)(
    ShortBlockEncryptor, value => Buffer.from(value, 'binary').toString('base64'))
  const result = Buffer.from(fixedEncrypt('A'.repeat(500), 'test-key'), 'base64')
  assert.equal(result.length, 768)
  for (let offset = 0; offset < result.length; offset += 256) {
    assert.ok(result.subarray(offset, offset + 255).every(byte => byte === 0))
    assert.equal(result[offset + 255], 0xab)
  }
})
