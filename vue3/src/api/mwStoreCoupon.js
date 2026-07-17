import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/mwStoreCoupon',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/mwStoreCoupon/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/mwStoreCoupon',
    method: 'put',
    data
  })
}
