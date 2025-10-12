import axios from 'axios'

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

export const createRoom = async (
  createdBy: string,
  hostNickname: string,
  clientId: string,
  clientNickname: string,
  imageUrl: string,
) => {
  console.log(createdBy, hostNickname, clientNickname)
  return await axios.post(
    `${HOST}/chat-rooms`,
    {
      name: clientNickname,
      description: `${clientNickname}, ${hostNickname}`,
      type: 'DIRECT',
      imageUrl: imageUrl,
      maxMembers: 2,
    },
    {
      withCredentials: true,
      params: {
        createdBy: createdBy,
      },
    },
  )
}
