import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/mwStoreBargainUser',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/mwStoreBargainUser/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/mwStoreBargainUser',
    method: 'put',
    data
  })
}
