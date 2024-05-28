/**
 * Created by shenji on 2022/08/30.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
export function tbOrderStatusParse(status) {
  switch (status) {
    case 3:
      return '订单结算'
    case 12:
      return '订单付款'
    case 13:
      return '订单失效'
    case 14:
      return '订单成功'
    default:
      return ''
  }
}
export function jdOrderStatusParse(status) {
  switch (status) {
    case 17:
      return '已完成'
    case 16:
      return '订单付款'
    case 15:
      return '待付款'
    default:
      return '订单失效'
  }
}
export function pddOrderStatusParse(status) {
  switch (status) {
    case -1:
      return '未支付'
    case 0:
      return '已支付'
    case 1:
      return '已成团'
    case 2:
      return '确认收货'
    case 3:
      return '审核成功'
    case 4:
      return '审核失败'
    case 5:
      return '已经结算'
    case 8:
      return '非多多进宝商品'
    default:
      return '未知'
  }
}
export function refundStatus(refundTag) {
  return refundTag === 1 ? '是' : ''
}

export function isCash(cash) {
  return cash === 1 ? '是' : '否'
}
export function isBinding(binding) {
  if (binding === 1) {
    return '已拆'
  } else if (binding === 2) {
    return '退款'
  } else if (binding === 3) {
    return '失效'
  }
  return '未拆'
}
export function mtItemStatusParse(status) {
  switch (status) {
    case 0:
      return '未使用'
    case 1:
      return '已使用'
    case 2:
      return '退款中'
    case 3:
      return '已退款'
    case 5:
      return '已消费退款'
    default:
      return ''
  }
}
export function mtItemBizStatusParse(status) {
  switch (status) {
    case 1:
      return '支付成功'
    case 2:
      return '核销成功'
    case 3:
      return '结算成功'
    case 99:
      return '无效订单'
    case 999:
      return '未知状态'
    default:
      return ''
  }
}
export function getTypeOptions() {
  return [
    { key: 0, label: 'iOS支付', parent: ['iospay'] },
    { key: 1, label: '支付宝-原生', parent: ['alipay'] },
    { key: 2, label: '支付宝-三方', parent: ['alipay', 'allinpay', 'adapay', 'ysepay'] },
    { key: 6, label: '微信支付-原生', parent: ['wechatpay'] },
    { key: 7, label: '微信支付-三方', parent: ['wechatpay'] },
    { key: 12, label: '银行卡-快捷支付', parent: ['yeepay'] },
    { key: 13, label: '银行卡-绑卡支付', parent: ['ysepay'] }
  ]
}
export function getChannelKeyOptions() {
  return [
    { key: 'wechatpay', label: '微信', parent: [6] },
    { key: 'alipay', label: '支付宝', parent: [1] },
    { key: 'alipayweb', label: '支付宝网页', parent: [2] },
    { key: 'adapay', label: '汇付天下', parent: [2] },
    { key: 'yeepay_bank', label: '易宝银行卡快捷', parent: [12] },
    { key: 'ysepay_bank_bind', label: '银盛银行卡绑卡', parent: [13] },
    { key: 'ysepay', label: '银盛支付宝', parent: [2] },
    { key: 'iospay', label: 'iOS内购', parent: [0] },
    { key: 'allinpay', label: '通联支付', parent: [2] }
  ]
}
export function getTypeLabel(type) {
  const typeCur = getTypeOptions().filter((typeObj) => {
    return typeObj['key'] === type
  })
  if (typeCur != null && typeCur.length > 0) {
    return typeCur[0]['label']
  }
  return '未知'
}
export function getChannelLabel(key) {
  const channelCur = getChannelKeyOptions().filter((typeObj) => {
    return typeObj['key'] === key
  })
  if (channelCur != null && channelCur.length > 0) {
    return channelCur[0]['label']
  }
  return '未知'
}
