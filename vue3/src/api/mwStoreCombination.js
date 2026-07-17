import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/mwStoreCombination',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: 'api/mwStoreCombination',
    method: 'put',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/mwStoreCombination/' + id,
    method: 'delete'
  })
}

export function getCombinationInfo(id) {
  return request({
    url: 'api/mwStoreCombination/info/' + id,
    method: 'get'
  })
}

export function onsale(id, data) {
  return request({
    url: 'api/mwStoreCombination/onsale/' + id,
    method: 'post',
    data
  })
}
