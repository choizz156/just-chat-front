import { onMounted, onUnmounted, type Ref, ref, watch } from 'vue'
import type { UserInfo } from '@/types'

type onlineUser = {
  userId: string
  nickname: string
  profileImage: string
}

export interface WebSocketMessage {
  type: string
  senderId?: number
  content?: string
  [key: string]: any
}

export interface WebSocketOnlineUsers {
  onlineUsers: onlineUser[]
}

export interface UseWebSocketProps {
  userId: string
  onlineUsers?: onlineUser[]
  onMessage?: (message: WebSocketMessage) => void
  onOnlineUsersMessage?: (message: WebSocketOnlineUsers) => void
  onConnect?: () => void
  onOnlineUsersConnect?: () => void
  onDisconnect?: () => void
  onOnlineUsersDisconnect?: () => void
  onError?: (err: string) => void
  ononlineUsersError?: (err: string) => void
}

export const useWebSocket = ({
  userId,
  onMessage,
  onOnlineUsersMessage,
  onConnect,
  onOnlineUsersConnect,
  onDisconnect,
  onOnlineUsersDisconnect,
  onError,
  ononlineUsersError,
}: UseWebSocketProps) => {
  const wsChat = ref<WebSocket | null>(null)
  const wsOnlieUsers = ref<WebSocket | null>(null)

  const isConnected = ref<boolean>(false)
  const isOnlineUsersConnected = ref<boolean>(false)

  const lastMessage = ref<WebSocketMessage | null>(null)
  const lastOnlineUsersMessage = ref<WebSocketOnlineUsers | null>(null)

  const errorChat = ref<string | undefined>(undefined)
  const errorOnlineUser = ref<string | undefined>(undefined)

  const reconnectAttemptsChat = ref<number>(0)
  const reconnectAttemptsOnlineUsers = ref<number>(0)

  const reconnectTimeoutIdChat = ref<number | undefined>(undefined)
  const reconnectTimeoutIdOnlineUsers = ref<number | undefined>(undefined)
  const maxReconnectAttempts = 3

  const connectChat = () => {
    if (!userId) {
      console.warn('WebSocket connect: userId가 없습니다.')
      return
    }

    if (wsChat.value?.readyState === WebSocket.OPEN) {
      console.log('이미 연결돼 있습니다.')
      return
    }

    if (wsChat.value) {
      wsChat.value.close()
      wsChat.value = null
    }

    try {
      const wsUrl = `ws://localhost:8080/ws/chat?userId=${userId}`
      wsChat.value = new WebSocket(wsUrl)
      wsChat.value.onopen = () => {
        console.log('websocket connecting')
        isConnected.value = true
        errorChat.value = undefined
        reconnectAttemptsChat.value = 0
        onConnect?.()
      }

      wsChat.value.onmessage = (event) => {
        try {
          console.log('websocket message', event.data)
          const message: WebSocketMessage = JSON.parse(event.data)
          lastMessage.value = message
          onMessage?.(message)
        } catch (err) {
          console.log('메시지 파싱 실패 : ', err)
          errorChat.value = '메시지 파싱 실패'
        }
      }

      wsChat.value.onclose = (event) =>
        handleReconnect(
          event,
          'chat',
          connectChat,
          reconnectAttemptsChat,
          reconnectTimeoutIdChat,
          errorChat,
          onDisconnect,
        )

      wsChat.value.onerror = (event) => {
        console.log('websocket error', event)
        errorChat.value = 'websocket 연결 오류'
        isConnected.value = false
        onError?.(event.type)
      }
    } catch (err) {
      console.error('커넥션 생성 실패', err)
      errorChat.value = 'websockt 연결 실패'
    }
  }

  const connectOnlineUser = () => {
    if (!userId) {
      console.warn('online users WebSocket connect: userId가 없습니다.')
      return
    }

    if (wsOnlieUsers.value?.readyState === WebSocket.OPEN) {
      console.log('online users가 이미 연결돼 있습니다.')
      return
    }

    if (wsOnlieUsers.value) {
      wsOnlieUsers.value.close()
      wsOnlieUsers.value = null
    }

    try {
      const wsUrl = `ws://localhost:8080/ws/onlin-users`
      wsOnlieUsers.value = new WebSocket(wsUrl)
      wsOnlieUsers.value.onopen = () => {
        console.log('online users websocket connecting')
        isOnlineUsersConnected.value = true
        errorOnlineUser.value = undefined
        reconnectAttemptsOnlineUsers.value = 0
        onOnlineUsersConnect?.()
      }

      wsOnlieUsers.value.onmessage = (event) => {
        try {
          console.log('websocket message', event.data)
          const message: WebSocketOnlineUsers = JSON.parse(event.data)
          lastOnlineUsersMessage.value = message
          onOnlineUsersMessage?.(message)
        } catch (err) {
          console.log('온라인 유저 메시지 파싱 실패 : ', err)
          errorOnlineUser.value = '메시지 파싱 실패'
        }
      }

      wsOnlieUsers.value.onclose = (event) =>
        handleReconnect(
          event,
          'onlineUsers',
          connectOnlineUser,
          reconnectAttemptsOnlineUsers,
          reconnectTimeoutIdOnlineUsers,
          errorOnlineUser,
          onOnlineUsersDisconnect,
        )

      wsOnlieUsers.value.onerror = (event) => {
        console.log('websocket error', event)
        errorOnlineUser.value = 'websocket 연결 오류'
        isOnlineUsersConnected.value = false
        ononlineUsersError?.(event.type)
      }
    } catch (err) {
      console.error('온라인 유저 커넥션 생성 실패', err)
      errorOnlineUser.value = 'websockt 연결 실패'
    }
  }

  const handleReconnect = (
    event: CloseEvent,
    type: 'chat' | 'onlineUsers',
    connect: () => void,
    attemptsRef: Ref<number>,
    timeoutRef: Ref<number | undefined>,
    errorRef: Ref<string | undefined>,
    onDisconnectWS?: () => void,
  ) => {
    onDisconnectWS?.()
    if (event.code !== 1000 && event.code !== 1001 && attemptsRef.value < maxReconnectAttempts) {
      const delay = Math.min(1000 * Math.pow(2, attemptsRef.value), 30000)
      if (attemptsRef.value && timeoutRef.value) {
        clearTimeout(timeoutRef.value)
      }

      timeoutRef.value = window.setTimeout(() => {
        attemptsRef.value++
        connect()
      }, delay)
    } else if (attemptsRef.value >= maxReconnectAttempts) {
      errorRef.value = '최대 재연결 시도 횟수 초과'
    }
  }

  const sendChatMessage = (message: WebSocketMessage): boolean => {
    if (wsChat.value?.readyState === WebSocket.OPEN) {
      try {
        wsChat.value.send(JSON.stringify(message))
        return true
      } catch (e) {
        console.error('메시지 전송 실패 : ', e)
        errorChat.value = '메시지 전송 실패'
        return false
      }
    } else {
      console.log('websocket 연결 실패')
      errorChat.value = 'websocket이 연결되지 않음'
      return false
    }
  }

  const disconnect = (
    ws: Ref<WebSocket | null>,
    isConnected: Ref<boolean>,
    attemptsRef: Ref<number>,
    timeoutRef: Ref<number | undefined>,
  ) => {
    attemptsRef.value = 0
    timeoutRef.value = 0
    if (timeoutRef.value) clearTimeout(timeoutRef.value)

    ws.value?.close(1000, 'all websocket disconnected')

    wsChat.value = null
    wsOnlieUsers.value = null

    isConnected.value = false
  }

  const sendOnlieUsersMessage = (message: onlineUser): boolean => {
    if (wsOnlieUsers.value?.readyState === WebSocket.OPEN) {
      wsOnlieUsers.value.send(JSON.stringify(message))
      return true
    } else {
      errorOnlineUser.value = 'User WebSocket이 연결되지 않음'
      return false
    }
  }

  // 페이지 로드 시 호출
  watch(
    () => userId,
    () => {
      connectChat()
      connectOnlineUser()
    },
    { immediate: true },
  )

  const handleBeforeUnload = () => {
    disconnect(wsChat, isConnected, reconnectAttemptsChat, reconnectTimeoutIdChat)
    disconnect(
      wsOnlieUsers,
      isOnlineUsersConnected,
      reconnectAttemptsOnlineUsers,
      reconnectTimeoutIdOnlineUsers,
    )
  }

  //페이지 새로고침, 벗어날 시 웹소켓 해제
  onUnmounted(() => {
    window.removeEventListener('beforeunload', handleBeforeUnload)
  })
  onMounted(() => window.addEventListener('beforeunload', handleBeforeUnload))

  return {
    isConnected,
    isOnlineUsersConnected,
    lastMessage,
    lastOnlineUsersMessage,
    sendMessage: sendChatMessage,
    sendOnlieUsersMessage: sendOnlieUsersMessage,
    disconnect: handleBeforeUnload,
    errorOnlineUser,
    errorChat,
  }
}
