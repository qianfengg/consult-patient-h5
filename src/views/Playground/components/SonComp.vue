<script setup lang="ts">
defineProps<{
  count: number
  modelValue: string
}>()
const emit = defineEmits<{
  // eslint-disable-next-line no-unused-vars
  (e: 'update:count', val: number): void
  // eslint-disable-next-line no-unused-vars
  (e: 'update:modelValue', val: string): void
}>()
</script>

<template>
  <div class="son-page">son</div>
  <h1>{{ count }} - <button @click="emit('update:count', count + 1)">改count</button></h1>
  <h1>{{ modelValue }} - <button @click="emit('update:modelValue', '大车车')">改车</button></h1>
</template>

<style scoped lang="scss"></style>
