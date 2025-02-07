<template>
  <div class="container">
    <div class="left-box">
      <div class="left-box-top">
        <el-input
          v-model="inputDesription"
          @input="translateEn"
          class="input"
          placeholder="请输入音效的描述语言，最多200字"
          type="textarea"
          maxlength="200"
        ></el-input>
        <div>
          <div class="common-use">
            <div v-for="item in commonUse" :key="item" class="common-use-item" @click="commonUseDesc(item)">{{ item.title }}</div>
          </div>
          <div class="generate">
            <div class="box1">
              <div class="Remaining">{{ inputDesription.length }}/200</div>
              <el-button v-if="!isLoading" type="primary" class="generate-button" @click="generateSound">生成音效</el-button>
              <el-button v-else type="primary" class="generate-button" @click="resetGenerate">取消生成</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="translate">
        <div class="title">提示词翻译结果</div>
        <div class="content">&nbsp;&nbsp;{{ translateResult }}</div>
      </div>
      <!-- element-loading-background="rgba(215, 0, 15)" -->
      <ACard class="left-box-center">
        <div
          v-show="isLoading"
          style="
            position: absolute;
            width: 100%;
            height: 100%;
            left: -0px;
            top: -0px;
            z-index: 999;
            background-color: rgb(255, 255, 255, 0.8);
            display: flex;
            justify-content: center;
            /* align-items: center; */
          "
        >
          <el-progress
            :color="currentProgressStatus == 'success' ? '' : '#409eff'"
            :status="currentProgressStatus"
            type="circle"
            :percentage="currentGeneratePercentage"
            style="margin: auto; zoom: 0.7; font-size: 20px"
          />
          <div style="position: absolute; font-size: 14px; top: calc(50% + 60px); width: 190px; padding-left: 5px" class="apostrophe">
            &nbsp;&nbsp;正在生成中，请耐心等待
          </div>
        </div>
        <div class="sound-list">
          <div
            :class="['sound-list-item', index == generateSoundList.length - 1 ? 'sound-list-item-last' : '']"
            v-for="(item, index) in generateSoundList"
            :key="item"
            :style="currentSound?.order === item?.order ? 'background:#edf1f4' : ''"
            @click="changeAudio(item)"
          >
            <div style="display: flex; align-items: center">
              <el-icon size="25" class="table-name-icon" style="margin-left: 27px"> <AIcon icon="icon-yinxiao1" /></el-icon>

              <span class="sound-name">{{ `音效${item?.order}` }}</span>
              <span style="font-size: 10px; color: gray; margin-left: 50px">{{ `时长${item?.duration}s` }}</span>
            </div>
            <a :href="item?.uri">
              <el-icon size="25" class="table-name-icon" style="cursor: pointer; margin-right: 25px"
                ><span style="font-size: 25px; color: rgb(48, 39, 51)" class="iconfont icon-xiazai"></span
              ></el-icon>
            </a>
          </div>
        </div>
      </ACard>
      <ACard class="left-box-bottom">
        <Audio :data="currentSound" ref="audioComponentRef" @endOfPlay="currentPlayHistoryAudio = null"></Audio>
      </ACard>
    </div>
    <div class="right-box">
      <div class="right-box-top">
        <p :class="['setting-and-history', isSetting == true ? 'setting-and-history-active' : '']" @click="changeOption(true)">设置</p>
        <p :class="['setting-and-history', isSetting == false ? 'setting-and-history-active' : '']" @click="changeOption(false)">历史</p>
      </div>
      <div class="setting-body" v-if="isSetting">
        <div style="min-height: 185px; display: flex; flex-direction: column">
          <div class="linear-class" style="margin-top: 10px; margin-bottom: 13px">模型</div>
          <div class="current-model" v-show="!isSelectModel" @click="changeIsSelectModel">
            <div style="width: 100%; text-align: start; height: 30px; display: flex; align-items: center">
              {{ currentSelectModel?.name }}
            </div>
            <div style="height: 30%; white-space: normal; word-wrap: break-word">
              <!-- {{ currentSelectModel?.desc }} -->
            </div>
            <div style="display: flex; gap: 5px; max-width: 100%; height: 37%; align-items: center; white-space: nowrap">
              <div v-for="i in currentSelectModel?.languages" :key="i">{{ i.display }}</div>
            </div>
          </div>
          <Transition name="model">
            <div class="select-model" v-if="isSelectModel">
              <div class="select-model-title">
                <span style="font-size: 16px">请选择模型</span>
                <el-button @click="backToCurrentModel" class="back-btn">返回</el-button>
              </div>
              <div v-for="item in modelLists" :key="item" class="model-list-item" @click="selectModel(item)">
                <div style="width: 100%; height: 30px; text-align: start; display: flex; align-items: center">{{ item?.name }}</div>
                <div style="min-height: 40px; white-space: wrap; word-wrap: break-word">
                  {{ item?.desc }}
                </div>
                <div style="display: flex; max-width: 100%; height: 30px; gap: 5px; align-items: center; white-space: nowrap">
                  支持语言：
                  <div v-for="i in currentSelectModel?.languages" :key="i">{{ i.display }}</div>
                </div>
              </div>
            </div>
          </Transition>
          <div style="flex: 1"></div>
          <div style="height: 1px; border: 1px solid #91c6de"></div>
        </div>

        <div class="apikey-container">
          <div class="slider-top">
            <div class="linear-class">选择API-Key</div>
          </div>
          <el-select style="font-size: 16px; margin-left: 10px; width: 200px" v-model="currentSelectApikey">
            <el-option v-for="item in apikeyList" :key="item" :label="item.keyName" :value="item.apiKey" />
          </el-select>
          <!-- <div style="flex: 1"></div> -->
          <div style="height: 1px; border: 1px solid #91c6de; margin-top: 15px"></div>
        </div>

        <div class="timer-setting">
          <div class="linear-class">其他设置</div>
          <div class="timer-setting-body">
            <div style="display: flex; align-items: center; font-size: 15px; margin: 5px 0px">
              <el-switch v-model="autoSetDuration" size="large" style="zoom: 1" />
              <div style="margin-left: 15px">自动设置最佳时长</div>
            </div>
            <div style="font-size: 15px; padding-bottom: 10px">确定你的音效时长，在1-15秒之间选择（自动设置时长打开后，手动设置时长将不生效）</div>
            <!--警告-->
            <el-input-number v-model="soundDuration" :min="1" :step-strictly="true" :max="15" style="width: 180px; height: 40px" />
          </div>
        </div>
        <!-- <div style="height: 1px; border: 1px solid #91c6de; margin-bottom: 15px"></div> -->

        <!-- <div class="linear-class">生成数量</div> -->
        <div style="font-size: 15px; padding-left: 10px">确定生成的音效条数，在1-4之间选择（一次生成的音效越多，等待的时间会越长）</div>

        <div class="timer-setting-body">
          <el-input-number v-model="soundNums" :min="1" :step-strictly="true" :max="4" style="width: 180px; height: 40px; margin-top: 15px" />
        </div>
        <!-- <p style="width: 100%; border-bottom: 1px solid #dcdfe6; padding-bottom: 3px">&nbsp;&nbsp;创意性</p>
        <el-slider class="slider" v-model="creativity" :show-tooltip="false" :max="100" style="width: 95%; margin: auto" />
        <div style="display: flex; justify-content: space-between; margin-top: 5px; user-select: none">
          <span>&nbsp;&nbsp;跟随提示</span>
          <span>{{ creativity * 2 }}%</span>
          <span>更具创意&nbsp;&nbsp;</span>
        </div> -->

        <div class="btn-box">
          <el-button class="reset-btn" @click="resetSetting">重置</el-button>
        </div>
      </div>
      <div v-else-if="descSetPage" class="desc-set-page">
        <SoundDescSetting
          :data="currentSeletHistorySetting"
          @closeWindow="changeDescSetPage(false)"
          @backFillText="changeGenerateDesc"
          @restoreSettings="restoreGenerateSettings"
        ></SoundDescSetting>
      </div>
      <div class="history" v-else>
        <div class="history-top">
          <el-checkbox
            v-if="isManage"
            v-model="checkAll"
            size="small"
            @change="handleCheckAllChange"
            style="margin-left: 18px; padding-top: 20px"
          ></el-checkbox>
          <div class="manage-btn" @click="changeManageStatus">{{ isManage ? '退出管理' : '管理' }}</div>
        </div>

        <el-collapse v-loading="isFireFoxAndIsLoading" style="width: 100%; flex: 9; overflow: auto" v-model="historyExpandList">
          <el-collapse-item class="history-list" v-for="(item, index) in historyLists" :key="item" :name="index">
            <template #title>
              <div class="history-item-collapse">
                <div style="width: 30px" v-if="isManage">
                  <el-checkbox
                    v-model="checkModelDescStatus[index].status"
                    :label="item"
                    size="small"
                    @change="handleCheckThisAllModelChange(item, index)"
                    style="margin-left: 18px"
                    ><br
                  /></el-checkbox>
                </div>

                <div class="num-records">{{ `${item.descData.reduce((sum, desc) => sum + desc.uris.length, 0)}条记录` }}</div>
                <div class="history-desc">{{ item.desc }}</div>
              </div>
            </template>
            <div v-for="desc in item.descData" :key="desc">
              <div style="border-top: 1px solid #dcdfe6; height: 30px; display: flex; align-items: center; padding-left: 18px">
                {{ formatTimestamp(desc.create_time) }}
                <el-icon size="20" style="cursor: pointer; margin-left: 15px"
                  ><AIcon icon="icon-shiyongwendang" @click="changeDescSetPage(true), setCurrentHistory(item, desc)"></AIcon
                ></el-icon>
              </div>
              <el-checkbox-group v-model="checkModelList">
                <el-table border :data="desc.uris" :show-header="false">
                  <!-- <el-table-column v-if="isManage" type="selection" :selectable="selectDeleteModel" min-width="10%" width="50px"> </el-table-column> -->
                  <el-table-column label="音效" min-width="85%">
                    <template #default="{ row }">
                      <div style="height: 100%; display: flex; align-items: center">
                        <!-- <el-icon v-if="!isManage" size="22" style="cursor: pointer; margin-left: 13px; width: 50px; justify-content: start">
                          <AIcon :icon="currentPlayHistoryAudio === row ? 'icon-zanting' : 'icon-start-full'" @click="playHistoryAudio(row)"></AIcon>
                        </el-icon> -->
                        <span
                          v-if="!isManage"
                          :class="['iconfont  bofang-class', currentPlayHistoryAudio === row ? 'icon-zanting' : 'icon-start-full']"
                          @click="playHistoryAudio(row)"
                        ></span>
                        <div v-else style="width: 40px; padding-left: 12px">
                          <el-checkbox :value="row.uri_id" :label="row.uri_id"><br /></el-checkbox>
                        </div>
                        <div style="width: calc(100% - 60px); text-align: center">
                          {{ `音效${row?.order}` }}
                          <span style="font-size: 10px; color: gray; margin-left: 40px">{{ `时长${row.duration}s` }}</span>
                        </div>
                      </div>
                    </template>
                  </el-table-column>

                  <el-table-column label="" min-width="15%">
                    <template #default="{ row }">
                      <div style="display: flex; justify-content: center; width: 100%">
                        <a :href="row.uri" style="height: auto; display: flex; align-items: center; align-content: center">
                          <span class="iconfont icon-xiazai" style="font-size: 22px; color: rgb(48, 39, 51); cursor: pointer"></span>
                        </a>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </el-checkbox-group>
            </div>
          </el-collapse-item>
        </el-collapse>

        <div class="history-footer">
          <el-button v-show="isManage" class="delete-btn" @click="deleteHistoryList">
            删除
            <div style="width: 100%; height: 100%; font-size: 8px; vertical-align: bottom">(记录数)</div></el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Audio from '@/components/Audio/Audio.vue';
import '@/styles/iconfont/iconfont.css';
import SoundDescSetting from './component/SoundDescSetting.vue';
import { computed, onActivated, onBeforeMount, onMounted, reactive, ref, watch } from 'vue';
import { useSound } from './hook/useSound';
import { useUserStore } from '@/store/modules/user';
import { ElMessage, ElMessageBox } from 'element-plus';
const userStore = useUserStore();
const userId = userStore.sysUser?.userID || '';
const { getGenerateAduio, getSoundHistoryList, deleteHistoryListRes, getModelLanguagesRes, getModelListsRes, downloadAudio } = useSound();
const audioComponentRef = ref(null);
const inputDesription = ref('');
const formData = ref({});
const isSetting = ref(true);
const descSetPage = ref(false);
const currentSeletHistorySetting = ref();
const currentSelectApikey = ref();
import { getapikey } from '@/views/VoiceToText/hook/useVoice';
import { cancelGenerateAudio } from '../TextToSpeech/hook/useTextToSpeech';
import { generateUUID } from '@/utils/utils';
const { apikeyList, getApiKeyList } = getapikey();
const changeDescSetPage = (boo) => {
  descSetPage.value = boo;
};
const translateResult = ref('');
const setCurrentHistory = (item, desc) => {
  currentSeletHistorySetting.value = desc;
  currentSeletHistorySetting.value.desc = item.desc;
};
const historyExpandList = ref([]);
const commonUse = ref([
  {
    title: '清晨的鸟声',
    desc: '清晨树林里，阳光洒下光影。鸟儿苏醒欢叫，麻雀叫声短促频繁，画眉婉转，啄木鸟啄木，鸟叫声交织成森林晨曲。',
  },
  {
    title: '下雨声',
    desc: '静谧夜，世界似蒙纱。雨滴飘落，打在窗玻璃上滴答响，打在树叶上沙沙作声，远处嘈杂，似催眠曲伴人安睡。',
  },
  {
    title: '小溪流水',
    desc: '山间峡谷里，小溪似银丝带蜿蜒。溪水撞击石头有悦耳声，浅滩似孩子嬉闹，遇巨石成细流，沙石滚动，水草摇曳。',
  },
]);
const modelLists = ref([]);
const currentSelectModel = ref();
//是否处于选择模型
const isSelectModel = ref(false);
//是否处于管理
const isManage = ref(false);
const changeManageStatus = () => {
  isManage.value = !isManage.value;
  // console.log(isManage.value);
};
const changeIsSelectModel = () => {
  isSelectModel.value = !isSelectModel.value;
};
const backToCurrentModel = () => {
  isSelectModel.value = false;
};
//选择模型
const selectModel = (model) => {
  currentSelectModel.value = model;
  isSelectModel.value = false;
};
//删除模型历史记录的列表
const checkModelList = ref([]);
const checkModelDescStatus = computed(() => {
  return historyLists.value.map((historyItem) => {
    const descDataWithStatus = historyItem.descData.map((desc) => {
      const allUrisInDesc = desc.uris.flatMap((uri) => uri.uri_id);
      const status = allUrisInDesc.every((uriId) => checkModelList.value.includes(uriId));
      return { desc_data_id: desc.desc_data_id, status };
    });
    const overallStatus = descDataWithStatus.every(({ status }) => status);
    return {
      descDataWithStatus, // 这里包含[{desc_data_id, status}]
      desc: historyItem.desc,
      status: overallStatus, // 每个historyItem的总体状态
    };
  });
});
const checkAll = ref(false);
function getBrowserName() {
  const userAgent = navigator.userAgent;

  if (/chrome|crios|crmo/i.test(userAgent)) {
    return 'Chrome';
  } else if (/firefox|fxios/i.test(userAgent)) {
    return 'Firefox';
  } else if (/safari/i.test(userAgent)) {
    return 'Safari';
  } else if (/msie|trident/i.test(userAgent)) {
    return 'Internet Explorer';
  } else if (/edge/i.test(userAgent)) {
    return 'Edge';
  } else if (/opr|opera/i.test(userAgent)) {
    return 'Opera';
  } else {
    return 'Unknown';
  }
}
const isFireFoxAndIsLoading = computed(() => {
  // 判断当前浏览器是 Firefox 且正在加载
  return getBrowserName() === 'Firefox' && isLoading?.value;
});
const handleCheckAllChange = () => {
  if (checkAll.value) {
    // 全选
    checkModelList.value = historyLists.value.flatMap((item) => item.descData.flatMap((desc) => desc.uris.flatMap((uri) => uri.uri_id)));
  } else {
    // 取消全选
    checkModelList.value = [];
  }
};
// 单个历史项全选状态的变化处理
const handleCheckThisAllModelChange = (item, index) => {
  const existingNums = ref(0);
  const arrLength = ref(0);
  item.descData.forEach((desc) => {
    arrLength.value += desc.uris.length;
  });

  item.descData.forEach((desc) => {
    desc.uris.forEach((uri) => {
      if (checkModelList.value.find((existingUri_id) => existingUri_id === uri.uri_id)) {
        existingNums.value += 1;
        //
      } else {
        checkModelList.value.push(uri.uri_id);
      }
    });
  });
  if (existingNums.value === arrLength.value) {
    item.descData.forEach((desc) => {
      desc.uris.forEach((uri) => {
        checkModelList.value = checkModelList.value.filter((existingUri) => existingUri !== uri.uri_id);
      });
    });
  }
  if (!historyExpandList.value.includes(index)) {
    historyExpandList.value.push(index);
  }
};

const currentSound = ref();
const changeOption = (change) => {
  isSetting.value = change;
};
const autoSetDuration = ref(false); //自动设置时长
const soundDuration = ref(5); //音效时长初始值
const soundNums = ref(2); //音效时长初始值
const creativity = ref(50); //创意性初始值
const changeAudio = (item) => {
  // console.log(item);

  currentSound.value = item;
};

const resetSetting = () => {
  autoSetDuration.value = false;
  soundDuration.value = 5;
  creativity.value = 50;
};
const generateSoundList = ref();
const currentGeneratePercentage = ref(0);
const currentProgressStatus = ref('');
const isLoading = ref(false);

//重置生成
const resetGenerate = () => {
  ElMessageBox.confirm('取消生成将会收取一半费用，是否确认取消？', '提醒', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    isLoading.value = false;
    currentProgressStatus.value = 'exception';
    controller.abort();
    formData.value = {};
    formData.value.task_id = uniqueId;
    cancelGenerateAudio(formData.value);
  });
};
//生成音效
const generateInterval = ref();
let controller;
let timerList = [];
let uniqueId;
const generateSound = async () => {
  if (isLoading.value) {
    ElMessage({
      message: '正在生成中，请稍后',
      type: 'warning',
    });
    return;
  }
  if (inputDesription.value.trim().length < 1) {
    ElMessage({
      message: '请输入描述',
      type: 'warning',
    });
    return;
  }
  if (!currentSelectApikey.value) {
    ElMessage.warning('当前APIKEY为空，请创建APIKEY或选择');
    return;
  }
  formData.value = {};
  formData.value.duration = soundDuration.value;
  formData.value.desc = inputDesription.value.trim().replace(/\n/g, '');
  if (autoSetDuration.value) {
    formData.value.duration = 5;
  }
  formData.value.creativity = creativity.value;
  formData.value.user_id = userId;
  formData.value.count = soundNums.value;
  const model = currentSelectModel.value.model;
  if (autoSetDuration.value == true) {
    formData.value.duration = 5;
  }
  isLoading.value = true;
  currentSound.value = null;
  translateResult.value = '';
  currentGeneratePercentage.value = 0;
  currentProgressStatus.value = '';
  generateInterval.value = setInterval(() => {
    if (isLoading.value && currentGeneratePercentage.value >= 99) {
      return;
    }
    currentGeneratePercentage.value += 1;
  }, formData.value.duration * 100 * 1.4);
  timerList.push(generateInterval.value);

  controller = new AbortController();
  //生成唯一标识
  uniqueId = generateUUID(48);
  formData.value.task_id = uniqueId;
  const res = await getGenerateAduio(formData.value, model, controller.signal);
  const clean = () => {
    isLoading.value = false;
    currentProgressStatus.value = 'exception';
    timerList.forEach((item, index) => {
      clearInterval(item);
    });
    timerList = [];
    generateInterval.value = null;
  };
  if (res == null) {
    clean();
    return;
  }
  generateSoundList.value = res.data;
  translateResult.value = res.translate_en;
  if (generateSoundList.value === null) {
    clean();
    return;
  }
  currentGeneratePercentage.value = 100;
  currentProgressStatus.value = 'success';
  timerList.forEach((item, index) => {
    clearInterval(item);
  });
  timerList = [];
  generateInterval.value = null;
  currentSound.value = generateSoundList.value[0];
  setTimeout(() => {
    isLoading.value = false;
  }, 500);
  selectHistsory();
};
const commonUseDesc = (item) => {
  inputDesription.value = item.desc;
};
const historyLists = ref();
const selectHistsory = async () => {
  formData.value = {};
  formData.value.desc = ''; //默认为空
  formData.value.user_id = userId;
  const list = ref([]);

  list.value = await getSoundHistoryList(formData.value);
  if (historyLists.value != list.value) {
    historyLists.value = list.value;
  }
};
const deleteRes = ref();
//删除历史记录
const deleteHistoryList = async () => {
  formData.value = {};
  formData.value.user_id = userId;
  // formData.value.desc = [];
  formData.value.uri_ids = checkModelList.value;
  // console.log(checkModelDescStatus.value);
  formData.value.desc = checkModelDescStatus.value.filter((item) => item.status).map((item) => item.desc);
  formData.value.desc_data_ids = checkModelDescStatus.value
    .filter((item) => !item.status)
    .map((item) => item.descDataWithStatus.filter((item) => item.status).map((item) => item.desc_data_id))
    .flat();
  // console.log(formData.value);
  if (formData.value.uri_ids.length < 1 && formData.value.desc.length < 1 && formData.value.desc_data_ids) {
    ElMessage.warning('暂无可删除记录');
    return;
  }
  deleteRes.value = await deleteHistoryListRes(formData.value);
  checkModelList.value = [];
  checkModelDescStatus.value = [];

  //刷新历史记录
  selectHistsory();
};
const formatTimestamp = (timestamp) => {
  // 将时间戳转换为毫秒
  const date = new Date(timestamp * 1000);

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');

  return `${yyyy}/${mm}/${dd} ${hh}:${min}`;
};
//回填文本
const changeGenerateDesc = (desc) => {
  inputDesription.value = desc;
};
//还原设置
const restoreGenerateSettings = (data) => {
  soundDuration.value = data.uris[0].duration;
  creativity.value = data.creativity;
  changeDescSetPage(false);
  changeOption(true);
};
//播放历史音频
const currentPlayHistoryAudio = ref();
const playHistoryAudio = (row) => {
  if (currentPlayHistoryAudio.value == row) {
    currentPlayHistoryAudio.value = null;
    audioComponentRef.value.changeAudioStatus();
  } else {
    currentPlayHistoryAudio.value = row;
    currentSound.value = row;
    setTimeout(() => {
      audioComponentRef.value.changeAudioStatus();
    }, 120);
  }
};
const getModeList = async () => {
  modelLists.value = await getModelListsRes();
  await Promise.all(
    modelLists.value.map(async (item) => {
      const languagesList = await getModelLanguagesRes(item.model_id);
      item.languages = languagesList; // 将语言列表添加到每个 item 中
    }),
  );

  currentSelectModel.value = modelLists.value[0];
};

watch(
  () => currentSelectApikey.value,
  (newValue) => {
    if (currentSelectApikey.value) {
      userStore.setApiKey(currentSelectApikey.value);
    }
  },
);
onActivated(async () => {
  await getApiKeyList();
  apikeyList.value = apikeyList.value.filter((item) => {
    return item.abilities.includes('tta');
  });
  if (!currentSelectApikey.value) {
    currentSelectApikey.value = apikeyList.value[0]?.apiKey;
  } else {
    if (
      !apikeyList.value.some((item) => {
        return item.apiKey === currentSelectApikey.value;
      })
    ) {
      currentSelectApikey.value = apikeyList.value[0]?.apiKey;
    }
  }
});

onMounted(() => {
  selectHistsory();
  getModeList();
});
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  height: 100% !important;
  max-width: 100% !important;
  // background: rgb(237, 241, 244);
  padding: 10px;
  padding-top: 0px;
  // border-radius: 10px;
}
.left-box {
  width: 60%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  .translate {
    flex: 1;
    background-color: #fff;
    border-radius: 10px;
    // border: 1px solid #dcdfe6;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.15);
    padding: 10px;
    display: flex;
    flex-direction: column;
    .title {
      font-size: 16px;
      width: fit-content;
      padding: 0px 23px;
      border-bottom: 1px solid #409eff;
    }
    .content {
      padding: 5px 0px;
      // display: -webkit-box;
      // -webkit-box-orient: vertical;
      // -webkit-line-clamp: 4;
      // line-height: 20px;
      // overflow: hidden;
      font-size: 14px;
    }
  }
  .left-box-top {
    height: 22.2vh;
    width: 100%;
    // height: 245px;
    min-height: 230px;
    max-height: 230px;
    background-color: #fff;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    // border: 1px solid #dcdfe6;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.15);
    .input {
      // height: 70%;
      flex: 1;
      width: 100%;
      padding-top: 5px;
      padding-left: 5px;
      :deep(.el-textarea__inner) {
        box-shadow: 0 0 0 0px var(--el-input-border-color, var(--el-border-color)) inset;
        resize: none;
        // cursor: default;
        height: 98% !important;
      }
    }
    .common-use {
      width: 95%;
      // height: 40%;
      min-height: 32px;
      margin: auto;
      border-bottom: 1px solid #dcdfe6;
      display: flex;
      .common-use-item {
        width: 90px;
        height: 100%;
        min-height: 32px;
        border-radius: 5px;
        align-content: center;
        text-align: center;
        font-size: 14px;
        user-select: none;
      }
      .common-use-item:hover {
        background-color: #e7f0f7;
      }
    }
    .generate {
      // height: 60%;
      height: 40px;
      :deep(.el-button--primary) {
        color: #333;
        background-color: #fff;
        border: 1px solid #dcdfe6;
      }
      .box1 {
        height: 100%;
        display: flex;
        float: right;
        align-items: center;
        margin-right: 30px;
        .Remaining {
          text-align: center;
          align-content: center;
          font-size: 12px;
          margin-right: 50px;
        }
      }
      .generate-button {
        width: 130px;
        height: 90%;
        max-height: 30px;
        padding: 0;
        display: flex;
        align-items: center;
        font-weight: bold;
      }
      .generate-button:hover {
        background-color: #edf1f4;
      }
    }
  }
  .left-box-center {
    // height: 36.5%;
    font-size: 14px;
    height: 240px;
    padding: 10px 0px;
    position: relative;
    border: none;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.15);
    .sound-list {
      width: 100%;
      .sound-list-item-last {
        border-bottom: 1px solid #dcdfe6;
      }
      .sound-list-item {
        width: 100%;
        height: 45px;
        border-top: 1px solid #dcdfe6;
        display: flex;
        justify-content: space-between;
        text-align: center;
        align-items: center;
        .sound-name {
          margin-left: 30px;
          text-align: center;
        }
      }
      .sound-list-item:hover {
        background-color: rgb(237, 241, 244);
      }
    }
  }
  .left-box-bottom {
    width: 100%;
    height: 170px;
    display: flex;
    margin: auto;
    border: none;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.15);
  }
}
.right-box {
  margin-left: 8px;
  overflow: hidden;

  width: 40%;
  height: 100%;
  background-color: #fff;
  border-radius: 10px;
  // border: 1px solid #dcdfe6;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.15);
  .setting-body {
    width: 100%;
    height: calc(100% - 45px);
    overflow: auto;
    position: relative;

    .slider {
      :deep(.el-slider__bar) {
        background-color: rgb(237, 241, 244);
      }
      :deep(.el-slider__button) {
        background-color: rgb(89, 87, 87);
        border: 2px solid rgb(89, 87, 87);
      }
    }
    .current-model {
      margin: 0px 10px;
      // margin-top: 30px;
      display: flex;
      padding: 0px 10px;
      flex-direction: column;
      width: calc(100% - 20px);
      height: 110px;
      border: 1px solid #dcdfe6;
      border-radius: 5px;
      cursor: pointer;
      overflow-x: auto;
    }
    .model-list-item {
      display: flex;
      position: relative;
      flex-direction: column;
      padding: 0px 10px;
      width: 100%;
      min-height: 110px;

      border: 1px solid #dcdfe6;
      border-radius: 5px;
      cursor: pointer;
      white-space: nowrap;
    }
    .model-list-item:hover {
      background-color: rgb(237, 241, 244);
    }
    .select-model {
      font-size: 16px;
      width: 100%;
      // margin-top: 10px;
      background: #fff;
      z-index: 99;
      height: 100%;
      border: 1px solid black;
      overflow: auto;
      // margin-top: 20px;
      position: absolute;
      padding: 10px;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      gap: 5px;
      .select-model-title {
        width: 100%;
        height: 32px;
        display: flex;

        align-items: center;
        justify-content: space-between;
        .back-btn {
          color: #333;
          width: 100px;
          height: 32px;
        }
      }
    }
  }
  .right-box-top {
    display: flex;
    padding-top: 5px;
    // margin-bottom: 20px;
    .setting-and-history {
      margin: 5px;
      text-align: center;
      border-bottom: 1px solid #dcdfe6;
      width: 60px;
      height: 30px;
      cursor: pointer;
      color: #333;
    }
    .setting-and-history-active {
      border-bottom: 1px solid rgb(89, 87, 87);
    }
  }
  .btn-box {
    // padding-top: 200px;
    width: 100%;
    flex: 1;
    display: flex;
    justify-content: center;
  }
  .reset-btn {
    width: 160px;
    height: 32px;
    background-color: black;
    color: white;
    margin-top: 50px;
    border: 1px solid black;
  }

  .back-btn:hover,
  .manage-btn:hover {
    background-color: rgb(237, 241, 244);
    color: #333;
    border: 1px solid #e6eaee;
  }
  .reset-btn:hover {
    background-color: rgb(237, 241, 244);
    color: #333;
    border: 1px solid #333;
  }
  .history {
    width: 100%;
    height: calc(100% - 45px);
    display: flex;
    flex-direction: column;
  }
  .history-top {
    width: 100%;
    flex: 0.5;
    .manage-btn {
      font-size: 14px;
      width: 100px;
      height: 30px;
      display: flex;
      align-items: center;
      border-radius: 5px;
      justify-content: center;
      user-select: none;
      float: right;
      margin-right: 20px;
      border: none;
      cursor: pointer;
    }
    // border-bottom: 1px solid #dcdfe6;
  }
  .history-list {
    display: flex;
    flex-direction: column;
    // align-items: center;
    :deep(.el-collapse-item__header) {
      height: 35px;
    }
    .no-border {
      border-right: none !important; /* 使用 !important 确保样式优先级 */
    }
    .history-item-collapse {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .num-records {
      width: 66px;
      height: 25px;
      text-align: center;
      border: 1px solid #dcdfe6;
      line-height: 25px;
      margin-left: 18px;
      border-radius: 5px;
    }
    .history-desc {
      width: calc(100% - 70px);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      height: 30px;
      line-height: 30px;
      margin-left: 15px;
      overflow: hidden;
    }
  }
  .history-footer {
    width: 100%;
    // height: 40px;
    flex: 0.5;
  }
  .delete-btn {
    background-color: black;
    color: white;
    border: 1px solid black;
    // position: fixed;
    float: right;
    margin-top: 5px;
    margin-right: 10px;
    width: 100px;
    height: 30px;
  }
  .delete-btn:hover {
    background-color: rgb(237, 241, 244);
    color: #333;
    border: 1px solid black;
  }
}

.history-item-collapse {
  width: calc(100% - 21px);
  .el-collapse-item__header {
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    color: #303133;
    padding-left: 20px;
    background-color: #f5f7fa;
    border-bottom: 1px solid #dcdfe6;
  }
}
.apikey-container {
  // height: 60px;
  width: 100%;
  // height: 140px;
  padding-bottom: 15px;
  display: flex;
  flex-direction: column;
  font-size: 16px;
  .slider-top {
    width: 100%;
    // border-bottom: 1px solid #d6d7df;
    margin-bottom: 15px;
    margin-top: 10px;
  }
}
.timer-setting {
  // margin-left: 20px;
  // height: 21%;
  padding-bottom: 15px;
  min-height: 160px;
}
.timer-setting-body {
  padding: 0px 10px;
}
.desc-set-page {
  width: 100%;
  height: 83.5%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
::v-deep .el-table tr {
  background-color: rgb(237, 241, 244);
  // border: 0.1px solid #d6d7df !important;
}
::v-deep .el-table tbody tr > td {
  border: 0.1px solid #e0e2e6 !important;
}
::v-deep .el-table tbody tr:hover > td {
  background: white !important;
}
::v-deep .el-collapse-item__content {
  padding-bottom: 0px;
}
::v-deep .el-table__cell {
  padding: 5px !important;
}
::v-deep .el-table__cell .cell {
  padding: 0px !important;
}
::v-deep .el-checkbox {
  width: 15px !important;
  height: 15px !important;
  margin-right: 5px;
}
::v-deep .el-checkbox {
  .el-checkbox__label {
    color: #333 !important;
    border-radius: 100px;
  }
  .el-checkbox__input {
    margin-bottom: px(5);
    border-radius: 100px;
    &.is-checked {
      .el-checkbox__inner {
        background-color: rgb(215, 0, 15);
        border-color: rgb(215, 0, 15);
      }
    }
    .el-checkbox__inner {
      &:hover {
        border-color: rgb(215, 0, 15);
      }
    }
  }
}
::v-deep .el-progress__text span {
  font-size: 20px !important;
}
.apostrophe:after {
  overflow: hidden;
  display: inline-block;
  vertical-align: bottom;
  -webkit-animation: ellipsis steps(4, end) 1900ms infinite;
  animation: ellipsis steps(4, end) 1900ms infinite;
  content: '\2026';
  width: 0px;
}
@keyframes ellipsis {
  to {
    width: 1.25em;
  }
}

@-webkit-keyframes ellipsis {
  to {
    width: 1.25em;
  }
}
// :deep(.el-select .select-trigger .el-input .el-input__wrapper) {
//   --el-border-color-hover: #d7000f;
//   --el-input-hover-border-color: #d7000f;
//   --el-select-input-focucs-border-color: #d7000f;
//   font-size: 16px;
//   height: 40px;
// }
.linear-class {
  background: linear-gradient(to right, #fff 0%, rgb(145, 198, 222, 0.3) 50%, #fff);
  font-size: 16px;
  width: 140px;
  padding: 5px 0px;
  padding-left: 20px;
  font-weight: 600;
}
.bofang-class {
  font-size: 22px;
  height: 25px;
  align-content: center;
  background: linear-gradient(to top right, #1190fb, #99dee4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  width: 40px;
  padding-left: 14px;
}
.apikey-select {
  :deep(.el-input__wrapper) {
    height: 32px !important;
  }
  :deep(.el-input__inner) {
    font-size: 14px;
  }
}
.model-enter-active,
.model-leave-active {
  transition: all 0.2s;
  opacity: 1;
}

.model-enter-from,
.model-leave-to {
  opacity: 0;
  transform: translateY(-150px);
}
</style>
