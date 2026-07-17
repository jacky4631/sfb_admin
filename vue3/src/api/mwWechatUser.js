import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/mwWechatUser',
    method: 'post',
    data
  })
}

export function del(uid) {
  return request({
    url: 'api/mwWechatUser/' + uid,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/mwWechatUser',
    method: 'put',
    data
  })
}
