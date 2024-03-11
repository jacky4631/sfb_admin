import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/mwUser',
    method: 'post',
    data
  })
}

export function del(uid) {
  return request({
    url: 'api/mwUser/' + uid,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/mwUser',
    method: 'put',
    data
  })
}

export function onStatus(id, data) {
  return request({
    url: 'api/mwUser/onStatus/' + id,
    method: 'post',
    data
  })
}

export function editp(data) {
  return request({
    url: 'api/mwUser/money',
    method: 'post',
    data
  })
}
export function edite(data) {
  return request({
    url: 'api/mwUser/energy',
    method: 'post',
    data
  })
}
export function editi(data) {
  return request({
    url: 'api/mwUser/integral',
    method: 'post',
    data
  })
}
export function deleteWechat(uid, data) {
  return request({
    url: 'api/mwUser/wechat/' + uid,
    method: 'delete',
    data
  })
}
export function deleteAli(uid, data) {
  return request({
    url: 'api/mwUser/ali/' + uid,
    method: 'delete',
    data
  })
}
export function resetRefund(uid, data) {
  return request({
    url: 'api/mwUser/reset/refund/' + uid,
    method: 'post',
    data
  })
}
export function getSpread(data) {
  return request({
    url: 'api/mwUser/spread',
    method: 'post',
    data
  })
}
export function getCode(uid, data) {
  return request({
    url: 'api/mwUser/bank/bind/' + uid,
    method: 'post',
    data
  })
}
export function bankBind(uid, data) {
  return request({
    url: 'api/mwUser/bank/bind/confirm/' + uid,
    method: 'post',
    data
  })
}
export function extract(uid, data) {
  return request({
    url: 'api/mwUser/extract/' + uid,
    method: 'post',
    data
  })
}
export function getUserExtra(uid) {
  return request({
    url: 'api/mwUserExtra/' + uid,
    method: 'get'
  })
}
export function setHbUnlockConfig(data) {
  return request({
    url: 'api/order/unlock/config',
    method: 'post',
    data
  })
}
export function getHbUnlockConfig() {
  return request({
    url: 'api/order/unlock/config',
    method: 'get'
  })
}

export function setAppDataConfig(data) {
  return request({
    url: 'api/app/data/config',
    method: 'post',
    data
  })
}
export function getAppDataConfig() {
  return request({
    url: 'api/app/data/config',
    method: 'get'
  })
}

export function setAppShareConfig(data) {
  return request({
    url: 'api/app/share/config',
    method: 'post',
    data
  })
}
export function getAppShareConfig() {
  return request({
    url: 'api/app/share/config',
    method: 'get'
  })
}
