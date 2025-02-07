<template>
  <div class="container">
    <!-- 顶部筛选框 -->
    <div class="filter-container">
      <div style="display: flex; width: 100%">
        <div class="filters" style="flex: 6; padding-right: 20px">
          <el-select style="flex: 1; min-width: 100px" v-model="filters.sex" placeholder="性别" clearable size="small">
            <el-option v-for="item in sexOptions?.items" :label="item" :value="item" :key="item" />
          </el-select>

          <el-select style="flex: 1; min-width: 100px" v-model="filters.age" placeholder="年龄" clearable size="small">
            <el-option v-for="item in ageOptions?.items" :label="item" :value="item" :key="item" />
          </el-select>

          <el-select style="flex: 1; min-width: 100px" v-model="filters.style" placeholder="声音风格" clearable size="small">
            <el-option v-for="item in styleOptions?.items" :label="item" :value="item" :key="item" />
          </el-select>

          <el-select style="flex: 1; min-width: 100px" v-model="filters.lang" placeholder="语言" clearable size="small">
            <el-option v-for="item in kindOptions?.items" :label="item" :value="item" :key="item" />
          </el-select>
          <el-input
            v-model="searchQuery"
            placeholder="根据名称搜索"
            class="search-input"
            clearable
            @input="performSearch"
            @keyup.enter="performSearch"
            style="height: 40px; font-size: 14px"
          >
            <template #prefix>
              <span class="iconfont icon-sousuo" style="font-size: 22px"></span>
              <!-- <img src="@/assets/search.svg" alt="搜索图标" class="search-icon" @click="performSearch" /> -->
            </template>
          </el-input>
        </div>
        <!--todo @input-->

        <div style="width: 100%; flex: 4"></div>
      </div>

      <!-- <div class="header-image">
        <img src="@/assets/headers.svg" alt="Header" />
      </div> -->
    </div>

    <!-- 菜单和内容部分 -->
    <div class="menu-content-container">
      <div class="menu">
        <div style="flex: 6; display: flex; align-items: center; height: 100%; padding-right: 15px">
          <!-- <div :class="['fliter-btn', isSelectMenu === 'all' ? 'fliter-btn-select' : '']" @click="changeCurrentMenu('all'), (isDontShowDetail = false)">
          全部
        </div> -->
          <div
            :class="['fliter-btn', isSelectMenu === 'vomsg' ? 'fliter-btn-select' : '']"
            @click="changeCurrentMenu('vomsg'), (isDontShowDetail = false)"
          >
            语音库
          </div>
          <!-- <div
          :class="['fliter-btn', isSelectMenu === 'sound' ? 'fliter-btn-select' : '']"
          @click="changeCurrentMenu('sound'), (isDontShowDetail = false)"
        >
          我的声音
        </div> -->
          <div
            :class="['fliter-btn', isSelectMenu === 'collect' ? 'fliter-btn-select' : '']"
            @click="changeCurrentMenu('collect'), (isDontShowDetail = false)"
          >
            我的收藏
          </div>
          <!-- <div
          :class="['fliter-btn', isSelectMenu === 'toBeListed' ? 'fliter-btn-select' : '']"
          @click="changeCurrentMenu('toBeListed'), (isDontShowDetail = true)"
        >
          待上架
        </div> -->
          <div style="flex: 1"></div>
          <el-select v-model="sortOrder" size="small" class="sort-select" @change="sortData" style="width: 250px">
            <el-option label="最近使用排序" value="lastused" />
            <el-option label="按名称排序" value="name" />
          </el-select>
        </div>
        <div style="flex: 4"></div>

        <!-- <div style="background-color: aqua; max-width: 1000px; width: calc(100% - 750px); display: flex; justify-content: end"> -->
        <!-- <button @click="changeCreateDialogStatus(true)" class="custom-button">创建新的声音</button> -->
        <!-- </div> -->
        <!-- 弹窗组件 -->
        <ADialog class="create-dialog" :title="'我的声音'" :option="{ width: '560px', center: true }" v-model:isShow="isShowCreateDialog">
          <div style="height: 500px">
            <el-form ref="createVoiceForm" label-width="40px" class="create-voice-form">
              <!-- 上传头像 -->
              <div class="avatar-and-info">
                <!-- 显示当前头像或者添加图标 -->
                <div class="avatar-select" @click="toggleAvatarPicker">
                  <template v-if="newVoice.pic_url">
                    <img :src="newVoice.pic_url" alt="avatar" class="avatar-image-selected" />
                  </template>
                  <template v-else>
                    <el-icon size="15" class="avatar">
                      <AIcon icon="icon-zengjia" />
                    </el-icon>
                  </template>
                </div>

                <!-- 头像选择框 -->
                <div v-if="isAvatarPickerVisible" class="avatar-picker">
                  <div class="avatar-picker-top" @click="isAvatarPickerVisible = false"><span style="cursor: pointer">✖</span></div>
                  <div class="avatars">
                    <div v-for="(avatar, index) in avatars" :key="index" class="avatar-item" @click="selectAvatar(avatar)">
                      <img :src="avatar.pic_url" alt="avatar" class="avatar-image" />
                    </div>
                  </div>
                </div>

                <div style="width: 85%">
                  <el-form-item props="name" label="名称">
                    <el-input style="margin-right: 100px" v-model="newVoice.name" placeholder="请输入名称，不超过10个字" maxlength="10" />
                  </el-form-item>

                  <!-- 描述 -->
                  <el-form-item label="描述">
                    <el-input
                      style="margin-right: 100px"
                      v-model="newVoice.desc"
                      class="desc-input"
                      placeholder="请输入描述，不超过30字"
                      type="textarea"
                      resize="none"
                      maxlength="30"
                      :rows="3"
                    ></el-input>
                  </el-form-item>
                </div>
              </div>
              <div class="langs-center">
                <!-- 性别 -->

                <el-select class="genderAge-select" v-model="newVoice.sex" placeholder="选择性别">
                  <el-option v-for="sex in sexOptions?.items" :label="sex" :value="sex == '男声' ? 1 : 2" :key="sex" />
                </el-select>

                <!-- 年龄 -->
                <el-select class="genderAge-select" v-model="newVoice.age" placeholder="选择年龄">
                  <el-option v-for="age in ageOptions?.items" :label="age" :value="age" :key="age" />
                </el-select>
              </div>
              <!-- 分割线 -->
              <div style="width: 100%; border-bottom: 1px solid #d6d7ef; line-height: 30px; padding-left: 15px; font-weight: 600">上传语音文件</div>

              <div class="upload-file" v-for="i in currentUploadNums" :key="i">
                <span
                  class="iconfont icon-shanchu1"
                  style="font-size: 20px; display: block; color: rgb(253, 10, 32); cursor: pointer"
                  @click="removeThisUpload(i - 1)"
                ></span>
                <el-select v-model="newSoundStyleList[i - 1]" placeholder="声音风格">
                  <el-option v-for="style in styleOptions?.items" :label="style" :value="style" :key="style" />
                </el-select>
                <el-select v-model="newSoundKindList[i - 1]" placeholder="选择语言">
                  <el-option v-for="kind in kindOptions?.items" :label="kind" :value="kind" :key="kind" />
                </el-select>
                <el-upload
                  v-if="!fileLists[i - 1]"
                  :before-upload="checkSize"
                  :http-request="(file) => uploadFile(file, i)"
                  :limit="1"
                  accept=".mp3,.wav"
                  >＋上传音频文件，最大500k</el-upload
                >
                <div v-else class="file-name">{{ fileLists[i - 1].fileName }}</div>
              </div>
              <span
                class="iconfont icon-xinzeng1-copy"
                v-if="currentUploadNums <= 4"
                style="width: 20px; font-size: 20px; display: block; color: rgb(215, 0, 15); margin: 10px; cursor: pointer"
                @click="addUploadNum"
              ></span>
              <!-- 语言 -->
            </el-form>
          </div>
          <!-- 按钮 -->
          <template #footer>
            <div class="dialog-footer">
              <el-button class="cancel-btn" @click="closeDialog()">取消</el-button>
              <el-button class="submit-btn" type="primary" @click="submitNewVoice">提交</el-button>
            </div>
          </template>
        </ADialog>
        <!-- <CreateVoiceDialog ref="createVoiceDialogRef" v-model="showCreateDialog" @close="showCreateDialog = false" @createRole="getData" /> -->
      </div>
      <div class="menu-data-container">
        <!-- 用户列表 -->
        <div class="menu-list">
          <Menu
            :text="currentMenuList"
            :status="menuType"
            :slavelist="tableData"
            @changeUpdata="handleupdata"
            @changeCurrentAudioInfo="changeAudioInfo"
          ></Menu>
        </div>
        <!-- 侧边栏用户详情 -->
        <div class="select-sound">
          <List
            v-show="!isDontShowDetail"
            :data="currentRole"
            @changeDefaultStatus="changeDefaultStatus"
            @changeIsSelectListStatus="changeSelectStatus"
            @deleteRole="deleteRoleFn"
          ></List>
          <NoData v-show="isDontShowDetail"></NoData>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, watch, nextTick } from 'vue';
import Menu from './menu.vue';
import { ElMessage } from 'element-plus';
import { getSelectOptionRes } from '../TextToSpeech/hook/useTextToSpeech';
import List from './list.vue';
import NoData from './noData.vue';
import { useUserStore } from '@/store/modules/user';
import { useList } from './hook/useList';
const isDontShowDetail = ref(false);
const formData = ref({});
// 接口调用
const { getTableList, getAudioInfoRes, getCreateSoundRes, getAvararListRes, getUploadAudioRes, getsetAudioDefaultRes } = useList();

const userStore = useUserStore();
const userId = userStore.sysUser?.userID || '';
const tableData = ref([]);
const isShowCreateDialog = ref(false);
const menuStatus = ref('voicelib');
// 筛选渲染
const sexOptions = ref();
const ageOptions = ref();
const styleOptions = ref();
const kindOptions = ref();
const previousData = ref([]); // 用于保存上一次数据状态
const searchResults = ref([]); // 存储搜索结果
const initGetOptions = async () => {
  sexOptions.value = await getSelectOptionRes({ type: 'sex' });
  ageOptions.value = await getSelectOptionRes({ type: 'age' });
  styleOptions.value = await getSelectOptionRes({ type: 'style' });
  kindOptions.value = await getSelectOptionRes({ type: 'kind' });
};
const changeCreateDialogStatus = (status: boolean) => {
  isShowCreateDialog.value = status;
};
const filters = ref({
  sex: null,
  age: null,
  style: null,
  lang: null,
});
// 获取筛选数据
const getFilteredData = async () => {
  const queryParams = {
    page: 1,
    size: 1000,
    order_by: sortOrder.value === '排序方式' ? 'lastused' : sortOrder.value,
    query_type: menuStatus.value, // 或其他菜单选项
    sex: filters.value.sex === '男声' ? 1 : filters.value.sex === '女声' ? 2 : null,
    age: filters.value.age,
    style: filters.value.style,
    kind: filters.value.lang,
    user_id: userId,
    name: searchQuery.value,
  };

  try {
    const data = await getTableList(queryParams);
    tableData.value = data.length ? data : [];
  } catch (error) {
    console.error('数据加载失败:', error);
  }
};

const newSoundStyleList = ref<Array<string>>([]);
const newSoundKindList = ref<Array<string>>([]);
const fileLists = ref<Array<fileList>>([]);
const newVoice = ref({
  name: '',
  desc: '',
  sex: null,
  age: '',
  kind: Array<string>(),
  style: Array<string>(),
  pic_url: null, // 头像路径
  audio_urls: Array<string>(),
  audio_names: Array<string>(),
  user_id: userId,
});
const isAvatarPickerVisible = ref(false);
const toggleAvatarPicker = () => {
  isAvatarPickerVisible.value = !isAvatarPickerVisible.value;
};
const selectAvatar = (avatar: any) => {
  newVoice.value.pic_url = avatar.pic_url;
  isAvatarPickerVisible.value = false; // 关闭头像选择框
};
interface avatarInfo {
  id?: number;
  name?: string;
  pic_url?: string;
}
interface fileList {
  fileName: string;
  url: string;
}
const avatars = ref<Array<avatarInfo>>([{}]);
const getAvatar = async () => {
  avatars.value = await getAvararListRes();
};
const currentUploadNums = ref(0);
const addUploadNum = () => {
  currentUploadNums.value++;
  if (currentUploadNums.value > 5) {
    ElMessage.warning('最大上传5个');
    return;
  }
};
const checkSize = (file: File) => {
  const maxSize = 500 * 1024;
  if (file.size > maxSize) {
    ElMessage.error('文件大小超过500KB，请重新选择');
    return false;
  }
  return true;
};
const uploadFile = async (file: any, i: number) => {
  const url = await getUploadAudioRes(file.file);
  if (url === null) {
    return;
  }
  fileLists.value[i - 1] = { fileName: file.file.name, url: url };
};
const removeThisUpload = (i: number) => {
  //删除
  newSoundStyleList.value.splice(i, 1);
  newSoundKindList.value.splice(i, 1);
  fileLists.value.splice(i, 1);
  currentUploadNums.value--;
};
const closeDialog = () => {
  isShowCreateDialog.value = false;
};
const submitNewVoice = async () => {
  //
  newVoice.value.kind = newSoundKindList.value;
  newVoice.value.style = newSoundStyleList.value;
  newVoice.value.audio_urls = fileLists.value.map((item) => {
    return item.url;
  });
  newVoice.value.audio_names = fileLists.value.map((item) => {
    return item.fileName;
  });
  newVoice.value.user_id = userId;
  if (!newVoice.value.pic_url) {
    ElMessage.error('请选择头像');
    return;
  }
  if (!newVoice.value.name.trim()) {
    ElMessage.error('请输入名称');
    return;
  }
  if (!newVoice.value.age) {
    ElMessage.error('请选择年龄');
    return;
  }
  if (!newVoice.value.sex) {
    ElMessage.error('请选择性别');
    return;
  }
  if (newVoice.value.kind.length === 0 || newVoice.value.style.length === 0 || newVoice.value.audio_urls.length === 0) {
    ElMessage.warning('创建新的声音必须有一个音频、风格、种类');
    return;
  }
  if (newVoice.value.kind.length != newVoice.value.style.length || newVoice.value.audio_urls.length != newVoice.value.kind.length) {
    ElMessage.warning('请确保上传的音频、风格、种类数量一致');
    return;
  }
  await getCreateSoundRes(newVoice.value);
  isShowCreateDialog.value = false;
  changeCurrentMenu('all');
  getData();
};
// 监听筛选条件的变化
watch(filters, getFilteredData, { deep: true });

function getKey({
  page = 1,
  size = 1000,
  order_by = 'lastused',
  // query_type = 'all',
  query_type = 'voicelib',
  name = nameSearch.value,
  user_id = userId,
  sex = null as number | null, // 新增参数，默认值为 null
  age = null, // 新增参数，默认值为 null
  style = null, // 新增参数，默认值为 null
  kind = null, // 新增参数，默认值为 null
} = {}) {
  return reactive({
    page,
    size,
    order_by,
    query_type,
    name,
    user_id,
    sex,
    age,
    style,
    kind,
  });
}

async function sortData() {
  nameSearch.value = searchQuery.value;
  // console.log(nameSearch.value, 1);
  console.log(filters.value.lang, '11111');

  const updatedKey = getKey({
    order_by: sortOrder.value === '排序方式' ? 'lastused' : sortOrder.value,
    query_type: menuStatus.value,
    name: nameSearch.value,
    age: filters.value.age,
    sex: filters.value.sex === '男声' ? 1 : filters.value.sex === '女声' ? 2 : null,
    style: filters.value.style,
    kind: filters.value.lang,
  });
  try {
    const data = await getTableList(updatedKey);
    tableData.value = data;
  } catch (error) {
    // console.error('Failed to load table data:', error);
    //
  }
}
// 执行搜索的方法，点击搜索图标或回车键时触发
const searchQuery = ref('');
const performSearch = async () => {
  if (searchQuery.value.trim() === '') {
    // ElMessage.error('搜索框为空');
    return;
  }
  if (searchQuery.value.trim()) {
    // console.log('执行搜索:', searchQuery.value);
    // console.log('搜索筛选', filters.value);
    nameSearch.value = searchQuery.value;
    const Key = reactive({
      page: 1,
      size: 1000,
      order_by: sortOrder.value === '排序方式' ? 'lastused' : sortOrder.value,
      query_type: menuStatus.value,
      name: nameSearch.value,
      user_id: userId,
      age: filters.value.age,
      sex: filters.value.sex === '男声' ? 1 : filters.value.sex === '女声' ? 2 : null,
      style: filters.value.style,
      kind: filters.value.lang,
    });

    // 保存当前数据状态
    if (tableData.value.length > 0) {
      previousData.value = [...tableData.value];
    }

    const data = await getTableList(Key);
    tableData.value = data.length ? data : [];
    // tableData.value = data;
    // console.log(tableData.value, 11111);

    nameSearch.value = '';
    // console.log('搜索结果数据:', tableData.value);
  } else {
    ElMessage.error('搜索发生错误');
  }
};
watch(
  () => searchQuery.value,
  async (newQuery) => {
    if (!newQuery.trim()) {
      tableData.value = [...previousData.value];
      console.log('搜索框清空，恢复原始数据:', tableData.value);
      const updatedKey = getKey({
        query_type: menuStatus.value,
        order_by: sortOrder.value === '排序方式' ? 'lastused' : sortOrder.value,
        age: filters.value.age,
        sex: filters.value.sex === '男声' ? 1 : filters.value.sex === '女声' ? 2 : null,
        style: filters.value.style,
        kind: filters.value.lang,
        name: '',
      });
      // console.log(updatedKey);
      try {
        const data = await getTableList(updatedKey);
        tableData.value = data;
        previousData.value = data;
      } catch (error) {
        console.error('Failed to load table data:', error);
      }

      await nextTick();
    }
  },
);
const nameSearch = ref();
const dataKey = reactive({
  page: 1,
  size: 1000,
  order_by: 'lastused',
  // query_type: 'all',
  query_type: 'voicelib',
  name: nameSearch.value,
  user_id: userId,
});
interface selectKey {
  id?: number;
  user_id?: string;
}
const selectData = ref<selectKey>({});

const getData = async () => {
  tableData.value = await getTableList(dataKey);
  previousData.value = tableData.value;
  selectData.value = {};
  selectData.value.id = tableData.value[0].id;
  selectData.value.user_id = userId;
  currentRole.value = await getAudioInfoRes(selectData.value);
  // console.log('master的数据', res);
};

const sortOrder = ref('排序方式');

const isSelectMenu = ref('vomsg'); //默认
const currentMenuList = ref();
//切换当前菜单页面
const menuType = ref('nomal');

const changeCurrentMenu = async (item: string) => {
  isSelectMenu.value = item;
  currentMenuList.value = item;

  switch (currentMenuList.value) {
    case 'toBeListed': {
      menuType.value = 'noNomal';
      menuStatus.value = 'pendinglisting';
      nameSearch.value = searchQuery.value;
      const updatedKey = getKey({
        query_type: 'pendinglisting',
        order_by: sortOrder.value === '排序方式' ? 'lastused' : sortOrder.value,
        age: filters.value.age,
        sex: filters.value.sex === '男声' ? 1 : filters.value.sex === '女声' ? 2 : null,
        style: filters.value.style,
        kind: filters.value.lang,
        name: nameSearch.value,
      });
      // console.log(updatedKey);
      try {
        const data = await getTableList(updatedKey);
        tableData.value = data;
        previousData.value = data;
      } catch (error) {
        console.error('Failed to load table data:', error);
      }
      break;
    }
    case 'all': {
      menuType.value = 'nomal';
      menuStatus.value = 'all';
      nameSearch.value = searchQuery.value;
      const updatedKey = getKey({
        query_type: 'all',
        order_by: sortOrder.value === '排序方式' ? 'lastused' : sortOrder.value,
        age: filters.value.age,
        // eslint-disable-next-line
        sex: filters.value.sex === '男声' ? 1 : filters.value.sex === '女声' ? 2 : null,
        style: filters.value.style,
        kind: filters.value.lang,
        name: nameSearch.value,
      });

      try {
        const data = await getTableList(updatedKey);
        tableData.value = data;
        previousData.value = data;
      } catch (error) {
        console.error('Failed to load table data:', error);
      }
      break;
    }
    case 'vomsg': {
      nameSearch.value = searchQuery.value;
      menuType.value = 'nomal';
      menuStatus.value = 'voicelib';
      const updatedKey = getKey({
        query_type: 'voicelib',
        order_by: sortOrder.value === '排序方式' ? 'lastused' : sortOrder.value,
        age: filters.value.age,
        sex: filters.value.sex === '男声' ? 1 : filters.value.sex === '女声' ? 2 : null,
        style: filters.value.style,
        kind: filters.value.lang,
        name: nameSearch.value,
      });
      try {
        const data = await getTableList(updatedKey);
        tableData.value = data;
        previousData.value = data;
      } catch (error) {
        console.error('Failed to load table data:', error);
      }
      break;
    }
    case 'sound': {
      nameSearch.value = searchQuery.value;
      menuType.value = 'nomal';
      menuStatus.value = 'myvoice';
      const updatedKey = getKey({
        query_type: 'myvoice',
        order_by: sortOrder.value === '排序方式' ? 'lastused' : sortOrder.value,
        age: filters.value.age,
        sex: filters.value.sex === '男声' ? 1 : filters.value.sex === '女声' ? 2 : null,
        style: filters.value.style,
        kind: filters.value.lang,
        name: nameSearch.value,
      });
      try {
        const data = await getTableList(updatedKey);
        tableData.value = data;
        previousData.value = data;
      } catch (error) {
        console.error('Failed to load table data:', error);
      }
      break;
    }
    case 'collect': {
      nameSearch.value = searchQuery.value;
      menuType.value = 'sound';
      menuStatus.value = 'mycollection';
      const updatedKey = getKey({
        query_type: 'mycollection',
        order_by: sortOrder.value === '排序方式' ? 'lastused' : sortOrder.value,
        age: filters.value.age,
        sex: filters.value.sex === '男声' ? 1 : filters.value.sex === '女声' ? 2 : null,
        style: filters.value.style,
        kind: filters.value.lang,
        name: nameSearch.value,
      });
      try {
        const data = await getTableList(updatedKey);
        tableData.value = data;
        previousData.value = data;
      } catch (error) {
        console.error('Failed to load table data:', error);
      }
      break;
    }
  }
};
const handleupdata = () => {
  console.log('更新传入数据');
  getFilteredData();
};

const changeAudioInfo = (data: any) => {
  currentRole.value = data;
};
const changeDefaultStatus = (status: boolean) => {
  currentRole.value.is_default_select = status;
};
const changeSelectStatus = (status: boolean) => {
  currentRole.value.is_in_selected_list = status;
};
interface audioRole {
  age?: string;
  audio_urls?: string[];
  author?: string;
  desc?: string;
  id?: number;
  is_default_select?: boolean;
  is_in_selected_list?: boolean;
  kind?: string[];
  name?: string;
  pic_url?: string;
  reject_reason?: string;
  sex?: number;
  speed_of_speech?: number;
  status?: number;
  style?: string[];
  tone?: number;
}
const currentRole = ref<audioRole>({});
const deleteRoleFn = () => {
  changeCurrentMenu('all');
  getData();
};
const newVoiceCopy = JSON.parse(JSON.stringify(newVoice));
const clearData = () => {
  newVoice.value = JSON.parse(JSON.stringify(newVoiceCopy));
  newSoundKindList.value = [];
  currentUploadNums.value = 0;
  newSoundStyleList.value = [];
  fileLists.value = [];
};
onMounted(() => {
  getData();
  initGetOptions();
  // getFilteredData(); // 初次筛选加载时获取数据
  watch(
    () => isShowCreateDialog.value,
    (newVal, oldVal) => {
      if (!newVal) {
        // createVoiceDialogRef.value.clearData();
        clearData();
      }
    },
    { immediate: true, deep: true },
  );
  getAvatar();
});
</script>

<style lang="scss" scoped>
.menu-side {
  width: 40%;
  border-left: 1px solid #ddd;
  padding: 20px;
  box-sizing: border-box;
}
.container {
  width: 100%;
  height: 100%;
  max-width: 100%;
  padding: 10px;
  padding-top: 0px;
  // background-color: rgb(237, 241, 244);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
}

.portrait-details {
  padding: 12px;
  background-color: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
}
.filter-container {
  overflow-x: auto;
  overflow-y: hidden;
  align-items: center;
  width: 100%;
  flex: 1.08;
  min-height: 40px;
  border-radius: 10px 10px 0px 0px;
  // background-color: white;
  background-image: url('@/assets/image/home/audiolisttop.png');
  background-size: 100% 100%;
  display: flex;
  align-items: center;
  padding-left: 10px;
}

.filters {
  width: 35%;
  min-width: 300px;
  height: 100%;
  margin-right: 15px;
  display: flex;
  align-items: center;
  gap: 15px;
  :deep(.el-select) {
    // --el-select-input-focus-border-color: #d7d7d7;
    --el-select-border-color-hover: rgb(145, 198, 222);
  }
}

::v-deep .el-input {
  border-right: none !important;
}
::v-deep .el-input .el-input-group__append {
  background: white !important;
  border-left: none !important;
}

.search-input {
  min-width: 250px; /* 保证最小宽度 */
  // border-radius: 10px;
  --el-input-border-color: #d7d7ef;
  --el-border-color-hover: rgb(145, 198, 222);
  --el-input-focus-border-color: rgb(145, 198, 222) !important;
}
.search-input .el-input__inner {
  // height: 36px; /* 输入框高度 */
  font-size: 14px; /* 字体大小 */
  padding-right: 30px; /* 保证图标位置 */
}

.search-input .el-input__append img {
  cursor: pointer;
  vertical-align: middle;
}
.search-input .el-input__append {
  border: none; /* 去掉图标容器的边框 */
  padding: 0; /* 去掉图标容器的内边距 */
}

.search-input {
  width: 30px;
  height: 40px;
  cursor: pointer;
  overflow: hidden;
  border: none;
  vertical-align: middle; /* 确保图标与输入框对齐 */
  position: relative;
}
.search-icon {
  width: 25px;
  height: 25px;
  cursor: pointer;
  overflow: hidden;
  border: none;
  vertical-align: middle; /* 确保图标与输入框对齐 */
  position: absolute;
  right: 20px; /* 根据需要调整 */
  border-radius: 10px;
}

.header-image {
  // flex: 1;

  display: flex;
  justify-content: end;
  min-width: 220px; /* 设置最小宽度为 220px */
  overflow: hidden;
  width: 25vw; /* 固定宽度为 220px */
}

.header-image img {
  width: 220px; /* 图片宽度始终占满容器 */
  max-width: 100%; /* 最大宽度为容器宽度 */
  margin-right: 20px;
  object-fit: contain;
}

.menu-content-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 8.95;
  padding: 10px;
  background-color: #fff;
  border-radius: 0px 0px 10px 10px;
  .menu-data-container {
    width: 100%;
    height: 100%;
    display: flex;
    padding-right: 8px;
    .menu-list {
      width: 60%;
      height: 100%;
      padding: 10px;
    }
    .select-sound {
      width: 40%;
      height: calc(100% - 10px);
      margin: 10px 0px;
      border: 1px solid #dcdfe6;
      border-radius: 10px;
      padding: 6px;
      // margin: 5px;
    }
  }
}

.menu {
  display: flex;
  width: 100%;
  height: 40px;
  min-height: 40px;
  font-size: 14px;
  gap: 10px;
  align-items: center;
  :deep(.el-select) {
    // --el-select-input-focus-border-color: #d7d7d7;
    --el-select-border-color-hover: #409eff;
  }
  .fliter-btn {
    width: 80px;
    height: 30px;
    margin: 0 10px;
    text-align: center;
    line-height: 30px;
    border-radius: 10px;
    user-select: none;
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
    white-space: nowrap; /* 防止换行 */
  }
  .fliter-btn:hover {
    box-shadow: 0px 0px 3px rgb(0, 0, 0, 0.1);
    background-color: #409eff;

    // background: linear-gradient(45deg, #409eff, #6fbce2);

    color: rgb(255, 255, 255);
  }
  .fliter-btn-select {
    background-color: #409eff;
    box-shadow: 0px 0px 3px rgb(0, 0, 0, 0.1);
    // background: linear-gradient(45deg, #409eff, #8585f08f);
    color: rgb(255, 255, 255);
  }
  .el-select {
    height: 90%;
    max-height: 50px;
  }
}

.tab-content {
  width: 100%;
  height: 100px;
  background-color: aqua;
}

.custom-button {
  height: 32px;
  width: 150px;
  background-color: black; /* 黑色背景 */
  color: white; /* 白色字体 */
  // border: none; /* 去掉边框 */
  border-radius: 5px; /* 圆角 */
  cursor: pointer; /* 鼠标变成手形 */
  margin-left: 45%;
  transition: background-color 0.3s ease, color 0.3s ease; /* 动画效果 */
  margin-right: 30px;
  /* margin-top: 1%; */
  white-space: nowrap; /* 强制文本不换行 */
}

.custom-button:hover {
  background-color: white; /* 悬停时白色背景 */
  color: #333; /* 悬停时黑色字体 */
}
.content {
  display: flex;
  width: 100%;
  height: 100%;
}

.list {
  width: 60%;
  padding: 10px;
  max-height: 120%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.list-item {
  display: flex;
  align-items: center;
  margin: 5px 0;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  padding: 5px;
  background-color: white;
}

.language {
  color: #555; /* 语言文本颜色 */
  margin-right: 10px; /* 语言与头像间距 */
  font-size: 14px; /* 语言字体大小 */
}

.avatar {
  width: 50px; /* 正方形头像 */
  height: 50px;
  border-radius: 5px; /* 轻微圆角 */
  margin-right: 10px;
}

.name {
  flex: 1; /* 使名称部分占满剩余空间 */
}

.tags {
  display: flex;
  gap: 5px; /* 标签间距 */
}

.tag {
  background-color: #e0e0e0; /* 标签背景色 */
  border-radius: 4px; /* 圆角 */
  padding: 2px 5px; /* 标签内边距 */
}

.delete-button {
  color: red; /* 删除按钮颜色 */
}

.portrait {
  width: 40%;
  height: 91%;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  /* display: flex; */
  margin-left: 3px;
}
.audio-container {
  display: flex;
  flex-direction: column;
}
.audio-item {
  margin-bottom: 10px; /* 每个音频项目之间的间隔 */
}
::v-deep .custom-tabs .el-tabs__nav {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px; /* 间距 */
}

::v-deep .custom-tabs .el-tabs__item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border-radius: 12px;
  transition: background-color 0.3s ease, color 0.3s ease, transform 0.2s ease;
  color: #333;
  min-width: 80px; /* 设置最小宽度确保方块统一 */
}

/* 去掉下划线 */
::v-deep .custom-tabs .el-tabs__nav-wrap::before,
::v-deep .custom-tabs .el-tabs__active-bar {
  display: none;
}

/* 悬浮时样式 */
::v-deep .custom-tabs .el-tabs__item:hover {
  background-color: #e74c3c;
  color: #fff;
  transform: scale(1.05); /* 微缩放效果 */
}

/* 选中时样式 */
::v-deep .custom-tabs .el-tabs__item.is-active {
  background-color: #e74c3c;
  color: #fff;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* 内容样式 */
::v-deep .custom-tabs > .el-tabs__content {
  /* padding: 32px; */
  color: #6b778c;
  font-size: 16px;
  font-weight: 600;
  text-align: left;
}
/*去掉切换时el-tab-pane底部的蓝色下划线*/
::v-deep .el-tabs__active-bar {
  background-color: transparent !important;
}

/*去掉tabs底部的下划线*/
::v-deep .el-tabs__nav-wrap::after {
  position: static !important;
}

::v-deep .el-dialog-create {
  position: absolute;
  top: -50px;
  left: calc(50% - 300px);
  border-radius: 10px;
  .el-dialog__body {
    padding: 0px;
    padding-top: 10px !important;
  }
  .el-dialog__footer {
    padding: 0px;
  }
  .el-dialog__header {
    padding: 0px !important;
    // padding-left: 20px;
    margin-right: 0px;
    align-items: center;
    border-radius: 10px 10px 0px 0px;
    background-color: rgb(237, 241, 244);
    .el-input__wrapper {
      background-color: rgb(237, 241, 244);
    }
    .el-dialog__headerbtn {
      margin-top: -6px;
      margin-right: 10px;
    }
  }
}
::v-deep .el-input__suffix:hover {
  cursor: pointer !important;
}
::v-deep .el-select {
  height: 40px;
  .select-trigger {
    height: 100%;
    .el-input {
      height: 100%;
    }
  }
}
:deep(.create-dialog) {
  .el-dialog__footer {
    padding: 0px;
  }
  .el-dialog__header {
    background-color: rgb(237, 241, 244);
    border-radius: 10px 10px 0px 0px;
    text-align: start;
    height: 50px;
  }
  .el-dialog__body {
    padding: 0px;
  }
  .avatar-and-info {
    display: flex;
    height: 25%;
    position: relative;
    padding-top: 15px;
    .avatar-select {
      width: 15%;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      height: 100%;
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
  .avatar-image-selected {
    width: 45px;
    height: 45px;
    border-radius: 5px;
    object-fit: cover;
  }
  .avatar-picker {
    position: absolute; /* 让关闭按钮能够在容器内定位 */
    display: flex;
    z-index: 999;
    left: 40px;
    top: 35px;
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
        .avatar-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      .avatar-item:hover {
        border-color: #409eff;
      }
    }
  }
  .desc-input {
    height: 100px;
    width: 100%;
  }
  .el-textarea__inner {
    resize: none;
    // font-size: 12px;
    font-size: 15px;
    height: 100%;
  }
  :deep(.el-input .el-input__wrapper .el-input__inner) {
    resize: none;
    // font-size: 12px;
    font-size: 15px;
  }
  :deep(.el-input):focus {
    border: 1px solid #d6d7ef;
  }
  .langs-center {
    display: flex;
    justify-content: center;
    width: 100%;

    .genderAge-select {
      width: 100px;
      height: 30px;
      margin: 0px 10px;
    }
  }
  .upload-file {
    width: 100%;
    height: 36px;
    padding: 5px 10px;
    display: flex;
    align-items: center;
    .el-select {
      height: 30px;
      width: 150px;
      padding-left: 5px;
    }
  }
  .file-name {
    width: 180px;

    height: 30px;
    margin-left: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 32px;
    align-content: center;
    align-items: center;
    padding: 0px 8px;
    border: 1px solid #d6d7ef;
    border-radius: 5px;
  }
  .submit-btn {
    background-color: rgb(89, 87, 87);
    border: 1px solid rgb(89, 87, 87);
    width: 120px;
    height: 32px;
    color: white;
    font-size: 12px;
    margin-right: 15px;
    margin-top: 10px;
  }
  .cancel-btn {
    background-color: #fff;
    resize: none;
    width: 120px;
    height: 32px;
    color: gray;
    font-size: 12px;
    margin-top: 10px;
  }
  .cancel-btn:hover {
    background-color: rgb(237, 241, 244);
    border: 1px solid black;
    color: #333;
  }
  .submit-btn:hover {
    background-color: rgb(237, 241, 244);
    border: 1px solid black;
    color: #333;
  }

  .upload-btn:hover {
    border: 2px solid #dbdcf8;
  }
  .dialog-footer {
    width: 100%;
    border-top: 1px solid #d6d7ef;
    height: 90px;
    display: flex;
    justify-content: end;
  }
}
::v-deep .el-upload {
  height: 30px;
  width: 180px;
  margin-left: 5px;
  border-radius: 5px;
  color: rgb(168, 171, 178);
  text-align: center;
  font-size: 12px;
  border: 0.5px dashed #d6d7ef;
}
:deep(.el-upload-list) {
  display: none;
}
::v-deep .el-input__wrapper {
  min-height: 40px;
  color: #333;
  font-size: 14px;
}
::v-deep .el-input__inner {
  min-height: 40px;
  color: #333;
}
</style>
