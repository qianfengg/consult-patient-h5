<script setup lang="ts">
// http://consult-patients.itheima.net/login
import { onMounted, onUnmounted, ref } from 'vue'
import { loginByQQ, sendMobileCode, bindMobile } from '@/services/user'
import { mobileRules, codeRules } from '@/utils/rules'
import { Toast, type FormInstance } from 'vant'
import type { User } from '@/types/user'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'

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
          console.log('登录成功', res)
          loginSuccess(res)
        })
        .catch(() => {
          // 登录失败
          console.log('登录失败')
          isBind.value = false
        })
    })
  }
})

const store = useUserStore()
const router = useRouter()
const loginSuccess = (res: { data: User }) => {
  store.setUser(res.data)
  router.replace(store.returnUrl || '/user')
  Toast.success('登录成功')
  store.setReturnUrl('')
}

const mobile = ref()
const code = ref()
const bind = async () => {
  const res = await bindMobile({
    mobile: mobile.value,
    code: code.value,
    openId: openId.value
  })
  loginSuccess(res)
}
const time = ref(0)
let timer: number = -1
const form = ref<FormInstance | null>(null)
const send = async () => {
  if (time.value > 0) return
  await form.value?.validate('mobile')
  await sendMobileCode(mobile.value, 'bindMobile')
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
  <div class="login-page" v-if="!isBind">
    <cp-nav-bar></cp-nav-bar>
    <div class="login-head">
      <h3>手机绑定</h3>
    </div>
    <van-form autocomplete="off" ref="form">
      <van-field
        :rules="mobileRules"
        v-model="mobile"
        name="mobile"
        placeholder="请输入手机号"
      ></van-field>
      <van-field :rules="codeRules" v-model="code" name="code" placeholder="请输入验证码">
        <template #button>
          <span class="btn-send" :class="{ active: time > 0 }" @click="send">{{
            time > 0 ? `${time}s后再次发送` : '发送验证码'
          }}</span>
        </template>
      </van-field>
      <div class="cp-cell">
        <van-button @click="bind" block round type="primary" native-type="submit">
          立即绑定
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<style scoped lang="scss">
@import '@/styles/login.scss';
</style>
