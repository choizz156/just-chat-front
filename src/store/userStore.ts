import { reactive, readonly } from 'vue'
import type { UserInfo } from '@/types/index.ts'

// export class UserStore {
//
//    readonly userId: string
//    readonly nickname: string
//    readonly email: string
//    readonly profileImage: string
//
//   constructor(userId: string, nickname: string, email: string, profileImage: string) {
//     this.userId = userId
//     this.nickname = nickname
//     this.email = email
//     this.profileImage = profileImage
//   }
// }

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
