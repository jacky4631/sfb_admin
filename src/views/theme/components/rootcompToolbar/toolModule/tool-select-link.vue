<template>
  <div class="module-box link-select">
    <div class="module-box__title">
      <label class="module-box__label">{{title}}</label>
    </div>
    <el-select class="link-select__select" :popper-append-to-body="false" v-model="selsectValue" placeholder="请选择跳转到的页面" @change="selectChanged">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <div class="link-select__confirm" v-show="confirmBtnVisible">
      <div class="btn" v-if="!selectName" @click="openDialog">
        <span class="iconfont">&#xe685;</span> 添加{{typeText}}
      </div>
      <div class="info" v-else>
        <span class="text">{{typeText}}</span>
        <span class="name">{{selectName}}</span>
        <span class="iconfont" @click="openDialog">&#xe66c;</span>
        <span class="iconfont" @click="delSelect">&#xe651;</span>
      </div>
    </div>
    <el-dialog width="600px" title="选择类别" v-model="categoryVisible">
      <category-select ref="categorySelect"></category-select>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="categoryVisible = false">取 消</el-button>
          <el-button type="primary" @click="categoryChanged">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog title="选择商品" v-model="productVisible">
      <product-select ref="productSelect"></product-select>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="productVisible = false">取 消</el-button>
          <el-button type="primary" @click="productChanged">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog title="选择店辅" v-model="shopVisible">
      <shop-select ref="shopSelect"></shop-select>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="shopVisible = false">取 消</el-button>
          <el-button type="primary" @click="shopChanged">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import ProductSelect from './product-select.vue'
import ShopSelect from './shop-select.vue'
import CategorySelect from './category-select.vue'

const props = defineProps({
  title: {
    type: String,
    default: '链接'
  },
  linkObj: {
    type: Object,
    default: () => ({
      selsectValue: '',
      selectName: '',
      typeText: '',
      url: ''
    })
  },
  options: {
    type: Array,
    default: () => [
      {
        value: '/index',
        label: '首页'
      },
      {
        value: '/category',
        label: '分类页面'
      },
      {
        value: '/shop',
        label: '店辅主页'
      },
      {
        value: '/detail',
        label: '商品详情'
      }
    ]
  }
})

defineOptions({ name: 'tool-select-link' })

const emit = defineEmits(['update:linkObj'])

const selsectValue = ref('')
const confirmBtnVisible = ref(false)
const selectName = ref('')
const typeText = ref('')
const productVisible = ref(false)
const shopVisible = ref(false)
const categoryVisible = ref(false)

const categorySelect = ref(null)
const productSelect = ref(null)
const shopSelect = ref(null)

onMounted(() => {
  selsectValue.value = props.linkObj.selsectValue
  selectName.value = props.linkObj.selectName
  typeText.value = props.linkObj.typeText
  confirmBtnVisible.value = selsectValue.value !== '/index'
})

watch(() => props.linkObj, (newVal) => {
  selsectValue.value = newVal.selsectValue
  selectName.value = newVal.selectName
  typeText.value = newVal.typeText
  confirmBtnVisible.value = selsectValue.value !== '/index'
}, { deep: true })

// 链接选择
function selectChanged(value) {
  categoryVisible.value = false
  shopVisible.value = false
  productVisible.value = false
  confirmBtnVisible.value = true
  selectName.value = ''
  typeText.value = ''
  switch (value) {
    case '/category':
      typeText.value = '类别'
      break
    case '/shop':
      typeText.value = '店辅'
      break
    case '/detail':
      typeText.value = '商品'
      break
    default:
      confirmBtnVisible.value = false
      const linkObj = {
        selsectValue: selsectValue.value,
        selectName: '',
        typeText: '',
        url: '/'
      }
      emit('update:linkObj', linkObj)
  }
}

// 打开添加弹窗
function openDialog() {
  switch (typeText.value) {
    case '类别':
      categoryVisible.value = true
      break
    case '店辅':
      shopVisible.value = true
      break
    case '商品':
      productVisible.value = true
      break
  }
}

// 类别选择
function categoryChanged() {
  const nodesObj = categorySelect.value.$refs['cascader'].getCheckedNodes()
  if (nodesObj) {
    const data = nodesObj[0].data
    selectName.value = nodesObj[0].label
    categoryVisible.value = false
    const linkObj = {
      selsectValue: selsectValue.value,
      selectName: selectName.value,
      typeText: typeText.value,
      data: data
    }
    emit('update:linkObj', linkObj)
  }
}

// 商品选择
function productChanged() {
  const data = productSelect.value.tableRadio
  productVisible.value = false
  selectName.value = productSelect.value.tableRadio.productName
  const linkObj = {
    selsectValue: selsectValue.value,
    selectName: selectName.value,
    typeText: typeText.value,
    data: data
  }
  emit('update:linkObj', linkObj)
}

// 店辅选择
function shopChanged() {
  const data = shopSelect.value.tableRadio
  shopVisible.value = false
  selectName.value = shopSelect.value.tableRadio.shopName
  const linkObj = {
    selsectValue: selsectValue.value,
    selectName: selectName.value,
    typeText: typeText.value,
    data: data
  }
  emit('update:linkObj', linkObj)
}

// 删除选择
function delSelect() {
  const linkObj = {
    selsectValue: '',
    selectName: '',
    typeText: '',
    data: {}
  }
  emit('update:linkObj', linkObj)
}
</script>

<style lang="scss" scoped>
.link-select{
  &__select{
    width: 100%;
  }
  &__confirm{
    margin-top: 10px;
    .btn{
      text-align: center;
      background-color: $mainColor;
      color: #fff;
      height: 36px;
      line-height: 36px;
      border-radius: 4px;
      cursor: pointer;
    }
    .info{
      height: 36px;
      line-height: 36px;
      border-radius: 4px;
      padding: 0 10px;
      border:1px solid $mainColor;
      display: flex;
      .text{
        color: $mainColor;
      }
      .name{
        flex: 1;
        margin-left: 10px;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
      .iconfont{
        margin-left: 10px;
        cursor: pointer;
        color: #666;
      }
    }
  }
}
</style>
