<script setup lang="ts">
import { ref } from 'vue';
import type { Ref } from 'vue';
import ChatHeader from './ChatHeader.vue';
import MessagesContainer from './MessagesContainer.vue';
import ChatInputArea from './ChatInputArea.vue';

interface Message {
  id: number;
  text: string;
  sender: 'me' | 'other';
  avatar: string;
}

interface User {
  name: string;
  avatar: string;
}

const user: Ref<User> = ref({
  name: 'You',
  avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
});

const messages: Ref<Message[]> = ref([
  { id: 1, text: 'Just Chat에 오신 것을 환영합니다!', sender: 'other', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e' },
  { id: 2, text: '자유롭게 대화를 시작해보세요.', sender: 'other', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e' },
]);

const addMessage = (text: string) => {
  if (text.trim() === '') return;
  messages.value.push({
    id: messages.value.length + 1,
    text,
    sender: 'me',
    avatar: user.value.avatar,
  });
};
</script>

<template>
  <div class="chat-area">
    <ChatHeader :user="user" />
    <MessagesContainer :messages="messages" />
    <ChatInputArea @send="addMessage" />
  </div>
</template>

<style scoped>
.chat-area {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #f5f5f5;
}
</style>
