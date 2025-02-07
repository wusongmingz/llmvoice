<template>
  <div style="height: 100%; width: 100%; position: relative">
    <div class="user-list" v-if="status === 'nomal'">
      <div
        class="user-item"
        v-for="(user, index) in data"
        @click="changeCurrentSelectRole(user)"
        :key="user.id"
        :style="currentSelectUser?.id === user?.id ? 'background:#edf1f4' : ''"
        @mouseover="hoveredUser = user.id"
        @mouseleave="hoveredUser = null"
        :class="{ 'user-item-hovered': hoveredUser === user.id }"
      >
        <div class="user-avatar-container">
          <!-- 头像 -->
          <img :src="user.pic_url" class="user-avatar" />
        </div>
        <!-- 用户信息 -->
        <div class="user-info">
          <div class="user-name">{{ user.name }}</div>
          <div class="user-traits" :class="{ highlight: hoveredUser === user.id }">
            {{ user.style.join('、') }}
          </div>
          <div class="user-language" :class="{ highlight: hoveredUser === user.id }">支持语言: {{ user.kind.join('、') }}</div>
          <div style="flex: 1"></div>
          <div class="right-btn">
            <button v-if="user.is_in_selected_list" class="remove-button" @click="deletefromList(user.id)">从列表中删除</button>
            <button v-else class="add-button" @click="addSelectList(user.id)">添加至选择列表</button>
          </div>
          <span
            :style="{ fontSize: '35px', color: user?.is_default_select ? '#d7000f' : 'rgb(210,214,218)' }"
            style="cursor: pointer; margin-left: 3%"
            class="iconfont icon-a-bianzu32x"
            title="设为默认语音"
            @click="setAudioDefault(user.is_default_select, user.id)"
          >
          </span>
        </div>

        <!-- 收藏图标 -->
        <div @click="toggleFavorite(user, index)" class="favorite-icon-container">
          <span
            :style="{ color: isFavorite[index] ? '#d7000f' : 'rgb(210,214,218)', fontSize: '34px' }"
            :class="['iconfont', 'icon-shoucang_shoucang']"
            :title="user.is_in_collection ? '取消收藏' : '加入我的收藏'"
          ></span>
        </div>
      </div>
    </div>
    <div v-else-if="status === 'noNomal'" class="user-list">
      <PendingComponent :list="data" @updateList="handleUpdateList"></PendingComponent>
    </div>
    <div v-else-if="status === 'sound'" class="user-list">
      <div
        class="user-item"
        v-for="(user, index) in data"
        @click="changeCurrentSelectRole(user)"
        :key="user.id"
        @mouseover="hoveredUser = user.id"
        @mouseleave="hoveredUser = null"
        :class="{ 'user-item-hovered': hoveredUser === user.id }"
      >
        <div class="user-avatar-container">
          <!-- 头像 -->
          <img :src="user.pic_url" alt="" class="user-avatar" />
        </div>

        <!-- 用户信息 -->
        <div class="user-info">
          <div class="user-name">{{ user.name }}</div>
          <div class="user-traits">
            {{ user.style.join('、') }}
          </div>
          <div class="user-language" :class="{ highlight: hoveredUser === user.id }" v-if="user.kind && user.kind.length > 0">
            支持语言: {{ user.kind.join('、') }}
          </div>
        </div>

        <!-- 删除图标 -->
        <div style="margin-right: 3%">
          <span
            :style="{ fontSize: '30px', color: isClicked ? 'red' : 'rgb(210, 214, 218)' }"
            class="iconfont icon-shanchu"
            @click="deleteSounds(user, index)"
          ></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, onMounted, watch, nextTick } from 'vue';
import '@/styles/iconfont/iconfont.css';
import PendingComponent from './PendingComponent.vue';
import { useList } from './hook/useList';
import { useUserStore } from '@/store/modules/user';
import { ElMessage } from 'element-plus';
import router from '@/router';

const userStore = useUserStore();
const formData = ref({});
const userId = userStore.sysUser?.userID || '';
const is_default_select_style = ref(false);
const emit = defineEmits(['changeCurrentAudioInfo']);
// 组件状态
const props = defineProps({
  status: {
    type: String,
    required: true,
  },
  slavelist: {
    type: Array,
    required: true,
  },
});

// 接口调用
const { getCollectionList, getAudioInfoRes, getCollectionLists, getsetAudioDefaultRes, getdeleteOrAddAudioRes } = useList();
const dataKey = {
  page: 1,
  size: 1000,
  order_by: 'lastused',
  query_type: 'all',
  user_id: userId,
};
const data = ref([]);
const isFavorite = ref([]); // 初始化收藏状态的数组

// 父组件的处理方法
// function handleUpdateList(deletedId) {
//   console.log('父组件接收到更新事件，删除的ID是:', deletedId);
//   const updatedList = props.slavelist.filter((item) => item.id !== deletedId);
//   props.updateList(updatedList);
// }
const handleUpdateList = (id) => {
  // 在这里处理接收到的id，比如更新相关数据、重新渲染列表等
  // console.log('接收到子组件传来的id:', id);
  data.value = props.slavelist.filter((item) => {
    return item.id !== id;
  });

  // 假设这里有一个列表数据listData，根据id进行更新操作
  // this.listData = this.listData.filter(item => item.id!== id);
};

const getData = () => {
  data.value = props.slavelist;

  // 根据接口返回的 is_in_collection 字段初始化 isFavorite 数组
  isFavorite.value = data.value.map((user) => user.is_in_collection);
};
const setAudioDefault = async (is_default_select, id) => {
  if (is_default_select) {
    ElMessage.warning('已经是默认语言');
    return;
  }
  formData.value = {};
  formData.value.user_id = userId;
  formData.value.audio_id = id;
  await getsetAudioDefaultRes(formData.value);
  emit('changeDefaultStatus', true);
  emit('changeUpdata');
  getData();
};

const addSelectList = async (id) => {
  //添加到列表
  formData.value = {};
  formData.value.op = 1;
  formData.value.audio_id = id;
  formData.value.user_id = userId;

  await getdeleteOrAddAudioRes(formData.value);
  emit('changeIsSelectListStatus', true);
  emit('changeUpdata');
  router.push({ path: '/textToSpeech', query: { audioId: id } });
  // console.log('选择被点击' + id);
};
const deletefromList = async (id) => {
  //从列表中删除
  formData.value = {};
  formData.value.op = 2;
  formData.value.audio_id = id;
  formData.value.user_id = userId;
  await getdeleteOrAddAudioRes(formData.value);
  emit('changeIsSelectListStatus', false);

  nextTick(() => {
    emit('changeUpdata');
  });
};
// 切换收藏状态的方法
const toggleFavorite = (user, index) => {
  const op = isFavorite.value[index] ? 2 : 1;
  isFavorite.value[index] = !isFavorite.value[index];
  const updataisFavorite = {
    op: op,
    audio_id: user.id,
    user_id: userId,
  };
  // console.log(updataisFavorite);
  getCollectionList(updataisFavorite);
};
const currentSelectUser = ref(null);
const changeCurrentSelectRole = async (item) => {
  formData.value = {};
  formData.value.id = item.id;
  formData.value.user_id = userId;
  currentSelectUser.value = item;
  const audioInfo = await getAudioInfoRes(formData.value);

  emit('changeCurrentAudioInfo', audioInfo);
  //
};
let index = 0;
// 使用 watch 监听 slavelist 数据的变化
watch(
  () => props.slavelist,
  (newList) => {
    if (newList.length >= 0) {
      data.value = newList;
      if (index == 0 && newList.length > 0) {
        currentSelectUser.value = props?.slavelist?.[0];
        index++;
      }

      isFavorite.value = newList.map((user) => user.is_in_collection);
    }
  },
  { immediate: true },
);
watch(
  () => currentSelectUser.value,
  (newList) => {
    console.log(currentSelectUser.value);
  },
  { immediate: true },
);
onMounted(() => {
  getData();
});

const hoveredUser = ref(null);

// 删除音频的方法
const deleteSounds = (user, index) => {
  // alert('删除');
  const updataisFavorite = {
    op: 2,
    audio_id: user.id,
    user_id: userId,
  };
  // console.log(updataisFavorite);
  getCollectionLists(updataisFavorite);
  data.value.splice(index, 1);
};
</script>

<style scoped>
.user-list {
  display: flex;
  flex-direction: column;
  max-height: 100%;
  overflow-y: auto;
  position: absolute;
  width: 100%;
  height: 100%;
  overflow-y: auto; /* 添加垂直滚动条 */
  overflow-x: auto; /* 禁止水平滚动条 */
}
/* .user-list::-webkit-scrollbar {
  width: 8px;
  height: 8px;
} */

.user-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #e0e0e0;
  transition: background-color 0.3s ease;
}

.user-item-hovered {
  background-color: rgb(237, 241, 244);
}
.user-avatar-container {
  width: 44px;
  height: 44px;
}

.user-avatar {
  width: 44px;
  height: 44px;
  border-radius: 5px;
  margin-right: 10px;
}

.user-info {
  display: flex;
  margin-left: 20px;
  flex: 1;
  height: 50px;
  max-height: 50px;
  align-items: center;
  padding-right: 50px;
}

.user-name {
  width: 100px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
  align-content: center;
}
/* .user-name:after {
  content: attr(data-ellipsis);
  visibility: hidden;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  width: 0;
}

.user-name[data-ellipsis] {
  width: auto;
  white-space: normal;
  overflow: visible;
  text-overflow: clip;
} */
.right-btn {
  /* margin-left: 20%; */
}
.remove-button {
  /* background-color: #d7000f; */
  border: 1px solid #409eff;
  color: #333;
  background: #fff;
  font-weight: 700;
  /* border: 1px solid #d2d6da; */
  padding: 5px 10px;
  cursor: pointer;
  transition: background-color 0.3s;
  border-radius: 5px;
  min-width: 120px;
}
.add-button {
  background-color: white;
  color: #333;
  border: 1px solid #d2d6da;
  padding: 5px 10px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.3s;
  border-radius: 5px;
  min-width: 120px;
}
.add-button:hover {
  background-color: #edf1f4;
}
.user-traits {
  width: 100px;
  height: 40px;
  min-width: 100px;
  text-overflow: ellipsis;
  /* white-space: nowrap; */
  overflow: hidden;
  margin: 0;
  /* text-align: end; */
  font-size: 14px;
  border-radius: 10px;
  /* background-color: #ffffff; */
  color: #333;
  /* align-items: center;
  justify-content: center; */
  padding: 0px 10px;
  line-height: 40px;
  /* flex: 1; */
  display: grid;
  padding-right: 40px;
}

.user-language {
  font-size: 14px;
  height: 40px;
  /* min-width: 200px; */
  width: 200px;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 4px;
  border-radius: 10px;
  /* background-color: #ffffff; */
  color: #333;
  display: flex;
  align-items: center;
  text-align: center;
  place-items: center;
}

.favorite-icon-container {
  padding-right: 40px;
}

.highlight {
  /* background-color: #ffffff; */
  /* box-shadow: 0 0 4px rgba(0, 0, 0, 0.1); */
}
</style>
