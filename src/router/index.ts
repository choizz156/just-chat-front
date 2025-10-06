import { createRouter, createWebHistory } from 'vue-router'
import JoinView from '@/component/JoinView.vue'
import LoginView from '@/component/LoginView.vue'
import ChatArea from '@/component/chat/ChatArea.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Login',
      component: LoginView,
    },
    {
      path: '/join',
      name: 'Join',
      component: JoinView,
    },
    {
      path: '/chatting',
      name:'Chatting',
      component: ChatArea
    }
  ],
})

export default router
