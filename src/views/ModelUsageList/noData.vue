<template>
  <div style="height: 100%; width: 100%; overflow: auto">
    <div class="profile-container">
      <div class="user-info">
        <div class="tags"></div>
      </div>

      <div class="language-checkbox">
        <span class="description-right" style="font-size: 12px">我的声音/语音库</span>
      </div>
    </div>

    <!-- 音调和语速 -->
    <div class="settings-container">
      <div class="settings-title">设置</div>
      <div class="setting-item" style="font-size: 14px"></div>
    </div>

    <!-- 示例声音 -->
    <div class="example-sound-container">
      <div class="settings-title">示例声音</div>
      <div class="audio-container"></div>
    </div>
    <div class="button-container"></div>
  </div>
</template>

<script setup>
// import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
// import { useList } from './hook/useList';
// const { getDeleteAudioRes, getEditAudioRes, getdeleteOrAddAudioRes, getsetAudioDefaultRes, getAvararListRes } = useList();

// const emit = defineEmits(['changeDefaultStatus', 'changeIsSelectListStatus', 'deleteRole']);

// const avatars = ref([]);
// const getAvatar = async () => {
//   avatars.value = await getAvararListRes();
//   // console.log(avatars.value);
// };

import { useUserStore } from '@/store/modules/user';

import '@/styles/iconfont/iconfont.css';

// watch(
//   () => props.data,
//   (newVal, oldVal) => {
//     if (props.data) {
//       editFormData.value = Object.assign({}, newVal);
//       checkAudioStatusList.value = [];
//       selectCount.value = newVal.audio_urls?.length > 0 ? newVal.audio_urls?.length : 0;
//     }
//   },
//   { immediate: true, deep: true },
// );
</script>

<style lang="scss" scoped>
.profile-container {
  overflow-x: hidden;
  overflow-y: scroll;
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  border: 2px solid #91c6de;
  border-radius: 12px;
  gap: 10px;
  padding-left: 10px;
  zoom: 0.98;
}
.profile-container::-webkit-scrollbar {
  display: none;
}
.avatar {
  width: 80px;
  height: 80px;
  border-radius: 10px;
}

.user-info {
  display: flex;
  width: 60%;
  height: 85px;
  flex-direction: column;
  justify-content: space-between;
}

.name-description {
  display: flex;
  width: 17vw;
  align-items: center;
}

.name {
  font-size: 1.1em;
  padding-top: 5px;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  height: 30px;
  text-overflow: ellipsis;
  max-width: 130px;
}

.description {
  color: #777;
  width: auto;
  max-width: 100%;
  line-height: 24px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  height: 24px;
  align-content: end;
  font-size: 0.7rem;
}

.tags {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  margin-bottom: 4px;
}

.tag {
  background-color: #f0f3f9;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8em;
}

.language-checkbox {
  width: auto;
  flex: 1;

  height: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0px;
  display: flex;
  flex-direction: column;
  padding-right: 5px;
  font-size: 0.85em;
}

.settings-container {
  height: 30%;
  padding: 10px;
  background-color: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 10px;
  margin-top: 15px;
}

.setting-item {
  width: 100%;
  height: calc(100% - 32px);
  padding-top: -16px;
  text-align: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  overflow-y: scroll;
}
.setting-item::-webkit-scrollbar-track {
  display: none;
}
.settings-title {
  font-weight: bold;
  width: 80px;
  height: 30px;
  margin-bottom: 10px;
  text-align: center;
  border-bottom: 2px solid #91c6de;
}

.example-sound-container {
  height: 32%;
  width: 100%;
  padding: 10px;
  background-color: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 10px;
  margin-top: 15px;
}

.audio-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.play-button {
  width: 45px;
  height: 45px;
  background-size: cover;
  background-position: center;
  border-radius: 8px;
}
.audio-label {
  font-size: 14px;
  width: 100%;
  text-align: center;
}
.play-button.playing {
  border: 2px solid #4caf50;
}

.sweet-sound-container {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.sweet-sound-label {
  font-size: 14px;
  color: #555;
}

.button-container {
  overflow-x: auto;
  display: flex;
  width: 100%;
  height: 80px;
  align-items: center;
  justify-content: space-between;
  button {
    border-radius: 5px;
    height: 30px;
  }
  .left-btn {
    width: 70%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    button {
      width: 120px;
    }
  }
  .right-btn {
    // width: 30%;
    justify-content: end;
    button {
      float: right;
      width: 150px;
      // margin-bottom: 5px;
    }
  }
}

.delete-button,
.edit-button,
.remove-button,
.add-button {
  background-color: white;
  color: #333;
  border: 1px solid #ccc;
  padding: 5px 10px;
  transition: background-color 0.3s;
}

.delete-button:hover,
.edit-button:hover,
.remove-button:hover,
.add-button:hover {
  background-color: #e0e0e0;
}

.edit-buttons {
  position: relative;
  display: flex;
  gap: 10px;
}

::v-deep .edit-dialog {
  position: absolute;
  border-radius: 5px;
  left: calc(100% - 400px);
  .el-dialog__body {
    padding: 0px;
    padding-top: 10px !important;
  }
  .el-dialog__footer {
    padding: 0px;
  }
  .el-dialog__header {
    padding: 0px !important;
    padding-left: 20px;
    margin-right: 0px;
    height: 40px !important;
    align-content: center;
    align-items: center;
    border-radius: 5px 5px 0px 0px;
    background-color: rgb(237, 241, 244);
    .el-input__wrapper {
      background-color: rgb(237, 241, 244);
    }
    .el-dialog__headerbtn {
      margin-top: -15px;
    }
  }
}
:deep(.delete-dialog) {
  position: absolute;
  border-radius: 5px;
  right: calc(20%);
  top: calc(50%);

  .el-dialog__body {
    padding: 0px;
    padding-top: 10px !important;
  }
  .el-dialog__footer {
    padding: 0px;
  }
  .el-dialog__header {
    padding: 0px !important;
    padding-left: 20px;
    margin-right: 0px;
    align-items: center;
    border-radius: 5px 5px 0px 0px;
    background-color: rgb(237, 241, 244);
    .el-input__wrapper {
      background-color: rgb(237, 241, 244);
    }
    .el-dialog__headerbtn {
      margin-top: -15px;
    }
  }
}
.avatar-select {
  height: 100%;
  width: 15%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.avatar-image-selected {
  width: 45px;
  height: 45px;
  border-radius: 5px;
  object-fit: cover;
}
.avatar-and-info {
  display: flex;
  height: 25%;
  position: relative;
  .avatar-select {
    height: 100%;
    width: 15%;
    display: flex;
    justify-content: center;
    .avatar {
      width: 45px;
      height: 45px;
      border: 1px dashed #ccc;
      cursor: pointer;
      border-radius: 5px;
    }
    .avatar:hover {
      border: 1px dashed rgb(145, 198, 222);
    }
  }
}
.avatar-picker {
  position: absolute; /* 让关闭按钮能够在容器内定位 */
  display: flex;
  z-index: 999;
  left: 40px;
  top: 45px;
  background-color: #fff;
  flex-direction: column;
  justify-content: center;
  border: 1px solid #d6d7ef; /* 单一颜色边框 */
  border-radius: 5px; /* 圆角边框 */
  .avatar-picker-top {
    height: 25px;
    line-height: 25px;
    width: 100%;
    padding-right: 10px;
    text-align: end;
    user-select: none;
  }
  .avatars {
    display: grid;
    grid-template-columns: repeat(9, 1fr); /* 每行9个头像 */
    gap: 8px;
    padding: 10px;
    padding-top: 3px;
  }
}
.avatar-item {
  width: 36px;
  height: 36px;
  cursor: pointer;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid #dcdfe6;
  display: flex;
  align-items: center;
  justify-content: center;
}
.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.avatar-item:hover {
  border-color: #409eff;
}
.desc-input {
  height: 80px;
  width: 100%;
}
:deep(.el-textarea__inner) {
  resize: none;
  // font-size: 12px;
  height: 100%;
}
:deep(.el-input .el-input__wrapper .el-input__inner) {
  resize: none;
  // font-size: 12px;
}
:deep(.el-input):focus {
  border: 1px solid #d6d7ef;
}
.langs-center {
  display: flex;
  width: 100%;
  // padding-left: 10px;
  justify-content: center;
  padding-bottom: 15px;
  align-items: center;
  .genderAge-select {
    width: 100px;
    margin-left: 5px;
  }
  .el-select {
    width: 100px;
  }
  .current-select {
    width: 100px;
    border-radius: 5px;
    margin: 0px 10px;

    text-align: center;
    line-height: 37px;
    border: 1px solid #d6d7ef;
  }
  .el-select {
    height: 37px;
    line-height: 37px;
  }
}
::v-deep .el-tag--info {
  zoom: 0.79;
}

::v-deep .el-select-tags-wrapper {
  max-height: 25px;
  overflow: hidden;
  white-space: nowrap;
}
.select-and-display {
  width: 100%;
  height: 50px;
  padding: 0px 0px 10px 10px;
  display: flex;
  align-items: center;
  .el-select {
    width: 30%;
    height: 37px;
    margin-left: 5px;
  }
  .display {
    width: 60%;
    height: 37px;
    margin-left: 10px;
    border-radius: 5px;
    border: 1px solid #d6d7ef;
    line-height: 37px;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
  }
}
.dialog-footer {
  width: 100%;
  border-top: 1px solid #d6d7ef;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: end;
  padding-right: 20px;
  .el-button {
    width: 120px;
    height: 37px;
  }
  .submit-btn {
    background-color: black;
    font-weight: 800;
    color: white;
    border: 1px solid black;
  }
  .cancel-btn {
    color: black;
    font-weight: 800;
  }
  .cancel-btn:hover {
    background-color: rgb(237, 241, 244);
    border: 1px solid black;
  }
  .submit-btn:hover {
    background-color: rgb(237, 241, 244);
    color: #333;
    border: 1px solid black;
  }
}
.dialog-delete-footer {
  height: 50px;
  display: flex;
  justify-content: end;
  align-items: center;
  border-top: 1px solid #d6d7ef;
  padding-right: 10px;
  .submit-delete-btn {
    height: 30px;
    width: 80px;
    color: white;
    background-color: black;
  }
  .submit-delete-btn:hover {
    color: #333;
    background-color: rgb(237, 241, 244);
    border: 1px solid black;
  }
}
</style>
