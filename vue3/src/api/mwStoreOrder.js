import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/mwStoreOrder',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/mwStoreOrder/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/mwStoreOrder',
    method: 'put',
    data
  })
}

export function updateDelivery(data) {
  return request({
    url: 'api/mwStoreOrder/updateDelivery',
    method: 'put',
    data
  })
}

export function editT(data) {
  return request({
    url: 'api/mwStoreOrder/check',
    method: 'put',
    data
  })
}

export function refund(data) {
  return request({
    url: 'api/mwStoreOrder/refund',
    method: 'post',
    data
  })
}

export function editOrder(data) {
  return request({
    url: 'api/mwStoreOrder/edit',
    method: 'post',
    data
  })
}

export function remark(data) {
  return request({
    url: 'api/mwStoreOrder/remark',
    method: 'post',
    data
  })
}

export function get() {
  return request({
    url: 'api/mwExpress',
    method: 'get'
  })
}

export function express(data) {
  return request({
    url: 'api/mwStoreOrder/express',
    method: 'post',
    data
  })
}

export function getOrderDetail(id) {
  return request({
    url: 'api/getStoreOrderDetail/' + id,
    method: 'get'
  })
}

export function getNowOrderStatus(id) {
  return request({
    url: '/api/getNowOrderStatus/' + id,
    method: 'get'
  })
}
