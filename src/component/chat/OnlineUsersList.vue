<script setup lang="ts">
import type { OnlineUserInfo } from '@/types'
import { ref } from 'vue'
import { createRoom } from'@/api/api.ts'
import { state } from '@/store/userStore.ts'
import { ElMessage } from 'element-plus'

defineProps<{ onlineUsers: OnlineUserInfo[] | null }>()

const dialogVisible = ref(false)
const selectedUser = ref<OnlineUserInfo | null>(null)

function openDialog(user: OnlineUserInfo) {
  selectedUser.value = user
  dialogVisible.value = true
}

async function createChatRoom() {
  try{
    const res = await createRoom(
      state.userInfo!.id,
      state.userInfo!.nickname,
      selectedUser.value!.id,
      selectedUser.value!.nickname,
      state.userInfo!.profileImage
    )
    ElMessage.success('채팅방이 생성됐습니다!')
  }catch(err){
    console.error(err)
    const errorMessage = '채팅방 생성에 실패했습니다.'
    ElMessage.error(errorMessage)
  }finally{
    dialogVisible.value = false
  }
}
</script>

<template>
  <div class="user-list">
    <h2>온라인 유저</h2>
    <el-scrollbar height="180px">
      <div
        v-for="user in onlineUsers"
        :key="user.id"
        class="user-item flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition"
        @click="openDialog(user)"
      >
        <el-avatar :size="40" :src="user.profileImage" class="border-2 border-gray-200" />
        <span class="text-gray-800">{{ user.nickname }}</span>
      </div>
    </el-scrollbar>

    <!-- 💬 채팅방 만들기 모달 -->
    <el-dialog
      v-model="dialogVisible"
      width="300px"
      :title="selectedUser ? `${selectedUser.nickname}님과 채팅` : '채팅방 만들기'"
    >
      <div class="text-center">
        <p>이 유저와 채팅방을 생성하시겠습니까?</p>
      </div>
      <template #footer>
        <div class="flex justify-end space-x-2">
          <el-button @click="dialogVisible = false">취소</el-button>
          <el-button type="primary" @click="createChatRoom">만들기</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.user-list {
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}
.user-list h2 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  color: #333;
  margin-bottom: 12px;
}
.user-list h2 .icon {
  width: 20px;
  height: 20px;
  color: #409eff;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}
.user-item:hover {
  background: #f5f7fa;
}
.avatar {
  position: relative;
}

.avatar-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  border: 2px solid #e0e0e0;
}
</style>
