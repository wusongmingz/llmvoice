<template>
  <div style="height: 100%; width: 100%; overflow: auto; display: flex; flex-direction: column">
    <!-- 人像详情部分 -->
    <div class="profile-container">
      <!-- 用户头像 -->
      <img :src="data?.pic_url" alt="头像" class="avatar" />
      <!-- 用户信息 -->
      <div class="user-info">
        <!-- <div class="name-description"> -->
        <div class="name">{{ data?.name }}</div>
        <div class="description">{{ data?.desc }}</div>
        <!-- </div> -->
        <!-- 标签列表 -->
        <div class="tags">
          <span class="tag">{{ data?.sex == 1 ? '男' : '女' }}</span>
          <span class="tag">{{ data?.age }}</span>
          <span
            class="tag"
            v-show="data?.style?.length != 0"
            style="max-width: 6vw; white-space: nowrap; text-overflow: ellipsis; overflow: hidden"
            >{{ data.style?.join(',') }}</span
          >
          <span class="tag" v-show="data?.kind?.length != 0" style="white-space: nowrap; text-overflow: ellipsis; overflow: hidden">{{
            data.kind?.join('、')
          }}</span>
        </div>
      </div>

      <!-- 语言选择复选框 -->
      <div class="language-checkbox">
        <span class="description-right" style="font-size: 14px; white-space: nowrap">{{ `${data?.author == userId ? '我的声音' : '语音库'}` }}</span>
        <!-- <span
          v-if="data?.is_in_selected_list"
          :style="{ fontSize: '35px', color: data?.is_default_select ? '#d7000f' : 'rgb(210,214,218)' }"
          style="cursor: pointer"
          class="iconfont icon-a-bianzu32x"
          title="设为默认语音"
          @click="setAudioDefault"
        >
        </span> -->
      </div>
    </div>

    <!-- 音调和语速 -->
    <div class="settings-container">
      <div class="settings-title">设置</div>
      <div class="setting-item" style="font-size: 14px">
        <p>音调 <span style="color: rgb(210, 214, 218)">---------------------------------------</span> {{ data.tone }}%</p>
        <p>语速 <span style="color: rgb(210, 214, 218)">---------------------------------------</span> {{ data.speed_of_speech }}%</p>
      </div>
    </div>

    <!-- 示例声音 -->
    <div class="example-sound-container">
      <div class="settings-title">示例声音</div>
      <div class="audio-container">
        <audio
          style="display: none"
          v-if="props.data"
          ref="audioRef"
          controls
          :src="currentPlayAudio"
          type="audio/wav"
          @timeupdate="updateProgress"
        ></audio>
        <div style="width: 55px; height: 75px" v-for="(item, index) in data?.audio_urls" :key="item">
          <div class="play-button" :style="{ backgroundImage: 'url(' + data.pic_url + ')' }">
            <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center">
              <span
                style="font-size: 25px; color: white; cursor: pointer"
                :class="['iconfont', checkAudioStatusList[index] ? 'icon-zantingbofang' : 'icon-kechengliebiaokaishibofang-copy']"
                @click="playAudio(item, index)"
              ></span>
            </div>
          </div>
          <div class="audio-label">{{ data?.style[index] }}</div>
        </div>
      </div>
    </div>

    <!-- 按钮区 -->
    <div class="button-container">
      <div class="left-btn">
        <button v-if="isAuthor" class="delete-button" @click="isShowDeleteDialog = true">删除</button>
        <button v-if="isAuthor" @click="openEditDialog" class="edit-button">编辑</button>
      </div>
      <el-dialog class="delete-dialog" width="400px" v-model="isShowDeleteDialog">
        <template #header>
          <div
            class="header-title"
            style="
              width: 100%;
              border-radius: 10px !important;
              height: 30px;
              font-size: 14px;
              line-height: 30px;
              display: flex;
              padding-left: 30px;
              align-items: center;
            "
          >
            提醒
          </div>
        </template>
        <div style="width: 100%; height: 80px; display: flex; align-items: center; padding-left: 30px; line-height: 60px">
          <span class="iconfont icon-gantanhao" style="color: rgb(215, 125, 0); font-size: 20px; padding-right: 10px"></span>
          是否确认删除我的声音
        </div>
        <template #footer>
          <div class="dialog-delete-footer">
            <el-button class="submit-delete-btn" @click="submitDelete">删除</el-button>
          </div>
        </template>
      </el-dialog>
      <div class="right-btn">
        <!-- <button v-if="data.is_in_selected_list" class="remove-button" @click="deletefromList">从列表中删除</button>
        <button v-else class="add-button" @click="addSelectList()">添加至选择列表</button> -->
      </div>
    </div>
    <ADialog class="edit-dialog" :title="'编辑语音'" :option="{ width: '560px', center: true }" v-model:isShow="updataDialog">
      <div style="height: 460px; position: relative">
        <el-form ref="editFormRef" :model="editFormData" label-width="40px" class="create-voice-form">
          <!-- 上传头像 -->
          <div class="avatar-and-info">
            <!-- 显示当前头像或者添加图标 -->
            <div class="avatar-select" @click="toggleAvatarPicker">
              <div v-show="editFormData?.pic_url">
                <img :src="editFormData?.pic_url" alt="avatar" class="avatar-image-selected" />
              </div>
              <div v-show="!editFormData?.pic_url">
                <el-icon size="15" class="avatar">
                  <AIcon icon="icon-zengjia" />
                </el-icon>
              </div>
            </div>

            <!-- 头像选择框 -->
            <div v-show="isAvatarPickerVisible" class="avatar-picker">
              <div class="avatar-picker-top" @click="isAvatarPickerVisible = false"><span style="cursor: pointer">✖</span></div>
              <div class="avatars">
                <div v-for="(avatar, index) in avatars" :key="index" class="avatar-item" @click="selectAvatar(avatar)">
                  <img :src="avatar.pic_url" alt="avatar" class="avatar-image" />
                </div>
              </div>
            </div>

            <div style="width: 80%">
              <el-form-item label="名称">
                <el-input style="" v-model="editFormData.name" placeholder="请输入名称，不超过10字" maxlength="10" />
              </el-form-item>

              <!-- 描述 -->
              <el-form-item label="描述">
                <el-input
                  v-model="editFormData.desc"
                  class="desc-input"
                  placeholder="请输入描述，不超过30字"
                  type="textarea"
                  maxlength="30"
                  :rows="3"
                ></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="langs-center">
            <!-- 性别 -->
            <el-select class="genderAge-select" v-model="editFormData.sex" placeholder="选择性别">
              <el-option v-for="(sex, index) in sexOptions?.items" :label="sex" :value="index + 1" :key="sex" />
            </el-select>
            <!-- <div class="current-select">{{ editFormData?.sex == 1 ? '男声' : '女声' }}</div> -->
            <!-- 年龄 -->

            <el-select style="margin-left: 30px" v-model="editFormData.age" placeholder="选择年龄">
              <el-option v-for="age in ageOptions?.items" :label="age" :value="age" :key="age" />
            </el-select>

            <!-- <div class="current-select">{{ editFormData?.age }}</div> -->
          </div>
          <!-- 分割线 -->
          <!-- <div style="width: 100%; border-bottom: 1px solid #d6d7ef; line-height: 30px; padding-top: 15px; padding-left: 15px; font-weight: 600">
            上传语音文件
          </div> -->

          <!-- 语言 -->
          <div class="select-and-display">
            <!-- @change="
                (value) => {
                  editFormData.style = editStyleList;
                }
              " -->
            <el-select
              placeholder="声音风格"
              v-model="editFormData.style"
              :multiple="selectCount === 1 ? false : true"
              :multiple-limit="selectCount"
              :disabled="selectCount === 0"
            >
              <!-- :multiple="true" -->
              <el-option v-for="style in styleOptions?.items" :label="style" :value="style" :key="style" />
            </el-select>
            <div class="display">{{ getJoinString(editFormData.style) }}</div>
          </div>
          <div class="select-and-display">
            <el-select
              placeholder="语言"
              v-model="editFormData.kind"
              :multiple="selectCount === 1 ? false : true"
              :multiple-limit="selectCount"
              :disabled="selectCount === 0"
            >
              <el-option v-for="kind in kindOptions?.items" :label="kind" :value="kind" :key="kind" />
            </el-select>
            <div class="display">{{ getJoinString(editFormData.kind) }}</div>
          </div>
        </el-form>
      </div>
      <!-- 按钮 -->
      <template #footer>
        <div class="dialog-footer">
          <el-button class="cancel-btn" @click="updataDialog = false">取消</el-button>
          <el-button class="submit-btn" type="primary" @click="submitEditFormData">提交</el-button>
        </div>
      </template>
    </ADialog>
    <!-- <el-dialog class="edit-dialog" v-model="updataDialog" width="520px" :close-on-click-modal="false">
     <template #header>
        <div
          class="header-title"
          style="
            width: 100%;
            border-radius: 10px !important;
            height: 40px;
            font-size: 14px;
            line-height: 30px;
            display: flex;
            padding-left: 15px;
            align-items: center;
          "
        >
          编辑语音
        </div>
      </template> 
      
    </el-dialog> -->
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { useList } from './hook/useList';
const { getDeleteAudioRes, getEditAudioRes, getdeleteOrAddAudioRes, getsetAudioDefaultRes, getAvararListRes } = useList();
const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
});
import { getSelectOptionRes } from '@/views/TextToSpeech/hook/useTextToSpeech';
const sexOptions = ref(null);
const styleOptions = ref(null);
const kindOptions = ref(null);
const ageOptions = ref(null);
const editKindList = ref([]);
const editStyleList = ref([]);
const emit = defineEmits(['changeDefaultStatus', 'changeIsSelectListStatus', 'deleteRole']);
const selectCount = ref(0);
const avatars = ref([]);
const getAvatar = async () => {
  avatars.value = await getAvararListRes();
  // console.log(avatars.value);
};
const initOptions = async () => {
  sexOptions.value = await getSelectOptionRes({ type: 'sex' });
  styleOptions.value = await getSelectOptionRes({ type: 'style' });
  kindOptions.value = await getSelectOptionRes({ type: 'kind' });
  ageOptions.value = await getSelectOptionRes({ type: 'age' });
};
const selectAvatar = (avatar) => {
  editFormData.value.pic_url = avatar.pic_url;
  isAvatarPickerVisible.value = false; // 关闭头像选择框
};
const editFormData = ref({});
const audioRef = ref(null);
const formData = ref({});
const getJoinString = computed(() => {
  return (arr) => {
    if (!arr || typeof arr === 'string') {
      return arr;
    }
    return arr.join('、');
  };
});
import { useUserStore } from '@/store/modules/user';
const userStore = useUserStore();
const userId = userStore.sysUser?.userID || '';
const isAuthor = computed(() => {
  return userId == props.data?.author ? true : false;
});
const isAvatarPickerVisible = ref(false);
const updataDialog = ref(false);
import '@/styles/iconfont/iconfont.css';
import { ElMessage } from 'element-plus';
import router from '@/router';
//当前选中的
const checkAudioStatusList = ref([]);
// 切换默认勾选状态
const isClicked = ref(false);
const currentPlayAudio = ref(null);
const openEditDialog = () => {
  updataDialog.value = true;
  nextTick(() => {
    editFormData.value = Object.assign({}, props.data);
    checkAudioStatusList.value = [];
    selectCount.value = props.data.audio_urls?.length > 0 ? props.data.audio_urls?.length : 0;
  });
};
const playAudio = (item, index) => {
  if (checkAudioStatusList.value[index] == true) {
    //如果是当前正在播放的音频
    audioRef.value.pause();
    checkAudioStatusList.value[index] = false;
  } else {
    //重置所有audio状态
    checkAudioStatusList.value = checkAudioStatusList.value.map((item) => {
      return false;
    });
    audioRef.value.pause();
    currentPlayAudio.value = item;
    checkAudioStatusList.value[index] = true;
    nextTick(() => {
      audioRef.value.play();
    });

    audioRef.value.addEventListener('ended', () => {
      checkAudioStatusList.value[index] = false; // 播放结束后将状态设置为false
    });
  }
};

const setAudioDefault = async () => {
  if (props.data.is_default_select) {
    ElMessage.warning('已经是默认语言');
    return;
  }
  formData.value = {};
  formData.value.user_id = userId;
  formData.value.audio_id = props.data.id;
  await getsetAudioDefaultRes(formData.value);
  emit('changeDefaultStatus', true);
};
const toggleAvatarPicker = () => {
  isAvatarPickerVisible.value = !isAvatarPickerVisible.value;
};

//删除
const isShowDeleteDialog = ref(false);
const submitDelete = async () => {
  //删除逻辑
  formData.value.user_id = userId;
  formData.value.id = props.data.id;
  await getDeleteAudioRes(formData.value);
  emit('deleteRole');
  isShowDeleteDialog.value = false;
};
const submitEditFormData = async () => {
  //编辑提交逻辑

  if (editFormData.value.name.trim().length < 1) {
    ElMessage.warning('请输入名称');
    return;
  }
  if (typeof editFormData.value.style === 'string') {
    editFormData.value.style = [editFormData.value.style];
  }
  if (typeof editFormData.value.kind === 'string') {
    editFormData.value.kind = [editFormData.value.kind];
  }
  if (editFormData.value.style?.length !== props.data.style?.length || editFormData.value.kind?.length !== props.data.kind?.length) {
    ElMessage.warning('请保证选择的语言和情感与原数据长度一致');
    return;
  }
  // editFormData.value.sex = editFormData.value.sex == '男声' ? 1 : 2;
  editFormData.value.user_id = userId;
  await getEditAudioRes(editFormData.value);
  updataDialog.value = false;
  emit('deleteRole'); //刷新
};

const deletefromList = async () => {
  //从列表中删除
  formData.value = {};
  formData.value.op = 2;
  formData.value.audio_id = props.data.id;
  formData.value.user_id = userId;
  await getdeleteOrAddAudioRes(formData.value);
  emit('changeIsSelectListStatus', false);
};
const addSelectList = async () => {
  //添加到列表
  formData.value = {};
  formData.value.op = 1;
  formData.value.audio_id = props.data.id;
  formData.value.user_id = userId;

  await getdeleteOrAddAudioRes(formData.value);
  emit('changeIsSelectListStatus', true);
  router.push({ path: '/textToSpeech', query: { audioId: props.data.id } });
};
watch(
  () => props.data,
  (newVal, oldVal) => {
    if (props.data && !audioRef.value?.paused) {
      nextTick(() => {
        audioRef.value.pause();
      });
      checkAudioStatusList.value = [];
    }
  },
  { immediate: true, deep: true },
);

onMounted(() => {
  initOptions();
  // getAvatar();
});
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
  padding-bottom: 10px;
  border-radius: 10px;
}

.user-info {
  display: flex;
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
  background-color: #deeef5;
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
  min-height: 170px;
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
  margin-top: -15px;
}
.setting-item::-webkit-scrollbar-track {
  display: none;
}
.settings-title {
  font-weight: bold;
  width: 80px;
  height: 30px;
  text-align: center;
  border-bottom: 2px solid #91c6de;
}

.example-sound-container {
  height: 35%;
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
  width: 55px;
  height: 55px;
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
  flex: 1;
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
      width: 130px;
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
  border: 1px solid #d2d6da;
  padding: 5px 10px;
  transition: background-color 0.3s;
}

.delete-button:hover,
.edit-button:hover,
.remove-button:hover,
.add-button:hover {
  background-color: #edf1f4;
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
    color: #333;
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
