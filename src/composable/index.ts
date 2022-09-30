import { followTarget, getPrescriptionPic } from '@/services/consult'
import type { FollowType } from '@/types/consult'
import { ImagePreview } from 'vant'
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
