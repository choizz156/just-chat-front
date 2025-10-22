<script setup lang="ts">
import { MessageCircle } from 'lucide-vue-next'
import { type OnlineUserInfo, type Room } from '@/types/index.ts'
import { ref, watch } from 'vue'
import { makeChatRoom } from '@/api/api.ts'
import { state } from '@/store/userStore.ts'
import Image from '@/component/Image.vue'
import { ElMessage } from 'element-plus'

const props = defineProps<{ rooms: Room[] }>()

const searchTerm = ref<string>('')
const selectedRoom = ref<string>('')
const filteredRooms = ref<Room[]>([])
const description = ref<string>('')
const imageUrl = ref<string>('')
const name = ref<string>('')
const dialogVisible = ref(false)

const setImageUrl = (url: string) => {
  imageUrl.value = url
}

const filterRoom = (term: string) => {
  if (!props.rooms) {
    filteredRooms.value = []
    return
  }

  if (!term.trim()) {
    filteredRooms.value = []
    return
  }

  filteredRooms.value = props.rooms.filter((room: Room) => {
    return room.name.toLowerCase().includes(term)
  })
}

const makeRoom = async () => {
  try {
    const resp = await makeChatRoom(
      state.userInfo!.id,
      name.value,
      description.value,
      imageUrl.value,
    )

    const item = resp.data.result
    const room: Room = {
      id: item.id,
      name: item.name,
      description: item.description,
      profileImage: item.imageUrl,
    }
    ElMessage.success('채팅방이 생성됐습니다!')
    props.rooms.push(room)
  } catch (err) {
    console.error(err)
    const errorMessage = '채팅방 생성에 실패했습니다.'
    ElMessage.error(errorMessage)
  } finally {
    dialogVisible.value = false
    name.value = ''
    description.value=''
  }
}

function openDialog() {
  dialogVisible.value = true
}

watch(searchTerm, (newTerm) => {
  filterRoom(newTerm)
})

watch(
  () => props.rooms,
  () => {
    console.log('RoomList: props.rooms 변경 감지됨')
    filterRoom(searchTerm.value)
  },
  { deep: true },
)
</script>

<template>
  <div class="room-list">
    <h2 class="chat-header">
      <div class="left">
        <MessageCircle class="icon" />
        <span>채팅방</span>
      </div>
      <el-button type="primary" @click="openDialog">채팅방 만들기</el-button>
    </h2>

    <el-dialog v-model="dialogVisible" width="300px" :title="`채팅방을 생성하시겠습니까?`">
      <div>
        채팅방 이름
        <el-input v-model="name" type="text"></el-input>
      </div>
      <div>
        설명
        <el-input v-model="description" type="textarea" maxlength="250" show-word-limit></el-input>
      </div>
      <Image @ImageLoad="setImageUrl" />
      <template #footer>
        <div class="flex justify-end space-x-2">
          <el-button @click="dialogVisible = false">취소</el-button>
          <el-button type="primary" @click="makeRoom">만들기</el-button>
        </div>
      </template>
    </el-dialog>

    <el-input
      v-model="searchTerm"
      placeholder="채팅방 검색..."
      prefix-icon="Search"
      clearable
      class="mb-3"
    />

    <template v-if="filteredRooms.length > 0">
      <div
        v-for="filterRoom in filteredRooms"
        :key="filterRoom.id"
        @click="selectedRoom = filterRoom.id"
        class="room-item"
        :class="{ active: selectedRoom === filterRoom.id }"
      >
        <div class="flex items-center" style="gap: 8px">
          <el-avatar :size="40" :src="filterRoom.profileImage" class="border-2 border-gray-200" />
        </div>
        <span>{{ filterRoom.name }}</span>
      </div>
    </template>

    <template v-else-if="searchTerm">
      <p class="no-result">검색 결과가 없습니다 😢</p>
    </template>

    <template v-else>
      <div
        v-for="room in rooms"
        :key="room.id"
        @click="selectedRoom = room.id"
        class="room-item"
        :class="{ active: selectedRoom === room.id }"
      >
        <div class="flex items-center" style="gap: 8px">
          <el-avatar :size="40" :src="room.profileImage" class="border-2 border-gray-200" />
        </div>
        <span>{{ room.name }}</span>
      </div>
    </template>
  </div>
</template>

<style scoped>
.room-list {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.room-list h2 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  color: #333;
  margin-bottom: 12px;
}

.room-list h2 .icon {
  width: 20px;
  height: 20px;
  color: #409eff;
}

.search-box {
  position: relative;
  margin-bottom: 12px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: #909399;
}

.search-box input {
  width: 100%;
  padding: 10px 12px 10px 36px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.search-box input:focus {
  border-color: #409eff;
}

.room-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 4px;
}

.room-item:hover {
  background: #f5f7fa;
}

.room-item.active {
  background: #ecf5ff;
  border-left: 4px solid #409eff;
}

.room-item span {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

.room-item.active span {
  color: #409eff;
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.chat-header .left {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
