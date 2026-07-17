import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/mwStoreVisit',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/mwStoreVisit/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/mwStoreVisit',
    method: 'put',
    data
  })
}
