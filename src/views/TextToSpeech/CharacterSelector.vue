<template>
  <div style="width: 100%; height: 100%; justify-content: center; padding: 5px 5px; display: flex">
    <div class="character-selector" @click="handleCharacterClick()" v-if="currentCharacter">
      <img class="avatar" :src="currentCharacter?.pic_url" />
      <div class="character-info">
        <div class="character-name">
          {{ currentCharacter?.name ? currentCharacter?.name : currentCharacter?.ai_audio_name }}
        </div>
        <div class="tags">
          {{ getJoinString(currentCharacter?.style) }}
        </div>
      </div>
    </div>
    <div class="character-selector" @click="handleCharacterClick()" v-else style="font-size: 18px; color: gray; text-align: center"></div>
    <div>
      <Transition>
        <el-dialog
          v-model="isDialogVisible"
          width="1000px"
          center
          class="eldialog"
          style="border-radius: 10px; box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.15)"
        >
          <template #header>
            <div
              style="
                width: 100%;
                height: 50px;
                border-radius: 10px 10px 0px 0px;
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: rgb(237, 241, 244);
                --el-color-primary: #333;
              "
            >
              <el-input
                class="search-input"
                style="width: 630px; height: 40px; background: none !important"
                v-model="searchQuery"
                placeholder="根据名称查找"
                clearable
                @input="getRoleListAndSetDefault"
              >
                <template #prefix>
                  <span class="iconfont icon-sousuo" style="font-size: 22px"></span>
                </template>
              </el-input>
            </div>
          </template>
          <!-- 筛选框 -->
          <div class="filters">
            <el-select style="width: 150px" v-model="filters.sex" placeholder="性别" clearable @change="getRoleListAndSetDefault">
              <el-option v-for="item in sexOptions?.items" :label="item" :value="item" :key="item" />
            </el-select>

            <el-select style="width: 150px" v-model="filters.age" placeholder="年龄" clearable @change="getRoleListAndSetDefault">
              <el-option v-for="item in ageOptions?.items" :label="item" :value="item" :key="item" />
            </el-select>

            <el-select style="width: 150px" v-model="filters.style" placeholder="声音风格" clearable @change="getRoleListAndSetDefault">
              <el-option v-for="item in styleOptions?.items" :label="item" :value="item" :key="item" />
            </el-select>

            <el-select style="width: 150px" v-model="filters.lang" placeholder="语言" clearable @change="getRoleListAndSetDefault">
              <el-option v-for="item in kindOptions?.items" :label="item" :value="item" :key="item" />
            </el-select>
          </div>
          <div class="dialog-body" :style="{ height: 650 + 'px', padding: 0 + 'px' }">
            <div class="role-title">最近使用</div>
            <div v-for="(user, index) in getFilterTypeRoleList(1)" :key="index" class="recent-users" @click="changeRole(user)">
              <div class="avatar-and-name">
                <img class="user-avatar" :src="user?.pic_url" />
                <div class="user-name">{{ user?.ai_audio_name }}</div>
              </div>
              <div class="user-tags">
                <div class="user-tag">{{ user.sex === 1 ? '男' : '女' }}</div>
                <div class="user-tag">{{ user.age }}</div>
                <div class="user-tag">
                  {{ getJoinString(user.style) }}
                </div>
                <div class="user-tag">支持语言：{{ getJoinString(user.lang) }}</div>
              </div>
            </div>

            <div class="role-title">专业语言</div>
            <div v-for="(user, index) in getFilterTypeRoleList(3)" :key="index" class="recent-users" @click="changeRole(user)">
              <div class="avatar-and-name">
                <img class="user-avatar" :src="user?.pic_url" />
                <div class="user-name">{{ user?.ai_audio_name }}</div>
              </div>
              <div class="user-tags">
                <div class="user-tag">{{ user.sex === 1 ? '男' : '女' }}</div>
                <div class="user-tag">{{ user.age }}</div>
                <div class="user-tag">
                  {{ getJoinString(user.style) }}
                </div>
                <div class="user-tag">支持语言：{{ getJoinString(user.lang) }}</div>
              </div>
            </div>
          </div>
          <template #footer>
            <div class="footer-class" @click="jumpTo('/voiceList')">前往语音列表添加更多声音</div>
          </template>
        </el-dialog>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onActivated } from 'vue';
import { getSelectOptionRes, getDefaultAudioRes } from './hook/useTextToSpeech';
import { useList } from '@/views/ModelUsageList/hook/useList';
const { getAudioInfoRes } = useList();
import { useUserStore } from '@/store/modules/user';
import router from '@/router';
const userStore = useUserStore();
const userId = userStore.sysUser?.userID || '';
const formData = ref({});
import { useRoute } from 'vue-router';
import { filter } from 'lodash-es';
const route = useRoute();
const props = defineProps({
  characters: {
    type: Array,
    default: () => [],
  },
});
const getJoinString = computed(() => {
  return (arr) => {
    if (!arr || typeof arr === 'string') {
      return arr;
    }
    return arr.join('、');
  };
});
const currentCharacter = ref();
const isDialogVisible = ref(false);
const searchQuery = ref('');
const filters = ref({
  sex: '',
  age: '',
  style: '',
  lang: '',
});
watch(
  () => isDialogVisible.value,
  (newVal, oldVal) => {
    if (isDialogVisible.value) {
      filter.value = {
        sex: '',
        age: '',
        style: '',
        lang: '',
      };
      searchQuery.value = '';
    }
  },
);
const changeRole = (user) => {
  currentCharacter.value = user;
  isDialogVisible.value = false;
};
const getFilterTypeRoleList = (type) => {
  return computed(() => {
    if (props.characters) {
      return props.characters.filter((character) => {
        return character.audio_type === type;
      });
    }
    return [];
  }).value;
};

const handleCharacterClick = () => {
  isDialogVisible.value = true;
};
const jumpTo = (url) => {
  router.push({
    path: url,
  });
  isDialogVisible.value = false;
};
const emit = defineEmits(['changeCharacterData']);
const getRoleList = async () => {
  formData.value.user_id = userId;
  formData.value.lang = filters.value.lang;
  formData.value.sex = filters.value.sex ? (filters.value.sex == '男声' ? 1 : 2) : 0;
  formData.value.age = filters.value.age;
  formData.value.name = searchQuery.value;
  formData.value.style = filters.value.style;
  emit('changeCharacterData', {
    formData: formData.value,
    callback: (result) => {
      //
    },
  });
};
const getRoleListAndSetDefault = async () => {
  getRoleList();
  const jumpRoleId = route.query.audioId;
  if (jumpRoleId) {
    currentCharacter.value = await getAudioInfoRes({ id: jumpRoleId, user_id: userId });
  } else {
    const defaultAudio_id = await getDefaultAudioRes({ user_id: userId });
    if (defaultAudio_id) {
      currentCharacter.value = await getAudioInfoRes({ id: defaultAudio_id, user_id: userId });
    }
  }
};
const sexOptions = ref();
const ageOptions = ref();
const styleOptions = ref();
const kindOptions = ref();
const initGetOptions = async () => {
  sexOptions.value = await getSelectOptionRes({ type: 'sex' });
  ageOptions.value = await getSelectOptionRes({ type: 'age' });
  styleOptions.value = await getSelectOptionRes({ type: 'style' });
  kindOptions.value = await getSelectOptionRes({ type: 'kind' });
};
onMounted(() => {
  initGetOptions();
});
onActivated(() => {
  getRoleListAndSetDefault();
});
defineExpose({
  currentCharacter,
  getRoleListAndSetDefault,
  getRoleList,
});
</script>

<style lang="scss" scoped>
.character-selector {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  gap: 5px;
  border-radius: 5px;
  cursor: pointer;

  .avatar {
    height: 70px;
    border-radius: 5px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .character-info {
    display: flex;
    // flex: 1;
    flex-direction: column;
    justify-content: center;
    gap: 10px;
    .character-name {
      font-size: 16px;
      flex: 1;
      text-align: center;
      color: #333;
    }
    .tags {
      width: 100%;
      height: 50%;
      text-align: center;
      padding: 5px 5px;
      font-size: 16px;
      text-align: center;
      padding: 5px 10px;
      border-radius: 10px;
      white-space: nowrap;
      user-select: none;
      overflow: hidden;
      text-overflow: ellipsis;
      background-color: #deeef5;
    }
  }
}

.user-row {
  display: flex;
}
.filters {
  display: flex;
  gap: 10px;
  justify-content: center;
  // justify-content: center;
  :deep(.el-select) {
    --el-color-primary: #409eff;
    --el-border-color-hover: #409eff;
  }
}
.character-card {
  text-align: center;
  margin: auto;
  padding: 8px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background-color: #f9f9f9;
  cursor: pointer;
}

.user-info {
  flex: 1;
  margin-left: 15px;
}

.personality {
  background-color: #ffecb3;
  color: #ff9800;
}
.search-input {
  --el-input-border-color: #d4e0ea;
  --el-border-color-hover: #409eff;
  --el-input-focus-border-color: #409eff !important;
  --el-border-radius-base: 10px;
}
::v-deep .el-dialog {
  position: absolute;
  top: -50px;
  left: 25%;
  .el-dialog__body {
    padding: 0px;
    padding-top: 10px !important;
  }
  .el-dialog__footer {
    padding: 0px;
  }
  .el-dialog__header {
    padding: 0px;
    padding-left: 20px;
    margin-right: 0px;
    align-items: center;
    background-color: rgb(237, 241, 244);
    .el-input__wrapper {
      background-color: rgb(237, 241, 244);
    }
    .el-dialog__headerbtn {
      .el-dialog__close {
        --el-color-primary: var(--el-color-info);
      }
    }
    .el-dialog__headerbtn {
      margin-top: -6px;
      margin-right: 10px;
    }
  }
}
.dialog-body {
  padding-top: 0px;
  border-bottom: 1px solid #ddd;
  display: flex;
  overflow: auto;
  flex-direction: column;
  .role-title {
    font-size: 16px;
    font-weight: bold;
    width: 100%;
    padding-left: 20px;
    line-height: 40px;
    height: 40px;
    color: #333;
    border-bottom: 1px solid #d6d7df;
  }
  .recent-users {
    width: 100%;
    height: 58px !important;
    justify-content: space-between;
    display: flex;
    padding: 5px;
    padding-left: 20px;

    border-bottom: 1px solid #d6d7df;

    .avatar-and-name {
      display: flex;
      align-items: center;
      width: 30%;
      .user-avatar {
        width: 50px;
        height: 50px;
        border-radius: 5px;
      }
      .user-name {
        width: 300px;
        font-size: 16px;
        text-align: start;
        padding-left: 30px;
        align-content: center;
      }
    }
    .user-tags {
      display: flex;
      gap: 10px;
      align-items: center;
      justify-content: space-between;
      padding-right: 50px;
      font-size: 16px;
      .user-tag {
        padding: 5px 10px;
        border-radius: 10px;
        background-color: #deeef5;
      }
      .user-tag1 {
        width: 60%;
        padding-left: 10px;
        height: 100%;
        display: flex;
        align-items: center;
        background-color: rgb(212, 224, 234);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        user-select: none;
      }
      .user-tag2 {
        padding-left: 10px;
        height: 100%;
        align-content: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        user-select: none;
        background-color: rgb(235, 244, 255);
      }
    }
  }
}
.recent-users:hover {
  background-color: rgb(237, 241, 244);
}
.footer-class {
  height: 40px;
  width: 100%;
  text-align: center;
  cursor: pointer;
  line-height: 40px;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
}
.footer-class:hover {
  background-color: rgb(237, 241, 244);
}
::v-deep .el-dialog__header {
  border-radius: 10px 10px 0px 0px;
  padding: 0px !important;
}
::v-deep .el-input__wrapper.is-focus {
  box-shadow: none !important;
}
</style>
