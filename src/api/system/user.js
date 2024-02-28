import request from '@/utils/request'
import { encrypt } from '@/utils/rsaEncrypt'
import md5 from 'js-md5'

export function add(data) {
  data.opePwd = md5(data.opepwd)
  data.opepwd = ''
  return request({
    url: 'api/users',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/users',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  data.opePwd = md5(data.opepwd)
  data.opepwd = ''
  return request({
    url: 'api/users',
    method: 'put',
    data
  })
}

export function editUser(data) {
  data.opePwd = md5(data.opepwd)
  data.opepwd = ''
  return request({
    url: 'api/users/center',
    method: 'put',
    data
  })
}

export function updatePass(user) {
  const data = {
    oldPass: encrypt(user.oldPass),
    newPass: encrypt(user.newPass),
    opePwd: md5(user.opepwd)
  }
  return request({
    url: 'api/users/updatePass/',
    method: 'post',
    data
  })
}

export function updateEmail(form) {
  const data = {
    password: encrypt(form.pass),
    email: form.email
  }
  return request({
    url: 'api/users/updateEmail/' + form.code,
    method: 'post',
    data
  })
}

export default { add, edit, del }

