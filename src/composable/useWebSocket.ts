import { onMounted, onUnmounted, ref, watch } from 'vue'

export interface WebSocketMessage {
  type: string
  senderId?: number
  content?: string
  [key: string]: any
}

export interface UseWebSocketProps {
  userId: string
  onMessage?: (message: WebSocketMessage) => void
  onConnect?: () => void
  onDisconnect?: () => void
  onError?: (err: string) => void
}

export const useWebSocket = ({
  userId,
  onMessage,
  onConnect,
  onDisconnect,
  onError,
}: UseWebSocketProps) => {
  const ws = ref<WebSocket | null>(null)
  const isConnected = ref<boolean>(false)
  const lastMessage = ref<WebSocketMessage | null>(null)
  const error = ref<string | undefined>(undefined)
  const reconnectAttempts = ref<number>(0)
  const reconnectTimeoutId = ref<number | undefined>(undefined)
  const maxReconnectAttempts = 3

  const connect = () => {
    if (!userId) {
      console.warn('WebSocket connect: userId가 없습니다.')
      return
    }

    if (ws.value?.readyState === WebSocket.OPEN) {
      console.log('이미 연결돼 있습니다.')
      return
    }

    if (ws.value) {
      ws.value.close()
      ws.value = null
    }

    try {
      const wsUrl = `ws://localhost:8080/ws/chat?userId=${userId}`
      ws.value = new WebSocket(wsUrl)
      ws.value.onopen = () => {
        console.log('websocket connecting')
        isConnected.value = true
        error.value = undefined
        reconnectAttempts.value = 0
        onConnect?.()
      }

      ws.value.onmessage = (event) => {
        try {
          console.log('websocket message', event.data)
          const message: WebSocketMessage = JSON.parse(event.data)
          lastMessage.value = message
          onMessage?.(message)
        } catch (err) {
          console.log('메시지 파싱 실패 : ', err)
          error.value = '메시지 파싱 실패'
        }
      }

      ws.value.onclose = (event) => {
        console.log('websocket disconnected')
        isConnected.value = false
        ws.value = null
        onDisconnect?.()

        if (
          event.code !== 1000 &&
          event.code !== 1001 &&
          reconnectAttempts.value < maxReconnectAttempts
        ) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.value), 30000)
          if (reconnectAttempts.value) {
            clearTimeout(reconnectTimeoutId.value)
          }

          reconnectTimeoutId.value = window.setTimeout(() => {
            reconnectAttempts.value++
            connect()
          }, delay)
        } else if (reconnectAttempts.value >= maxReconnectAttempts) {
          error.value = '최대 재연결 시도 횟수 초과'
        }
      }

      ws.value.onerror = (event) => {
        console.log('websocket error', event)
        error.value = 'websocket 연결 오류'
        isConnected.value = false
        onError?.(event.type)
      }
    } catch (err) {
      console.error('커넥션 생성 실패', err)
      error.value = 'websockt 연결 실패'
    }
  }

  const disconnect = () => {
    reconnectAttempts.value = 0
    if (reconnectTimeoutId.value) {
      clearTimeout(reconnectTimeoutId.value)
    }

    if (ws.value) {
      ws.value.close(1000, 'user disconnected')
      ws.value = null
    }

    isConnected.value = false
  }

  const sendMessage = (message: WebSocketMessage): boolean => {
    if (ws.value?.readyState === WebSocket.OPEN) {
      try {
        ws.value.send(JSON.stringify(message))
        return true
      } catch (e) {
        console.error('메시지 전송 실패 : ', e)
        error.value = '메시지 전송 실패'
        return false
      }
    } else {
      console.log('websocket 연결 실패')
      error.value = 'websocket이 연결되지 않음'
      return false
    }
  }

  watch(
    () => userId,
    () => {
      connect()
    },
    { immediate: true },
  )

  onUnmounted(() => {
    disconnect()
    window.removeEventListener('beforeunload', handleBeforeUnload)
  })

  const handleBeforeUnload = () => disconnect()
  onMounted(() => window.addEventListener('beforeunload', handleBeforeUnload))

  return {
    isConnected,
    lastMessage,
    sendMessage,
    disconnect,
    error,
  }
}
