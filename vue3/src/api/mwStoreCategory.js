import request from '@/utils/request'

export function getCates(params) {
  return request({
    url: 'api/mwStoreCategory',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/mwStoreCategory',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/mwStoreCategory/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/mwStoreCategory',
    method: 'put',
    data
  })
}

export default { add, edit, del, getCates }
