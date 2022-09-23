<script setup lang="ts">
import { ref } from 'vue'
import type { ConsultIllness } from '@/types/consult'
import { ConsultTime } from '@/enums'
import type { UploaderAfterRead, UploaderFileListItem } from 'vant/lib/uploader/types'
import { uploadImage } from '@/services/consult'

const form = ref<ConsultIllness>({
  illnessDesc: '',
  illnessTime: undefined,
  consultFlag: undefined,
  pictures: []
})
const illnessTimeOptions = [
  {
    label: '一周内',
    value: ConsultTime.Week
  },
  {
    label: '一月内',
    value: ConsultTime.Month
  },
  {
    label: '半年内',
    value: ConsultTime.HalfYear
  },
  {
    label: '大于半年',
    value: ConsultTime.More
  }
]
const consultFlagOptions = [
  {
    label: '就诊过',
    value: 1
  },
  {
    label: '没就诊过',
    value: 0
  }
]
const fileList = ref([])
const afterRead: UploaderAfterRead = async (file) => {
  if (Array.isArray(file)) return
  if (!file.file) return
  // console.log(item.file)
  try {
    file.status = 'uploading'
    file.message = '上传中...'
    const res = await uploadImage(file.file)
    file.status = 'done'
    file.message = undefined
    file.url = res.data.url
    form.value.pictures?.push(res.data)
  } catch (e) {
    file.status = 'failed'
    file.message = '上传失败'
  }
}
const deleteImg = (file: UploaderFileListItem) => {
  form.value.pictures = form.value.pictures?.filter((item) => item.url !== file.url)
}
</script>

<template>
  <div class="consult-illness-page">
    <cp-nav-bar title="图文问诊" />
    <!-- 医生提示 -->
    <div class="illness-tip van-hairline--bottom">
      <img class="img" src="@/assets/avatar-doctor.svg" />
      <div class="info">
        <p class="tit">在线医生</p>
        <p class="tip">请描述你的疾病或症状、是否用药、就诊经历，需要我听过什么样的帮助</p>
        <p class="safe"><cp-icon name="consult-safe" /><span>内容仅医生可见</span></p>
      </div>
    </div>
    <!-- 表单 -->
    <div class="illness-form">
      <van-field
        type="textarea"
        placeholder="请详细描述您的病情，病情描述不能为空"
        rows="3"
        v-model="form.illnessDesc"
      ></van-field>
      <div class="item">
        <p>本次患病多久了？</p>
        <cp-radio-btn :options="illnessTimeOptions" v-model="form.illnessTime"></cp-radio-btn>
      </div>
      <div class="item">
        <p>此次病情是否去医院就诊过？</p>
        <cp-radio-btn :options="consultFlagOptions" v-model="form.consultFlag"></cp-radio-btn>
      </div>
      <div class="illness-img">
        <van-uploader
          upload-text="上传图片"
          upload-icon="photo-o"
          max-count="9"
          :max-size="5 * 1024 * 1024"
          v-model="fileList"
          :after-read="afterRead"
          @delete="deleteImg"
        ></van-uploader>
        <p class="tip" v-if="!fileList.length">上传内容仅医生可见,最多9张图,最大5MB</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.consult-illness-page {
  padding-top: 46px;
}
.illness-tip {
  display: flex;
  padding: 15px;
  .img {
    width: 52px;
    height: 52px;
    border-radius: 4px;
    overflow: hidden;
    margin-top: 10px;
  }
  .info {
    flex: 1;
    padding-left: 12px;
    .tit {
      font-size: 16px;
      margin-bottom: 5px;
    }
    .tip {
      padding: 12px;
      background: var(--cp-bg);
      color: var(--cp-text3);
      font-size: 13px;
      margin-bottom: 10px;
    }
    .safe {
      font-size: 10px;
      color: var(--cp-text3);
      display: flex;
      align-items: center;
      .cp-icon {
        font-size: 12px;
        margin-right: 2px;
      }
    }
  }
}
.illness-form {
  padding: 15px;
  .van-field {
    padding: 0;
    &::after {
      border-bottom: none;
    }
  }
  .item {
    > p {
      color: var(--cp-text3);
      padding: 15px 0;
    }
  }
}
.illness-img {
  padding-top: 16px;
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  .tip {
    font-size: 12px;
    color: var(--cp-tip);
  }
  ::v-deep() {
    .van-uploader {
      &__preview {
        &-delete {
          left: -6px;
          top: -6px;
          border-radius: 50%;
          background-color: var(--cp-primary);
          width: 20px;
          height: 20px;
          &-icon {
            transform: scale(0.9) translate(-22%, 22%);
          }
        }
        &-image {
          border-radius: 8px;
          overflow: hidden;
        }
      }
      &__upload {
        border-radius: 8px;
      }
      &__upload-icon {
        color: var(--cp-text3);
      }
    }
  }
}
</style>
