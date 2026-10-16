<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission">
        <template #right>
          <el-tooltip class="item" effect="dark" content="同步小程序控制台直播间数据" placement="top-start">
            <el-button
              class="filter-item"
              size="small"
              type="success"
              :icon="Icons.Refresh"
              :loading="syncLoading"
              :disabled="crud.selections.length === 0"
              @click="doSync"
            >同步</el-button>
          </el-tooltip>
        </template>
      </crudOperation>
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :model-value="crud.status.cu > 0" :title="crud.status.title" width="800px">
        <el-form ref="formRef" :model="form" :rules="rules" size="small" label-width="140px">
          <el-form-item label="直播间标题" prop="name">
            <el-input v-model="form.name" style="width: 370px;" :disabled="isDisabled" />
          </el-form-item>
          <el-form-item label="直播间背景图" prop="coverImg" >
            <MaterialList v-model="form.coverImgArr" style="width: 370px" type="image" :num="1" :width="150" :height="150" :disabled="isDisabled" />
          </el-form-item>
          <el-form-item label="直播间分享图片" prop="shareImg" >
            <MaterialList v-model="form.shareImgArr" style="width: 370px" type="image" :num="1" :width="150" :height="150" :disabled="isDisabled" />
          </el-form-item>
          <el-form-item label="封面图" prop="feedsImg" >
            <MaterialList v-model="form.feedsImgArr" style="width: 370px" type="image" :num="1" :width="150" :height="150" :disabled="isDisabled" />
            <p style="color: #cf0f0f">购物直播封面图 ，建议尺寸800*800</p>
          </el-form-item>
          <el-form-item label="计划直播开始时间" prop="startDate" >
            <el-date-picker v-model="form.startDate" type="datetime" style="width: 370px;" :disabled="isDisabled"/>
            <p style="color: #cf0f0f">开播时间需要在当前时间的10分钟后,并且开始时间不能在6个月后</p>
          </el-form-item>
          <el-form-item label="计划直播结束时间" prop="endDate" >
            <el-date-picker v-model="form.endDate" type="datetime" style="width: 370px;" :disabled="isDisabled"/>
            <p style="color: #cf0f0f">开播时间和结束时间间隔不得短于30分钟,不得超过24小时</p>
          </el-form-item>
          <el-form-item label="主播昵称" prop="anchorName" :disabled="isDisabled">
            <el-input v-model="form.anchorName" style="width: 370px;" :disabled="isDisabled"/>
          </el-form-item>
          <el-form-item label="主播微信号" prop="anchorWechat" :disabled="isDisabled">
            <el-input v-model="form.anchorWechat" style="width: 370px;" :disabled="isDisabled"/>
            <p style="color: #cf0f0f">主播微信号需要实名，搜索微信官方小程序【小程序直播】进行认证</p>
          </el-form-item>
          <el-form-item label="主播头像" prop="anchorImg" >
            <MaterialList v-model="form.anchorImgArr" style="width: 370px" type="image" :num="1" :width="150" :height="150" :disabled="isDisabled"/>
          </el-form-item>

          <el-form-item label="直播间类型" prop="type" >
            <el-radio-group v-model="form.type" :disabled="isDisabled" >
              <el-radio :value="1" class="radio">推流</el-radio>
              <el-radio :value="0">手机直播</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="横屏、竖屏" prop="screenType" >
            <el-radio-group v-model="form.screenType" :disabled="isDisabled">
              <el-radio :value="1" class="radio">横屏</el-radio>
              <el-radio :value="0">竖屏</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否关闭点赞" prop="closeLike" >
            <el-radio-group v-model="form.closeLike" :disabled="isDisabled">
              <el-radio :value="1" class="radio">关闭</el-radio>
              <el-radio :value="0">开启</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否关闭货架" prop="closeGoods" >
            <el-radio-group v-model="form.closeGoods" :disabled="isDisabled">
              <el-radio :value="1" class="radio">关闭</el-radio>
              <el-radio :value="0">开启</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否关闭评论" prop="closeComment" >
            <el-radio-group v-model="form.closeComment" :disabled="isDisabled">
              <el-radio :value="1" class="radio">关闭</el-radio>
              <el-radio :value="0">开启</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="是否关闭回放" prop="closeLike" >
            <el-radio-group v-model="form.closeReplay" :disabled="isDisabled">
              <el-radio :value="1" class="radio">关闭</el-radio>
              <el-radio :value="0">开启</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否关闭分享" prop="closeGoods" >
            <el-radio-group v-model="form.closeShare" :disabled="isDisabled">
              <el-radio :value="1" class="radio">关闭</el-radio>
              <el-radio :value="0">开启</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否关闭客服" prop="closeComment" >
            <el-radio-group v-model="form.closeKf" :disabled="isDisabled">
              <el-radio :value="1" class="radio">关闭</el-radio>
              <el-radio :value="0">开启</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button link @click="crud.cancelCU">取消</el-button>
            <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU" :disabled="isDisabled">确认</el-button>
          </div>
        </template>
      </el-dialog>
      <el-dialog title="修改直播间商品信息"
                 v-model="closeDialogVisible"
                 width="40%">
        <el-form :model="form"
                 label-width="150px">
              <el-form-item label="选择入库商品" >
                <LiveGoods :product="form.product"  @selectGoods="getGoods" > </LiveGoods>
              </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="closeDialog()">取 消</el-button>
            <el-button type="primary" @click="handleCloseOrder">确 定</el-button>
          </span>
        </template>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="tableRef" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column v-if="columns.visible('roomId')" prop="roomId" label="直播间id" />
        <el-table-column v-if="columns.visible('name')" prop="name" label="直播间标题" />
        <el-table-column v-if="columns.visible('coverImge')" prop="coverImge" label="背景图">
          <template #default="scope">
            <a :href="scope.row.coverImge" style="color: rgb(64, 158, 255)" target="_blank"><img :src="scope.row.coverImge" alt="点击打开" class="el-avatar"></a>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('shareImge')" prop="shareImge" label="分享图片" >
          <template #default="scope">
            <a :href="scope.row.shareImge" style="color: rgb(64, 158, 255)" target="_blank"><img :src="scope.row.shareImge" alt="点击打开" class="el-avatar"></a>
          </template>
        </el-table-column>
<!--        101：直播中，102：未开始，103 已结束，104 禁播，105：暂停，106：异常，107：已过期-->
        <el-table-column v-if="columns.visible('liveStatus')" prop="liveStatus" label="直播间状态" >
          <template #default="scope">
            <div>
              <el-tag v-if="scope.row.liveStatus === 101" type="primary">直播中</el-tag>
              <el-tag v-if="scope.row.liveStatus === 102" type="primary">未开始</el-tag>
              <el-tag v-if="scope.row.liveStatus === 103" type="primary">已结束</el-tag>
              <el-tag v-if="scope.row.liveStatus === 104" type="primary">禁播</el-tag>
              <el-tag v-if="scope.row.liveStatus === 105" type="primary">暂停</el-tag>
              <el-tag v-if="scope.row.liveStatus === 106" type="primary">异常</el-tag>
              <el-tag v-if="scope.row.liveStatus === 107" type="primary">已过期</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="startTime" label="开始时间"  width="200" >
          <template #default="scope" width="200">
            <span>{{ formatTimeThree(scope.row.startTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="endTime" label="预计结束时间"  width="200">
          <template #default="scope"  width="200">
            <span>{{ formatTimeThree(scope.row.endTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('anchorName')" prop="anchorName" label="主播昵称" />
        <el-table-column v-if="columns.visible('anchorWechat')" prop="anchorWechat" label="主播微信号" />
        <el-table-column v-if="columns.visible('anchorImge')" prop="anchorImge" label="主播头像" >
          <template #default="scope">
            <a :href="scope.row.anchorImge" style="color: rgb(64, 158, 255)" target="_blank"><img :src="scope.row.anchorImge" alt="点击打开" class="el-avatar"></a>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('type')" prop="type" label="直播类型" >
          <template #default="scope">
            <div>
              <el-tag v-if="scope.row.type === 1" type="primary">推流</el-tag>
              <el-tag v-else type="primary">手机直播</el-tag>
            </div>
          </template>
        </el-table-column>
          <el-table-column v-if="columns.visible('closeReplay')" prop="closeReplay" label="回放" >
            <template #default="scope">
              <div>
                <el-tag v-if="scope.row.closeReplay === 1" type="primary">关闭</el-tag>
                <el-tag v-else type="primary">开启</el-tag>
              </div>
            </template>
        </el-table-column>
        <el-table-column v-if="checkPermission(['admin','mwWechatLive:edit','mwWechatLive:del'])" label="操作" width="150px" align="center">
          <template #default="scope">

            <udOperation
              :data="scope.row"
              :permission="permission"
            >
            </udOperation>
            <el-button
              size="small"
              type="success"
              @click="showCloseOrderDialog(scope.row)"
            >
              添加商品
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script setup>
import checkPermission from '@/utils/permission.js'
import { ref, reactive, computed } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { sync } from '@/api/mwWechatLive.js'
import crudMwWechatLive from '@/api/mwWechatLive.js'
import CRUD, { presenter, header } from '@/components/Crud/crud.js'
import rrOperation from '@/components/Crud/RR.operation.vue'
import crudOperation from '@/components/Crud/CRUD.operation.vue'
import pagination from '@/components/Crud/Pagination.vue'
import MaterialList from '@/components/material/index.vue'
import LiveGoods from '@/views/components/livegoods/index.vue'
import udOperation from '@/components/Crud/UD.operation.vue'
import { formatTimeThree } from '@/utils/index.js'
import { addGoods } from '@/api/mwWechatLive.js'
import * as Icons from '@element-plus/icons-vue'

// crud交由presenter持有
const defaultCrud = CRUD({
  optShow: {
    add: true,
    edit: false,
    del: false,
    download: true
  },
  title: '直播房间',
  url: 'api/mwWechatLive',
  sort: 'room_id,desc',
  crudMethod: { ...crudMwWechatLive }
})

const defaultForm = {
  product: [],
  roomId: null,
  productId: null,
  feedsImg: null,
  name: null,
  coverImge: null,
  startDate: null,
  endDate: null,
  shareImge: null,
  liveStatus: null,
  coverImgArr: [],
  shareImgArr: [],
  anchorImgArr: [],
  feedsImgArr: [],
  startTime: null,
  endTime: null,
  anchorName: null,
  anchorWechat: null,
  anchorImge: null,
  type: 0,
  screenType: 0,
  closeLike: 0,
  closeGoods: 0,
  closeComment: 0,
  closeReplay: 0,
  closeShare: 0,
  closeKf: 0
}

const closeDialogVisible = ref(false)
const disabled = ref(false)
const syncLoading = ref(false)
const permission = ref({
  add: ['admin', 'mwWechatLive:add'],
  edit: ['admin', 'mwWechatLive:edit'],
  del: ['admin', 'mwWechatLive:del']
})
const rules = {
  name: [
    { required: true, message: '直播间标题不能为空', trigger: 'blur' }
  ],
  coverImge: [
    { required: true, message: '背景图不能为空', trigger: 'blur' }
  ],
  shareImge: [
    { required: true, message: '分享图片不能为空', trigger: 'blur' }
  ],
  startDate: [
    { required: true, message: '开始时间不能为空', trigger: 'blur' }
  ],
  endDate: [
    { required: true, message: '预计结束时间不能为空', trigger: 'blur' }
  ],
  anchorName: [
    { required: true, message: '主播昵称不能为空', trigger: 'blur' }
  ],
  anchorWechat: [
    { required: true, message: '主播微信号不能为空', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '直播间类型 1：推流 0：手机直播不能为空', trigger: 'blur' }
  ],
  screenType: [
    { required: true, message: '横屏、竖屏 【1：横屏，0：竖屏】不能为空', trigger: 'blur' }
  ],
  closeLike: [
    { required: true, message: '是否关闭货架 【0：开启，1：关闭】不能为空', trigger: 'blur' }
  ],
  closeComment: [
    { required: true, message: '是否关闭评论 【0：开启，1：关闭】不能为空', trigger: 'blur' }
  ]
}

const form = reactive({ ...defaultForm })

const isDisabled = computed(() => {
  if (disabled.value) {
    return true
  } else {
    return false
  }
})

const columns = ref({
  visible: (key) => true
})

const { crud } = presenter(defaultCrud)

// CRUD hooks and methods would be provided by the presenter

const closeDialog = () => {
  form.product = []
  closeDialogVisible.value = false
}

const showCloseOrderDialog = (row) => {
  closeDialogVisible.value = true
  form.roomId = row.id
  form.product = row.product
}

const handleCloseOrder = () => {
  ElMessageBox.confirm('是否提交?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const params = {
      "roomId": form.roomId,
      "productId": form.productId
    }
    addGoods(params).then(res => {
      closeDialogVisible.value = false
      ElMessage.success("添加成功")
    }).catch(err => {
      ElMessage.error(err.msg || '添加失败')
    })
  })
}

const getGoods = (p) => {
  const ids = []
  p.forEach((item, index) => {
    ids.push(item.id)
  })
  form.productId = ids.join(",")
}

const doSync = () => {
  syncLoading.value = true
  sync().then(() => {
    crud.refresh()
    crud.notify('同步成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
    syncLoading.value = false
  }).then(() => {
    syncLoading.value = false
  })
}

// CRUD hooks
const beforeRefresh = () => {
  return true
}

const beforeSubmit = () => {
  form.coverImge = form.coverImgArr.join(',')
  form.shareImge = form.shareImgArr.join(',')
  form.anchorImge = form.anchorImgArr.join(',')
  form.feedsImg = form.feedsImgArr.join(',')
}

const beforeToAdd = () => {
  disabled.value = false
}

const beforeToEdit = (crud, formData) => {
  formData.coverImgArr = [formData.coverImge]
  formData.shareImgArr = [formData.shareImge]
  formData.anchorImgArr = [formData.anchorImge]
  formData.product = formData.product
  disabled.value = true
}
</script>

<style scoped>
.table-img {
  display: inline-block;
  text-align: center;
  background: #ccc;
  color: #fff;
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  vertical-align: middle;
  width: 32px;
  height: 32px;
  line-height: 32px;
}
</style>
