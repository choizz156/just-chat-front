import { reactive } from 'vue'

export class UserStore {

   readonly userId: string
   readonly nickname: string
   readonly email: string
   readonly profileImage: string

  constructor(userId: string, nickname: string, email: string, profileImage: string) {
    this.userId = userId
    this.nickname = nickname
    this.email = email
    this.profileImage = profileImage
  }
}

export const state = reactive({
  userInfo: null as UserStore | null
});

export const methods = {
  setUserInfo(userInfo: UserStore) {
    state.userInfo = userInfo
  },
  clearUserInfo() {
    state.userInfo = null
  },
}


export default {
  state,
  methods,
  UserStore
}
