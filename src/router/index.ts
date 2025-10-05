import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/component/HomeView.vue'
import JoinView from '@/component/JoinView.vue'
import LoginView from '@/component/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
    },
    {
      path: '/join',
      name: 'Join',
      component: JoinView,
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginView,
    }
  ],
})

export default router
