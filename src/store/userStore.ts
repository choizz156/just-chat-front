import { reactive, readonly } from 'vue'
import type { UserInfo } from '@/types/index.ts'

export const state = reactive({
  userInfo: null as UserInfo | null,
})

function setUserInfo(userInfo: UserInfo) {
  state.userInfo = userInfo
}

function clearUserInfo() {
  state.userInfo = null
}

export function useUserStore() {
  return {
    state: readonly(state),
    setUserInfo,
    clearUserInfo,
  }
}
