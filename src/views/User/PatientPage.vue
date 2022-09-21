<script setup lang="ts">
import { addPatient, deletePatient, getPatientList, updatePatient } from '@/services/user'
import type { Patient } from '@/types/user'
import { Dialog, Toast } from 'vant'
import { computed, onMounted, ref } from 'vue'
import CpRadioBtn from '../../components/cp-radio-btn.vue'
import IDValidator from 'id-validator'
const Validator = new IDValidator()

const initPatient: Patient = {
  name: '',
  idCard: '',
  gender: 1,
  defaultFlag: 0
}
const list = ref<Patient[]>([])
const getList = async () => {
  const res = await getPatientList()
  list.value = res.data
}
onMounted(() => {
  getList()
})

const options = [
  {
    label: '男',
    value: 1
  },
  {
    label: '女',
    value: 0
  }
]
const show = ref(false)
const showPopup = (item?: Patient) => {
  // console.log(item)
  if (item) {
    // edit
    const { id, idCard, name, gender, defaultFlag } = item
    patient.value = { id, idCard, name, gender, defaultFlag }
  } else {
    // add
    patient.value = { ...initPatient }
  }
  show.value = true
}
const patient = ref<Patient>({ ...initPatient })
const defaultFlag = computed({
  get() {
    return patient.value.defaultFlag === 1
  },
  set(val) {
    patient.value.defaultFlag = val ? 1 : 0
  }
})
const submit = async () => {
  const idCard = patient.value.idCard
  if (!patient.value.name) return Toast('请输入姓名')
  if (!idCard) return Toast('请输入身份证号')
  if (!Validator.isValid(idCard)) return Toast('请输入正确的身份证')
  const info = Validator.getInfo(idCard)
  // console.log(info)
  if (info.sex !== patient.value.gender) return Toast('性别和身份证不符')
  patient.value.id ? await updatePatient(patient.value) : await addPatient(patient.value)
  getList()
  show.value = false
  Toast(`${patient.value.id ? '编辑' : '添加'}患者成功`)
}
const remove = async () => {
  await Dialog.confirm({
    title: '温馨提示',
    message: '确认删除吗'
  })
  await deletePatient(patient.value.id!)
  getList()
  show.value = false
  Toast('删除成功')
}
</script>

<template>
  <div class="patient-page">
    <cp-nav-bar title="家庭档案"></cp-nav-bar>
    <div class="patient-list">
      <div class="patient-item" v-for="item in list" :key="item.id">
        <div class="info">
          <span class="name">{{ item.name }}</span>
          <span class="id">{{
            item.idCard.replace(/^(.{6})(?:\d+)(.{4})$/, '$1*********$2')
          }}</span>
          <span>{{ item.genderValue }}</span>
          <span>{{ item.age }}岁</span>
        </div>
        <div class="icon"><cp-icon name="user-edit" @click="showPopup(item)" /></div>
        <div class="tag" v-if="item.defaultFlag === 1">默认</div>
      </div>
      <div class="patient-add" @click="showPopup()" v-if="list.length < 6">
        <cp-icon name="user-add" />
        <p>添加患者</p>
      </div>
      <div class="patient-tip">最多可添加 6 人</div>
    </div>
    <van-popup v-model:show="show" position="right">
      <cp-nav-bar
        @right-click="submit"
        :back="() => (show = false)"
        :title="`${patient.id ? '编辑' : '添加'}患者`"
        right-text="保存"
      ></cp-nav-bar>
      <van-form autocomplete="off">
        <van-field v-model="patient.name" label="真实姓名" placeholder="请输入真实姓名" />
        <van-field v-model="patient.idCard" label="身份证号" placeholder="请输入身份证号" />
        <van-field label="性别">
          <!-- 单选按钮组件 -->
          <template #input>
            <cp-radio-btn v-model="patient.gender" :options="options"></cp-radio-btn>
          </template>
        </van-field>
        <van-field label="默认就诊人">
          <template #input>
            <van-checkbox v-model="defaultFlag" round />
          </template>
        </van-field>
        <van-action-bar v-if="patient.id">
          <van-action-bar-button @click="remove">删除</van-action-bar-button>
        </van-action-bar>
      </van-form>
    </van-popup>
  </div>
</template>

<style lang="scss" scoped>
.patient-page {
  padding: 46px 0 80px;
  .van-action-bar {
    padding: 0 10px;
    margin-bottom: 10px;
    .van-button {
      color: var(--cp-price);
      background-color: var(--cp-bg);
    }
  }
  ::v-deep() {
    .van-popup {
      width: 100%;
      height: 100%;
      padding-top: 46px;
      box-sizing: border-box;
    }
  }
}
.patient-list {
  padding: 15px;
}
.patient-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: var(--cp-bg);
  border-radius: 8px;
  margin-bottom: 15px;
  position: relative;
  border: 1px solid var(--cp-bg);
  transition: all 0.3s;
  overflow: hidden;
  .info {
    display: flex;
    flex-wrap: wrap;
    flex: 1;
    span {
      color: var(--cp-tip);
      margin-right: 20px;
      line-height: 30px;
      &.name {
        font-size: 16px;
        color: var(--cp-text1);
        width: 80px;
        margin-right: 0;
      }
      &.id {
        color: var(--cp-text2);
        width: 180px;
      }
    }
  }
  .icon {
    color: var(--cp-tag);
    width: 20px;
    text-align: center;
  }
  .tag {
    position: absolute;
    right: 60px;
    top: 21px;
    width: 30px;
    height: 16px;
    font-size: 10px;
    color: #fff;
    background-color: var(--cp-primary);
    border-radius: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &.selected {
    border-color: var(--cp-primary);
    background-color: var(--cp-plain);
    .icon {
      color: var(--cp-primary);
    }
  }
}
.patient-add {
  background-color: var(--cp-bg);
  color: var(--cp-primary);
  text-align: center;
  padding: 15px 0;
  border-radius: 8px;
  .cp-icon {
    font-size: 24px;
  }
}
.patient-tip {
  color: var(--cp-tag);
  padding: 12px 0;
}
</style>
