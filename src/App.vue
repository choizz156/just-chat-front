<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <RouterLink to="/">Home</RouterLink>
  <RouterLink to="/join">회원가입</RouterLink>
  <RouterView />
</template>

<style scoped></style>
