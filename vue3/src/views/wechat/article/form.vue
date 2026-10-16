<template>
  <div class="app-container">
    <el-form ref="formRef" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="标题">
        <el-input v-model="form.title" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="作者">
        <el-input v-model="form.author" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="封面">
        <MaterialList v-model="form.imageArr" style="width: 370px" type="image" :num="1" :width="150" :height="150" />
      </el-form-item>
      <el-form-item label="简介">
        <el-input v-model="form.synopsis" style="width: 370px;" :rows="5" type="textarea" />
      </el-form-item>
      <el-form-item label="正文">
        <!--<editor v-model="form.content" />-->
        <VueUeditorWrap v-model="form.content" :config="myConfig"  @beforeInit="addCustomDialog"  style="width: 90%;"></VueUeditorWrap>
      </el-form-item>
      <el-form-item>
        <!--<el-button link @click="cancel">取消</el-button>-->
        <el-button :loading="loading" type="primary" @click="doSubmit">保存</el-button>
      </el-form-item>
    </el-form>
    <!--<div slot="footer" class="dialog-footer">-->
      <!--<el-button link @click="cancel">取消</el-button>-->
      <!--<el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>-->
    <!--</div>-->
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElNotification } from 'element-plus'
import { add, edit, get } from '@/api/mwArticle'
import picUpload from '@/components/pic-upload'
import editor from '../../components/Editor'
import yamedit from '@/components/YamlEdit'
import MaterialList from '@/components/material'
import { VueUeditorWrap } from 'vue-ueditor-wrap'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const dialog = ref(false)
const formRef = ref(null)
const form = reactive({
  id: '',
  cid: '',
  title: '',
  author: '',
  imageInput: '',
  imageArr: [],
  synopsis: '',
  content: '',
  shareTitle: '',
  shareSynopsis: '',
  visit: '',
  sort: '',
  url: '',
  status: '',
  addTime: '',
  hide: '',
  merId: '',
  productId: '',
  isHot: '',
  isBanner: ''
})
const rules = {
}
const myConfig = ref({
  autoHeightEnabled: false, // 编辑器不自动被内容撑高
  initialFrameHeight: 500, // 初始容器高度
  initialFrameWidth: '100%', // 初始容器宽度
  UEDITOR_HOME_URL: '/UEditor/',
  serverUrl: ''
})

onMounted(() => {
  form.id = route.params.id
  if (form.id) {
    get(form.id).then(data => {
      Object.assign(form, data)
      form.imageArr = [data.imageInput]
    })
  }
})

const addCustomDialog = () => {
  window.UE.registerUI('mshop', function (editor, uiName) {
    let dialog = new window.UE.ui.Dialog({
      iframeUrl: '/mshop/materia/index',
      editor: editor,
      name: uiName,
      title: '上传图片',
      cssRules: 'width:1200px;height:500px;padding:20px;'
    })
    this.dialog = dialog

    var btn = new window.UE.ui.Button({
      name: 'dialog-button',
      title: '上传图片',
      cssRules: `background-image: url(../../../assets/images/icons.png);background-position: -726px -77px;`,
      onclick: function () {
        dialog.render()
        dialog.open()
      }
    })

    return btn
  }, 37)
}

const cancel = () => {
  resetForm()
}

const doSubmit = () => {
  loading.value = true
  if (form.imageArr.length > 0) {
    form.imageInput = form.imageArr.join(',')
  } else {
    form.imageInput = ''
  }

  if (!form.id) {
    doAdd()
  } else doEdit()
}

const doAdd = () => {
  add(form).then(res => {
    resetForm()
    ElNotification({
      title: '添加成功',
      type: 'success',
      duration: 2500
    })
    loading.value = false
    setTimeout(() => {
      router.push({ path: '/wechat/wearticle' })
    }, 500)
  }).catch(err => {
    loading.value = false
    console.log(err.response?.data?.message || err.message)
  })
}

const doEdit = () => {
  edit(form).then(res => {
    resetForm()
    ElNotification({
      title: '修改成功',
      type: 'success',
      duration: 2500
    })
    loading.value = false
    setTimeout(() => {
      router.push({ path: '/wechat/wearticle' })
    }, 500)
  }).catch(err => {
    loading.value = false
    console.log(err.response?.data?.message || err.message)
  })
}

const resetForm = () => {
  dialog.value = false
  formRef.value?.resetFields()
  Object.assign(form, {
    id: '',
    cid: '',
    title: '',
    author: '',
    imageInput: '',
    synopsis: '',
    shareTitle: '',
    shareSynopsis: '',
    visit: '',
    sort: '',
    url: '',
    status: '',
    addTime: '',
    hide: '',
    adminId: '',
    merId: '',
    productId: '',
    isHot: '',
    isBanner: ''
  })
}
</script>

<style scoped>

</style>
