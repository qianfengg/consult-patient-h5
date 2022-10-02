import { request } from '@/utils/request'
import type { OrderPre, AddressItem, OrderDetail, Logistics } from '@/types/order'
// getMedicalOrderPre getAddressList
export const getMedicalOrderPre = (params: { prescriptionId: string }) => {
  return request<OrderPre>('patient/medicine/order/pre', 'GET', params)
}

export const getAddressList = () => {
  return request<AddressItem[]>('patient/order/address', 'GET')
}
// 创建药品订单 createMedicalOrder
export const createMedicalOrder = (data: { id: string; couponId: string; addressId: string }) => {
  return request<{ id: string }>('patient/medicine/order', 'POST', data)
}

// 获取药品订单详情
export const getMedicalOrderDetail = (id: string) =>
  request<OrderDetail>(`/patient/medicine/order/detail/${id}`)

// 获取药品订单物流信息
export const getMedicalOrderLogistics = (id: string) =>
  request<Logistics>(`/patient/order/${id}/logistics`)
