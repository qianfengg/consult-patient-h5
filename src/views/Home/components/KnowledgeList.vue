<script setup lang="ts">
import { ref } from 'vue'
import KnowledgeCard from './KnowledgeCard.vue'
const loading = ref(false)
const finished = ref(false)
const list = ref<number[]>([])
const onLoad = () => {
  console.log('loading')
  setTimeout(() => {
    const data = [1, 2, 3, 4, 5]
    list.value.push(...data)
    loading.value = false
    if (list.value.length > 20) {
      finished.value = true
    }
  }, 1000)
}
</script>

<template>
  <div class="knowledge-list">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <knowledge-card v-for="i in list" :key="i"></knowledge-card>
    </van-list>
  </div>
</template>

<style lang="scss" scoped>
.knowledge-list {
  padding: 0 15px;
}
</style>
