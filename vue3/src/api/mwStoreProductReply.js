import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/mwStoreProductReply',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/mwStoreProductReply/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/mwStoreProductReply',
    method: 'put',
    data
  })
}
