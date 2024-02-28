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
