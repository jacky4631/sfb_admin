import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/mwWechatLiveGoods',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/mwWechatLiveGoods/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/mwWechatLiveGoods',
    method: 'put',
    data
  })
}
export function sync(ids) {
  return request({
    url: 'api/mwWechatLiveGoods/synchro',
    method: 'post',
    data: ids
  })
}
export default { add, edit, del, sync }
