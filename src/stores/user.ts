import type { User } from '@/types/user'
import { defineStore } from 'pinia'
import { ref } from 'vue'

const useUserStore = defineStore(
  'cp-user',
  () => {
    const user = ref<User>({} as User)
    const setUser = (u: User) => {
      user.value = u
    }
    const delUser = () => {
      user.value = {} as User
    }
    return {
      user,
      setUser,
      delUser
    }
  },
  {
    persist: true
  }
)
export default useUserStore
