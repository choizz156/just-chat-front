<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <div class="app-title">Just Chatting</div>
      </template>

      <el-form ref="loginFormRef" :model="loginForm" :rules="rules" label-width="0" size="large">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="e-mail" prefix-icon="User" />
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
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import router from '@/router'
import { useUserStore } from '@/store/userStore.ts'
import type { UserInfo } from '@/types/index.ts'
import { login } from '@/api/api.ts'

const loginFormRef = ref<FormInstance>()
const loading = ref(false)

const loginForm = reactive({
  username: '',
  password: '',
})

const rules = reactive<FormRules>({
  username: [
    { required: true, message: '이메일을 입력해주세요', trigger: 'blur' },
    { type: 'email', message: '올바른 이메일 형식이 아닙니다', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '비밀번호를 입력해주세요', trigger: 'blur' },
    { min: 4, message: '비밀번호는 최소 4자 이상이어야 합니다', trigger: 'blur' },
  ],
})

const handleLogin = async () => {
  if (!loginFormRef.value) return

  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true

      try {
        const res = await login(loginForm.username, loginForm.password)

        storeUserInfo(res.data.result)
        ElMessage.success('로그인 성공!')
        await router.push('/chatting')
      } catch (error: any) {
        console.error(error.message)
        const errorMessage = '로그인에 실패했습니다.'
        ElMessage.error(errorMessage)
      } finally {
        loading.value = false
      }
    }
  })
}

const { setUserInfo } = useUserStore()
function storeUserInfo(data: any) {
  const imageUrl: string = data.profileImage
    ? data.profileImage
    : `https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png`

  const userInfo: UserInfo = {
    id: data.id,
    nickname: data.nickname,
    email: data.email,
    profileImage: imageUrl,
  }
  setUserInfo(userInfo)
}

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
