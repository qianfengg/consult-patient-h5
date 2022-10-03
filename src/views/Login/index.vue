<script setup lang="ts">
import { loginByCode, loginByPassword, sendMobileCode } from '@/services/user'
import { useUserStore } from '@/stores'
import { mobileRules, passwordRules, codeRules } from '@/utils/rules'
import { Toast, type FormInstance } from 'vant'
import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const agree = ref(false)
const showPwd = ref(false)
const isPasswordLogin = ref(true)

const mobile = ref('')
const password = ref('')
const code = ref('')

const store = useUserStore()
const router = useRouter()
const route = useRoute()

const login = async () => {
  if (!agree.value) {
    return Toast('请勾选协议')
  }
  // console.log('可以发请求了', mobile.value, password.value)
  const res = isPasswordLogin.value
    ? await loginByPassword(mobile.value, password.value)
    : await loginByCode(mobile.value, code.value)
  store.setUser(res.data)
  router.replace((route.query.returnUrl as string) || '/user')
  Toast.success('登录成功')
}

// API 接口函数
// 发送验证码逻辑
// 2.1 判断是否已经发送验证码
// 2.2 校验手机
// 2.3 发送请求
// 倒计时逻辑
const time = ref(0)
let timer: number = -1
const form = ref<FormInstance | null>(null)
const send = async () => {
  if (time.value > 0) return
  await form.value?.validate('mobile')
  await sendMobileCode(mobile.value, 'login')
  Toast.success('发送成功')
  time.value = 60
  if (timer > 0) clearInterval(timer)
  timer = window.setInterval(() => {
    time.value--
    if (time.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}
onUnmounted(() => {
  clearInterval(timer)
})
onMounted(() => {
  // 组件渲染完毕，使用QC生成QQ登录按钮，目的得到跳转链接
  // QC.Login({
  //   btnId: 'qq'
  // })
})
</script>

<template>
  <div class="login-page">
    <cp-nav-bar right-text="注册" @click-right="$router.push('/register')"></cp-nav-bar>
    <div class="login-head">
      <h3>{{ isPasswordLogin ? '密码' : '短信' }}登录</h3>
      <a href="javascript:;" @click="isPasswordLogin = !isPasswordLogin">
        <span>{{ !isPasswordLogin ? '密码' : '短信验证码' }}登录</span>
        <van-icon name="arrow"></van-icon>
      </a>
    </div>
    <!-- form 表单 -->
    <van-form ref="form" @submit="login" autocomplete="off">
      <van-field
        name="mobile"
        :rules="mobileRules"
        v-model="mobile"
        type="tel"
        placeholder="请输入手机号"
      ></van-field>
      <van-field
        v-if="isPasswordLogin"
        :rules="passwordRules"
        v-model="password"
        :type="`${showPwd ? 'text' : 'password'}`"
        placeholder="请输入密码"
      >
        <template #right-icon>
          <cp-icon
            @click="showPwd = !showPwd"
            :name="`login-eye-${showPwd ? 'on' : 'off'}`"
          ></cp-icon>
        </template>
      </van-field>
      <van-field v-else v-model="code" placeholder="请输入验证码" :rules="codeRules">
        <template #button>
          <span @click="send" class="btn-send" :class="{ active: time > 0 }">{{
            time > 0 ? `${time}s后再发送` : '发送验证码'
          }}</span>
        </template>
      </van-field>
      <div class="cp-cell">
        <van-checkbox v-model="agree">
          <span>我已同意</span>
          <a href="javascript:;">用户协议</a>
          <span>及</span>
          <a href="javascript:;">隐私条款</a>
        </van-checkbox>
      </div>
      <div class="cp-cell">
        <van-button native-type="submit" block round type="primary">登 录</van-button>
      </div>
      <div class="cp-cell">
        <a href="javascript:;">忘记密码？</a>
      </div>
    </van-form>
    <div class="login-other">
      <!-- <div class="icon" id="qq"></div> -->
      <van-divider>第三方登录</van-divider>
      <a
        @click="store.setReturnUrl(route.query.returnUrl as string)"
        href="https://graph.qq.com/oauth2.0/authorize?client_id=102015968&response_type=token&scope=all&redirect_uri=http%3A%2F%2Fconsult-patients.itheima.net%2Flogin%2Fcallback"
        class="icon"
      >
        <img src="@/assets/qq.svg" alt="" />
      </a>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/styles/login.scss';
</style>
