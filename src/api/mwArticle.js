import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/mwArticle',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/mwArticle/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/mwArticle',
    method: 'put',
    data
  })
}

export function publish(id) {
  return request({
    url: 'api/mwArticle/publish/' + id,
    method: 'get'
  })
}

export function get(id) {
  return request({
    url: 'api/mwArticle/info/' + id,
    method: 'get'
  })
}
