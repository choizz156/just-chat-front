<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <div class="app-title">Just Chatting</div>
      </template>

      <el-form ref="loginFormRef" :model="loginForm" :rules="rules" label-width="0" size="large">
        <el-form-item prop="email">
          <el-input v-model="loginForm.email" placeholder="e-mail" prefix-icon="User" />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="passwrod"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="submit-btn" @click="handleLogin" :loading="loading">
            로그인
          </el-button>
        </el-form-item>

        <el-divider>또는</el-divider>

        <el-form-item>
          <el-button class="submit-btn" @click="handleGoToJoin"> 회원가입 </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import router from '@/router'

const loginFormRef = ref<FormInstance>()
const loading = ref(false)

// 로그인 폼 데이터
const loginForm = reactive({
  email: '',
  password: '',
})

// 유효성 검사 규칙
const rules = reactive<FormRules>({
  email: [
    { required: true, message: '이메일을 입력해주세요', trigger: 'blur' },
    { type: 'email', message: '올바른 이메일 형식이 아닙니다', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '비밀번호를 입력해주세요', trigger: 'blur' },
    { min: 4, message: '비밀번호는 최소 4자 이상이어야 합니다', trigger: 'blur' },
  ],
})

// 로그인 처리
const handleLogin = async () => {
  if (!loginFormRef.value) return

  await loginFormRef.value.validate((valid) => {
    if (valid) {
      loading.value = true

      // TODO: 실제 로그인 API 호출
      setTimeout(() => {
        loading.value = false
        ElMessage.success('로그인 성공!')
        // router.push('/')
      }, 1000)
    }
  })
}

// 회원가입 페이지로 이동
const handleGoToJoin = () => {
  ElMessage.info('회원가입 페이지로 이동')
  router.push('/join')
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
}

.login-card {
  width: 450px;
  padding: 20px;
}

.card-header {
  text-align: center;
  font-size: 24px;
  font-weight: 600;
}

.app-title {
  text-align: center;
  font-size: 32px;
  font-weight: 700;
  color: #409eff;
  margin-bottom: 10px;
}

.submit-btn {
  width: 100%;
}
</style>