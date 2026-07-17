<template>
  <div class="app-container">
    <el-row :gutter="15">
      <el-col style="margin-bottom: 10px">
        <el-card class="box-card" shadow="never">
          <template #header>
            <span class="role-span">字段配置：{{ tableName }}</span>
            <el-button
              :loading="genLoading"
              :icon="Promotion"
              size="small"
              style="float: right; padding: 6px 9px;"
              type="success"
              @click="toGen"
            >保存&生成</el-button>
            <el-button
              :loading="columnLoading"
              :icon="Check"
              size="small"
              style="float: right; padding: 6px 9px;margin-right: 9px"
              type="primary"
              @click="saveColumnConfig"
            >保存</el-button>
            <el-tooltip class="item" effect="dark" content="数据库中表字段变动时使用该功能" placement="top-start">
              <el-button
                :loading="syncLoading"
                :icon="Refresh"
                size="small"
                style="float: right; padding: 6px 9px;"
                type="info"
                @click="sync"
              >同步</el-button>
            </el-tooltip>
          </template>
          <el-form size="small" label-width="90px">
            <el-table v-loading="loading" :data="data" :max-height="tableHeight" size="small" style="width: 100%;margin-bottom: 15px">
              <el-table-column prop="columnName" label="字段名称" />
              <el-table-column prop="columnType" label="字段类型" />
              <el-table-column prop="remark" label="字段描述">
                <template #default="scope">
                  <el-input v-model="data[scope.$index].remark" size="small" class="edit-input" />
                </template>
              </el-table-column>
              <el-table-column align="center" label="必填" width="70px">
                <template #default="scope">
                  <el-checkbox v-model="data[scope.$index].notNull" />
                </template>
              </el-table-column>
              <el-table-column align="center" label="列表" width="70px">
                <template #default="scope">
                  <el-checkbox v-model="data[scope.$index].listShow" />
                </template>
              </el-table-column>
              <el-table-column align="center" label="表单" width="70px">
                <template #default="scope">
                  <el-checkbox v-model="data[scope.$index].formShow" />
                </template>
              </el-table-column>
              <el-table-column label="表单类型">
                <template #default="scope">
                  <el-select v-model="data[scope.$index].formType" filterable class="edit-input" clearable size="small" placeholder="请选择">
                    <el-option
                      label="文本框"
                      value="Input"
                    />
                    <el-option
                      label="文本域"
                      value="Textarea"
                    />
                    <el-option
                      label="单选框"
                      value="Radio"
                    />
                    <el-option
                      label="下拉框"
                      value="Select"
                    />
                    <el-option
                      label="日期框"
                      value="Date"
                    />
                    <el-option
                      label="图片文件"
                      value="Imges"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="查询方式">
                <template #default="scope">
                  <el-select v-model="data[scope.$index].queryType" filterable class="edit-input" clearable size="small" placeholder="请选择">
                    <el-option label="=" value="=" />
                    <el-option label="!=" value="!=" />
                    <el-option label=">=" value=">=" />
                    <el-option label="<=" value="<=" />
                    <el-option label="Like" value="Like" />
                    <el-option label="NotNull" value="NotNull" />
                    <el-option label="BetWeen" value="BetWeen" />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="日期注解">
                <template #default="scope">
                  <el-select v-model="data[scope.$index].dateAnnotation" filterable class="edit-input" clearable size="small" placeholder="请选择">
                    <el-option label="自动创建时间" value="CreationTimestamp" />
                    <el-option label="自动更新时间" value="UpdateTimestamp" />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="关联字典">
                <template #default="scope">
                  <el-select v-model="data[scope.$index].dictName" filterable class="edit-input" clearable size="small" placeholder="请选择">
                    <el-option v-for="item in dicts" :key="item.id" :label="item.remark === '' ? item.name : item.remark" :value="item.name" />
                  </el-select>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </el-card>
      </el-col>
      <el-col>
        <el-card class="box-card" shadow="never">
          <template #header>
            <span class="role-span">生成配置</span>
            <el-button
              :loading="configLoading"
              :icon="Check"
              size="small"
              style="float: right; padding: 6px 9px"
              type="primary"
              @click="doSubmit"
            >保存</el-button>
          </template>
          <el-form ref="formRef" :model="form" :rules="rules" size="small" label-width="78px">
            <el-form-item label="作者名称" prop="author">
              <el-input v-model="form.author" style="width: 40%" />
              <span style="color: #C0C0C0;margin-left: 10px;">类上面的作者名称</span>
            </el-form-item>
            <el-form-item label="模块名称" prop="moduleName">
              <el-input v-model="form.moduleName" style="width: 40%" />
              <span style="color: #C0C0C0;margin-left: 10px;">模块的名称，请选择项目中已存在的模块</span>
            </el-form-item>
            <el-form-item label="至于包下" prop="pack">
              <el-input v-model="form.pack" style="width: 40%" />
              <span style="color: #C0C0C0;margin-left: 10px;">项目包的名称，生成的代码放到哪个包里面</span>
            </el-form-item>
            <el-form-item label="接口名称" prop="apiAlias">
              <el-input v-model="form.apiAlias" style="width: 40%" />
              <span style="color: #C0C0C0;margin-left: 10px;">接口的名称，用于控制器与接口文档中</span>
            </el-form-item>
            <el-form-item label="前端路径" prop="path">
              <el-input v-model="form.path" style="width: 40%" />
              <span style="color: #C0C0C0;margin-left: 10px;">输入views文件夹下的目录，不存在即创建</span>
            </el-form-item>
            <el-form-item label="去表前缀" prop="prefix">
              <el-input v-model="form.prefix" placeholder="默认不去除表前缀" style="width: 40%" />
              <span style="color: #C0C0C0;margin-left: 10px;">默认不去除表前缀，可自定义</span>
            </el-form-item>
            <el-form-item label="是否覆盖" prop="cover">
              <el-radio-group v-model="form.cover" size="small" style="width: 40%">
                <el-radio-button label="true">是</el-radio-button>
                <el-radio-button label="false">否</el-radio-button>
              </el-radio-group>
              <span style="color: #C0C0C0;margin-left: 10px;">谨防误操作，请慎重选择</span>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import crud from '@/mixins/crud'
import { update, get } from '@/api/generator/genConfig'
import { save, sync, generator } from '@/api/generator/generator'
import { getDicts } from '@/api/system/dict'
import { ElMessage } from 'element-plus'

defineOptions({
  name: 'GeneratorConfig'
})

const route = useRoute()

const activeName = ref('first')
const tableName = ref('')
const tableHeight = ref(550)
const columnLoading = ref(false)
const configLoading = ref(false)
const dicts = ref([])
const syncLoading = ref(false)
const genLoading = ref(false)
const loading = ref(false)
const formRef = ref(null)

const form = reactive({
  id: null,
  tableName: '',
  author: '',
  pack: '',
  path: '',
  moduleName: '',
  cover: 'false',
  apiPath: '',
  prefix: '',
  apiAlias: null
})

const rules = {
  author: [
    { required: true, message: '作者不能为空', trigger: 'blur' }
  ],
  pack: [
    { required: true, message: '包路径不能为空', trigger: 'blur' }
  ],
  moduleName: [
    { required: true, message: '包路径不能为空', trigger: 'blur' }
  ],
  path: [
    { required: true, message: '前端路径不能为空', trigger: 'blur' }
  ],
  apiAlias: [
    { required: true, message: '接口名称不能为空', trigger: 'blur' }
  ],
  cover: [
    { required: true, message: '不能为空', trigger: 'blur' }
  ]
}

// Mixin properties - extracted from crud mixin
const data = ref([])

// Mixin methods
const beforeInit = () => {
  return true
}

const init = () => {
  // This would typically refresh data
  loading.value = true
  // Simulate loading
  setTimeout(() => {
    loading.value = false
  }, 100)
}

const notify = (message, type) => {
  ElMessage({
    message,
    type: type === 'success' ? 'success' : 'error'
  })
}

onMounted(() => {
  tableHeight.value = document.documentElement.clientHeight - 385
  tableName.value = route.params.tableName

  nextTick(() => {
    init()
    get(tableName.value).then(resData => {
      Object.assign(form, resData)
      form.cover = form.cover.toString()
    })
    getDicts().then(resData => {
      dicts.value = resData
    })
  })
})

const saveColumnConfig = () => {
  columnLoading.value = true
  save(data.value).then(() => {
    notify('保存成功', 'success')
    columnLoading.value = false
  }).catch(err => {
    columnLoading.value = false
    console.log(err.response?.data?.message)
  })
}

const doSubmit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      configLoading.value = true
      form.apiPath = ''
      update(form).then(res => {
        notify('保存成功', 'success')
        Object.assign(form, res)
        form.cover = form.cover.toString()
        configLoading.value = false
      }).catch(err => {
        configLoading.value = false
        console.log(err.response?.data?.message)
      })
    }
  })
}

const syncColumns = () => {
  syncLoading.value = true
  sync([tableName.value]).then(() => {
    init()
    notify('同步成功', 'success')
    syncLoading.value = false
  }).catch(() => {
    syncLoading.value = false
  })
}

const toGen = () => {
  genLoading.value = true
  save(data.value).then(() => {
    notify('保存成功', 'success')
    // 生成代码
    generator(tableName.value, 0).then(() => {
      genLoading.value = false
      notify('生成成功', 'success')
    }).catch(err => {
      genLoading.value = false
      console.log(err.response?.data?.message)
    })
  }).catch(err => {
    genLoading.value = false
    console.log(err.response?.data?.message)
  })
}

defineExpose({
  data,
  form,
  notify
})
</script>

<style rel="stylesheet/scss" lang="scss">
.edit-input {
  .el-input__inner {
    border: 1px solid #e5e6e7;
  }
}
</style>

<style scoped>
:deep(.input-with-select .el-input-group__prepend) ) {
  background-color: #fff;
}
</style>
