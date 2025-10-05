<script setup lang="ts">
import MessageItem from './MessageItem.vue';

defineProps({
  messages: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <div class="messages-container">
    <div class="message-date">
      <span class="message-date-text">2024년 10월 5일</span>
    </div>

    <MessageItem
      v-for="msg in messages"
      :key="msg.id"
      :message="msg"
    />
  </div>
</template>

<style scoped>
.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: #f5f5f5;
  scroll-behavior: smooth;
}
.message-date {
  text-align: center;
  margin: 20px 0;
}

.message-date-text {
  display: inline-block;
  padding: 6px 12px;
  background-color: rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  font-size: 12px;
  color: #6b7280;
}

/* 스크롤바 스타일 */
.messages-container::-webkit-scrollbar {
  width: 6px;
}

.messages-container::-webkit-scrollbar-track {
  background: transparent;
}

.messages-container::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.messages-container::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.3);
}
</style>
