export type UserInfo = {
  id: string
  nickname: string
  email: string
  profileImage: string
}

export type OnlineUserInfo = {
  id: string
  nickname: string
  profileImage: string
}

export type Room = {
  id: string
  name: string
  type: 'DIRECT' | 'GROUP'
  description: string
  profileImage: string
}
