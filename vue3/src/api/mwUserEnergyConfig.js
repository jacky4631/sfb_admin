import request from '@/utils/request'
export function get() {
  return request({
    url: 'api/energy/config',
    method: 'get'
  })
}
export function edit(data) {
  return request({
    url: 'api/energy/config',
    method: 'post',
    data
  })
}

export default { get, edit }
