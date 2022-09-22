import { request } from '@/utils/request'
import type {
  KnowledgeParams,
  KnowledgePage,
  PageParams,
  DoctorPage,
  FollowType,
  TopDep
} from './../types/consult.d'
export const getKnowledgePage = (params: KnowledgeParams) => {
  return request<KnowledgePage>('patient/home/knowledge', 'GET', params)
}

export const getDoctorPage = (params: PageParams) => {
  return request<DoctorPage>('home/page/doc', 'get', params)
}

export const followTarget = (id: string, type: FollowType = 'doc') => {
  return request('like', 'POST', {
    id,
    type
  })
}

export const getAllDep = () => {
  return request<TopDep[]>('dep/all')
}
