import type { User } from '@/types/user'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore(
  'cp-user',
  () => {
    const user = ref<User>({} as User)
    const setUser = (u: User) => {
      user.value = u
    }
    const delUser = () => {
      user.value = {} as User
    }
    const returnUrl = ref('')
    const setReturnUrl = (url: string) => {
      returnUrl.value = url
    }
    return {
      user,
      setUser,
      delUser,
      returnUrl,
      setReturnUrl
    }
  },
  {
    persist: true
  }
)
