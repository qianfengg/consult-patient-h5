<script setup lang="ts">
import { createOrder, getOrderPre } from '@/services/consult'
import { getPatient } from '@/services/user'
import { useConsultStore } from '@/stores'
import type { ConsultOrderPreData } from '@/types/consult'
import type { Patient } from '@/types/user'
import { Toast } from 'vant'
import { onMounted, ref } from 'vue'

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
    <van-action-sheet v-model:show="show" title="选择支付方式">
      <div class="pay-type">
        <p class="amount">￥{{ orderPreData.actualPayment.toFixed(2) }}</p>
        <van-cell-group>
          <van-cell title="微信支付" @click="paymentMethod = 0">
            <template #icon><cp-icon name="consult-wechat" /></template>
            <template #extra><van-checkbox :checked="paymentMethod === 0" /></template>
          </van-cell>
          <van-cell title="支付宝支付" @click="paymentMethod = 1">
            <template #icon><cp-icon name="consult-alipay" /></template>
            <template #extra><van-checkbox :checked="paymentMethod === 1" /></template>
          </van-cell>
        </van-cell-group>
        <div class="btn">
          <van-button type="primary" round block>立即支付</van-button>
        </div>
      </div>
    </van-action-sheet>
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
