<script setup lang="ts">
import { evaluateConsultOrder } from '@/services/consult'
import type { ConsultOrderItem } from '@/types/consult'
import type { EvaluateDoc } from '@/types/room'
import { Toast } from 'vant'
import { computed, inject, ref, type Ref } from 'vue'

defineProps<{
  evaluateDoc?: EvaluateDoc
}>()
// docId orderId
const score = ref(0)
const content = ref('')
const anonymousFlag = ref(false)
const consult = inject<Ref<ConsultOrderItem>>('consult')
const disabled = computed(() => !score.value || !content.value)
const completeEva = inject<(score: number) => void>('completeEva')
const submit = async () => {
  //   console.log(consult?.value.id, consult?.value.docInfo?.id)
  if (!score.value) return Toast('请评价分数')
  if (!content.value) return Toast('请填写评价')
  if (!consult) return Toast('未找到订单')
  const docId = consult.value.docInfo?.id
  if (docId) {
    await evaluateConsultOrder({
      docId,
      orderId: consult.value.id,
      score: score.value,
      content: content.value,
      anonymousFlag: anonymousFlag.value ? 1 : 0
    })
    // 修改祖父数据
    completeEva && completeEva(score.value)
  }
}
</script>

<template>
  <div class="evalutate-card" v-if="evaluateDoc">
    <p class="title">医生服务评价</p>
    <p class="desc">我们会更加努力提升服务质量</p>
    <van-rate
      :modelValue="evaluateDoc.score"
      size="7vw"
      gutter="3vw"
      color="#FADB14"
      void-icon="star"
      void-color="rgba(0,0,0,0.04)"
    />
  </div>
  <div class="evalutate-card" v-else>
    <p class="title">感谢您的评价</p>
    <p class="desc">本次在线问诊服务您还满意吗？</p>
    <van-rate
      size="7vw"
      gutter="3vw"
      color="#FADB14"
      void-icon="star"
      void-color="rgba(0,0,0,0.04)"
      v-model="score"
    />
    <van-field
      type="textarea"
      maxlength="150"
      show-word-limit
      rows="3"
      placeholder="请描述您对医生的评价或是在医生看诊过程中遇到的问题"
      v-model="content"
    ></van-field>
    <div class="footer">
      <van-checkbox v-model="anonymousFlag">匿名评价</van-checkbox>
      <van-button @click="submit" :class="{ disabled }" type="primary" size="small" round>
        提交评价
      </van-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.evalutate-card {
  width: 100%;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  text-align: center;
  padding: 15px;
  .title {
    font-size: 15px;
    margin-bottom: 5px;
  }
  .desc {
    font-size: 12px;
    margin-bottom: 15px;
    color: var(--cp-tip);
  }
  .van-field {
    background-color: var(--cp-bg);
    margin: 15px 0;
    border-radius: 8px;
  }
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    ::v-deep() {
      .van-checkbox {
        .van-icon {
          font-size: 12px;
        }
        &__label {
          font-size: 12px;
          color: var(--cp-tip);
        }
        height: 16px;
      }
      .van-button {
        padding: 0 16px;
        &.disabled {
          opacity: 1;
          background: #fafafa;
          color: #d9dbde;
          border: #fafafa;
        }
      }
    }
  }
}
</style>
