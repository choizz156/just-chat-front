import { reactive, readonly } from 'vue'
import type { UserInfo } from '@/types/index.ts'


const storedUserInfo = sessionStorage.getItem('userInfo')

export const state = reactive({
  userInfo: storedUserInfo ? JSON.parse(storedUserInfo) as UserInfo : null,
})

function setUserInfo(userInfo: UserInfo) {
  state.userInfo = userInfo
  sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
}

function clearUserInfo() {
  state.userInfo = null
  sessionStorage.removeItem('userInfo')
}

export function useUserStore() {
  return {
    state: readonly(state),
    setUserInfo,
    clearUserInfo,
  }
}
