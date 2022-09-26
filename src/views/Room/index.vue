<script setup lang="ts">
import RoomStatus from './components/RoomStatus.vue'
import RoomAction from './components/RoomAction.vue'
import RoomMessage from './components/RoomMessage.vue'

import { io } from 'socket.io-client'
import type { Socket } from 'socket.io-client'
import type { TimeMessages, Message } from '@/types/room'
import { onMounted, onUnmounted, ref } from 'vue'
import { baseURL } from '@/utils/request'
import { useUserStore } from '@/stores'
import { useRoute } from 'vue-router'
import { MsgType, OrderType } from '@/enums'
import type { ConsultOrderItem } from '@/types/consult'
import { getConsultOrderDetail } from '@/services/consult'

const store = useUserStore()
const route = useRoute()

// chatMsgList 接收聊天记录

// sendChatMsg 发送消息

// receiveChatMsg 接收消息

// updateMsgStatus 消息已读

// getChatMsgList 获取聊天记录

// statusChange 接收订单状态改变
let socket: Socket
const list = ref<Message[]>([])
const consult = ref<ConsultOrderItem>({} as ConsultOrderItem)
const requestOrderDetail = async () => {
  const res = await getConsultOrderDetail(route.query.orderId as string)
  // console.log(res.data);
  consult.value = res.data
}
onMounted(async () => {
  socket = io(baseURL, {
    auth: { token: `Bearer ${store.user.token}` },
    query: {
      orderId: route.query.orderId
    }
  })
  socket.on('connect', () => {
    // 建立连接成功
    console.log('connect')
  })

  socket.on('error', () => {
    // 错误异常消息
    console.log('error')
  })

  socket.on('disconnect', () => {
    // 已经断开连接
    console.log('disconnect')
  })
  socket.on('chatMsgList', (res: { data: TimeMessages[] }) => {
    const msgs: Message[] = []
    res.data.forEach((item) => {
      msgs.push({
        id: item.createTime,
        msgType: MsgType.Notify,
        createTime: item.createTime,
        msg: {
          content: item.createTime
        }
      })
      msgs.push(...item.items)
    })
    // console.log(msgs)
    list.value.unshift(...msgs)
  })
  socket.on('statusChange', () => {
    requestOrderDetail()
  })
  requestOrderDetail()
})

onUnmounted(() => {
  socket.close()
})
const sendTextFn = (val: string) => {
  console.log(val)
  socket.emit('sendChatMsg', {
    from: store.user.id,
    to: consult.value.docInfo?.id,
    msgType: MsgType.MsgText,
    msg: {
      content: val
    }
  })
}
</script>

<template>
  <div class="room-page">
    <cp-nav-bar title="问诊室" />
    <room-status :status="consult.status" :countdown="consult.countdown"></room-status>
    <room-message :list="list"></room-message>
    <room-action
      @send-text="sendTextFn"
      :disabled="consult.status !== OrderType.ConsultChat"
    ></room-action>
  </div>
</template>

<style lang="scss" scoped>
.room-page {
  padding-top: 90px;
  padding-bottom: 60px;
  min-height: 100vh;
  box-sizing: border-box;
  background-color: var(--cp-bg);
  .van-pull-refresh {
    width: 100%;
    min-height: calc(100vh - 150px);
  }
}
</style>
