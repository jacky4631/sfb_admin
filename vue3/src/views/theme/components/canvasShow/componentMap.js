import { defineAsyncComponent } from 'vue'
const componentMap = [
  // 手机端
  new Map([
  ['header', defineAsyncComponent(() => import('@/views/theme/components/canvasShow/mobile/Header.vue'))], // 店铺头部
  ['search', defineAsyncComponent(() => import('@/views/theme/components/canvasShow/mobile/Search.vue'))], // 搜索商品
  ['banner', defineAsyncComponent(() => import('@/views/theme/components/canvasShow/mobile/Banner.vue'))], // 轮播图
  ['noticeBar', defineAsyncComponent(() => import('@/views/theme/components/canvasShow/mobile/NoticeBar.vue'))], // 滚动新闻
  ['menu', defineAsyncComponent(() => import('@/views/theme/components/canvasShow/mobile/Menu.vue'))], // 菜单
  ['adv', defineAsyncComponent(() => import('@/views/theme/components/canvasShow/mobile/Adv.vue'))], // 广告
  ['groupon', defineAsyncComponent(() => import('@/views/theme/components/canvasShow/mobile/Groupon.vue'))], // 超值拼团
  [
    'hotCommodity',
    defineAsyncComponent(() => import('@/views/theme/components/canvasShow/mobile/HotCommodity.vue'))
  ], // 热门榜单
  [
    'firstNewProduct',
    defineAsyncComponent(() => import('@/views/theme/components/canvasShow/mobile/FirstNewProduct.vue'))
  ], // 秒杀
  [
    'productsRecommended',
    defineAsyncComponent(() => import('@/views/theme/components/canvasShow/mobile/ProductsRecommended.vue'))
  ], // 精品推荐
  [
    'promoteProduct',
    defineAsyncComponent(() => import('@/views/theme/components/canvasShow/mobile/PromoteProduct.vue'))
  ], // 促销单品
  ['live', defineAsyncComponent(() => import('@/views/theme/components/canvasShow/mobile/Live.vue'))], // 直播
  [
    'promotionGood',
    defineAsyncComponent(() => import('@/views/theme/components/canvasShow/mobile/PromotionGood.vue'))
  ] // 为您推荐
]),
  // PC
  new Map([
    // pc单商户改版
    ['NavPersonal', defineAsyncComponent(() => import('@/views/theme/components/canvasShow/pc/NavPersonal.vue'))], // 个人中心
    ['NavType', defineAsyncComponent(() => import('@/views/theme/components/canvasShow/pc/NavType.vue'))], // 分类导航
    ['PcBanner', defineAsyncComponent(() => import('@/views/theme/components/canvasShow/pc/Banner.vue'))], // 轮播图
    ['ProductNew', defineAsyncComponent(() => import('@/views/theme/components/canvasShow/pc/ProductNew.vue'))], // 新品首发
    ['ProductHot', defineAsyncComponent(() => import('@/views/theme/components/canvasShow/pc/ProductHot.vue'))], // 人气爆款
    ['ProductSeckill', defineAsyncComponent(() => import('@/views/theme/components/canvasShow/pc/ProductSeckill.vue'))], // 秒杀专区
    ['ProductComb', defineAsyncComponent(() => import('@/views/theme/components/canvasShow/pc/ProductComb.vue'))], // 拼团专区
    ['ProductDiscount', defineAsyncComponent(() => import('@/views/theme/components/canvasShow/pc/ProductDiscount.vue'))], // 折扣专区
    ['ProductBargin', defineAsyncComponent(() => import('@/views/theme/components/canvasShow/pc/ProductBargin.vue'))], // 砍价专区
    ['Footer', defineAsyncComponent(() => import('@/views/theme/components/canvasShow/pc/Footer.vue'))] // 底部版权相关
  ])
]

export default componentMap
