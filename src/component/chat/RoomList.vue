<script setup lang="ts">
import { MessageCircle } from 'lucide-vue-next'
import { type Room } from '@/types/index.ts'
import { ref, watch } from 'vue'
import { makeGroupChatRoom } from '@/api/api.ts'
import { state } from '@/store/userStore.ts'
import Image from '@/component/Image.vue'
import { ElMessage } from 'element-plus'
import type { TabsPaneContext } from 'element-plus'
import type { ScrollbarDirection } from 'element-plus'
const props = defineProps<{
  groupRooms: Room[]
  roomsForMe: Room[]
}>()

const emit = defineEmits<(e: 'roomCreated', groupRoom: Room) => void>()

const searchTerm = ref<string>('')
const selectedRoom = ref<string>('')
const filteredRooms = ref<Room[]>([])
const description = ref<string>('')
const imageUrl = ref<string>('')
const name = ref<string>('')
const dialogVisible = ref<boolean>(false)
const activeName = ref<string>('private')
const scrollSize = ref(30)

const loadMore = (direction: ScrollbarDirection) => {
  if (direction === 'bottom') {
    scrollSize.value += 5
  }
}

const setImageUrl = (url: string) => {
  imageUrl.value = url
}

const filterRoom = (term: string) => {
  if (!props.groupRooms?.length && !props.roomsForMe?.length) {
    filteredRooms.value = []
    return
  }

  if (!term.trim()) {
    filteredRooms.value = []
    return
  }

  const lowerTerm = term.toLowerCase()

  const groupFiltered = (props.groupRooms || []).filter((room: Room) =>
    room.name.toLowerCase().includes(lowerTerm),
  )

  const directFiltered = (props.roomsForMe || []).filter((room: Room) =>
    room.name.toLowerCase().includes(lowerTerm),
  )

  filteredRooms.value = [...groupFiltered, ...directFiltered]
}

const makeRoom = async () => {
  try {
    const resp = await makeGroupChatRoom(
      state.userInfo!.id,
      name.value,
      description.value,
      imageUrl.value,
    )

    const item = resp.data.result
    const room: Room = {
      id: item.id,
      name: item.name,
      type: item.type,
      description: item.description,
      profileImage: item.imageUrl,
    }
    ElMessage.success('채팅방이 생성됐습니다!')
    emit('roomCreated', room)
  } catch (err) {
    console.error(err)
    const errorMessage = '채팅방 생성에 실패했습니다.'
    ElMessage.error(errorMessage)
  } finally {
    dialogVisible.value = false
    name.value = ''
    description.value = ''
  }
}

const handleClick = () => {}

function openDialog() {
  dialogVisible.value = true
}

watch(searchTerm, (newTerm) => {
  filterRoom(newTerm)
})
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
      <el-tabs v-model="activeName" stretch="true" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="오픈 그룹 채팅" name="first">
          <el-scrollbar height="800px" @end-reached="loadMore" class="scroll-area">
            <div
              v-for="groupRoom in groupRooms"
              :key="groupRoom.id"
              @click="selectedRoom = groupRoom.id"
              class="room-item"
              :class="{ active: selectedRoom === groupRoom.id }"
            >
              <div class="flex items-center" style="gap: 8px">
                <el-avatar
                  :size="40"
                  :src="groupRoom.profileImage"
                  class="border-2 border-gray-200"
                />
              </div>
              <span>{{ groupRoom.name }}</span>
            </div>
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane label="나의 채팅방" name="second">
          <el-scrollbar height="800px" @end-reached="loadMore" class="scroll-area">
            <div
              v-for="room in roomsForMe"
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
          </el-scrollbar>
        </el-tab-pane>
      </el-tabs>
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

.demo-tabs > .el-tabs__content {
  padding: 30px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

.scroll-area {
  max-height: 500px;
  overflow-y: auto;
}
</style>
