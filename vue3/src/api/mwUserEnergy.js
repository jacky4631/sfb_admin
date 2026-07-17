import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/energy/order',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/energy/order',
    method: 'delete',
    data: ids
  })
}
export function delScale(ids) {
  return request({
    url: 'api/energy/orderScale',
    method: 'delete',
    data: ids
  })
}
export function edit(data) {
  return request({
    url: 'api/energy/order',
    method: 'put',
    data
  })
}
export function editScale(data) {
  return request({
    url: 'api/energy/orderScale',
    method: 'put',
    data
  })
}
export function addScale(data) {
  return request({
    url: 'api/energy/orderScale',
    method: 'post',
    data
  })
}
export default { add, edit, del, delScale, editScale, addScale }
