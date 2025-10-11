import { ref, watch, onMounted, onUnmounted, type Ref } from 'vue'
import type { OnlineUserInfo } from '@/types/index.ts'


interface UseOnlineUsersWebSocketProps {
  userId: string | undefined
  onMessage?: () => void
  onConnect?: () => void
  onDisconnect?: () => void
  onError?: (err: string) => void
}

export const useOnlineUsersWebSocket = ({
  userId,
  onMessage,
  onConnect,
  onDisconnect,
  onError,
}: UseOnlineUsersWebSocketProps) => {
  const ws = ref<WebSocket | null>(null)
  const isConnected = ref(false)
  const lastMessage = ref<OnlineUserInfo[] | null>(null)
  const error = ref<string>()
  const reconnectAttempts = ref(0)
  const reconnectTimeoutId = ref<number | undefined>()
  const maxReconnectAttempts = 3

  const connect = () => {
    if (ws.value?.readyState === WebSocket.OPEN) {
      console.log('이미 연결됨')
      return
    }

    if (ws.value) {
      ws.value.close()
      ws.value = null
    }

    try {
  
      const wsUrl = `ws://localhost:8080/ws/online-users`
      ws.value = new WebSocket(wsUrl)

      ws.value.onopen = () => {
        console.log('Online users WebSocket connected')
        isConnected.value = true
        error.value = undefined
        reconnectAttempts.value = 0
        onConnect?.()
      }

      ws.value.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as OnlineUserInfo[]
          console.log(message);
          lastMessage.value = message
          console.log(lastMessage.value);
          
          onMessage?.()
        } catch {
          error.value = '메시지 파싱 실패'
        }
      }

      ws.value.onclose = (event) => handleReconnect(event)
      ws.value.onerror = (event) => {
        error.value = '연결 오류'
        isConnected.value = false
        onError?.(event.type)
      }
    } catch {
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

  const disconnect = () => {
    if (reconnectTimeoutId.value) clearTimeout(reconnectTimeoutId.value)
    ws.value?.close(1000, 'disconnect')
    ws.value = null
    isConnected.value = false
  }

  const handleBeforeUnload = () => disconnect()
  onMounted(() => window.addEventListener('beforeunload', handleBeforeUnload))
  onUnmounted(() => {
      disconnect()
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  )

  watch(() => userId, () => connect(), { immediate: true })

  return {
    isConnected,
    lastMessage,
    disconnect,
    error,
  }
}
