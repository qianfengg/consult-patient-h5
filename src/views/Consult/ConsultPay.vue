<script setup lang="ts">
import { createOrder, getOrderPre, getPayUrl } from '@/services/consult'
import { getPatient } from '@/services/user'
import { useConsultStore } from '@/stores'
import type { ConsultOrderPreData } from '@/types/consult'
import type { Patient } from '@/types/user'
import { Dialog, Toast } from 'vant'
import { onMounted, ref } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'

const store = useConsultStore()
const orderPreData = ref<ConsultOrderPreData>()
const patient = ref<Patient>()
const getOrderPreData = async () => {
  const res = await getOrderPre({
    type: store.consult.type,
    illnessType: store.consult.illnessType
  })
  // console.log(res)
  orderPreData.value = res.data
  store.setCoupon(res.data.couponId)
}
const getPatientInfo = async () => {
  if (store.consult.patientId) {
    const res = await getPatient(store.consult.patientId)
    patient.value = res.data
  }
}

onMounted(() => {
  if (!store.consult.type) {
    return Dialog.alert({
      title: '温馨提示',
      message: '问诊信息不完整请重新填写，如有未支付的问诊订单可在问诊记录中继续支付',
      closeOnPopstate: false
    }).then(() => {
      router.push('/')
    })
  }
  getOrderPreData()
  getPatientInfo()
})

const agree = ref(false)
const show = ref(false)
const paymentMethod = ref<0 | 1>()
const orderId = ref<string>()
const loading = ref(false)
const submit = async () => {
  if (!agree.value) return Toast('请先同意协议')
  loading.value = true
  // 创建订单
  const res = await createOrder(store.consult)
  orderId.value = res.data.id
  loading.value = false
  // store清空
  store.clear()
  // 打开
  show.value = true
}
const router = useRouter()
const beforeCloseFn = () => {
  return Dialog.confirm({
    title: '关闭支付',
    message: '取消支付将无法获得医生回复，医生接诊名额有限，是否确认关闭？',
    cancelButtonText: '仍要关闭',
    confirmButtonText: '继续支付',
    confirmButtonColor: 'var(--cp-primary)'
  })
    .then(() => {
      // 继续支付
      return false
    })
    .catch(() => {
      // 仍要关闭
      orderId.value = ''
      router.push('/user/consult')
      return true
    })
}
onBeforeRouteLeave(() => {
  if (orderId.value) {
    return false
  }
})
const pay = async () => {
  if (paymentMethod.value === undefined) return Toast('请选择支付方式')
  if (orderId.value === undefined) return Toast('订单错误')
  Toast.loading('跳转支付')
  const res = await getPayUrl({
    paymentMethod: paymentMethod.value,
    orderId: orderId.value,
    payCallback: `http://localhost:5173/room`
  })
  location.href = res.data.payUrl
}
</script>

<template>
  <div class="consult-pay-page" v-if="orderPreData && patient">
    <cp-nav-bar title="支付" />
    <div class="pay-info">
      <p class="tit">图文问诊 {{ orderPreData.payment }} 元</p>
      <img class="img" src="@/assets/avatar-doctor.svg" />
      <p class="desc">
        <span>极速问诊</span>
        <span>自动分配医生</span>
      </p>
    </div>
    <van-cell-group>
      <van-cell title="优惠券" :value="`-¥${orderPreData.couponDeduction}`" />
      <van-cell title="积分抵扣" :value="`-¥${orderPreData.pointDeduction}`" />
      <van-cell title="实付款" :value="`¥${orderPreData.actualPayment}`" class="pay-price" />
    </van-cell-group>
    <div class="pay-space"></div>
    <van-cell-group>
      <van-cell
        title="患者信息"
        :value="`${patient.name} | ${patient.gender} | ${patient.age}岁`"
      ></van-cell>
      <van-cell title="病情描述" :label="`${store.consult.illnessDesc}`"></van-cell>
    </van-cell-group>
    <div class="pay-schema">
      <van-checkbox v-model="agree">我已同意 <span class="text">支付协议</span></van-checkbox>
    </div>
    <van-submit-bar
      button-type="primary"
      :price="orderPreData.actualPayment * 100"
      button-text="立即支付"
      text-align="left"
      @click="submit"
      :loading="loading"
    />
    <cp-pay-sheet
      v-model:show="show"
      :orderId="orderId!"
      :onClose="beforeCloseFn"
      :actual-payment="orderPreData.actualPayment"
      :pay-callback="`http://localhost:5173/room`"
    ></cp-pay-sheet>
  </div>
  <div class="consult-pay-page" v-else>
    <van-skeleton title :row="3" />
    <van-skeleton title :row="4" />
    <van-skeleton title :row="5" />
  </div>
</template>

<style lang="scss" scoped>
.pay-type {
  .amount {
    padding: 20px;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
  }
  .btn {
    padding: 15px;
  }
  .van-cell {
    align-items: center;
    .cp-icon {
      margin-right: 10px;
      font-size: 18px;
    }
    .van-checkbox :deep(.van-checkbox__icon) {
      font-size: 16px;
    }
  }
}

::v-deep() {
  .van-submit-bar__button {
    font-weight: normal;
    width: 160px;
  }
}

.pay-schema {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  .text {
    color: var(--cp-primary);
  }
}

.pay-price {
  ::v-deep() {
    .vam-cell__title {
      font-size: 16px;
    }
    .van-cell__value {
      font-size: 16px;
      color: var(--cp-price);
    }
  }
}
.pay-space {
  height: 12px;
  background-color: var(--cp-bg);
}

.consult-pay-page {
  padding: 46px 0 50px 0;
}
.pay-info {
  display: flex;
  padding: 15px;
  flex-wrap: wrap;
  align-items: center;
  .tit {
    width: 100%;
    font-size: 16px;
    margin-bottom: 10px;
  }
  .img {
    margin-right: 10px;
    width: 38px;
    height: 38px;
    border-radius: 4px;
    overflow: hidden;
  }
  .desc {
    flex: 1;
    > span {
      display: block;
      color: var(--cp-tag);
      &:first-child {
        font-size: 16px;
        color: var(--cp-text2);
      }
    }
  }
}
</style>
