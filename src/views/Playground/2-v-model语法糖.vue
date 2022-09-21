<script setup lang="ts">
import { ref } from 'vue'
import SonComp from './components/SonComp.vue'
const count = ref(10)
const car = ref('小车车')
</script>

<template>
  <div class="playground-page">playground</div>
  <!-- :count.sync="count" -->
  <!-- <son-comp :count="count" @update:count="count = $event"></son-comp> -->
  <!-- :modelValue="car" @update:modelValue='car = $event' -->
  <son-comp v-model:count="count" v-model="car"></son-comp>
</template>

<style scoped lang="scss"></style>
