import request from '@/utils/request'

export function del(keys) {
  return request({
    url: 'auth/online',
    method: 'delete',
    data: keys
  })
}

export function delT(keys) {
  return request({
    url: 'auth/online/delete',
    method: 'post',
    data: keys
  })
}

export function delM() {
  return request({
    url: 'auth/online/deletes',
    method: 'post'
  })
}

