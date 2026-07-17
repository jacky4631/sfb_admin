import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/mwStoreCouponUser',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/mwStoreCouponUser/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/mwStoreCouponUser',
    method: 'put',
    data
  })
}
