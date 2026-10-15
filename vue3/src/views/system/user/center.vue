<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="8" :lg="6" :xl="5" style="margin-bottom: 10px">
        <el-card class="box-card">
          <template #header>
            <div class="clearfix">
              <span>个人信息</span>
            </div>
          </template>
          <div>
            <div style="text-align: center">
              <el-upload
                :show-file-list="false"
                :on-success="handleSuccess"
                :on-error="handleError"
                :headers="headers"
                :action="updateAvatarApi"
                class="avatar-uploader"
              >
                <img :src="user.avatar || Avatar" title="点击上传头像" class="avatar">
              </el-upload>
            </div>
            <ul class="user-info">
              <li><div style="height: 100%"><svg-icon icon-class="login" /> 登录账号<div class="user-right">{{ user.username }}</div></div></li>
              <li><svg-icon icon-class="user1" /> 用户昵称 <div class="user-right">{{ user.nickName }}</div></li>
              <li><svg-icon icon-class="phone" /> 手机号码 <div class="user-right">{{ user.phone }}</div></li>
              <li><svg-icon icon-class="email" /> 用户邮箱 <div class="user-right">{{ user.email }}</div></li>
              <li><svg-icon icon-class="dept" /> 所属部门 <div class="user-right"> {{ user.dept }} / {{ user.job }}</div></li>
              <li>
                <svg-icon icon-class="anq" /> 安全设置
                <div class="user-right">
                  <a @click="passRef.dialog = true">修改密码</a>
                  <a @click="emailRef.dialog = true">修改邮箱</a>
                </div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="16" :lg="18" :xl="19">
        <!--    用户资料    -->
        <el-card class="box-card">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="用户资料" name="first">
              <el-form ref="formRef" :model="form" :rules="rules" style="margin-top: 10px;" size="small" label-width="80px">
                <el-form-item label="昵称" prop="nickName">
                  <el-input v-model="form.nickName" style="width: 35%" />
                  <span style="color: #C0C0C0;margin-left: 10px;">用户昵称不作为登录使用</span>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                  <el-input v-model="form.phone" style="width: 35%;" />
                  <span style="color: #C0C0C0;margin-left: 10px;">手机号码不能重复</span>
                </el-form-item>
                <el-form-item label="性别">
                  <el-radio-group v-model="form.sex" style="width: 178px">
                    <el-radio value="男">男</el-radio>
                    <el-radio value="女">女</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="">
                  <el-button :loading="saveLoading" size="mini" type="primary" @click="doSubmit">保存配置</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <!--    操作日志    -->
            <el-tab-pane label="操作日志" name="second">
              <el-table v-loading="loading" :data="data" style="width: 100%;">
                <el-table-column prop="description" label="行为" />
                <el-table-column prop="requestIp" label="IP" />
                <el-table-column :show-overflow-tooltip="true" prop="address" label="IP来源" />
                <el-table-column prop="browser" label="浏览器" />
                <el-table-column prop="time" label="请求耗时" align="center">
                  <template #default="scope">
                    <el-tag v-if="scope.row.time <= 300">{{ scope.row.time }}ms</el-tag>
                    <el-tag v-else-if="scope.row.time <= 1000" type="warning">{{ scope.row.time }}ms</el-tag>
                    <el-tag v-else type="danger">{{ scope.row.time }}ms</el-tag>
                  </template>
                </el-table-column>
                <el-table-column align="right">
                  <template #header>
                    <div style="display:inline-block;float: right;cursor: pointer" @click="init">创建日期<i class="el-icon-refresh" style="margin-left: 40px" /></div>
                  </template>
                  <template #default="scope">
                    <span>{{ parseTime(scope.row.createTime) }}</span>
                  </template>
                </el-table-column>
              </el-table>
              <!--分页组件-->
              <el-pagination
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                :total="total"
                style="margin-top: 8px;"
                layout="total, prev, pager, next, sizes"
                @size-change="sizeChange"
                @current-change="pageChange"
              />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
    <updateEmail ref="emailRef" :email="user.email" />
    <updatePass ref="passRef" />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElNotification } from 'element-plus'
import updatePass from './center/updatePass'
import updateEmail from './center/updateEmail'
import { getToken } from '@/utils/auth'
import { isvalidPhone } from '@/utils/validate'
import { parseTime } from '@/utils/index'
import { initData } from '@/api/data'
import { editUser } from '@/api/system/user'
import Avatar from '@/assets/images/avatar.png'
import { useUserStore } from '@/store/modules/user'

defineOptions({
  name: 'Center'
})

const userStore = useUserStore()

// 与 vue2 的 api store 对齐：修改头像接口（DEV 下走 '/' 由 vite 代理转发）
const updateAvatarApi = (import.meta.env.DEV ? '/' : (import.meta.env.VITE_APP_BASE_API || '/admin')) + 'api/users/updateAvatar'

// 自定义验证
const validPhone = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入电话号码'))
  } else if (!isvalidPhone(value)) {
    callback(new Error('请输入正确的11位手机号码'))
  } else {
    callback()
  }
}

const formRef = ref(null)
const passRef = ref(null)
const emailRef = ref(null)

const activeName = ref('first')
const saveLoading = ref(false)
const headers = { Authorization: getToken() }
const form = reactive({ id: undefined, nickName: '', sex: '', phone: '' })
const rules = {
  nickName: [
    { required: true, message: '请输入用户昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, trigger: 'blur', validator: validPhone }
  ]
}

const user = computed(() => ({ ...userStore.user, avatar: userStore.avatar }))

// 操作日志（迁移自 vue2 crud mixin，仅保留本页面用到的部分）
const data = ref([])
const loading = ref(false)
const total = ref(0)
const page = ref(0)
const size = ref(10)
const sort = ['id,desc']
const currentPage = ref(1)
const pageSize = ref(10)

const syncPageState = () => {
  currentPage.value = page.value + 1
  pageSize.value = size.value
}

const init = () => {
  loading.value = true
  return initData('api/logs/user', { page: page.value, size: size.value, sort: sort.join(',') }).then(res => {
    total.value = res.totalElements
    data.value = res.content
    loading.value = false
  }).catch(err => {
    loading.value = false
    console.log(err)
  })
}

// 改变页码
const pageChange = (e) => {
  page.value = e - 1
  syncPageState()
  init()
}
// 改变每页显示数
const sizeChange = (e) => {
  page.value = 0
  size.value = e
  syncPageState()
  init()
}

const handleClick = (tab) => {
  if (tab.props.name === 'second') {
    init()
  }
}

const handleSuccess = () => {
  ElNotification({
    title: '头像修改成功',
    type: 'success',
    duration: 2500
  })
  userStore.GetInfo()
}

// 监听上传失败
const handleError = (e) => {
  const msg = JSON.parse(e.message)
  ElNotification({
    title: msg.message,
    type: 'error',
    duration: 2500
  })
}

const doSubmit = () => {
  if (formRef.value) {
    formRef.value.validate((valid) => {
      if (valid) {
        saveLoading.value = true
        editUser(form).then(() => {
          ElNotification({
            title: '编辑成功',
            type: 'success',
            duration: 2500
          })
          userStore.GetInfo()
          saveLoading.value = false
        }).catch(() => {
          saveLoading.value = false
        })
      }
    })
  }
}

const fillForm = () => {
  const u = user.value
  form.id = u.id
  form.nickName = u.nickName
  form.sex = u.sex
  form.phone = u.phone
}

onMounted(() => {
  userStore.GetInfo().then(() => {
    fillForm()
  }).catch(() => {})
})
</script>

<style rel="stylesheet/scss" lang="scss">
  .avatar-uploader-icon {
    font-size: 28px;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center
  }

  .avatar {
    width: 120px;
    height: 120px;
    display: block;
    border-radius: 50%
  }
  .user-info {
    padding-left: 0;
    list-style: none;
    li{
      border-bottom: 1px solid #F0F3F4;
      padding: 11px 0;
      font-size: 13px;
    }
    .user-right {
      float: right;

      a{
        color: #317EF3;
      }
    }
  }
</style>
