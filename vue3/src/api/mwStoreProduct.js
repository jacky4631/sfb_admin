import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/mwStoreProduct/addOrSave',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/mwStoreProduct/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/mwStoreProduct',
    method: 'put',
    data
  })
}

export function onsale(id, data) {
  return request({
    url: 'api/mwStoreProduct/onsale/' + id,
    method: 'post',
    data
  })
}

export function recovery(id) {
  return request({
    url: 'api/mwStoreProduct/recovery/' + id,
    method: 'delete'
  })
}

export function isFormatAttr(id, data) {
  return request({
    url: 'api/mwStoreProduct/isFormatAttr/' + id,
    method: 'post',
    data
  })
}

export function isFormatAttrForActivity(id, data) {
  return request({
    url: 'api/mwStoreProduct/isFormatAttrForActivity/' + id,
    method: 'post',
    data
  })
}
export function setAttr(id, data) {
  return request({
    url: 'api/mwStoreProduct/setAttr/' + id,
    method: 'post',
    data
  })
}

export function clearAttr(id) {
  return request({
    url: 'api/mwStoreProduct/clearAttr/' + id,
    method: 'post'
  })
}

export function getAttr(id) {
  return request({
    url: 'api/mwStoreProduct/attr/' + id,
    method: 'get'
  })
}

export function getInfo(id) {
  return request({
    url: 'api/mwStoreProduct/info/' + id,
    method: 'get'
  })
}
