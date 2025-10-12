<script setup lang="ts">
import type { OnlineUserInfo } from '@/types'

defineProps(['onlineUsers'])

</script>

<template>
  <div class="sidebar">
    <div class="user-list">
      <h2><User class="icon" /> 온라인 유저</h2>
      <el-scrollbar height="180px">
        <div v-for="user in onlineUsers" :key="user.id" class="user-item">
          <div class="avatar">
            <el-avatar :size="40" :src="user.profileImage" class="border-2 border-gray-200" />
          </div>
          <span>{{ user.nickname }}</span>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  width: 320px;
  background: white;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
}
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
</style>
