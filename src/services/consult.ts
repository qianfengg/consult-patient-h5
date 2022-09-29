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
  PartialConsult,
  ConsultOrderItem,
  ConsultOrderListParams,
  ConsultOrderPage
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

export const getPayUrl = (params: {
  paymentMethod: 0 | 1
  orderId: string
  payCallback: string
}) => {
  return request<{ payUrl: string }>('/patient/consult/pay', 'post', params)
}

export const getConsultOrderDetail = (orderId: string) => {
  return request<ConsultOrderItem>('/patient/consult/order/detail', 'GET', {
    orderId
  })
}

export const getPrescriptionPic = (id: string) => {
  return request<{ url: string }>(`patient/consult/prescription/${id}`)
}

// 评价问诊
export const evaluateConsultOrder = (data: {
  docId: string
  orderId: string
  score: number
  content: string
  anonymousFlag: 0 | 1
}) => {
  return request('patient/order/evaluate', 'POST', data)
}

// 问诊记录分页数据
export const getConsultOrderList = (params: ConsultOrderListParams) => {
  return request<ConsultOrderPage>('patient/consult/order/list', 'get', params)
}