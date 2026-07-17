import request from '@/utils/request'

export function count() {
  return request({
    url: 'api/visits',
    method: 'post'
  })
}

export function get() {
  return request({
    url: 'api/visits',
    method: 'get'
  })
}

export function getChartData() {
  return request({
    url: 'api/visits/chartData',
    method: 'get'
  })
}

export function gett() {
  return request({
    url: 'api/data/count',
    method: 'get'
  })
}
export function getIncomeData() {
  return request({
    url: 'api/data/income',
    method: 'get'
  })
}

export function chart(platform, type) {
  return request({
    url: 'api/data/chart?platform=' + platform + '&type=' + type,
    method: 'get'
  })
}

export function getOrderCount() {
  return request({
    url: 'api/mwStoreOrder/orderCount',
    method: 'get'
  })
}
