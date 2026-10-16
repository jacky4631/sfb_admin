<template>
  <div v-if="type == 'image'">
    <ul v-for="(item,index) in modelValue" :key="index" class="el-upload-list el-upload-list--picture-card">
      <li tabindex="0" class="el-upload-list__item is-ready" :style="'width: '+width+'px;height: '+height+'px'">
        <div>
          <img :src="item" alt="" class="el-upload-list__item-thumbnail">
          <span class="el-upload-list__item-actions">
            <span v-if="index != 0" class="el-upload-list__item-preview" @click="moveMaterial(index,'up')">
              <el-icon><Back /></el-icon>
            </span>
            <span class="el-upload-list__item-preview" @click="zoomMaterial(index)">
              <el-icon><View /></el-icon>
            </span>
            <span class="el-upload-list__item-delete" @click="deleteMaterial(index)">
              <el-icon><Delete /></el-icon>
            </span>
            <span v-if="index != modelValue.length-1" class="el-upload-list__item-preview" @click="moveMaterial(index,'down')">
              <el-icon><Right /></el-icon>
            </span>
          </span>
        </div>
      </li>
    </ul>
    <div v-if="num > modelValue.length" tabindex="0" class="el-upload el-upload--picture-card" :style="'width: '+width+'px;height: '+height+'px;'+'line-height:'+height+'px;'" @click="toSeleteMaterial">
      <el-icon><Plus /></el-icon>
    </div>

    <el-dialog
      append-to-body
      v-model="dialogVisible"
      width="35%"
    >
      <img :src="url" alt="" style="width: 100%">
    </el-dialog>

    <el-dialog
      title="图片素材库"
      append-to-body
      v-model="listDialogVisible"
      width="70%"
    >
      <el-container>
        <el-aside width="unset">
          <div style="margin-bottom: 10px">
            <el-button
              :icon="Plus"
              size="small"
              @click="materialgroupAdd()"
            >
              添加分组
            </el-button>
          </div>
          <el-tabs v-model="materialgroupObjId" v-loading="materialgroupLoading" tab-position="left" @tab-click="tabClick">
            <el-tab-pane
              v-for="(item,index) in materialgroupList"
              :key="item.id"
              :name="item.id"
            >
              <template #label><span> {{ item.name }}</span></template>
            </el-tab-pane>
          </el-tabs>
        </el-aside>
        <el-main>
          <el-card>
            <template #header>
              <el-row>
                <el-col :span="12">
                  <span>{{ materialgroupObj.name }}</span>
                  <span v-if="materialgroupObj.id != '-1'">
                    <el-button size="small" link :icon="Edit" style="margin-left: 10px;" @click="materialgroupEdit(materialgroupObj)">重命名</el-button>
                    <el-button size="small" link :icon="Delete" style="margin-left: 10px;color: red" @click="materialgroupDelete(materialgroupObj)">删除</el-button>
                  </span>
                </el-col>
                <el-col :span="12" style="text-align: right;">
                  <el-upload
                    :action="uploadApi"
                    :headers="headers"
                    :file-list="[]"
                    :on-progress="handleProgress"
                    :before-upload="beforeUpload"
                    :on-success="handleSuccess"
                    :data="{type: 1}"
                    multiple
                  >
                    <el-button size="small" type="primary">批量上传</el-button>
                  </el-upload>
                </el-col>
              </el-row>
            </template>
            <div v-loading="tableLoading">
              <el-alert
                v-if="tableData.length <= 0"
                title="暂无数据"
                type="info"
                :closable="false"
                center
                show-icon
              />
              <el-row :gutter="5">
                <el-checkbox-group v-model="urls" :max="num - modelValue.length">
                  <el-col v-for="(item,index) in tableData" :key="index" :span="4">
                    <el-card :body-style="{ padding: '5px' }">
                      <el-image
                        style="width: 100%;height: 100px"
                        :src="item.url"
                        fit="contain"
                        :preview-src-list="[item.url]"
                        :z-index="9999"
                      />
                      <div>
                        <el-checkbox class="material-name" :label="item.url">
                          选择
                        </el-checkbox>
                        <el-row>
                          <el-col :span="24" class="col-do">
                            <el-button link size="default" @click="materialDel(item)">删除</el-button>
                          </el-col>
                        </el-row>

                      </div>
                    </el-card>
                  </el-col>
                </el-checkbox-group>
              </el-row>
              <el-pagination
                v-model:current-page="page.currentPage"
                :page-sizes="[12, 24]"
                :page-size="page.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="page.total"
                class="pagination"
                @size-change="sizeChange"
                @current-change="pageChange"
              />
            </div>
          </el-card>
        </el-main>
      </el-container>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="listDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="sureUrls">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>

</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getList as materialgroupPageApi, addObj as materialgroupAddApi, delObj as materialgroupDelApi, putObj as materialgroupEditApi } from '@/api/tools/materialgroup'
import { getPage, addObj, delObj, putObj } from '@/api/tools/material'
import { getToken } from '@/utils/auth'

defineOptions({
  name: 'Material'
})

const props = defineProps({
  // 素材数据
  modelValue: {
    type: Array,
    default() {
      return []
    }
  },
  // 素材类型
  type: {
    type: String,
    default: 'image'
  },
  // 素材限制数量，默认5个
  num: {
    type: Number,
    default: 5
  },
  // 宽度
  width: {
    type: Number,
    default: 150
  },
  // 高度
  height: {
    type: Number,
    default: 150
  }
})

const emit = defineEmits(['update:modelValue'])

const headers = ref({
  Authorization: getToken()
})
const dialogVisible = ref(false)
const url = ref('')
const listDialogVisible = ref(false)
const materialgroupList = ref([])
const materialgroupObjId = ref('')
const materialgroupObj = ref({})
const materialgroupLoading = ref(false)
const tableData = ref([])
const resultNumber = ref(0)
const page = reactive({
  total: 0, // 总页数
  currentPage: 1, // 当前页数
  pageSize: 12, // 每页显示多少条
  ascs: [], // 升序字段
  descs: 'create_time'// 降序字段
})
const tableLoading = ref(false)
const groupId = ref(null)
const urls = ref([])

const baseUrl = import.meta.env.VITE_BASE_API || ''
const uploadApi = computed(() => baseUrl + '/api/upload')

const moveMaterial = (index, type) => {
  const valueArray = [...props.modelValue]
  if (type == 'up') {
    const tempOption = valueArray[index - 1]
    valueArray[index - 1] = valueArray[index]
    valueArray[index] = tempOption
  }
  if (type == 'down') {
    const tempOption = valueArray[index + 1]
    valueArray[index + 1] = valueArray[index]
    valueArray[index] = tempOption
  }
  emit('update:modelValue', valueArray)
}

const zoomMaterial = (index) => {
  dialogVisible.value = true
  url.value = props.modelValue[index]
}

const deleteMaterial = async (index) => {
  try {
    await ElMessageBox.confirm('是否确认删除？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    const valueArray = [...props.modelValue]
    valueArray.splice(index, 1)
    emit('update:modelValue', valueArray)
    urls.value = []
  } catch {
    // User cancelled
  }
}

const toSeleteMaterial = () => {
  listDialogVisible.value = true
  if (tableData.value.length <= 0) {
    materialgroupPage()
  }
}

const materialgroupPage = () => {
  materialgroupLoading.value = true
  materialgroupPageApi({
    total: 0, // 总页数
    page: 1, // 当前页数
    size: 100, // 每页显示多少条
    ascs: [], // 升序字段
    sort: 'create_time,desc'// 降序字段
  }).then(response => {
    materialgroupLoading.value = false
    const materialgroupListData = response
    materialgroupListData.unshift({
      id: '-1',
      name: '全部分组'
    })
    materialgroupList.value = materialgroupListData
    tabClick({
      index: 0
    })
  })
}

const materialgroupDelete = async (materialgroupObjData) => {
  try {
    await ElMessageBox.confirm('是否确认删除该分组？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    materialgroupDelApi(materialgroupObjData.id).then(() => {
      const index = materialgroupObjData.index
      materialgroupList.value.splice(index, 1)
    })
  } catch {
    // User cancelled
  }
}

const materialgroupEdit = async (materialgroupObjData) => {
  try {
    const { value } = await ElMessageBox.prompt('请输入分组名', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputValue: materialgroupObjData.name
    })
    materialgroupEditApi({
      id: materialgroupObjData.id,
      name: value
    }).then(() => {
      materialgroupObjData.name = value
      const index = materialgroupObjData.index
      materialgroupList.value[index] = materialgroupObjData
    })
  } catch {
    // User cancelled
  }
}

const materialgroupAdd = async () => {
  try {
    const { value } = await ElMessageBox.prompt('请输入分组名', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
    materialgroupAddApi({
      name: value
    }).then(() => {
      materialgroupPage()
    })
  } catch {
    // User cancelled
  }
}

const tabClick = (tab) => {
  urls.value = []
  const index = Number(tab.index)
  const materialgroupObjData = materialgroupList.value[index]
  materialgroupObjData.index = index
  materialgroupObj.value = materialgroupObjData
  materialgroupObjId.value = materialgroupObjData.id
  page.currentPage = 1
  page.total = 0
  if (materialgroupObjData.id != '-1') {
    groupId.value = materialgroupObjData.id
  } else {
    groupId.value = null
  }
  fetchPage(page)
}

const fetchPage = (pageParams) => {
  tableLoading.value = true
  getPage(Object.assign({
    page: page.currentPage - 1,
    size: page.pageSize,
    descs: page.descs,
    ascs: page.ascs,
    sort: 'create_time,desc'
  }, {
    groupId: groupId.value
  })).then(response => {
    const tableDataRes = response.content
    page.total = response.totalElements
    page.currentPage = page.currentPage
    page.pageSize = page.pageSize
    tableData.value = tableDataRes
    tableLoading.value = false
  }).catch(() => {
    tableLoading.value = false
  })
}

const sizeChange = (val) => {
  console.log(val)
  page.currentPage = 1
  page.pageSize = val
  fetchPage(page)
}

const pageChange = (val) => {
  console.log(val)
  page.currentPage = val
  fetchPage(page)
}

const materialRename = async (item) => {
  try {
    const { value } = await ElMessageBox.prompt('请输入素材名', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputValue: item.name
    })
    putObj({
      id: item.id,
      name: value
    }).then(() => {
      fetchPage(page)
    })
  } catch {
    // User cancelled
  }
}

const materialUrl = async (item) => {
  try {
    await ElMessageBox.prompt('素材链接', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputValue: item.url
    })
  } catch {
    // User cancelled
  }
}

const materialDel = async (item) => {
  try {
    await ElMessageBox.confirm('是否确认删除该素材？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    delObj(item.id).then(() => {
      fetchPage(page)
    })
  } catch {
    // User cancelled
  }
}

const handleCommand = (command) => {
  const s = command.split('-')
  putObj({
    id: s[0],
    groupId: s[1]
  }).then(() => {
    fetchPage(page)
  })
}

const handleProgress = (event, file, fileList) => {
  console.log(event)
}

const handleSuccess = (response, file, fileList) => {
  uploadProgress.value = 0
  addObj({
    type: '1',
    groupId: groupId.value != '-1' ? groupId.value : null,
    name: file.name,
    url: response.link
  }).then(() => {
    resultNumber.value++
    if (fileList.length === resultNumber.value) {
      fetchPage(page)
      resultNumber.value = 0
    }
  })
}

const uploadProgress = ref(0)

const beforeUpload = (file) => {
  const isPic =
    file.type === 'image/jpeg' ||
    file.type === 'image/png' ||
    file.type === 'image/gif' ||
    file.type === 'image/jpg'
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isPic) {
    ElMessage.error('上传图片只能是 JPG、JPEG、PNG、GIF 格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('上传头像图片大小不能超过 2MB!')
  }
  return isPic && isLt2M
}

const sureUrls = () => {
  const valueArray = [...props.modelValue]
  urls.value.forEach(item => {
    valueArray.push(item)
  })
  emit('update:modelValue', valueArray)
  listDialogVisible.value = false
}
</script>

<style lang="scss" scoped>
:deep(.el-upload-list__item .el-icon) {
  color: red;
}
.material-name{
  padding: 8px 0px;
}
.col-do{
  text-align: center;
}
.button-do{
  padding: unset!important;
  font-size: 12px;
}
</style>
