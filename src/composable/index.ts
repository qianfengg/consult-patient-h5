import { OrderType } from '@/enums'
import { cancelOrder, deleteOrder, followTarget, getPrescriptionPic } from '@/services/consult'
import { getMedicalOrderDetail } from '@/services/order'
import { sendMobileCode } from '@/services/user'
import type { ConsultOrderItem, FollowType } from '@/types/consult'
import type { OrderDetail } from '@/types/order'
import type { CodeType } from '@/types/user'
import { ImagePreview, Toast, type FormInstance } from 'vant'
import { onMounted, onUnmounted, ref, type Ref } from 'vue'

export function useFollow(type: FollowType = 'doc') {
  const loading = ref(false)
  const follow = async (item: { id: string; likeFlag: 0 | 1 }) => {
    loading.value = true
    try {
      await followTarget(item.id, type)
      item.likeFlag = item.likeFlag === 1 ? 0 : 1
    } finally {
      loading.value = false
    }
  }
  return { loading, follow }
}

export const useShowPresciption = () => {
  const showPrescription = async (id?: string) => {
    if (id) {
      const res = await getPrescriptionPic(id)
      ImagePreview([res.data.url])
    }
  }
  return { showPrescription }
}

// 取消订单
export const useCancleOrder = () => {
  const loading = ref(false)
  const cancelConsultOrder = async (item: ConsultOrderItem) => {
    loading.value = true
    try {
      await cancelOrder(item.id)
      item.status = OrderType.ConsultCancel
      item.statusValue = '已取消'
      Toast.success('取消成功')
    } catch (e) {
      Toast.fail('取消失败')
    } finally {
      loading.value = false
    }
  }
  return {
    loading,
    cancelConsultOrder
  }
}

export const useDeleteOrder = (cb: () => void) => {
  const deleteLoading = ref(false)
  const deleteOrderHandler = async (item: ConsultOrderItem) => {
    try {
      deleteLoading.value = true
      await deleteOrder(item.id)
      // emit('on-delete', item.id)
      cb?.()
      Toast.success('删除订单成功')
    } catch (error) {
      Toast.fail('删除订单失败')
    } finally {
      deleteLoading.value = false
    }
  }
  return {
    deleteLoading,
    deleteOrderHandler
  }
}

export const useOrderDetail = (id: string) => {
  const orderDetail = ref<OrderDetail>()
  const loading = ref(false)
  onMounted(async () => {
    loading.value = true
    try {
      const res = await getMedicalOrderDetail(id)
      orderDetail.value = res.data
    } finally {
      loading.value = false
    }
  })
  return {
    orderDetail,
    loading
  }
}

export const useSendCode = (mobile: Ref<string>, type: CodeType) => {
  const time = ref(0)
  let timer: number = -1
  const form = ref<FormInstance | null>(null)
  const send = async () => {
    if (time.value > 0) return
    await form.value?.validate('mobile')
    await sendMobileCode(mobile.value, type)
    Toast.success('发送成功')
    time.value = 60
    if (timer > 0) clearInterval(timer)
    timer = window.setInterval(() => {
      time.value--
      if (time.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  }
  onUnmounted(() => {
    clearInterval(timer)
  })
  return { time, form, send }
}
