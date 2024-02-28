import request from '@/utils/request'

export function add(data, id) {
  return request({
    url: `api/mwStoreProductRule/save/${id}`,
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/mwStoreProductRule/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/mwStoreProductRule',
    method: 'put',
    data
  })
}

export function info(id) {
  return request({
    url: `api/mwStoreProductRule/rule/${id}`,
    method: 'get'
  })
}

export default { add, edit, del, info }
