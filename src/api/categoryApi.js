import { request } from './request'

function getCategoryListApi() {
  return request({
    url: '/category',
    method: 'get',
  })
}

export { getCategoryListApi }
