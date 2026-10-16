<template>
  <div class="app-container finance-page wechat-editor-page wechat-menu-page">
    <div class="finance-settings wechat-reply-wrapper wechat-menu">
      <div class="menu-workspace">
        <div class="menu-preview-panel">
          <h3 class="menu-panel-title">菜单预览</h3>
          <div class="view-wrapper col-sm-4">
              <div class="mobile-header">公众号</div>
              <section class="view-body">
                <div class="time-wrapper"><span class="time">9:36</span></div>
              </section>
              <div class="menu-footer">
                <ul class="flex">
                  <li v-for="(menu, index) in menus" :class="{active:menu === checkedMenu}">
                    <span @click="activeMenu(menu,index,null)"><i class="icon-sub" />{{ menu.name || '一级菜单' }}</span>
                    <div class="sub-menu">
                      <ul>
                        <li v-for="(child, cindex) in menu.subButtons" :class="{active:child === checkedMenu}">
                          <span @click="activeMenu(child,cindex,index)">{{ child.name || '二级菜单' }}</span>
                        </li>
                        <li v-if="menu.subButtons.length < 5" @click="addChild(menu,index)"><i class="icon-add" /></li>
                      </ul>
                    </div>
                  </li>
                  <li v-if="menus.length < 3" @click="addMenu()"><i class="icon-add" /></li>
                </ul>
              </div>
            </div>
          <p class="menu-preview-tip">点击菜单编辑，点击「+」添加菜单</p>
        </div>
        <div class="menu-editor-panel">
          <div class="menu-editor-heading">
            <h3 class="menu-panel-title">菜单设置</h3>
            <el-button v-if="checkedMenuId !== null" type="danger" link @click="delMenu">删除菜单</el-button>
          </div>
          <div class="menu-editor-body">
            <el-empty v-if="checkedMenuId === null" :image-size="80" description="选择左侧菜单开始编辑，也可以点击「+」添加菜单" />
            <el-form v-else :model="checkedMenu" label-width="90px" size="small" @submit.prevent>
              <el-form-item label="菜单名称">
                <el-input v-model="checkedMenu.name" placeholder="请输入菜单名称" />
              </el-form-item>
              <el-alert v-if="checkedMenu.subButtons?.length" title="该菜单包含子菜单，仅需设置菜单名称。" type="info" :closable="false" show-icon />
              <template v-else>
                <el-form-item label="菜单类型">
                  <el-select v-model="checkedMenu.type" style="width: 100%">
                    <el-option label="关键字" value="click" />
                    <el-option label="跳转网页" value="view" />
                    <el-option label="小程序" value="miniprogram" />
                  </el-select>
                </el-form-item>
                <el-form-item v-if="checkedMenu.type === 'click'" label="关键字">
                  <el-input v-model="checkedMenu.key" placeholder="请输入关键字" />
                </el-form-item>
                <el-form-item v-if="checkedMenu.type === 'view'" label="跳转地址">
                  <el-input v-model="checkedMenu.url" placeholder="请输入跳转地址" />
                </el-form-item>
                <template v-if="checkedMenu.type === 'miniprogram'">
                  <el-form-item label="AppID"><el-input v-model="checkedMenu.appId" placeholder="请输入小程序 AppID" /></el-form-item>
                  <el-form-item label="备用网页"><el-input v-model="checkedMenu.url" placeholder="请输入备用网页地址" /></el-form-item>
                  <el-form-item label="小程序路径"><el-input v-model="checkedMenu.pagePath" placeholder="请输入小程序路径" /></el-form-item>
                </template>
              </template>
            </el-form>
          </div>
          <div class="menu-editor-footer">
            <span>编辑完成后保存发布至公众号</span>
            <el-button type="primary" @click="submit">保存发布</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { del, add, get } from '@/api/mwWechatMenu.js'
import eForm from './form.vue'

const delLoading = ref(false)
const menus = ref([])
const checkedMenu = ref({
  type: 'click',
  name: ''
})
const checkedMenuId = ref(null)
const parentMenuId = ref(null)

onMounted(() => {
  get().then(res => {
    // 未发布过菜单时 result 为空，判空避免 JSON.parse(undefined) 崩溃
    menus.value = ((res && res.result) ? JSON.parse(res.result) : []).map(menu => ({ ...menu, subButtons: menu.subButtons || [] }))
  })
})

const defaultMenusData = () => {
  return {
    type: 'click',
    name: '',
    subButtons: []
  }
}

const defaultChildData = () => {
  return {
    type: 'click',
    name: ''
  }
}

const addMenu = () => {
  if (!check()) return false
  const data = defaultMenusData()
  const id = menus.value.length
  menus.value.push(data)
  checkedMenu.value = data
  checkedMenuId.value = id
  parentMenuId.value = null
}

const addChild = (menu, index) => {
  if (!check()) return false
  const data = defaultChildData()
  const id = menu.subButtons.length
  menu.subButtons.push(data)
  checkedMenu.value = data
  checkedMenuId.value = id
  parentMenuId.value = index
}

const delMenu = () => {
  console.log(parentMenuId.value)
  if (parentMenuId.value === null) {
    menus.value.splice(checkedMenuId.value, 1)
  } else {
    menus.value[parentMenuId.value].subButtons.splice(checkedMenuId.value, 1)
  }
  parentMenuId.value = null
  checkedMenu.value = {}
  checkedMenuId.value = null
}

const activeMenu = (menu, index, pid) => {
  if (!check()) return false
  if (pid === null) {
    checkedMenu.value = menu
    parentMenuId.value = null
  } else {
    checkedMenu.value = menus.value[pid].subButtons[index]
    parentMenuId.value = pid
  }
  checkedMenuId.value = index
}

const check = () => {
  if (checkedMenuId.value === null) return true
  if (!checkedMenu.value.name) {
    ElMessage({
      message: '请输入按钮名称',
      type: 'error',
      duration: 1000
    })
    return false
  }
  if (checkedMenu.value.subButtons?.length) return true
  if (checkedMenu.value.type == 'click' && !checkedMenu.value.key) {
    ElMessage({
      message: '请输入关键字',
      type: 'error',
      duration: 1000
    })
    return false
  }
  if (checkedMenu.value.type == 'view' && !checkedMenu.value.url) {
    ElMessage({
      message: '请输入跳转地址',
      type: 'error',
      duration: 1000
    })

    return false
  }
  if (checkedMenu.value.type == 'miniprogram' &&
    (!checkedMenu.value.appId ||
      !checkedMenu.value.pagePath ||
      !checkedMenu.value.url)) {
    ElMessage({
      message: '请填写完整小程序配置',
      type: 'error',
      duration: 1000
    })
    return false
  }
  return true
}

const submit = () => {
  if (!check()) return false
  if (!menus.value.length) {
    ElMessage({
      message: '请添加菜单',
      type: 'error',
      duration: 1000
    })
    return false
  }
  add({ buttons: menus.value }).then(function(res) {
    console.log(555)
    ElMessage({ message: '添加成功', type: 'success' })
  }).catch(function(err) {
    // ElMessage.error('错了哦，这是一条错误消息');
  })
}
</script>

<style rel="stylesheet/scss" scoped>

  body {
    font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 13px;
    color: #676a6c;
    overflow-x: hidden;
  }

  .form-group {
    font-size: 12px
  }

  .form-control {
    background-color: #FFF;
    background-image: none;
    border: 1px solid #e5e6e7;
    border-radius: 1px;
    color: inherit;
    display: block;
    padding: 6px 12px;
    -webkit-transition: border-color .15s ease-in-out 0s, box-shadow .15s ease-in-out 0s;
    transition: border-color .15s ease-in-out 0s, box-shadow .15s ease-in-out 0s;
    width: 100%;
    font-size: 14px;
  }

  .flex {
    display: -webkit-box;
    display: -moz-box;
    display: -webkit-flex;
    display: -moz-flex;
    display: -ms-flexbox;
    display: flex;
  }

  #app .layout-ceiling-main a {
    color: #9ba7b5
  }


  #table-list .mp-header-wrapper h1 {
    padding-left: 15px;
    float: left;
    font-size: 18px;
    line-height: 24px;
    padding-bottom: 20px;
    font-weight: 400;
    color: #464c5b;
  }


  .mp-form .ivu-tree li {
    margin: 0;
  }


  .mp-form .demo-upload-list img {
    width: 100%;
    height: 100%;
  }


  .mp-form .demo-upload-list-cover i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }


  .wechat-reply-wrapper .fr {
    float: right;
  }

  .wechat-reply-wrapper .clearfix:after {
    content: ".";
    display: block;
    height: 0;
    visibility: hidden;
    clear: both;
  }

  .wechat-reply-wrapper .ibox-title p {
    border-left: 2px solid #2494f2;
    text-indent: 8px;
  }

  .wechat-reply-wrapper .ibox-content {
    padding: 15px;
    font-size: 12 ox
  }

  .menu-preview-panel .view-wrapper {
    position: relative;
    width: 317px;
    background-image: url(../../../assets/wechat/mobile_head.png);
    background-repeat: no-repeat;
    background-position: left top;
    background-color: #f5f5f5;
  }

  .menu-preview-panel .view-wrapper .mobile-header {
    position: relative;
    left: 0;
    top: 36px;
    width: 100%;
    text-align: center;
    color: #fff;
    font-size: 16px;
  }

  .menu-preview-panel .view-wrapper .view-body {
    margin-top: 65px;
    background-color: #f5f5f5;
    height: 500px;
  }

  .wechat-reply-wrapper .view-wrapper .view-body .time-wrapper {
    margin-bottom: 10px;
    text-align: center;
  }

  .wechat-reply-wrapper .view-wrapper .view-body .time-wrapper .time {
    display: inline-block;
    color: #f5f5f5;
    display: inline-block;
    color: #f5f5f5;
    background: rgba(0, 0, 0, .3);
    padding: 3px 8px;
    border-radius: 3px;
    font-size: 12px;
  }


  .wechat-reply-wrapper .view-wrapper .view-body .view-item .avatar img {
    max-width: 100%;
    height: auto;
  }


  .wechat-reply-wrapper .submit {
    text-align: center;
  }

  /* 图文 */

  /* 音乐 */

  .view-wrapper .view-body .view-item.music-box .box-content p {
    width: 75%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }


  /* 右侧控制器 */
  .wechat-reply-wrapper .ibox-content .control-wrapper {
    position: relative;
    width: 535px;
    height: 565px;
    padding: 0;
    margin-left: 20px;
    border: 1px solid #e2e2e2;
  }

  .wechat-reply-wrapper .ibox-content .control-wrapper .control-body {
    margin-top: 40px;
    padding: 0 10px;
  }

  .wechat-reply-wrapper .ibox-content .control-wrapper .control-body .form-group label {
    font-weight: normal;
  }

  .wechat-reply-wrapper .ibox-content .control-wrapper .control-body .form-group .tips:after {
    content: '*';
    color: red;
    position: absolute;
    margin-left: 4px;
    font-weight: bold;
    line-height: 1.8em;
  }

  .wechat-reply-wrapper .ibox-content .control-wrapper .control-body .form-group .group-item {
    position: relative;
  }

  .wechat-reply-wrapper .ibox-content .control-wrapper .control-body .form-group .group-item .file-btn {
    position: absolute;
    right: 15px;
    top: 0;
    display: block;
    width: 66px;
    border-radius: 6px;
    cursor: pointer;
    padding: .5rem;
    background-color: #18a689;
    color: #fff;
    text-align: center;
    height: 100%;
    line-height: 23px;
  }

  .wechat-reply-wrapper .ibox-content .control-wrapper .control-body .form-group .group-item textarea {
    resize: none;
    width: 100%;
    height: 100px;
    padding: 10px;
  }

  .wechat-reply-wrapper .ibox-content .control-wrapper .control-body .tips-info {
    padding-left: 100px;
    font-size: 12px;
    color: #737373;
  }

  .wechat-reply-wrapper .ibox-content .control-wrapper .control-body .control-main .control-item {
    display: none;
  }

  .wechat-reply-wrapper .ibox-content .control-wrapper .control-body .control-main .control-item.show {
    display: block;
  }

  /* 微信菜单定制 */
  .wechat-menu {
    position: relative;
  }

  .wechat-menu ul {
    padding: 0;
  }

  .wechat-menu .menu-footer {
    position: absolute;
    left: 0;
    bottom: -10px;
    width: 100%;
    padding-left: 43px;
    background: url("../../../assets/wechat/mobile_foot.png") no-repeat 0px 20px;
    border-top: 1px solid #e7e7eb;
  }

  .wechat-menu .menu-footer span {
    display: block;
    font-size: 12px
  }

  .wechat-menu .menu-footer .icon-add {
    background: url(../../../assets/wechat/index.png) 0 0 no-repeat;
    width: 14px;
    height: 14px;
    vertical-align: middle;
    display: inline-block;
    margin-top: -2px;
    border-bottom: none !important;
  }

  .wechat-menu .menu-footer li {
    position: relative;
    -webkit-flex: 1;
    -moz-flex: 1;
    -ms-flex: 1;
    flex: 1;
    height: 50px;
    line-height: 50px;
    text-align: center;
    cursor: pointer;
    list-style: none;
    border: 1px solid transparent;
    border-right: 1px solid #e7e7eb;
  }

  .wechat-menu .menu-footer .icon-sub {
    background: url(../../../assets/wechat/index.png) 0 -48px no-repeat;
    width: 7px;
    height: 7px;
    vertical-align: middle;
    display: inline-block;
    margin-right: 2px;
    margin-top: -2px;
  }

  .wechat-menu .menu-footer .sub-menu {
    position: absolute;
    border-radius: 3px;
    border: 1px solid #d0d0d0;
    display: block;
    bottom: 60px;
    width: 100%;
    background-color: #fafafa;
  }

  .wechat-menu .menu-footer .sub-menu:after {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    background: #fafafa;
    -webkit-transform: rotate(45deg);
    -moz-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
    bottom: -5px;
    border-bottom: 1px solid #d0d0d0;
    border-right: 1px solid #d0d0d0;
    left: 50%;
    margin-left: -5px;
  }

  .wechat-menu .menu-footer .sub-menu li {
    border-right: 0;
    border-bottom: 1px solid #d0d0d0;
  }

  .wechat-menu .menu-footer .sub-menu li:last-child {
    border-bottom: 0;
  }

  .wechat-menu .menu-footer .active {
    border: 1px solid #44b549;
  }

  .wechat-menu .menu-footer .sub-menu li.active {
    border: 1px solid #44b549 !important;
  }

  /* 右侧 */
  .wechat-menu .menu-control .popover-title {
    padding: 8px 14px;
    margin: 0;
    font-size: 14px;
    background-color: #f7f7f7;
    border-bottom: 1px solid #ebebeb;
    border-radius: 5px 5px 0 0;
    font-weight: 400;
  }

  .wechat-menu .menu-control .popover-title a {
    color: #06C;
    font-size: 12px;
  }

  .wechat-menu .menu-control .tips-txt {
    line-height: 40px;
    padding: 0 20px;
    font-size: 12px
  }

  .wechat-reply-wrapper .ibox-content .control-wrapper .control-body.menu-content {
    padding: 0 20px;
    margin-top: 0;
  }

  .wechat-reply-wrapper .ibox-content .control-wrapper .control-body.menu-content .radio {
    display: inline-block !important;
    width: 45%;
  }

  .wechat-reply-wrapper .ibox-content .control-wrapper .control-body.menu-content .menu-control-box {
    padding: 0 20px;
  }

  .wechat-reply-wrapper .ibox-content .control-wrapper .control-body.menu-content .menu-control-box .radio {
    display: block !important;
    width: 100%;
  }

  .menu-control-box .item {
    display: none;
  }

  .menu-control-box .show {
    display: block;
  }


/* Match the shared settings cards while keeping the phone preview intact. */
.wechat-editor-page .wechat-reply-wrapper .ibox-content {
  padding: 0;
  font-size: 14px;
}

.wechat-editor-page .wechat-reply-wrapper .ibox-content .control-wrapper {
  width: 100%;
  height: auto;
  min-height: 565px;
  margin-left: 0;
  overflow: hidden;
  border-color: #e8edf4;
  border-radius: 10px;
  background: #fff;
}

.wechat-editor-page .form-group {
  margin-bottom: 18px;
  font-size: 14px;
}

.wechat-editor-page .group-item input,
.wechat-editor-page .group-item select {
  max-width: 100%;
}

.wechat-editor-page .ibox-content.submit {
  margin-top: 20px;
  text-align: right;
}

@media (max-width: 1199px) {
  .wechat-editor-page .menu-preview-panel .view-wrapper {
    margin: 0 auto 24px;
    max-width: 100%;
  }
}


/* Keep preview, editor, and publish action together on wide screens. */
.menu-workspace {
  display: grid;
  grid-template-columns: 317px minmax(0, 560px);
  align-items: start;
  gap: 28px;
  width: 100%;
  max-width: 905px;
  margin: 0 auto;
}
.menu-panel-title { margin: 0; font-size: 15px; font-weight: 600; line-height: 24px; }
.menu-preview-panel > .menu-panel-title { margin-bottom: 16px; }
.menu-preview-tip { margin: 22px 0 0; color: #909399; font-size: 13px; text-align: center; }
.menu-editor-panel {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 630px;
  overflow: hidden;
  border: 1px solid #e8edf4;
  border-radius: 10px;
  background: #fff;
}
.menu-editor-heading { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; border-bottom: 1px solid #e8edf4; background: #f7f9fc; }
.menu-editor-body { flex: 1; padding: 24px 20px; }
.menu-editor-footer { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px; padding: 16px 20px; border-top: 1px solid #e8edf4; }
.menu-editor-footer > span { color: #909399; font-size: 13px; }
@media (max-width: 1000px) {
  .menu-workspace { grid-template-columns: minmax(0, 1fr); max-width: 560px; }
  .menu-preview-panel > .menu-panel-title { text-align: center; }
  .menu-editor-panel { min-height: 400px; }
}

</style>
