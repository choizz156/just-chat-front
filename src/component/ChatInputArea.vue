<script setup lang="ts">
import { ref } from 'vue';

const text = ref('');
const emit = defineEmits(['send']);

const handleSend = () => {
  emit('send', text.value);
  text.value = '';
};
</script>

<template>
  <div class="chat-input-area">
    <button class="chat-input-button">📎</button>
    <input
      v-model="text"
      type="text"
      class="chat-input"
      placeholder="메시지를 입력하세요..."
      @keypress.enter="handleSend"
    />
    <button class="send-button" @click="handleSend">➤</button>
  </div>
</template>

<style scoped>
.chat-input-area {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  background-color: #ffffff;
  border-top: 1px solid #e0e0e0;
  gap: 12px;
}

.chat-input-button {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background-color: #f3f4f6;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  font-size: 20px;
}

.chat-input-button:hover {
  background-color: #e5e7eb;
  transform: scale(1.05);
}

.chat-input {
  flex: 1;
  padding: 10px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  font-size: 15px;
  outline: none;
  transition: all 0.2s;
  background-color: #f9fafb;
}

.chat-input:focus {
  border-color: #667eea;
  background-color: #ffffff;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.send-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);
  font-size: 20px;
}

.send-button:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.4);
}

.send-button:active {
  transform: scale(0.95);
}
</style>
