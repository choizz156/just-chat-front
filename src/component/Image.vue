<script setup lang="ts">
import type { UploadFile, UploadProps } from 'element-plus'
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
const profileImageFile = ref<UploadFile>()
const imageUrl = ref('')

const handleFileChange: UploadProps['onChange'] = (uploadFile) => {
  if (uploadFile.raw) {
    profileImageFile.value = uploadFile
    imageUrl.value = URL.createObjectURL(uploadFile.raw)
  }
}
</script>

<template>
  <el-form-item class="profile-image-item">
    <div style="width: 100%; text-align: center; margin-bottom: 8px">프로필 이미지</div>
    <el-upload
      action="#"
      class="avatar-uploader"
      :auto-upload="false"
      :show-file-list="false"
      :on-change="handleFileChange"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar" @load="$emit('imageLoad', imageUrl)" />
      <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
    </el-upload>
  </el-form-item>
</template>

<style scoped>
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

.profile-image-item :deep(.el-form-item__content) {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  text-align: center;
}
</style>
