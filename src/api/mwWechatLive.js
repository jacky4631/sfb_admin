import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/mwWechatLive',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/mwWechatLive/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/mwWechatLive',
    method: 'put',
    data
  })
}

export function sync() {
  return request({
    url: 'api/mwWechatLive/synchro',
    method: 'get'
  })
}

export function addGoods(data) {
  return request({
    url: 'api/mwWechatLive/addGoods',
    method: 'post',
    data
  })
}
export default { add, edit, del, sync, addGoods }
