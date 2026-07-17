import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/mwExpress',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/mwExpress/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/mwExpress',
    method: 'put',
    data
  })
}

