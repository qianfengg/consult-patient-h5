<template>
  <div>我是App</div>
  <h1>user信息 {{ store.user }}</h1>
  <button @click="store.setUser({ id: '1', token: '1', avatar: '1', mobile: '1', account: '1' })">
    login
  </button>
  <button @click="store.delUser()">logout</button>
  <van-button type="danger">click</van-button>
  <div class="test-div"></div>
  <hr />
  <h1>test request</h1>
  <van-button @click="loginTest">test login</van-button>
  <van-button @click="getUserInfo">get info</van-button>
</template>

<script setup lang="ts">
import { useUserStore } from './stores'
import { Button as VanButton } from 'vant'
import { request } from './utils/request'
import type { User } from '@/types/user'

const store = useUserStore()
// 登录的时候把密码改错，是测试？
// 业务逻辑失败
// 登录成功，看 res 打印，是测试？
// 剥离一层数据
// 获取用户信息成功，是测试？
// 是否携带token
// 把 token 删除或修改，获取用户信息失败，是测试？
// 401 token 失效跳转 login 页面
const loginTest = () => {
  console.log('login test')
  request<User>('login/password', 'post', {
    password: 'abc12345',
    mobile: '13211112222'
  }).then((res) => {
    console.log(res)
    store.setUser(res.data)
  })
}
const getUserInfo = () => {
  request('patient/myUser').then((res) => console.log(res))
}
</script>

<style scoped>
.test-div {
  width: 187.5px;
  height: 100px;
  background-color: red;
}
</style>
