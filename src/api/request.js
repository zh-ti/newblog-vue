import axios from 'axios'
import { Message } from 'element-ui'
import VueCookie from 'vue-cookie'

const request = axios.create({
  baseURL: 'http://localhost:8088/tblog',
  method: 'post',
  timeout: 10000,
})

request.interceptors.request.use(request => {
  let userInfo = JSON.parse(VueCookie.get('currentUserInfo'))
  if (userInfo) {
    request.headers.token = userInfo.token
  }
  return request
})
request.interceptors.response.use(
  result => {
    console.log(result.data)
    if (result.data.success) {
      return result.data
    } else {
      Message({ type: 'error', message: result.data.message })
    }
  },
  () => {
    Message({ type: 'error', message: '请求异常' })
  }
)

export { request }
