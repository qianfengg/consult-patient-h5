<script setup lang="ts">
import RoomStatus from './components/RoomStatus.vue'
import RoomAction from './components/RoomAction.vue'
import RoomMessage from './components/RoomMessage.vue'

import { io } from 'socket.io-client'
import type { Socket } from 'socket.io-client'
import type { TimeMessages, Message } from '@/types/room'
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import { baseURL } from '@/utils/request'
import { useUserStore } from '@/stores'
import { useRoute } from 'vue-router'
import { MsgType, OrderType } from '@/enums'
import type { ConsultOrderItem, Image } from '@/types/consult'
import { getConsultOrderDetail } from '@/services/consult'
import dayjs from 'dayjs'
import { Toast } from 'vant'

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
    list.value = []
  })

  socket.on('error', () => {
    // 错误异常消息
    console.log('error')
  })

  socket.on('disconnect', () => {
    // 已经断开连接
    console.log('disconnect')
  })
  socket.on('chatMsgList', async (res: { data: TimeMessages[] }) => {
    const msgs: Message[] = []
    res.data.forEach((item, i) => {
      if (i === 0) {
        time.value = item.createTime
      }
      msgs.push({
        id: item.createTime,
        msgType: MsgType.Notify,
        createTime: item.createTime,
        msg: {
          content: item.createTime
        }
      })
      // msgs.push(...item.items)
      item.items.forEach((msg) => {
        msgs.push({ ...msg, notScroll: !init.value })
      })
    })
    // console.log(msgs)
    list.value.unshift(...msgs)
    loading.value = false
    if (res.data.length === 0) {
      return Toast('没有聊天记录了')
    }
    await nextTick()
    if (init.value) {
      const id = msgs[msgs.length - 1].id
      // console.log('init', id)
      socket.emit('updateMsgStatus', id)
      window.scrollTo(0, document.body.scrollHeight)
      init.value = false
    }
  })
  socket.on('statusChange', () => {
    requestOrderDetail()
  })
  socket.on('receiveChatMsg', async (res: Message) => {
    // console.log(res)
    list.value.push(res)
    await nextTick()
    socket.emit('updateMsgStatus', res.id)
    window.scrollTo(0, document.body.scrollHeight)
  })
  requestOrderDetail()
})

onUnmounted(() => {
  socket.close()
})
const sendTextFn = (val: string) => {
  // console.log(val)
  socket.emit('sendChatMsg', {
    from: store.user.id,
    to: consult.value.docInfo?.id,
    msgType: MsgType.MsgText,
    msg: {
      content: val
    }
  })
}
const sendImageFn = (img: Image) => {
  socket.emit('sendChatMsg', {
    from: store.user.id,
    to: consult.value.docInfo?.id,
    msgType: MsgType.MsgImage,
    msg: {
      picture: img
    }
  })
}

// 实现下拉刷新效果
// 记录每段消息的开始时间，作为下一次请求的开始时间
// 触发刷新，发送获取聊天记录消息
// 在接收聊天记录事件中
// 关闭刷新中效果
// 判断是否有数据？没有提示 没有聊天记录了
// 如果是初始化获取的聊天，需要滚动到最底部
// 如果是第二，三...次获取消息,不需要滚动到底部
// 如果断开连接后再次连接，需要清空聊天记录
const init = ref(true)
const loading = ref(false)
const onRefresh = () => {
  // console.log('refresh')
  // setTimeout(() => {
  //   loading.value = false
  // }, 2000)
  //向socket服务端发送数据 参数：pageSize: number, lastTime: string, orderId: string
  socket.emit('getChatMsgList', 20, time.value, route.query.orderId)
}
const time = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'))
</script>

<template>
  <div class="room-page">
    <cp-nav-bar title="问诊室" />
    <room-status :status="consult.status" :countdown="consult.countdown"></room-status>
    <van-pull-refresh v-model="loading" @refresh="onRefresh">
      <room-message :list="list"></room-message>
    </van-pull-refresh>
    <room-action
      @send-text="sendTextFn"
      @send-image="sendImageFn"
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
