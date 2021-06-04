import axios from 'axios'
import { parseCookies } from 'nookies'

export function getApiClient(ctx?: any) {
  const { 'next_js_lerna_token': token } = parseCookies(ctx)

  const api = axios.create({
    baseURL: 'http://127.0.0.1:3333'
  })

  api.interceptors.request.use(config => {
    console.log(config)
    return config
  })

  if (token) {
    api.defaults.headers['Authorization'] = `Bearer ${token}`
  }

  return api
}
