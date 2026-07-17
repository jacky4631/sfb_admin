import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/mwStoreSeckill',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/mwStoreSeckill/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/mwStoreSeckill',
    method: 'put',
    data
  })
}

export function getSecKillInfo(id) {
  return request({
    url: 'api/mwStoreSecKill/info/' + id,
    method: 'get'
  })
}
