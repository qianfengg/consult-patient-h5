import { request } from '@/utils/request'
import type {
  KnowledgeParams,
  KnowledgePage,
  PageParams,
  DoctorPage,
  FollowType,
  TopDep,
  Image,
  ConsultOrderPreParams,
  ConsultOrderPreData,
  PartialConsult
} from './../types/consult.d'
export const getKnowledgePage = (params: KnowledgeParams) => {
  return request<KnowledgePage>('patient/home/knowledge', 'GET', params)
}

export const getDoctorPage = (params: PageParams) => {
  return request<DoctorPage>('home/page/doc', 'get', params)
}

export const followTarget = (id: string, type: FollowType = 'doc') => {
  return request('like', 'POST', {
    id,
    type
  })
}

export const getAllDep = () => {
  return request<TopDep[]>('dep/all')
}

export const uploadImage = (file: File) => {
  const fd = new FormData()
  fd.append('file', file)
  return request<Image>('upload', 'POST', fd)
}

export const getOrderPre = (params: ConsultOrderPreParams) => {
  return request<ConsultOrderPreData>('patient/consult/order/pre', 'get', params)
}

// 创建订单
export const createOrder = (data: PartialConsult) => {
  return request<{ id: string }>('patient/consult/order', 'post', data)
}
