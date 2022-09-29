<script setup lang="ts">
import type { Message, Prescription } from '@/types/room'
import { ConsultTime, MsgType, PrescriptionStatus } from '@/enums'
import { consultFlagOptions, illnessTimeOptions } from '@/services/constants'
import type { Image } from '@/types/consult'
import { ImagePreview, Toast } from 'vant'
import { useUserStore } from '@/stores'
import dayjs from 'dayjs'
import { getPrescriptionPic } from '@/services/consult'
import { useRouter } from 'vue-router'

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
const showPrescription = async (id?: string) => {
  if (id) {
    const res = await getPrescriptionPic(id)
    ImagePreview([res.data.url])
  }
}
const router = useRouter()
const buy = (prescription?: Prescription) => {
  if (prescription) {
    if (prescription.status === PrescriptionStatus.Invalid) return Toast('处方已失效')
    if (prescription.status === PrescriptionStatus.NotPayment && !prescription.orderId) {
      return router.push(`/order/pay?id=${prescription.id}`)
    }
    router.push(`/order/${prescription.orderId}`)
  }
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
    <div class="msg msg-recipe" v-if="msgType === MsgType.CardPre">
      <div class="content">
        <div class="head van-hairline--bottom">
          <div class="head-tit">
            <h3>电子处方</h3>
            <p @click="showPrescription(msg.prescription?.id)">
              原始处方 <van-icon name="arrow"></van-icon>
            </p>
          </div>
          <p>
            {{ msg.prescription?.name }} {{ msg.prescription?.genderValue }}
            {{ msg.prescription?.age }}岁 {{ msg.prescription?.diagnosis }}
          </p>
          <p>开方时间：{{ msg.prescription?.createTime }}</p>
        </div>
        <div class="body">
          <div class="body-item" v-for="med in msg.prescription?.medicines" :key="med.id">
            <div class="durg">
              <p>{{ med.name }} {{ med.specs }}</p>
              <p>{{ med.usageDosag }}</p>
            </div>
            <div class="num">x{{ med.quantity }}</div>
          </div>
        </div>
        <div class="foot"><span @click="buy(msg.prescription)">购买药品</span></div>
      </div>
    </div>
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
