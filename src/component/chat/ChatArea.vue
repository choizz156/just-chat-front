<script setup lang="ts">
import { ref } from 'vue';
import type { Ref } from 'vue';
import ChatHeader from './ChatHeader.vue';
import MessagesContainer from './MessagesContainer.vue';
import ChatInputArea from './ChatInputArea.vue';


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
