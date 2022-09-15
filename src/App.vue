<template>
  <div>我是App</div>
  <h1>user信息 {{ store.user }}</h1>
  <button @click="store.setUser({ id: '1', token: '1', avatar: '1', mobile: '1', account: '1' })">
    login
  </button>
  <button @click="store.delUser()">logout</button>
</template>

<script setup lang="ts">
import useUserStore from './stores/user'

const store = useUserStore()
</script>

<style scoped></style>
