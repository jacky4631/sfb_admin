import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/mwUserExtract',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/mwUserExtract/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/mwUserExtract',
    method: 'put',
    data
  })
}

export function extracts(data) {
  return request({
    url: 'api/mwUserExtracts',
    method: 'put',
    data
  })
}
export function addInvalidExtract(data) {
  return request({
    url: 'api/extract/ban',
    method: 'post',
    data
  })
}
export function delInvalidExtract(uid) {
  return request({
    url: 'api/extract/ban/' + uid,
    method: 'delete'
  })
}

export function getExtractConfig() {
  return request({
    url: 'api/extract/config',
    method: 'get'
  })
}

export function editExtractConfig(data) {
  return request({
    url: 'api/extract/config',
    method: 'post',
    data
  })
}
