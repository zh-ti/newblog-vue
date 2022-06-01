import { request } from './request'

function getTagListApi(keyword = null, limit = 10) {
  return request({
    url: '/tag',
    method: 'get',
    params: {
      keyword,
      limit,
    },
  })
}

function addTagApi(name) {
  return request({
    url: '/tag',
    method: 'post',
    data: { name },
  })
}

export { getTagListApi, addTagApi }
