<template>
  <div class="login-page">
    <!-- 左侧品牌区 -->
    <div class="login-brand">
      <!-- 左上角 Logo + 系统名称 -->
      <div class="brand-header">
        <img alt="" class="brand-logo" src="@/assets/images/logo.png" />
        <span class="brand-title">{{ brandName }}</span>
      </div>

      <!-- 中间插画 + 标语 -->
      <div class="brand-content">
        <img alt="" class="brand-illustration" src="@/assets/svgs/login-network.svg" />
        <div class="brand-tagline">
          <h2 class="brand-slogan">淘客商城运营管理平台</h2>
          <p class="brand-sub-slogan">全链路电商返利解决方案，助力业务精准增长</p>
        </div>
      </div>

      <!-- 底部版权 -->
      <div class="brand-footer">
        <template v-if="showFooter">
          <span v-html="footerTxt" />
          <span> ⋅ </span>
          <a href="http://beian.miit.gov.cn" target="_blank">{{ caseNumber }}</a>
        </template>
        <span v-else>© {{ currentYear }} {{ brandName }} All Rights Reserved</span>
      </div>
    </div>

    <!-- 右侧登录区 -->
    <div class="login-form-area">
      <!-- 移动端顶部 Logo -->
      <div class="login-toolbar">
        <div class="toolbar-mobile-logo">
          <img alt="" class="brand-logo" src="@/assets/images/logo.png" />
          <span class="brand-title">{{ brandName }}</span>
        </div>
      </div>

      <!-- 登录表单容器 -->
      <div class="login-form-wrapper">
        <div class="login-form-inner">
          <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" class="login-form" label-position="top" size="large">
            <!-- 标题区域 -->
            <div class="login-title-area">
              <h2 class="login-main-title">欢迎登录</h2>
              <p class="login-sub-title">登录{{ brandName }}，开启智能分销之旅</p>
            </div>

            <el-form-item prop="username">
              <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="请输入用户名" class="login-input">
                <template #prefix>
                  <el-icon><User /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="loginForm.password" type="password" auto-complete="off" placeholder="请输入密码" show-password class="login-input" @keyup.enter="handleLogin">
                <template #prefix>
                  <el-icon><Lock /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item v-if="captchaEnabled" prop="code">
              <div class="login-code-row">
                <el-input v-model="loginForm.code" auto-complete="off" placeholder="请输入验证码" class="login-input code-input" @keyup.enter="handleLogin">
                  <template #prefix>
                    <el-icon><Key /></el-icon>
                  </template>
                </el-input>
                <el-button :disabled="captchaOnOff" class="login-code-btn" @click="getCode">{{ captchaBtn }}</el-button>
              </div>
            </el-form-item>
            <el-form-item class="remember-item">
              <el-checkbox v-model="loginForm.rememberMe">
                记住我
              </el-checkbox>
            </el-form-item>
            <el-form-item>
              <el-button :loading="loading" class="login-submit-btn" type="primary" @click="handleLogin">
                <span v-if="!loading">登 录</span>
                <span v-else>登 录 中...</span>
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onUnmounted, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { encrypt } from '@/utils/rsaEncrypt'
import Config from '@/settings'
import { getCodeImg, getCaptchaEnable } from '@/api/login'
import Cookies from 'js-cookie'
import { useUserStore } from '@/store/modules/user'
import { useSettingsStore } from '@/store/modules/settings'
import { usePermissionStore } from '@/store/modules/permission'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const settingsStore = useSettingsStore()
const permissionStore = usePermissionStore()

const showFooter = computed(() => settingsStore.showFooter)
const footerTxt = computed(() => settingsStore.footerTxt)
const caseNumber = computed(() => settingsStore.caseNumber)

const brandName = computed(() => {
  const title = Config.title || ''
  return title.includes('管理系统') ? title : `${title}管理系统`
})
const currentYear = new Date().getFullYear()

const loginFormRef = ref(null)
const loginForm = reactive({
  username: 'admin',
  password: '123456',
  rememberMe: false,
  code: '',
  uuid: ''
})

const loginRules = {
  username: [{ required: true, trigger: 'blur', message: '用户名不能为空' }],
  password: [{ required: true, trigger: 'blur', message: '密码不能为空' }],
  code: [{ required: false, trigger: 'change', message: '验证码不能为空' }]
}

const loading = ref(false)
const captchaEnabled = ref(true)
const captchaOnOff = ref(false)
const captchaNum = ref(60)
const captchaBtn = ref('获取验证码')
const cookiePass = ref('')
const redirect = ref(route.query?.redirect || '/')

let inTime = null

const getCookie = () => {
  const username = Cookies.get('username')
  let password = Cookies.get('password')
  const rememberMe = Cookies.get('rememberMe')
  cookiePass.value = password === undefined ? '' : password
  password = password === undefined ? loginForm.password : password
  loginForm.username = username === undefined ? loginForm.username : username
  loginForm.password = password
  loginForm.rememberMe = rememberMe === undefined ? false : Boolean(rememberMe)
}

const getCode = () => {
  getCodeImg(loginForm.username).then(res => {
    captchaOnOff.value = true
    const fn = () => {
      captchaNum.value--
      captchaBtn.value = captchaNum.value
      if (captchaNum.value === 0) {
        captchaOnOff.value = false
        captchaBtn.value = '获取验证码'
        clearInterval(inTime)
        captchaNum.value = 60
      }
    }
    fn()
    inTime = setInterval(fn, 1000)
  })
}

const handleLogin = () => {
  if (!loginFormRef.value) {
    return
  }
  loginFormRef.value.validate().then(() => {
    const user = {
      username: loginForm.username,
      password: loginForm.password,
      rememberMe: loginForm.rememberMe,
      code: loginForm.code,
      uuid: loginForm.uuid
    }
    if (user.password !== cookiePass.value) {
      user.password = encrypt(user.password)
    }
    if (user.rememberMe) {
      Cookies.set('username', user.username, { expires: Config.passCookieExpires })
      Cookies.set('password', user.password, { expires: Config.passCookieExpires })
      Cookies.set('rememberMe', user.rememberMe, { expires: Config.passCookieExpires })
    } else {
      Cookies.remove('username')
      Cookies.remove('password')
      Cookies.remove('rememberMe')
    }
    loading.value = true
    userStore.Login(user).then(() => {
      // 登录成功后标记需要加载动态菜单，路由守卫会检测此标志
      permissionStore.loadMenus = true
      loading.value = false
      router.push({ path: redirect.value || '/' })
    }).catch((err) => {
      loading.value = false
      console.error('Login error:', err)
    })
  }).catch((err) => {
    console.error('Validation failed:', err)
  })
}

onMounted(() => {
  // 查询后端验证码开关，关闭时隐藏验证码输入框
  getCaptchaEnable().then(res => {
    captchaEnabled.value = !!res.enable
  }).catch(() => {})
})

onUnmounted(() => {
  inTime && clearInterval(inTime)
})

getCookie()
</script>

<style lang="scss" scoped>
.login-page {
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

// ==================== 左侧品牌区 ====================
.login-brand {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 55%;
  min-width: 480px;
  padding: 40px 48px;
  background: linear-gradient(135deg, #0f1b3d 0%, #1a3a6b 50%, #15305a 100%);
  overflow: hidden;

  // 背景装饰 - 微妙的光晕纹理
  &::before {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image:
      radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(251, 191, 36, 0.05) 0%, transparent 50%);
    content: '';
    pointer-events: none;
  }
}

.brand-header {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-logo {
  width: 44px;
  height: 44px;
  border-radius: 8px;
}

.brand-title {
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.brand-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 32px;
}

.brand-illustration {
  width: 380px;
  max-width: 80%;
  opacity: 0.9;
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-12px);
  }
}

.brand-tagline {
  text-align: center;
}

.brand-slogan {
  margin: 0;
  color: #fff;
  font-size: 28px;
  font-weight: 600;
  letter-spacing: 2px;
}

.brand-sub-slogan {
  margin: 12px 0 0;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  letter-spacing: 1px;
}

.brand-footer {
  position: relative;
  z-index: 1;
  color: rgba(255, 255, 255, 0.3);
  font-size: 12px;

  a {
    color: inherit;
    text-decoration: none;
  }
}

// ==================== 右侧登录区 ====================
.login-form-area {
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  background: #fff;
  overflow-y: auto;
}

.login-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding: 0 32px;
}

.toolbar-mobile-logo {
  display: none;
  align-items: center;
  gap: 10px;

  .brand-logo {
    width: 36px;
    height: 36px;
  }

  .brand-title {
    color: #1a1a2e;
    font-size: 16px;
    font-weight: 600;
  }
}

.login-form-wrapper {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.login-form-inner {
  width: 100%;
  max-width: 400px;
  padding: 40px;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  animation: fade-in-up 0.5s ease both;
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// ==================== 登录表单 ====================
.login-form {
  width: 100%;
}

.login-title-area {
  margin-bottom: 8px;
  text-align: center;
}

.login-main-title {
  margin: 0;
  color: #1a1a2e;
  font-size: 26px;
  font-weight: 700;
  letter-spacing: 1px;
}

.login-sub-title {
  margin: 10px 0 0;
  color: #8c8c9a;
  font-size: 13px;
  letter-spacing: 0.5px;
}

// 输入框样式
:deep(.login-input) {
  width: 100%;

  .el-input__wrapper {
    height: 44px;
    border-radius: 8px;
    box-shadow: 0 0 0 1px #e8e8ed inset;
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 0 0 1px #c0c4cc inset;
    }

    &.is-focus {
      box-shadow: 0 0 0 1px var(--el-color-primary) inset;
    }
  }

  .el-input__prefix {
    .el-icon {
      color: #b0b0b8;
      font-size: 18px;
    }
  }
}

// 验证码行
.login-code-row {
  display: flex;
  gap: 12px;
  width: 100%;
}

.code-input {
  flex: 1;
}

.login-code-btn {
  width: 116px;
  height: 44px;
  flex-shrink: 0;
  border-radius: 8px;
  border: 1px solid #dcdfe6;
  color: var(--el-color-primary);
  font-size: 14px;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--el-color-primary);
    background: rgba(37, 99, 235, 0.04);
  }

  &:disabled {
    color: #a8abb2;
  }
}

.remember-item {
  margin-bottom: 8px;

  :deep(.el-form-item__content) {
    line-height: 24px;
  }
}

// 登录按钮
.login-submit-btn {
  width: 100%;
  height: 44px;
  margin-top: 4px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 4px;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
}

// ==================== 响应式 ====================
@media (max-width: 960px) {
  .login-brand {
    display: none;
  }

  .login-form-area {
    background: linear-gradient(135deg, #0f1b3d 0%, #1a3a6b 100%);
  }

  .toolbar-mobile-logo {
    display: flex;
  }

  .toolbar-mobile-logo .brand-title {
    color: #fff;
  }

  .login-form-inner {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
  }
}

@media (max-width: 480px) {
  .login-toolbar {
    padding: 0 16px;
  }

  .login-form-wrapper {
    padding: 16px;
  }

  .login-form-inner {
    padding: 24px 20px;
    border-radius: 12px;
  }
}
</style>
