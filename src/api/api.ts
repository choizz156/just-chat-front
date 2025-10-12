import axios from 'axios'
import { reactive } from 'vue'

const HOST: string = 'http://localhost:8080'

export const join = async (
  email: string,
  password: string,
  nickname: string,
  imageUrl: string | null,
) => {
  return await axios.post(`${HOST}/users`, {
    email: email,
    password: password,
    nickname: nickname,
    profileImage: imageUrl,
  })
}

export const login = async (username: string, password: string) => {
  return await axios.post(
    `${HOST}/auth/login`,
    {
      username: username,
      password: password,
    },
    { withCredentials: true },
  )
}
