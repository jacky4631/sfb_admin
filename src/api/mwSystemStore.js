import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/mwSystemStore',
    method: 'post',
    data
  })
}

export function get() {
  return request({
    url: 'api/mwSystemStore',
    method: 'get'
  })
}

export function getAll() {
  return request({
    url: 'api/mwSystemStore/all',
    method: 'get'
  })
}

export function getL(data) {
  return request({
    url: 'api/mwSystemStore/getL',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/mwSystemStore/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/mwSystemStore',
    method: 'put',
    data
  })
}

export default { getL, add, edit, del, get, getAll }
