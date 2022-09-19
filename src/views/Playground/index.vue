<script setup lang="ts">
import { Button as VanButton } from 'vant'
</script>

<template>
  <div>Playground</div>
  <h1>test h1 color</h1>
  <div class="test-div"></div>
  <div class="test-div"></div>
  <van-button type="primary">test</van-button>
</template>

<style scoped lang="scss">
h1 {
  background-color: var(--test-color);
}
.test-div {
  width: 200px;
  height: 200px;
  margin: 5px;
}
div:nth-of-type(2) {
  background: var(--test-color);
}
div:nth-of-type(3) {
  border: 1px solid var(--test-color);
}
</style>
