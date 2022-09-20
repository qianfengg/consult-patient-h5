<script setup lang="ts">
import { loginByPassword, sendMobileCode } from '@/services/user'
import { useUserStore } from '@/stores'
import { mobileRules, passwordRules, codeRules } from '@/utils/rules'
import { Toast, type FormInstance } from 'vant'
import { onUnmounted, ref } from 'vue'
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
  const res = await loginByPassword(mobile.value, password.value)
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
      <van-divider>第三方登录</van-divider>
      <div class="icon">
        <img src="@/assets/qq.svg" alt="" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login {
  &-page {
    padding-top: 46px;
  }
  &-head {
    padding: 30px 30px 50px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    line-height: 1;
    h3 {
      font-weight: normal;
      font-size: 24px;
    }
    a {
      font-size: 15px;
    }
  }
  &-other {
    margin-top: 60px;
    padding: 0 30px;
    .icon {
      display: flex;
      justify-content: center;
      img {
        width: 36px;
        height: 36px;
        padding: 4px;
      }
    }
  }
}
.van-form {
  padding: 0 14px;
  .cp-cell {
    height: 52px;
    line-height: 24px;
    padding: 14px 16px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    .van-checkbox {
      a {
        color: var(--cp-primary);
        padding: 0 5px;
      }
    }
  }
  .btn-send {
    color: var(--cp-primary);
    &.active {
      color: rgba(22, 194, 163, 0.5);
    }
  }
}
</style>
