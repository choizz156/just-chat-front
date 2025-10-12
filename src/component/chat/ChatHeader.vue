<script setup lang="ts">

</script>

<template>
  <div class="chat-header">
    <div class="chat-header-avatar"></div>
    <div class="chat-header-info">
      <div class="chat-header-name"></div>
      <div class="chat-header-status"></div>
    </div>
  </div>
</template>

<style scoped>
.chat-header {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  background-color: #ffffff;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
.chat-header-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 18px;
}
.chat-header-info {
  flex: 1;
}

.chat-header-name {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 2px 0;
}

.chat-header-status {
  font-size: 13px;
  color: #10b981;
}
</style>
