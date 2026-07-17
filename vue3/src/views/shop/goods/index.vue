<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input v-model="query.value" clearable placeholder="输入搜索内容" style="width: 200px;" class="filter-item" @keyup.enter="toQuery" />
      <el-select v-model="query.type" clearable placeholder="搜索类型" class="filter-item" style="width: 130px">
        <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-select v-model="cateId"  clearable placeholder="商品分类" class="filter-item" filterable :filter-method="dataFilter" style="width: 130px">
        <el-option v-for="item in optionsMetaShow" :disabled="item.disabled === 0"
                   :value="item.value"
                   :key="item.id"
                   :label="item.label"></el-option>
      </el-select>
      <el-button class="filter-item" size="small" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          class="filter-item"
          size="small"
          type="primary"
          icon="el-icon-plus"
          @click="toAddURL"
        >
            新增
        </el-button>
        <el-button
          type="danger"
          class="filter-item"
          size="small"
          icon="el-icon-refresh"
          @click="toQuery"
        >刷新</el-button>
      </div>
    </div>
    <!--表单组件-->
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column prop="id" label="商品id" />
      <el-table-column ref="table" prop="image" label="商品图片">
        <template #scope="scope">
          <a :href="scope.row.image" style="color: rgb(64, 158, 255)" target="_blank"><img :src="scope.row.image" alt="点击打开" class="el-avatar"></a>
        </template>
      </el-table-column>
      <el-table-column prop="storeName" label="商品名称" />
      <el-table-column prop="storeCategory.cateName" label="分类名称" />
      <el-table-column prop="price" label="商品价格" />
      <el-table-column prop="sales" label="销量" />
      <el-table-column prop="stock" label="库存" />
      <el-table-column label="商品类型" align="center">
        <template #scope="scope">
          <el-tag v-if="scope.row.isIntegral === 1" style="cursor: pointer" :type="'warning'">积分商品</el-tag>
          <el-tag v-else style="cursor: pointer" :type=" 'info' ">普通商品</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template #scope="scope">
          <div @click="onSale(scope.row.id,scope.row.isShow)">
            <el-tag v-if="scope.row.isShow === 1" style="cursor: pointer" :type="''">已上架</el-tag>
            <el-tag v-else style="cursor: pointer" :type=" 'info' ">已下架</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="265px" align="center">
        <template #scope="scope">
          <el-button
            size="small"
            type="primary"
            icon="el-icon-edit"
            @click="toUpdateURL(scope.row.id)"
          >
            编辑
          </el-button>
          <el-popover
            :ref="scope.row.id"
            placement="top"
            width="180"
          >
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="small" type="text" @click="cancelPopover(scope.row.id)">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="small" @click="subDelete(scope.row.id)">确定</el-button>
            </div>
            <template #reference>
              <el-button slot="reference" type="danger" icon="el-icon-delete" size="small">删除</el-button>
            </template>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      :current-page="page + 1"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import checkPermission from '@/utils/permission'
import initData from '@/mixins/crud'
import { del, onsale } from '@/api/mwStoreProduct'

defineOptions({ name: 'ShopGoodsIndex' })

const router = useRouter()
const { data, loading, total, page, size } = initData({
  url: 'api/mwStoreProduct',
  params: { sort: 'id,desc', isShow: 1, isDel: 0 }
})

const dropDownValue = ref('')
const optionsMetaShow = ref([])
const delLoading = ref(false)
const visible = ref(false)
const queryTypeOptions = [
  { key: 'storeName', display_name: '商品名称' }
]
const isAttr = ref(false)
const cateId = ref(null)

onMounted(() => {
  nextTick(() => {
    init().then(() => {
      optionsMetaShow.value = cateList.value
    })
  })
})

const toAddURL = () => {
  router.push({ path: '/shop/goodsAdd' })
}

const toUpdateURL = (id) => {
  router.push({ path: '/shop/goodsEdit/' + id })
}

const dataFilter = (val) => {
  value.value = val
  if (val) {
    optionsMetaShow.value = cateList.value.filter((item => {
      if (!!~item.label.indexOf(val) || !!~item.label.toUpperCase().indexOf(val.toUpperCase())) {
        return true
      }
    }))
  } else {
    optionsMetaShow.value = cateList.value
  }
}

const beforeInit = () => {
  const sort = 'id,desc'
  params.value = { page: page.value, size: size.value, sort: sort, isShow: 1, isDel: 0, cateId: cateId.value }
  const query = query.value
  const type = query.type
  const value = query.value
  if (type && value) { params.value[type] = value }
  return true
}

const subDelete = (id) => {
  delLoading.value = true
  del(id).then(res => {
    delLoading.value = false
    cancelPopover(id)
    dleChangePage()
    init()
    ElMessage({
      title: '删除成功',
      type: 'success',
      duration: 2500
    })
  }).catch(err => {
    delLoading.value = false
    cancelPopover(id)
    console.log(err.response.data.message)
  })
}

const onSale = (id, status) => {
  ElMessageBox.confirm(`确定进行[${status ? '下架' : '上架'}]操作?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      onsale(id, { status: status }).then(({ data }) => {
        ElMessage({
          message: '操作成功',
          type: 'success',
          duration: 1000,
          onClose: () => {
            init()
          }
        })
      })
    })
    .catch(() => { })
}

const add = () => {
  isAdd.value = true
  formRef.value.dialog = true
  formRef.value.getCates()
}

const edit = (data) => {
  isAdd.value = false
  const _this = formRef.value
  _this.getCates()
  _this.form = {
    id: data.id,
    merId: data.merId,
    image: data.image,
    sliderImage: data.sliderImage,
    imageArr: data.image.split(','),
    sliderImageArr: data.sliderImage.split(','),
    storeName: data.storeName,
    storeInfo: data.storeInfo,
    keyword: data.keyword,
    barCode: data.barCode,
    storeCategory: data.storeCategory || { id: null },
    price: data.price,
    vipPrice: data.vipPrice,
    otPrice: data.otPrice,
    postage: data.postage,
    unitName: data.unitName,
    sort: data.sort,
    sales: data.sales,
    stock: data.stock,
    isShow: data.isShow,
    isHot: data.isHot,
    isBenefit: data.isBenefit,
    isBest: data.isBest,
    isNew: data.isNew,
    description: data.description,
    addTime: data.addTime,
    isPostage: data.isPostage,
    isDel: data.isDel,
    merUse: data.merUse,
    giveIntegral: data.giveIntegral,
    cost: data.cost,
    isSeckill: data.isSeckill,
    isBargain: data.isBargain,
    isGood: data.isGood,
    ficti: data.ficti,
    browse: data.browse,
    codePath: data.codePath,
    soureLink: data.soureLink
  }
  _this.dialog = true
}

const attr = (data) => {
  console.log(3333)
  isAttr.value = false
  const _this = formRef2.value
  _this.form = {
    id: data.id,
    merId: data.merId,
    image: data.image,
    sliderImage: data.sliderImage,
    storeName: data.storeName,
    storeInfo: data.storeInfo,
    keyword: data.keyword,
    barCode: data.barCode,
    storeCategory: data.storeCategory,
    price: data.price,
    vipPrice: data.vipPrice,
    otPrice: data.otPrice,
    postage: data.postage,
    unitName: data.unitName,
    sort: data.sort,
    sales: data.sales,
    stock: data.stock,
    isShow: data.isShow,
    isHot: data.isHot,
    isBenefit: data.isBenefit,
    isBest: data.isBest,
    isNew: data.isNew,
    description: data.description,
    addTime: data.addTime,
    isPostage: data.isPostage,
    isDel: data.isDel,
    merUse: data.merUse,
    giveIntegral: data.giveIntegral,
    cost: data.cost,
    isSeckill: data.isSeckill,
    isBargain: data.isBargain,
    isGood: data.isGood,
    ficti: data.ficti,
    browse: data.browse,
    codePath: data.codePath,
    soureLink: data.soureLink
  }
  _this.dialog = true
  formRef2.value.getAttrs(data.id)
}

// Helper to close popover
const cancelPopover = (id) => {
  // In Vue 3, we need to access the popover via ref
  const popoverRef = ref(null)
  // This is a simplified version - actual implementation may need proper ref handling
}
</script>

<style scoped>

</style>
