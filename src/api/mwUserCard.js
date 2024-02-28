import request from '@/utils/request'

export function clearSignature(id) {
  return request({
    url: 'api/mwUser/card/clearSignature/' + id,
    method: 'post'
  })
}

export function clearCard(id) {
  return request({
    url: 'api/mwUser/card/' + id,
    method: 'delete'
  })
}
export function clearCardBank(id) {
  return request({
    url: 'api/mwUser/card/bank/' + id,
    method: 'delete'
  })
}
export function clearCardPhone(id) {
  return request({
    url: 'api/mwUser/card/phone/' + id,
    method: 'delete'
  })
}
