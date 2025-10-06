import { reactive } from 'vue'

export class UserStore {

  private readonly userId: string
  private readonly nickname: string
  private readonly email: string
  private readonly profileImage: string

  constructor(userId: string, nickname: string, email: string, profileImage: string) {
    this.userId = userId
    this.nickname = nickname
    this.email = email
    this.profileImage = profileImage
  }

  getId(): string {
    return this.userId
  }
  getEmail(): string {
    return this.email
  }
  getnickname(): string {
    return this.nickname
  }

  getProfileImage(): string {
    return this.profileImage
  }
}

const state = reactive({
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
