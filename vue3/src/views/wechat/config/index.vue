<template>
  <div class="app-container">
    <el-form ref="formRef" :model="form" :rules="rules" size="small" label-width="150px">
      <el-form-item label="公众号AppID">
        <el-input v-model="form.wechat_appid" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="公众号AppSecret">
        <el-input v-model="form.wechat_appsecret" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="微信开放平台AppID">
        <el-input v-model="form.wxapp_appId" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="微信开放平台AppSecret">
        <el-input v-model="form.wxapp_secret" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="微信验证TOKEN">
        <el-input v-model="form.wechat_token" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="EncodingAESKey">
        <el-input v-model="form.wechat_encodingaeskey" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="微信服务器地址">
        <el-input v-model="form.api" :disabled="true" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="微信分享图片">
        <MaterialList v-model="imageArr" style="width: 370px" type="image" :num="1" :width="150" :height="150" />
      </el-form-item>
      <el-form-item label="关注二维码">
        <MaterialList
          v-model="wechat_follow_imgArr"
          style="width: 500px"
          type="image"
          :num="1"
          :width="150"
          :height="150"
        />
      </el-form-item>
      <el-form-item label="微信分享标题">
        <el-input v-model="form.wechat_share_title" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="微信分享简介">
        <el-input v-model="form.wechat_share_synopsis" style="width: 370px;" :rows="5" type="textarea" />
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="doSubmit">提交</el-button>
      </el-form-item>

    </el-form>

  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { get, add } from '@/api/mwSystemConfig'
import MaterialList from '@/components/material'

const formRef = ref(null)
const wechat_follow_imgArr = ref([])
const imageArr = ref([])
const delLoading = ref(false)

const form = reactive({
  wechat_name: '',
  wechat_id: '',
  wechat_sourceid: '',
  wechat_appid: '',
  wechat_appsecret: '',
  wxapp_appId: '',
  wxapp_secret: '',
  wxapp_appId_jkj: '',
  wxapp_secret_jkj: '',
  wechat_token: '',
  wechat_encode: '',
  wechat_encodingaeskey: '',
  wechat_share_img: '',
  wechat_follow_img: '',
  wechat_qrcode: '',
  wechat_type: '',
  wechat_share_title: '',
  wechat_share_synopsis: '',
  api: 'http://你的mshop-app端域名/api/wechat/serve',
  wechat_avatar: ''
})

const rules = {}

watch(imageArr, (val) => {
  if (val) {
    form.wechat_share_img = val.join(',')
  }
})

watch(wechat_follow_imgArr, (val) => {
  if (val) {
    form.wechat_follow_img = val.join(',')
  }
})

const initData = () => {
  get().then(rese => {
    rese.content.forEach(key => {
      const keyName = key.menuName
      const newValue = key.value
      if (keyName in form) {
        form[keyName] = newValue
      }
    })

    imageArr.value = form.wechat_share_img ? form.wechat_share_img.split(',') : []
    wechat_follow_imgArr.value = form.wechat_follow_img ? form.wechat_follow_img.split(',') : []
  })
}

const checkPermission = () => {
  // Permission check logic
}

const doSubmit = () => {
  add(form).then(res => {
    ElMessage({ message: '设置成功', type: 'success' })
  }).catch(err => {
    console.log(err.response?.data?.message)
  })
}

onMounted(() => {
  initData()
})
</script>

<style scoped>

</style>
