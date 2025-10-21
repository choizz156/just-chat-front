<template>
  <Header />
  <div class="chat-app">
    <!-- 왼쪽 사이드바 -->
    <div class="sidebar">
      <OnlineUsersList :onlineUsers="onlineUsers" />
      <RoomList :rooms="rooms" />
    </div>

        <div class="chat-area">
    <!--      <template v-if="selectedRoom">-->
    <!--        <div class="chat-header">-->
    <!--          <h3>{{ chatRooms.find((r) => r.id === selectedRoom)?.name }}</h3>-->
    <!--        </div>-->

    <!--        &lt;!&ndash; 메시지 목록 &ndash;&gt;-->
    <!--        <el-scrollbar class="message-list">-->
    <!--          <div v-for="msg in messages" :key="msg.id" class="message" :class="{ me: msg.isMe }">-->
    <!--            <div class="message-box">-->
    <!--              <div v-if="!msg.isMe" class="username">{{ msg.user }}</div>-->
    <!--              <div class="bubble" :class="{ me: msg.isMe }">-->
    <!--                <p>{{ msg.content }}</p>-->
    <!--                <span class="time">{{ msg.time }}</span>-->
    <!--              </div>-->
    <!--            </div>-->
    <!--          </div>-->
    <!--        </el-scrollbar>-->

    <!--        &lt;!&ndash; 입력 영역 &ndash;&gt;-->
    <!--        <div class="input-area">-->
    <!--          <el-input-->
    <!--            v-model="message"-->
    <!--            placeholder="메시지를 입력하세요..."-->
    <!--            @keyup.enter="sendMessage"-->
    <!--            clearable-->
    <!--          />-->
    <!--          <el-button type="primary" @click="sendMessage">-->
    <!--            <Send class="icon" />-->
    <!--            전송-->
    <!--          </el-button>-->
    <!--        </div>-->
    <!--      </template>-->

    <!--      <template v-else>-->
    <!--        <div class="empty">-->
    <!--          <MessageCircle class="empty-icon" />-->
    <!--          <p>채팅방을 선택해주세요</p>-->
    <!--        </div>-->
    <!--      </template>-->
        </div>
  </div>
</template>

<script setup lang="ts">
import { state } from '@/store/userStore.ts'
import { useOnlineUsersWebSocket } from '@/composable/UseOnlineUsersWebSocket.ts'
import type { OnlineUserInfo, Room } from '@/types/index.ts'
import { ref, watch } from 'vue'
import OnlineUsersList from '@/component/chat/OnlineUsersList.vue'
import Header from '@/component/Header.vue'
import RoomList from '@/component/chat/RoomList.vue'

const userId: string | undefined = state.userInfo!.id
const onlineUsers = ref<OnlineUserInfo[] | undefined>(undefined)
const rooms = ref<Room[] | undefined>(undefined)


rooms.value = [
  {
    id: '1',
    name: '일반 채팅방',
    profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: '2',
    name: '팀 프로젝트',
    profileImage: 'https://randomuser.me/api/portraits/women/45.jpg',
  },
  {
    id: '3',
    name: '스터디 그룹',
    profileImage: 'https://randomuser.me/api/portraits/men/66.jpg',
  },
  {
    id: '4',
    name: '친구들 모임',
    profileImage: 'https://randomuser.me/api/portraits/women/23.jpg',
  },
  {
    id: '5',
    name: '게임 채팅방',
    profileImage: 'https://randomuser.me/api/portraits/men/12.jpg',
  },
]

const { isConnected, lastMessage, disconnect, error } = useOnlineUsersWebSocket({
  userId,
  onMessage: () => console.log('메시지 수신'),
  onConnect: () => console.log('온라인 유저 연결 완료'),
  onDisconnect: () => console.log('온라인 유저 소켓 해제'),
  onError: (error) => console.error(error),
})

watch(lastMessage, (newOnlineUsers) => {
  onlineUsers.value = newOnlineUsers?.filter((user) => user.id !== userId)
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.chat-app {
  display: flex;
  height: 100vh;
  background: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
}

.sidebar {
  width: 320px;
  background: white;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
}

.unread {
  background: #f56c6c;
  color: white;
  font-size: 12px;
  font-weight: bold;
  padding: 2px 8px;
  border-radius: 12px;
  min-width: 20px;
  text-align: center;
}

.chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
}
/* ✅ 텍스트 길이에 따라 자동 조절 */
.bubble {
  display: inline-block;
  background: white;
  padding: 10px 14px;
  border-radius: 12px;
  max-width: 150%; /* 메시지 버블 최대 너비 */
  word-wrap: break-word; /* 오래된 브라우저 호환용 */
  overflow-wrap: break-word; /* 최신 브라우저에서 긴 문자열 끊기 */
  word-break: break-word; /* 긴 단어 강제 줄바꿈 */
  white-space: pre-wrap; /* 줄바꿈 문자(\n)는 유지 */
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
  text-align: left; /* ✅ 줄바꿈 기준을 왼쪽으로 */
}

.bubble.me {
  background: #409eff;
  color: white;
  align-self: flex-end;
}

.bubble p {
  margin: 0;
  line-height: 1.4;
}

.time {
  display: block;
  font-size: 0.75rem;
  color: rgba(0, 0, 0, 0.4);
  text-align: right;
  margin-top: 4px;
}

.bubble.me .time {
  color: rgba(255, 255, 255, 0.7);
}
.chat-header {
  height: 64px;
  padding: 0 24px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.chat-header h3 {
  font-size: 20px;
  color: #303133;
}

.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  background: #f5f7fa;
}

.message {
  display: flex;
  margin-bottom: 16px;
}

.message.me {
  justify-content: flex-end;
}

.message-box {
  max-width: 60%;
  display: flex;
  flex-direction: column;
}

.message.me .message-box {
  align-items: flex-end;
}

.username {
  font-size: 12px;
  font-weight: 600;
  color: #909399;
  margin-bottom: 4px;
  padding: 0 4px;
}

.bubble {
  padding: 12px 16px;
  border-radius: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.bubble:not(.me) {
  background: white;
  color: #303133;
  border: 1px solid #e0e0e0;
  border-bottom-left-radius: 4px;
}

.bubble.me {
  background: #409eff;
  color: white;
  border-bottom-right-radius: 4px;
}

.bubble p {
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
}

.time {
  font-size: 11px;
  display: block;
  margin-top: 4px;
}

.bubble:not(.me) .time {
  color: #909399;
}

.bubble.me .time {
  color: rgba(255, 255, 255, 0.8);
}

.input-area {
  height: 80px;
  padding: 0 24px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
}

.input-area input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.input-area input:focus {
  border-color: #409eff;
}

.input-area button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #409eff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.input-area button:hover {
  background: #66b1ff;
}

.input-area button .icon {
  width: 16px;
  height: 16px;
}

.empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #c0c4cc;
}

.empty-icon {
  width: 96px;
  height: 96px;
  opacity: 0.5;
  margin-bottom: 16px;
}

.empty p {
  font-size: 20px;
  font-weight: 500;
}
</style>
