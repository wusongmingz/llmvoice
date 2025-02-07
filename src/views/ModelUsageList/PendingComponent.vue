<template>
  <!-- 待上架 -->
  <div style="height: 100%; width: 100%; zoom: 0.98; overflow-y: auto">
    <div v-for="user in data" :key="user.id">
      <div
        class="user-item"
        @mouseover="hoveredUser = user.id"
        @mouseleave="hoveredUser = null"
        :class="{ 'user-item-hovered': hoveredUser === user.id && buttonHovered !== user.id }"
      >
        <!-- 头像 -->
        <img :src="user.pic_url" alt="" class="user-avatar" />
        <div class="user-info">
          <div class="user-name-container">
            <div class="user-name">{{ user.name }}</div>
            <div class="user-sex-age-container">
              <div class="user-sex">{{ user.sex === 1 ? '男' : '女' }}</div>
              <div class="user-age">{{ user.age }}</div>
            </div>
          </div>

          <div class="user-traits">{{ user.desc }}</div>
          <div style="width: 280px; display: flex; flex-direction: column; justify-content: center; align-items: center">
            <div class="user-submit">提交时间：{{ formatTimestamp(user.updated_at) }}</div>
            <div class="user-listing">{{ statusMap[user.status] || '未知状态' }}</div>
          </div>
          <div v-if="statusMap[user.status] == '等待上架'">
            <button
              style="
                background-color: white;
                border-radius: 5px;
                width: 100px;
                height: 30px;
                border: 1px solid rgb(233, 239, 246);
                /* pointer-events: none; */
                margin-left: 30px;
                margin-top: 20px;
              "
              @mouseover="
                buttonHovered = user.id;
                hoveredUser = null;
              "
              @mouseleave="buttonHovered = null"
              :style="{ backgroundColor: buttonHovered === user.id ? 'rgb(233, 239, 246)' : 'white' }"
              @click="unlistClick(user.id)"
            >
              取消上架
            </button>
          </div>
        </div>
      </div>
      <!-- 动态渲染音频文件列表 -->
      <div class="user-items" v-for="(item, index) in user.kind" :key="'audio-' + index">
        <div class="user-infos">
          <div class="user-language">支持语言：{{ user.kind[index] }}</div>
          <div class="user-style">{{ user.style[index] }}</div>
          <div class="user-listings">
            {{ user.audio_names && user.audio_names[index] ? user.audio_names[index] : '' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, defineEmits } from 'vue';
import '@/styles/iconfont/iconfont.css';
import { defineProps } from 'vue';
import { useList } from './hook/useList';
import { useUserStore } from '@/store/modules/user';
const userStore = useUserStore();
const userId = userStore.sysUser?.userID || '';
const { getDeleteAudioRes } = useList();
// 悬浮效果
const hoveredUser = ref(null); // 控制父元素悬浮
const buttonHovered = ref(null); // 控制按钮悬浮

const statusMap = {
  1: '等待上架',
  2: '人工审核',
  3: '模型训练',
  4: '已上架',
  5: '拒绝上架（具体原因请联系客服）',
};

const props = defineProps({
  list: {
    type: Array,
    required: true,
  },
});
const hovered = ref[false];
const data = ref([]);
// 取消上架
const emit = defineEmits(['updateList']);
async function unlistClick(id) {
  // console.log(id);
  const formData = ref({});
  formData.value = {
    user_id: userId,
    id: id,
  };
  await getDeleteAudioRes(formData.value);

  emit('updateList', id); // 触发自定义事件，通知父组件更新
}
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${year}/${month}/${day} ${hours}:${minutes}`;
}

const getData = () => {
  data.value = props.list;
};
watch(
  () => props.list,
  (newList) => {
    data.value = newList;
  },
  { immediate: true, deep: true },
);

onMounted(() => {
  getData();
});
</script>

<style scoped>
.user-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #e0e0e0;
  border-radius: 0;
  transition: background-color 0.3s ease;
  margin-bottom: 10px;
  height: 90px;
  width: 100%;
}

.user-items {
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #e0e0e0;
  border-radius: 0;
  transition: background-color 0.3s ease;
  margin-bottom: 10px;
  height: 50px;
  width: 100%;
}

.user-item-hovered {
  background-color: rgba(210, 214, 218, 1);
}
.user-hovered-btn {
  /* background-color: rgb(233, 239, 246); */
  background-color: red;
}

.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 5px;
  margin-right: 10px;
}

.user-info {
  display: flex;
  height: 50px;
  align-items: center;
  width: 93%;
}

.user-infos {
  display: flex;
  height: 50px;
  width: 93%;
}
.user-sex-age-container {
  display: flex;
}
.user-name {
  /* flex-grow: 1; */
  width: 160px;
  /* margin-left: 30px;
  margin-right: 30px; */
  /* text-align: center; */
  font-size: 14px;
  font-weight: 700;
  color: #333;
  white-space: nowrap; /* 强制文本不换行 */
  overflow: hidden; /* 超出宽度的部分隐藏 */
  text-overflow: ellipsis; /* 超出部分显示省略号 */
  padding-bottom: 15px;
  padding-left: 10px;
}

.user-sex {
  width: 30px;
  font-size: 13px;
  flex-grow: 0;
  height: 30px;
}
.user-age {
  width: 60px;
  font-size: 13px;
  padding-left: 20px;
  white-space: nowrap; /* 强制文本不换行 */
  overflow: hidden; /* 超出宽度的部分隐藏 */
  text-overflow: ellipsis; /* 超出部分显示省略号 */
  height: 30px;
}
.user-language {
  width: 240px;
  font-size: 13px;
}

.user-style {
  width: 180px;
  font-size: 13px;
  padding-left: 30px;
  white-space: nowrap; /* 强制文本不换行 */
  overflow: hidden; /* 超出宽度的部分隐藏 */
  text-overflow: ellipsis; /* 超出部分显示省略号 */
}

.user-traits {
  font-size: 13px;

  margin-left: 20px;
  width: 330px;
  min-width: 100px;
  min-height: 20px;
  height: 60px;
  border-radius: 4px;
  border: 1px solid rgb(233, 239, 246);
  color: #333;
  overflow: hidden; /* 超出宽度的部分隐藏 */
  text-overflow: ellipsis; /* 超出部分显示省略号 */
  border-radius: 10px;
}

.user-submit {
  font-size: 13px;
  width: 100%;
  text-align: center;
  /* flex: 1; */
  color: #333;
  padding-bottom: 5px;
  /* text-align: end; */
}

.user-listing {
  width: 110px;
  font-size: 13px;
  height: 30px;
  padding: 5px 5px;
  text-align: center;
  border-radius: 10px;
  align-content: center;
  background-color: rgb(237, 241, 244);
  white-space: nowrap;
  overflow: hidden;
}

.user-listings {
  width: 300px;
  font-size: 13px;
  height: 50px;
  text-align: center;
  border-radius: 10px;
}

div[style*='overflow-y: auto'] {
  max-height: 700px; /* 可根据需要调整最大高度 */
}
</style>
