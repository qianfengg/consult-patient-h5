import { ConsultType, ConsultTime } from '@/enums'
import { Patient } from './user'

// 图片列表
export type Image = {
  id: string
  url: string
}
// 问诊记录
export type Consult = {
  id: string
  type: ConsultType
  illnessType: 0 | 1
  depId: string
  illnessDesc: string
  illnessTime: ConsultTime
  consultFlag: 0 | 1
  pictures: Image[]
  patientId: string
  couponId: string
}

// 问诊记录-全部可选
export type PartialConsult = Partial<Consult>
// Required 转换为全部必须   Partial 转换问全部可选  两个内置的泛型类型

// recommend推荐，fatReduction减脂，food健康饮食like关注医生页面文章
// 文章类型
export type KnowledgeType = 'like' | 'recommend' | 'fatReduction' | 'food'

// 文章信息类型
export type Knowledge = {
  id: string
  title: string
  coverUrl: string[]
  topics: string[]
  collectionNumber: number
  commentNumber: number
  creatorName: string
  creatorAvatar: string
  creatorHospatalName: string
  likeFlag: 0 | 1
  content: string
  creatorDep: string
  creatorTitles: string
  creatorId: string
}

// 文章列表
export type KnowledgeList = Knowledge[]

// 文章列表带分页
export type KnowledgePage = {
  pageTotal: number
  total: number
  rows: KnowledgeList
}

// 通用的分页查询参数
export type PageParams = {
  current: number
  pageSize: number
}

// 文章列表查询参数
export type KnowledgeParams = PageParams & {
  type: KnowledgeType
}

// 医生卡片
export type Doctor = {
  id: string
  name: string
  avatar: string
  hospitalName: string
  gradeName: string
  depName: string
  positionalTitles: string
  likeFlag: 0 | 1
  serviceFee: number
  consultationNum: number
  score: number
  major: string
}

// 医生列表
export type DoctorList = Doctor[]

// 医生分页
export type DoctorPage = {
  pageTotal: number
  total: number
  rows: DoctorList
}

// topic百科话题,knowledge百科文章,doc医生,disease疾病
export type FollowType = 'topic' | 'knowledge' | 'doc' | 'disease'

export type SubDep = {
  id: string
  name: string
}

export type TopDep = SubDep & {
  child: SubDep[]
}

export type ConsultIllness = Pick<
  PartialConsult,
  'illnessDesc' | 'illnessTime' | 'consultFlag' | 'pictures'
>

// 问诊订单预支付传参
export type ConsultOrderPreParams = Pick<PartialConsult, 'type' | 'illnessType'>

// 问诊订单预支付信息
export type ConsultOrderPreData = {
  pointDeduction: number
  couponDeduction: number
  couponId: string
  payment: number
  couponId: number
  actualPayment: number
}

// 问诊订单单项信息
export type ConsultOrderItem = Consult & {
  createTime: string
  docInfo?: Doctor
  patientInfo: Patient
  orderNo: string
  statusValue: string
  typeValue: string
  status: OrderType
  countdown: number
  prescriptionId?: string
  evaluateId: number
  payment: number
  couponDeduction: number
  pointDeduction: number
  actualPayment: number
}

export type ConsultOrderListParams = PageParams & {
  type: ConsultType
}
export type ConsultOrderPage = {
  pageTotal: number
  total: number
  rows: ConsultOrderItem[]
}
