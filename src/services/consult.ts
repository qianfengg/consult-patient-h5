import { request } from '@/utils/request'
import type { KnowledgeParams, KnowledgePage, PageParams, DoctorPage } from './../types/consult.d'
export const getKnowledgePage = (params: KnowledgeParams) => {
  return request<KnowledgePage>('patient/home/knowledge', 'GET', params)
}

export const getDoctorPage = (params: PageParams) => {
  return request<DoctorPage>('home/page/doc', 'get', params)
}
