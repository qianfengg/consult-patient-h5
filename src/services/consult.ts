import { request } from '@/utils/request'
import type { KnowledgeParams, KnowledgePage } from './../types/consult.d'
export const getKnowledgePage = (params: KnowledgeParams) => {
  return request<KnowledgePage>('patient/home/knowledge', 'GET', params)
}
