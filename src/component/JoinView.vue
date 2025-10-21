<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules, UploadFile, UploadProps } from 'element-plus'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { join } from '@/api/api.ts'
import Image from '@/component/Image.vue'

const router = useRouter()
const ruleFormRef = ref<FormInstance>()
const imageUrl = ref('')

const setImageUrl = (url: string) => {
  imageUrl.value = url
}

const validatePass = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('비밀번호를 입력해주세요.'))
  } else if (value.length < 4) {
    callback(new Error('비밀번호는 4자리 이상이어야합니다.'))
  } else {
    if (ruleForm.checkPass !== '') {
      if (!ruleFormRef.value) return
      ruleFormRef.value.validateField('checkPass')
    }
    callback()
  }
}
const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('비밀번호를 한번 더 입력해주세요.'))
  } else if (value !== ruleForm.pass) {
    callback(new Error('두 비밀번호가 다릅니다.'))
  } else {
    callback()
  }
}

const validateNickname = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('닉네임을 입력해주세요.'))
  } else if (value.includes(' ')) {
    callback(new Error('닉네임에 공백이 있어서는 안됩니다.'))
  } else {
    callback()
  }
}

const validateEmail = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('Email을 입력해주세요.'))
  } else if (!value.includes('@') || !value.includes('.')) {
    callback(new Error('올바른 이메일 형식이 아닙니다.'))
  } else if (/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(value)) {
    callback(new Error('올바른 이메일 형식이 아닙니다.'))
  } else {
    callback()
  }
}

const ruleForm = reactive({
  username: '',
  pass: '',
  checkPass: '',
  nickname: '',
})

const rules = reactive<FormRules<typeof ruleForm>>({
  username: [
    { type: 'email', message: '올바른 이메일 형식이 아닙니다', trigger: 'blur' },
    { validator: validateEmail, required: true, trigger: 'blur' },
  ],
  pass: [{ validator: validatePass, trigger: 'blur' }],
  checkPass: [{ validator: validatePass2, trigger: 'blur' }],
  nickname: [{ validator: validateNickname, trigger: 'blur' }],
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      try {
        await join(ruleForm.username, ruleForm.pass, ruleForm.nickname, imageUrl.value)

        ElMessage.success('회원가입이 완료되었습니다!')
        await router.push('/')
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || '회원가입에 실패했습니다. 다시 시도해주세요.'
        ElMessage.error(errorMessage)
      }
    } else {
      ElMessage.error('입력값을 다시 확인해주세요.')
    }
  })
}
</script>
<template>
  <div class="join-container">
    <el-card class="join-card">
      <template #header>
        <div class="card-header">
          <span>회원 가입</span>
        </div>
      </template>
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        status-icon
        :rules="rules"
        label-position="top"
        class="demo-ruleForm"
        @submit.prevent="submitForm(ruleFormRef)"
      >
        <Image @imageLoad="setImageUrl" />
        <el-form-item label="이메일" prop="username">
          <el-input v-model="ruleForm.username" />
        </el-form-item>
        <el-form-item label="비밀번호" prop="pass">
          <el-input v-model="ruleForm.pass" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="비밀번호 확인" prop="checkPass">
          <el-input v-model="ruleForm.checkPass" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="닉네임" prop="nickname">
          <el-input v-model="ruleForm.nickname" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit" class="submit-btn"> 회원가입 </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.join-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
}

.join-card {
  width: 450px;
  padding: 20px;
}

.card-header {
  text-align: center;
  font-size: 24px;
  font-weight: 600;
}

.submit-btn {
  width: 100%;
}

.profile-image-item :deep(.el-form-item__content) {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-uploader .avatar {
  width: 120px;
  height: 120px;
  display: block;
  border-radius: 50%;
}

:deep(.avatar-uploader .el-upload) {
  border: 1px dashed var(--el-border-color);
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

:deep(.avatar-uploader .el-upload:hover) {
  border-color: var(--el-color-primary);
}


</style>
