import { OrderType } from '@/enums'
import { cancelOrder, followTarget, getPrescriptionPic } from '@/services/consult'
import type { ConsultOrderItem, FollowType } from '@/types/consult'
import { ImagePreview, Toast } from 'vant'
import { ref } from 'vue'

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
