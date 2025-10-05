<script setup lang="ts">
defineProps({
  message: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div class="message" :class="message.sender === 'me' ? 'sent' : 'received'">
    <div v-if="message.sender === 'other'" class="message-avatar">{{ message.avatar }}</div>
    <div class="message-content">
      <div class="message-bubble">{{ message.text }}</div>
    </div>
  </div>
</template>

<style scoped>
.message {
  display: flex;
  margin-bottom: 16px;
  animation: fadeIn 0.3s ease-in;
}
/* 받은 메시지 */
.message.received {
  justify-content: flex-start;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
/* 보낸 메시지 */
.message.sent {
  justify-content: flex-end;
}
.message-bubble {
  padding: 10px 14px;
  border-radius: 18px;
  word-wrap: break-word;
  line-height: 1.4;
  font-size: 15px;
  position: relative;
}
.message-time {
  font-size: 11px;
  color: #9ca3af;
  margin-top: 4px;
  padding: 0 4px;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 8px;
  background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 14px;
  align-self: flex-end;
  flex-shrink: 0;
}

.message.sent .message-avatar {
  display: none;
}

.message-content {
  max-width: 60%;
  display: flex;
  flex-direction: column;
}

.message.received .message-bubble {
  background-color: #ffffff;
  color: #1a1a1a;
  border-bottom-left-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.message.sent .message-bubble {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  border-bottom-right-radius: 4px;
  box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);
}

.message.received .message-time {
  text-align: left;
}

.message.sent .message-time {
  text-align: right;
  color: #9ca3af;
}
</style>
