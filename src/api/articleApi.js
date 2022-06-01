import { request } from './request'

function getArticleListApi(page = 1, size = 10, condition = null) {
  let params = { page, size }
  condition && Object.assign(params, condition)
  return request({
    url: '/article',
    method: 'get',
    params: params,
  })
}

function getArticleByIdApi(id) {
  return request({
    url: '/article',
    method: 'get',
    params: { id },
  })
}

function addArticleApi(article) {
  return request({
    url: '/article',
    method: 'post',
    data: article,
  })
}

function updateArticleApi(article) {
  return request({
    url: '/article',
    method: 'put',
    data: article,
  })
}

function deleteArticleApi(idList) {
  let ids = idList.join(',')
  return request({
    url: '/article',
    method: 'delete',
    params: { ids },
  })
}

function publishArticleApi(id) {
  return request({
    url: '/article',
    method: 'patch',
    params: { id, state: 1 },
  })
}

function withdrawArticleApi(id) {
  return request({
    url: '/article',
    method: 'patch',
    params: { id, state: 0 },
  })
}

export {
  getArticleListApi,
  addArticleApi,
  updateArticleApi,
  getArticleByIdApi,
  deleteArticleApi,
  publishArticleApi,
  withdrawArticleApi,
}
