import { request } from '@/utils/request'
import type { OrderPre, AddressItem } from '@/types/order'
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
