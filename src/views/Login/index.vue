<script setup lang="ts">
// import CpNavBar from '../../components/cp-nav-bar.vue'
// import { Button as VanButton, Checkbox as VanCheckbox } from 'vant'
const clickFn = () => {
  console.log('click fn')
}
</script>

<template>
  <div class="login-page">
    <cp-nav-bar title="测试title" right-text="测试右侧文字" @right-click="clickFn"></cp-nav-bar>>
    <van-button type="primary">按钮</van-button>
    <van-checkbox :checked="true">复选框</van-checkbox>
    <van-icon name="chat-o" />
  </div>
</template>

<style lang="scss" scoped></style>
