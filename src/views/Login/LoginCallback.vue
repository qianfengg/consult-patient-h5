<script setup lang="ts">
// http://consult-patients.itheima.net/login
import { onMounted, ref } from 'vue'
import { loginByQQ } from '@/services/user'

const openId = ref('')
const isBind = ref(true)
onMounted(() => {
  if (window.QC.Login.check()) {
    window.QC.Login.getMe((id) => {
      openId.value = id
      // QQ，登录
      loginByQQ(id)
        .then((res) => {
          // 登录成功
          console.log('登录成功')
        })
        .catch(() => {
          // 登录失败
          console.log('登录失败')
          isBind.value = false
        })
    })
  }
})
</script>

<template>
  <div class="callback-page">callback</div>
</template>

<style scoped lang="scss"></style>
