import { MsgType, PrescriptionStatus } from '@/enums'
import type { Consult, Image } from './consult'
import type { Patient } from './user'

export type Medical = {
  id: string
  name: string
  amount: string
  avatar: string
  specs: string
  usageDosag: string
  quantity: string
  prescriptionFlag: 0 | 1
}

export type Prescription = {
  id: string
  orderId: string
  createTime: string
  name: string
  recordId: string
  gender: 0 | 1
  genderValue: ''
  age: number
  diagnosis: string
  status: PrescriptionStatus
  medicines: Medical[]
}

export type EvaluateDoc = {
  id?: string
  score?: number
  content?: string
  createTime?: string
  creator?: string
}

export type Message = {
  id: string
  msgType: MsgType
  from?: string
  fromAvatar?: string
  to?: string
  toAvatar?: string
  createTime: string
  msg: {
    content?: string
    picture?: Image
    consultRecord?: Consult & {
      patientInfo: Patient
    }
    prescription?: Prescription
    evaluateDoc?: EvaluateDoc
  }
}

export type TimeMessages = {
  createTime: string
  items: Message[]
  orderId: string
  sid: string
}
