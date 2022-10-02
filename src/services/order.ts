import { request } from '@/utils/request'
import type { OrderPre, AddressItem, OrderDetail } from '@/types/order'
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
