import { request } from '@/utils/request'
import type { OrderPre, AddressItem } from '@/types/order'
// getMedicalOrderPre getAddressList
export const getMedicalOrderPre = (params: { prescriptionId: string }) => {
  return request<OrderPre>('patient/medicine/order/pre', 'GET', params)
}

export const getAddressList = () => {
  return request<AddressItem[]>('patient/order/address', 'GET')
}
