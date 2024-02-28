import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/mwWechatTemplate',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/mwWechatTemplate/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/mwWechatTemplate',
    method: 'put',
    data
  })
}

export function get() {
  return request({
    url: 'api/mwWechatTemplate',
    method: 'get'
  })
}

