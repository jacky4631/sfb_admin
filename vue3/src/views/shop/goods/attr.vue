<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" v-model="dialogRef" :title="title" width="900px">
    <el-form v-show="hidden == false" ref="formRef" :model="form" :inline="true" :rules="rules" label-width="80px">
      <el-form-item label="规则名称">
        <el-row :gutter="10">
          <el-col :span="10"><el-button type="primary" @click="hiddenBool">添加新规则</el-button></el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <el-form v-show="hidden == true" ref="formRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="规则名称">
        <el-row :gutter="10">
          <el-col
            v-for="(item, index) in items"
            :key="index"
            :span="5"
            style="position: relative;margin-right: 6px"
          >
            <el-input v-model="item.value" style="width: 150px;" placeholder="设置名称" />
            <el-button v-show="item.attrHidden == true" link style="position: absolute;top:-6px;right:17px;margin-top:1px;border: none;font-size: 14px;font-weight:bold;line-height: 1.8" :icon="Close" @click="handleRemove(index)" />
            <el-button v-show="item.attrHidden == false" link style="position: absolute;top:-6px;right:17px;margin-top:1px;border: none;font-size: 14px;font-weight:bold;line-height: 1.8" :icon="Check" @click="attrHiddenBool(item)" />
          </el-col>
          <el-col :span="5"><el-button type="primary" @click="handleAdd">添加新规则</el-button></el-col>
        </el-row>
      </el-form-item>
      <el-form-item
        v-for="(item, index) in items"
        v-show="item.attrHidden == true"
        :key="index"
        :label="''+item.value+':'"
      >
        <el-row :gutter="13">
          <el-col
            v-for="(attr,k) in item.detail"
            :key="attr"
            :span="3"
            :name="attr"
          >
            <el-tag closable @close="attrRemove(item,k)">{{ attr }}</el-tag>
          </el-col>
          <el-col :span="5">
            <el-input v-model="item.detailValue" style="width: 150px;" placeholder="设置属性" />
          </el-col>
          <el-col :span="5">
            <el-button type="primary" @click="attrAdd(item)">添加</el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item v-show="hidden == true">
        <el-row :gutter="24">
          <el-col :span="24"><el-button :loading="loading" type="primary" @click="addGoods(true)">生成</el-button></el-col>
        </el-row>
      </el-form-item>

      <template v-if="items[0].value!='' && items[0].detail.length>0 && attrs.length">
        <template v-for="(attr,index) in attrs">
          <el-form-item>
            <el-row :gutter="24">
              <template v-for="(item,index) in attr.detail">
                <el-col :span="3" style="margin-right: 2px">
                  {{ index }}:{{ item }}
                </el-col>
              </template>
              <el-col :span="4">
                <span :class="attr.check ? 'check':''">金额:</span>&nbsp;
                <el-input v-model="attr.price" placeholder="金额" style="width: 60%" :number="true" />
              </el-col>
              <el-col :span="4">
                <span :class="attr.check ? 'check':''">库存:</span>&nbsp;
                <el-input v-model="attr.sales" placeholder="库存" style="width: 60%" :number="true" maxlength="7"/>
              </el-col>
              <el-col :span="5">
                <span :class="attr.check ? 'check':''">成本价:</span>&nbsp;
                <el-input v-model="attr.cost" placeholder="成本价" style="width: 60%" :number="true" />
              </el-col>
              <el-col :span="3" style="margin-right: 2px">
                <div class="demo-upload">
                  <pic-upload-two v-model="attr.pic" />
                </div>
              </el-col>
              <el-col :span="2" style="margin-right: 3px">
                <el-button type="primary" @click="removeGoods(index)">删除</el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </template>
        <el-form-item>
          <el-row :gutter="24">
            <el-col :span="2">
              <el-button type="primary" :loading="loading" @click="submit">提交</el-button>
            </el-col>
            <el-col :span="2">
              <el-button type="error" @click="clear">清空所有属性</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </template>

    </el-form>
  </el-dialog>

</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { getCates } from '@/api/mwStoreCategory'
import { add, edit, isFormatAttr, setAttr, clearAttr, getAttr } from '@/api/mwStoreProduct'
import editor from '../../components/Editor'
import picUploadTwo from '@/components/pic-upload-two'
import mulpicUpload from '@/components/mul-pic-upload'
import { ElMessage, ElMessageBox } from 'element-plus'

defineOptions({ name: 'ShopGoodsAttr' })

const props = defineProps({
  isAttr: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['update:visible'])

const loading = ref(false)
const dialogRef = ref(false)
const cates = ref([])
const title = ref('规则属性')
const formRef = ref(null)
const form = reactive({
  id: '',
  merId: '',
  image: '',
  sliderImage: '',
  storeName: '',
  storeInfo: '',
  keyword: '',
  barCode: '',
  cateId: 1,
  price: '',
  vipPrice: '',
  otPrice: '',
  postage: '',
  unitName: '',
  sort: '',
  sales: '',
  stock: '',
  isShow: '',
  isHot: '',
  isBenefit: '',
  isBest: '',
  isNew: '',
  description: '',
  addTime: '',
  isPostage: '',
  isDel: '',
  merUse: '',
  giveIntegral: '',
  cost: '',
  isSeckill: '',
  isBargain: '',
  isGood: '',
  ficti: '',
  browse: '',
  codePath: '',
  soureLink: ''
})
const rules = {}
const items = ref([{
  value: '',
  detailValue: '',
  attrHidden: false,
  detail: []
}])
const attrs = ref([])
const hidden = ref(false)
const attrHidden = ref(false)
const submiting = ref(false)

onMounted(() => {
})

const getAttrs = (id) => {
  getAttr(id).then(res => {
    console.log('res' + res)
    if (res) {
      hidden.value = true
      items.value = res.attr
      attrs.value = res.value
    } else {
      hidden.value = false
      items.value = [{
        value: '',
        detailValue: '',
        attrHidden: false,
        detail: []
      }]
      attrs.value = []
    }
  })
}

const cancel = () => {
  resetForm()
}

const doSubmit = () => {
  loading.value = true
  if (props.isAttr) {
    doAdd()
  } else doEdit()
}

const doAdd = () => {
  add(form).then(res => {
    resetForm()
    emit('update:visible', false)
    loading.value = false
    // Note: $parent.init() would need to be handled differently in Vue 3
  }).catch(err => {
    loading.value = false
    console.log(err.response.data.message)
  })
}

const doEdit = () => {
  edit(form).then(res => {
    resetForm()
    emit('update:visible', false)
    loading.value = false
  }).catch(err => {
    loading.value = false
    console.log(err.response.data.message)
  })
}

const resetForm = () => {
  dialogRef.value = false
  formRef.value?.resetFields()
  Object.assign(form, {
    id: '',
    merId: '',
    image: '',
    sliderImage: '',
    storeName: '',
    storeInfo: '',
    keyword: '',
    barCode: '',
    cateId: '',
    price: '',
    vipPrice: '',
    otPrice: '',
    postage: '',
    unitName: '',
    sort: '',
    sales: '',
    stock: '',
    isShow: '',
    isHot: '',
    isBenefit: '',
    isBest: '',
    isNew: '',
    description: '',
    addTime: '',
    isPostage: '',
    isDel: '',
    merUse: '',
    giveIntegral: '',
    cost: '',
    isSeckill: '',
    isBargain: '',
    isGood: '',
    ficti: '',
    browse: '',
    codePath: '',
    soureLink: ''
  })
}

const setAttrPic = (index, pic) => {
  attrs.value[index].pic = pic
}

const attrHiddenBool = (item) => {
  if (item.value == '') {
    ElMessage({ message: '请填写规则名称', type: 'error' })
  } else {
    item.attrHidden = true
  }
}

const hiddenBool = () => {
  hidden.value = true
}

const handleAdd = () => {
  if (!checkAttr()) return
  items.value.push({
    value: '',
    detailValue: '',
    attrHidden: false,
    detail: []
  })
}

const checkAttr = () => {
  var bool = true
  items.value.map(function (item) {
    if (!bool) return
    if (!item.value) {
      ElMessage({ message: '请填写规则名称', type: 'error' })
      bool = false
    } else if (!item.detail.length) {
      ElMessage({ message: '请设置规则属性', type: 'error' })
      bool = false
    }
  })
  return bool
}

const attrAdd = (item) => {
  if (!item.detailValue) return false
  item.detail.push(item.detailValue)
  item.detailValue = ''
}

const handleRemove = (index) => {
  if (items.value.length > 1) { items.value.splice(index, 1) } else { ElMessage({ message: '请设置至少一个规则', type: 'error' }) }
}

const attrRemove = (item, k) => {
  console.log('item:')
  if (item.detail.length == 1) {
    ElMessage({ message: '请设置至少一个属性', type: 'error' })
    return false
  }
  item.detail.splice(k, 1)
}

const removeGoods = (index) => {
  attrs.value.splice(index, 1)
}

const checkGoods = () => {
  var bool = true
  attrs.value.map(function (attr) {
    if (!bool) return
    if (!Object.keys(attr.detail).length) {
      ElMessage({ message: '请选择至少一个属性', type: 'error' })
      bool = false
    } else if (attr.price != parseFloat(attr.price) || attr.price < 0) {
      ElMessage({ message: '请输入正确的商品价格', type: 'error' })
      bool = false
    } else if (attr.sales != parseInt(attr.sales) || attr.sales < 0) {
      ElMessage({ message: '请输入正确的商品库存', type: 'error' })
      bool = false
    }
  })
  return bool
}

const addGoods = (type) => {
  if (attrs.value.length) {
    if (!checkGoods()) return
  }
  isFormatAttr(form.id, { items: items.value, attrs: attrs.value }).then(res => {
    attrs.value = res
  }).catch(err => {
    loading.value = false
    console.log(err.response.data.message)
  })
}

const submit = () => {
  submiting.value = true
  if (!checkAttr() || !checkGoods()) return
  for (const attr in attrs.value) {
    attrs.value[attr].check = false
  }

  loading.value = false
  setAttr(form.id, { items: items.value, attrs: attrs.value }).then(res => {
    attrs.value = res
    ElMessage({ message: '操作成功', type: 'success' })
  }).catch(err => {
    loading.value = false
    console.log(err.response.data.message)
  })
  dialogRef.value = false
}

const clear = () => {
  ElMessageBox.confirm(`确定要清空属性数据'}]操作?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      clearAttr(form.id).then(({ data }) => {
        ElMessage({ message: '操作成功', type: 'success' })
        getAttrs(form.id)
      })
    })
    .catch(() => { })
}
</script>

<style scoped>

  .demo-upload{
    display: block;
    /*//height: 50px;*/
    text-align: center;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-right: 4px;
  }
  .demo-upload img{
    width: 100%;
    height: 100%;
    display: block;
  }

  .demo-upload-cover{
    display: block;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.6);
  }
  .demo-upload:hover .demo-upload-cover{
    display: block;
  }
  .demo-upload-cover i{
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }

</style>
