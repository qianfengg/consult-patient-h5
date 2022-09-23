<script setup lang="ts">
import RoomStatus from './components/RoomStatus.vue'
import RoomAction from './components/RoomAction.vue'
</script>

<template>
  <div class="room-page">
    <cp-nav-bar title="问诊室" />
    <room-status></room-status>
    <room-action></room-action>
  </div>
</template>

<style lang="scss" scoped></style>
