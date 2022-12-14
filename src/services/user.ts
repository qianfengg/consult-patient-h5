import type { CodeType, Patient, User, UserInfo } from '@/types/user'
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

export const getPatientList = () => {
  return request<Patient[]>('patient/mylist')
}

export const addPatient = (patient: Patient) => {
  return request('patient/add', 'POST', patient)
}

export const updatePatient = (patient: Patient) => {
  return request('patient/update', 'PUT', patient)
}

export const deletePatient = (id: string) => {
  return request(`patient/del/${id}`, 'DELETE')
}

export const getPatient = (id: string) => {
  return request<Patient>(`patient/info/${id}`)
}

export const loginByQQ = (openId: string) =>
  request<User>('/login/thirdparty', 'POST', { openId, source: 'qq' })

export const bindMobile = (data: { mobile: string; code: string; openId: string }) =>
  request<User>('/login/binding', 'POST', data)
