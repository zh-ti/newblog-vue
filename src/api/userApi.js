import { request } from './request'

function getUserListApi(page = 1, size = 10, condition = null) {
  let params = { page, size }
  // 将 condition 中的属性添加到 params
  condition && Object.assign(params, condition)
  return request({
    url: '/user',
    method: 'get',
    params: params,
  })
}

function addUserApi(userInfo) {
  return request({
    url: '/user',
    method: 'post',
    data: userInfo,
  })
}

function updateUserApi(userInfo) {
  return request({
    url: '/user',
    method: 'put',
    data: userInfo,
  })
}

function deleteUsersApi(idList) {
  return request({
    url: '/user',
    method: 'delete',
    params: {
      ids: idList.join(','),
    },
  })
}

function userLoginApi(userInfo) {
  return request({
    url: '/user/login',
    method: 'post',
    data: userInfo,
  })
}

function userRegistryApi(userInfo) {
  return request({
    url: '/user/registry',
    method: 'post',
    data: userInfo,
  })
}

export {
  getUserListApi,
  addUserApi,
  updateUserApi,
  deleteUsersApi,
  userLoginApi,
  userRegistryApi,
}
