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
