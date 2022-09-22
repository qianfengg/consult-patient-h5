import type { ConsultType } from '@/enums'
import type { PartialConsult } from '@/types/consult'
import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useConsultStore = defineStore(
  'cp-consult',
  () => {
    // 问诊记录状态
    const consult = ref<PartialConsult>({})
    // 修改问诊类型
    const setConsultType = (type: ConsultType) => (consult.value.type = type)
    // 修改极速问诊类型
    const setIillnessType = (type: 0 | 1) => (consult.value.illnessType = type)
    // 修改科室
    const setDepId = (depId: string) => (consult.value.depId = depId)
    // 修改病情描述相关信息
    const setIllness = (
      illness: Pick<PartialConsult, 'illnessDesc' | 'illnessTime' | 'consultFlag' | 'pictures'>
    ) => {
      consult.value.illnessDesc = illness.illnessDesc
      consult.value.illnessTime = illness.illnessTime
      consult.value.consultFlag = illness.consultFlag
      consult.value.pictures = illness.pictures
    }
    // 修改患者
    const setPatient = (id: string) => (consult.value.patientId = id)
    // 设置优惠券
    const setCoupon = (id: string) => (consult.value.couponId = id)
    // 清空记录
    const clear = () => (consult.value = {})
    return {
      consult,
      setConsultType,
      setIillnessType,
      setDepId,
      setIllness,
      setPatient,
      setCoupon,
      clear
    }
  },
  {
    persist: true
  }
)
