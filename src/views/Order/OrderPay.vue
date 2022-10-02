<script setup lang="ts">
import { createMedicalOrder, getAddressList, getMedicalOrderPre } from '@/services/order'
import type { AddressItem, OrderPre } from '@/types/order'
import { Toast } from 'vant'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import OrderMedical from './components/OrderMedical.vue'

const route = useRoute()
const orderPre = ref<OrderPre>()
const address = ref<AddressItem>()
const agree = ref(false)
const orderId = ref('')
const loading = ref(false)
onMounted(async () => {
  const orderPreRes = await getMedicalOrderPre({ prescriptionId: route.query.id as string })
  orderPre.value = orderPreRes.data
  const addressRes = await getAddressList()
  const addressList = addressRes.data
  if (addressList.length) {
    const defaultAddress = addressList.find((item) => item.isDefault === 1)
    if (defaultAddress) {
      address.value = defaultAddress
    } else {
      address.value = addressList[0]
    }
  }
})
const show = ref(false)
// 支付功能
const pay = async () => {
  if (!agree.value) return Toast('请先同意协议')
  if (!address.value) return Toast('请先选择地址')
  if (!orderPre.value) return Toast('未找到处方')
  if (!orderId.value) {
    loading.value = true
    try {
      // 发送请求
      const res = await createMedicalOrder({
        id: orderPre.value.id,
        couponId: orderPre.value.couponId,
        addressId: address.value.id
      })
      orderId.value = res.data.id
      loading.value = false
      show.value = true
    } catch (error) {
      loading.value = false
    }
  } else {
    show.value = true
  }
}
</script>

<template>
  <div class="order-pay-page" v-if="address && orderPre">
    <cp-nav-bar title="药品支付" />
    <div class="order-address">
      <p class="area">
        <van-icon name="location" />
        <span>{{ address.province }} {{ address.city }} {{ address.county }}</span>
      </p>
      <p class="detail">{{ address.addressDetail }}</p>
      <p>
        {{ address.receiver }} {{ address.mobile.replace(/^(\d{3})(?:\d{4})(\d{4})$/, '$1xxxx$2') }}
      </p>
    </div>
    <order-medical :medicines="orderPre.medicines"></order-medical>
    <div class="order-detail">
      <van-cell-group>
        <van-cell title="药品金额" :value="`￥${orderPre.payment}`" />
        <van-cell title="运费" :value="`￥${orderPre.expressFee}`" />
        <van-cell title="优惠券" :value="`-￥${orderPre.couponDeduction}`" />
        <van-cell title="实付款" :value="`￥${orderPre.actualPayment}`" class="price" />
      </van-cell-group>
    </div>
    <div class="order-tip">
      <p class="tip">
        由于药品的特殊性，如非错发、漏发药品的情况，药品一经发出
        不得退换，请核对药品信息无误后下单。
      </p>
      <van-checkbox v-model="agree">我已同意<a href="javascript:;">支付协议</a></van-checkbox>
    </div>
    <van-submit-bar
      :price="orderPre.actualPayment * 100"
      button-text="立即支付"
      button-type="primary"
      text-align="left"
      @click="pay"
    ></van-submit-bar>
    <cp-pay-sheet
      v-model:show="show"
      :actual-payment="orderPre.actualPayment"
      :order-id="orderId"
      :pay-callback="`http://localhost:5173/order/pay/result`"
    ></cp-pay-sheet>
  </div>
</template>

<style lang="scss" scoped>
:deep(.van-nav-bar) {
  background-color: var(--cp-primary);
  .van-nav-bar__arrow,
  .van-nav-bar__title {
    color: #fff;
  }
}
:deep(.van-cell) {
  .van-cell__title {
    font-size: 16px;
  }
  .van-cell__value {
    font-size: 16px;
  }
  &.price {
    .van-cell__value {
      font-size: 18px;
      color: var(--cp-price);
    }
  }
}
:deep(.van-submit-bar) {
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.1);
  .van-button {
    width: 200px;
  }
}
.order-pay-page {
  padding: 46px 0 65px;
}
.order-address {
  padding: 15px 15px 0 15px;
  background-color: #fff;
  font-size: 13px;
  .area {
    color: var(--cp-tag);
    margin-bottom: 5px;
    .van-icon-location {
      color: #ff7702;
      font-size: 14px;
    }
  }
  .detail {
    font-size: 17px;
    margin-bottom: 5px;
  }
  &::after {
    content: '';
    display: block;
    height: 12px;
    background-color: var(--cp-bg);
    margin: 0 -15px;
    margin-top: 15px;
  }
}

.order-tip {
  padding: 0 15px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 10px;
  .tip {
    font-size: 12px;
    color: var(--cp-tag);
    width: 100%;
    &::before {
      content: '*';
      color: var(--cp-price);
      font-size: 14px;
    }
    margin-bottom: 30px;
  }
  .van-checkbox {
    a {
      color: var(--cp-primary);
    }
  }
}
</style>
