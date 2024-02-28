import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/mwStorePink',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/mwStorePink/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/mwStorePink',
    method: 'put',
    data
  })
}
