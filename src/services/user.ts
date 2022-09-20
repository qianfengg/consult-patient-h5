import type { CodeType, User, UserInfo } from '@/types/user'
import { request } from '@/utils/request'

export const loginByPassword = (mobile: string, password: string) => {
  return request<User>('login/password', 'post', {
    password,
    mobile
  })
}

export const sendMobileCode = (mobile: string, type: CodeType) => {
  return request('code', 'get', {
    mobile,
    type
  })
}

export const loginByCode = (mobile: string, code: string) => {
  return request<User>('login', 'POST', {
    mobile,
    code
  })
}

export const getUserInfo = () => {
  return request<UserInfo>('patient/myUser')
}
