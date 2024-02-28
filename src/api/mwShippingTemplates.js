import request from '@/utils/request'

export function add(data, id) {
  return request({
    url: `api/mwShippingTemplates/save/${id}`,
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/mwShippingTemplates/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/mwShippingTemplates',
    method: 'put',
    data
  })
}

export function getCity() {
  return request({
    url: 'api/mwShippingTemplates/citys',
    method: 'get'
  })
}

export default { add, edit, del, getCity }
