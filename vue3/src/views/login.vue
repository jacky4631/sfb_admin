<template>
  <div class="login">
    <div style="display:flex;justify-content:space-between;align-items: center;">
      <div style="padding: 0 60px 0 0">
        <h3 style="color: #ffffff;font-size: 24px;padding: 0;margin-bottom: 10px">
          电商系统
        </h3>
      </div>
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" label-position="left" label-width="0px" class="login-form">
      <h3 class="title">
        后台管理系统
      </h3>
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="账号">
          <template #prefix>
            <svg-icon icon-class="user" class="el-input__icon input-icon" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="loginForm.password" type="password" auto-complete="off" placeholder="密码" @keyup.enter="handleLogin">
          <template #prefix>
            <svg-icon icon-class="password" class="el-input__icon input-icon" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input v-model="loginForm.code" auto-complete="off" placeholder="验证码" style="width: 63%" @keyup.enter="handleLogin">
          <template #prefix>
            <svg-icon icon-class="validCode" class="el-input__icon input-icon" />
          </template>
        </el-input>
        <div class="login-code">
          <el-button :disabled="captchaOnOff" style="width: 100px; color: #da2e26;margin-top: 2px" @click="getCode">{{ captchaBtn }}</el-button>
        </div>
      </el-form-item>
      <el-checkbox v-model="loginForm.rememberMe" style="margin:0 0 25px 0;">
        记住我
      </el-checkbox>
      <el-form-item style="width:100%;">
        <el-button :loading="loading" size="medium" type="primary" style="width:100%;" @click.native.prevent="handleLogin">
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form-item>
    </el-form>
    </div>
    <div v-if="showFooter" id="el-login-footer">
      <span v-html="footerTxt" />
      <span> ⋅ </span>
      <a href="http://beian.miit.gov.cn" target="_blank">{{ caseNumber }}</a>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { encrypt } from '@/utils/rsaEncrypt'
import Config from '@/settings'
import { getCodeImg } from '@/api/login'
import Cookies from 'js-cookie'
import { useUserStore } from '@/store/modules/user'
import { useSettingsStore } from '@/store/modules/settings'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const settingsStore = useSettingsStore()

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
  code: [{ required: true, trigger: 'change', message: '验证码不能为空' }]
}

const loading = ref(false)
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
  loginForm.validateField(['username', 'password', 'code'], (valid) => {
    if (valid) {
      return
    }
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
      loading.value = false
      router.push({ path: redirect.value || '/' })
    }).catch(() => {
      loading.value = false
      getCode()
    })
  })
}

onUnmounted(() => {
  inTime && clearInterval(inTime)
})

getCookie()
</script>

<style lang="scss" scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("../assets/images/bg.jpg");
  background-size: cover;
}
.title {
  margin: 0 auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 385px;
  padding: 25px 25px 5px 25px;
  :deep(.el-input) {
    height: 38px;
    input {
      height: 38px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}
.login-code {
  width: 33%;
  display: inline-block;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle
  }
}
</style>
