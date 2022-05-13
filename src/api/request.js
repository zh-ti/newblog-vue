import axios from 'axios'
import { Message } from 'element-ui'

const request = axios.create({
  baseURL: 'http://localhost:8088/tblog',
  method: 'post',
})

request.interceptors.response.use(
  result => {
    return result.data
  },
  error => {
    console.log(error)
    Message({ type: 'error', message: '请求异常' })
  }
)

export { request }
