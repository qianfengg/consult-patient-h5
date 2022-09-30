import type { ConsultTime } from '@/enums'
import { consultFlagOptions, illnessTimeOptions } from '@/services/constants'

export const consultFlagText = (flag?: 0 | 1) => {
  return consultFlagOptions.find((item) => item.value === flag)?.label
}
export const illnessTimeText = (time?: ConsultTime) => {
  return illnessTimeOptions.find((item) => item.value === time)?.label
}
