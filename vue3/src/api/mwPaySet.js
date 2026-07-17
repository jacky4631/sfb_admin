import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/payset',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/payset/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/payset',
    method: 'put',
    data
  })
}

export function get() {
  return request({
    url: 'api/payset',
    method: 'get'
  })
}

export function getAppPayConfig() {
  return request({
    url: 'api/pay/config',
    method: 'get'
  })
}

export function setAppPayConfig(data) {
  return request({
    url: 'api/pay/config',
    method: 'post',
    data
  })
}
