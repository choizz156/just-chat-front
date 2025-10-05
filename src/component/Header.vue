<template>
  <header class="bg-white shadow-sm">
    <div class="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
      <!-- Logo -->
      <h1 class="text-xl font-bold text-gray-900">MyApp <el-dropdown trigger="click" @command="handleCommand">
        <div class="flex items-center cursor-pointer hover:opacity-80 transition-opacity">
          <el-avatar
            :size="40"
            :src="userProfile.avatar"
            class="border-2 border-gray-200"
          />
          <span class="text-sm font-semibold text-gray-900 ml-4">{{ userProfile.nickname }}</span>
          <el-icon class="text-gray-400 ml-2">
            <arrow-down />
          </el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">
              <el-icon class="mr-2"><user /></el-icon>
              프로필
            </el-dropdown-item>
            <el-dropdown-item command="settings">
              <el-icon class="mr-2"><setting /></el-icon>
              설정
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              <el-icon class="mr-2"><switch-button /></el-icon>
              로그아웃
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown></h1>

      <!-- User Profile Section -->

    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { ArrowDown, User, Setting, SwitchButton } from '@element-plus/icons-vue'

// 사용자 프로필 정보
const userProfile = ref({
  avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
  nickname: '홍길동',
  email: 'hong@example.com'
})

// 드롭다운 메뉴 핸들러
const handleCommand = (command: string) => {
  switch (command) {
    case 'profile':
      ElMessage.info('프로필 페이지로 이동')
      // TODO: router.push('/profile')
      break
    case 'settings':
      ElMessage.info('설정 페이지로 이동')
      // TODO: router.push('/settings')
      break
    case 'logout':
      handleLogout()
      break
  }
}

// 로그아웃 처리
const handleLogout = () => {
  ElMessage.success('로그아웃 되었습니다')
  // TODO: 실제 로그아웃 로직
  // - 토큰 삭제
  // - 스토어 초기화
  // - 로그인 페이지로 리다이렉트
  // router.push('/login')
}
</script>

<style scoped>
.el-dropdown-menu__item {
  display: flex;
  align-items: center;
}
</style>
