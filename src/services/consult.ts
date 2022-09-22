import { request } from '@/utils/request'
import type {
  KnowledgeParams,
  KnowledgePage,
  PageParams,
  DoctorPage,
  FollowType
} from './../types/consult.d'
export const getKnowledgePage = (params: KnowledgeParams) => {
  return request<KnowledgePage>('patient/home/knowledge', 'GET', params)
}

export const getDoctorPage = (params: PageParams) => {
  return request<DoctorPage>('home/page/doc', 'get', params)
}

export const followDoctor = (id: string, type: FollowType = 'doc') => {
  return request('like', 'POST', {
    id,
    type
  })
}
