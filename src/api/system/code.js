import request from '@/utils/request.js'

export function resetEmail(data) {
  return request({
    url: 'api/code/resetEmail',
    method: 'post',
    data
  })
}

export function updatePass(pass) {
  return request({
    url: 'api/users/updatePass/' + pass,
    method: 'get'
  })
}
