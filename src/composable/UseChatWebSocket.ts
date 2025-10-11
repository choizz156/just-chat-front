import { ref, onMounted, onUnmounted, type Ref, watch } from 'vue'

export interface WebSocketMessage {
  type: string
  senderId?: number
  content?: string
  [key: string]: any
}

interface UseChatWebSocketProps {
  userId: string
  onMessage?: (msg: WebSocketMessage) => void
  onConnect?: () => void
  onDisconnect?: () => void
  onError?: (err: string) => void
}

export const useChatWebSocket = ({
  userId,
  onMessage,
  onConnect,
  onDisconnect,
  onError,
}: UseChatWebSocketProps) => {
  const wsChat = ref<WebSocket | null>(null)
  const isConnected = ref(false)
  const lastMessage = ref<WebSocketMessage | null>(null)
  const error = ref<string>()
  const reconnectAttempts = ref(0)
  const reconnectTimeoutId = ref<number | undefined>()
  const maxReconnectAttempts = 3

  const connect = () => {
    if (!userId) {
      console.warn('userId가 없습니다.')
      return
    }

    if (wsChat.value?.readyState === WebSocket.OPEN) {
      console.log('이미 연결됨')
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
        console.log('Chat WebSocket connected')
        isConnected.value = true
        error.value = undefined
        reconnectAttempts.value = 0
        onConnect?.()
      }

      wsChat.value.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data)
          lastMessage.value = message
          onMessage?.(message)
        } catch (err) {
          error.value = '메시지 파싱 실패'
        }
      }

      wsChat.value.onclose = (event) => handleReconnect(event)
      wsChat.value.onerror = (event) => {
        console.log('WebSocket error', event)
        error.value = '연결 오류'
        isConnected.value = false
        onError?.(event.type)
      }
    } catch (err) {
      error.value = 'WebSocket 연결 실패'
    }
  }

  const handleReconnect = (event: CloseEvent) => {
    onDisconnect?.()

    if (event.code !== 1000 && reconnectAttempts.value < maxReconnectAttempts) {
      const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.value), 30000)
      if (reconnectTimeoutId.value) clearTimeout(reconnectTimeoutId.value)

      reconnectTimeoutId.value = window.setTimeout(() => {
        reconnectAttempts.value++
        connect()
      }, delay)
    } else {
      error.value = '최대 재연결 시도 초과'
    }
  }

  const sendMessage = (message: WebSocketMessage): boolean => {
    if (wsChat.value?.readyState === WebSocket.OPEN) {
      wsChat.value.send(JSON.stringify(message))
      return true
    }
    error.value = 'WebSocket이 연결되지 않음'
    return false
  }

  const disconnect = () => {
    if (reconnectTimeoutId.value) clearTimeout(reconnectTimeoutId.value)
    wsChat.value?.close(1000, 'disconnect')
    wsChat.value = null
    isConnected.value = false
  }

  watch(
    () => userId,
    () => connect(),
    { immediate: true },
  )

  const handleBeforeUnload = () => disconnect()
  onMounted(() => window.addEventListener('beforeunload', handleBeforeUnload))
  onUnmounted(() => {
    disconnect()
    window.removeEventListener('beforeunload', handleBeforeUnload)
  })

  return {
    isConnected,
    lastMessage,
    sendMessage,
    disconnect,
    error,
  }
}
