<script setup lang="ts">
import type { Message } from '@/types/room'
import { ConsultTime, MsgType } from '@/enums'
import { consultFlagOptions, illnessTimeOptions } from '@/services/constants'
import type { Image } from '@/types/consult'
import { ImagePreview } from 'vant'
import { useUserStore } from '@/stores'
import dayjs from 'dayjs'

// ImagePreview(['https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg'])

defineProps<{
  list: Message[]
}>()
const consultFlagText = (flag?: 0 | 1) => {
  return consultFlagOptions.find((item) => item.value === flag)?.label
}
const illnessTimeText = (time?: ConsultTime) => {
  return illnessTimeOptions.find((item) => item.value === time)?.label
}
const previewImg = (imgs?: Image[]) => {
  if (imgs && imgs.length) {
    ImagePreview(imgs.map((img) => img.url))
  }
}
const store = useUserStore()
const formatTime = (time: string) => dayjs(time).format('HH:mm')
const loadFinish = (notScroll?: boolean) => {
  !notScroll && window.scrollTo(0, document.body.scrollHeight)
}
</script>

<template>
  <template v-for="{ id, msg, msgType, from, createTime, fromAvatar, notScroll } in list" :key="id">
    <div class="msg msg-illness" v-if="msgType === MsgType.CardPat">
      <div class="patient van-hairline--bottom">
        <p>
          {{ msg.consultRecord?.patientInfo.name }}
          {{ msg.consultRecord?.patientInfo.genderValue }}
          {{ msg.consultRecord?.patientInfo.age }}岁
        </p>
        <p>
          {{ illnessTimeText(msg.consultRecord?.illnessTime) }} |
          {{ consultFlagText(msg.consultRecord?.consultFlag) }}
        </p>
      </div>
      <van-row>
        <van-col span="6">病情描述</van-col>
        <van-col span="18">{{ msg.consultRecord?.illnessDesc }}</van-col>
        <van-col span="6">图片</van-col>
        <van-col span="18" @click="previewImg(msg.consultRecord?.pictures)">点击查看</van-col>
      </van-row>
    </div>
    <div class="msg msg-tip" v-if="msgType === MsgType.NotifyTip">
      <div class="content">
        <span class="green">温馨提示：</span>
        <span>{{ msg.content }}</span>
      </div>
    </div>
    <div class="msg msg-tip" v-if="msgType === MsgType.Notify">
      <div class="content">
        <span>{{ msg.content }}</span>
      </div>
    </div>
    <div class="msg msg-to" v-if="msgType === MsgType.MsgText && from === store.user.id">
      <div class="content">
        <div class="time">{{ formatTime(createTime) }}</div>
        <div class="pao">{{ msg.content }}</div>
      </div>
      <van-image :src="store.user.avatar" />
    </div>
    <div class="msg msg-to" v-if="msgType === MsgType.MsgImage && from === store.user.id">
      <div class="content">
        <div class="time">{{ formatTime(createTime) }}</div>
        <van-image fit="contain" :src="msg.picture?.url" @load="loadFinish(notScroll)" />
      </div>
      <van-image :src="store.user.avatar" />
    </div>
    <div class="msg msg-from" v-if="msgType === MsgType.MsgText && from !== store.user.id">
      <van-image :src="fromAvatar" />
      <div class="content">
        <div class="time">{{ formatTime(createTime) }}</div>
        <div class="pao">{{ msg.content }}</div>
      </div>
    </div>
    <div class="msg msg-from" v-if="msgType === MsgType.MsgImage && from !== store.user.id">
      <van-image :src="fromAvatar" />
      <div class="content">
        <div class="time">{{ formatTime(createTime) }}</div>
        <van-image :src="msg.picture?.url" @load="loadFinish(notScroll)" />
      </div>
    </div>
    <!-- <div class="msg msg-recipe">
      <div class="content">
        <div class="head van-hairline--bottom">
          <div class="head-tit">
            <h3>电子处方</h3>
            <p>原始处方 <van-icon name="arrow"></van-icon></p>
          </div>
          <p>李富贵 男 31岁 血管性头痛</p>
          <p>开方时间：2022-01-15 14:21:42</p>
        </div>
        <div class="body">
          <div class="body-item" v-for="i in 2" :key="i">
            <div class="durg">
              <p>优赛明 维生素E乳</p>
              <p>口服，每次1袋，每天3次，用药3天</p>
            </div>
            <div class="num">x1</div>
          </div>
        </div>
        <div class="foot"><span>购买药品</span></div>
      </div>
    </div> -->
    <!-- <div class="msg msg-tip msg-tip-cancel">
      <div class="content">
        <span>订单取消</span>
      </div>
    </div> -->
  </template>
</template>

<style lang="scss" scoped>
@import '@/styles/room.scss';
</style>
