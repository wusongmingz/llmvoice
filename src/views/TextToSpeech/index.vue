<template>
  <div class="container">
    <div class="left-box">
      <div class="left-box-top">
        <span class="text-centered-bold" style="width: 170px; height: 100%; align-content: center"
          ><img src="@/assets/image/home/jump.gif" alt="" style="width: 300px; position: absolute; top: -105px; left: -80px" />
        </span>
        <!-- <button @click="requestData">request——test</button> -->
        <div
          style="
            display: flex;
            align-items: center;
            flex: 2;
            height: 100%;
            justify-content: center;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.15);
            border-radius: 10px;
            background-color: white;
          "
        >
          <CharacterSelector @changeCharacterData="reacquireCharaterData" :characters="characters" ref="charaterRef"></CharacterSelector>
        </div>
        <div style="flex: 6; box-shadow: 0 0 5px rgba(0, 0, 0, 0.15); border-radius: 10px; background-color: white; padding: 5px 8px">
          <LanguageSelector :langs="currentSelectModel?.languages" ref="languageRef"></LanguageSelector>
        </div>
      </div>
      <ACard class="left-box-center" :hidePadding="true">
        <div style="height: 90%; width: 100%; position: relative">
          <div
            v-show="isGenerateOrPlay"
            style="
              position: absolute;
              width: 100%;
              height: 100%;
              z-index: 999;
              background-color: rgb(255, 255, 255, 0.8);
              display: flex;
              flex-direction: column;
              align-items: center;
            "
          >
            <el-progress
              :color="currentProgressStatus == 'success' ? '' : '#409eff'"
              :status="currentProgressStatus"
              type="circle"
              :percentage="Number(currentGeneratePercentage)"
              style="margin: auto; zoom: 0.7"
            >
            </el-progress>
            <div style="position: absolute; font-size: 14px; top: calc(50% + 60px); width: 190px; padding-left: 5px" class="apostrophe">
              &nbsp;&nbsp;正在生成中，请耐心等待
            </div>
          </div>
          <el-input
            v-model="inputDesription"
            class="input"
            :placeholder="`请粘贴或输入文本内容，最多${maxinputlength}字`"
            type="textarea"
            :maxlength="maxinputlength"
          ></el-input>
        </div>

        <div class="generate">
          <div class="box1">
            <div class="Remaining">{{ inputDesription?.length }}/{{ maxinputlength }}</div>

            <el-button v-if="!isGenerating" type="primary" class="generate-button" @click="generateAudioFile">生成音频文件</el-button>
            <el-button v-if="isGenerating" type="primary" class="generate-button" @click="resetGenerate">取消生成</el-button>
          </div>
        </div>
      </ACard>

      <ACard class="left-box-bottom">
        <Audio :data="currentSound"></Audio>
      </ACard>
    </div>
    <ACard class="right-box" :hidePadding="true">
      <div class="right-box-top">
        <p :class="['setting-and-history', isSetting == true ? 'setting-and-history-active' : '']" @click="changeOption(true)">设置</p>
        <p :class="['setting-and-history', isSetting == false ? 'setting-and-history-active' : '']" @click="changeOption(false)">历史</p>
      </div>
      <div class="setting-body" v-if="isSetting">
        <!-- 模型部分 -->
        <div style="min-height: 185px; display: flex; flex-direction: column">
          <div style="width: 100%">
            <div class="linear-class" style="margin-top: 10px; margin-bottom: 13px">模型</div>
          </div>
          <!-- 模型名称输入框 -->
          <div class="current-model" v-show="!isSelectModel" @click="changeIsSelectModel">
            <div style="width: 100%; text-align: start; height: 30px; display: flex; align-items: center">
              {{ currentSelectModel?.name }}
            </div>
            <div style="height: 30%; white-space: normal; word-wrap: break-word">
              <!-- {{ currentSelectModel?.desc }} -->
            </div>
            <div style="display: flex; max-width: 100%; gap: 5px; justify-content: start; height: 37%; align-items: center; white-space: nowrap">
              <div style="text-align: center" v-for="i in currentSelectModel?.languages" :key="i">{{ i.display }}</div>
            </div>
          </div>
          <Transition name="model">
            <div class="select-model" v-show="isSelectModel">
              <div class="select-model-title">
                <span style="font-size: 16px">请选择模型</span>
                <el-button @click="backToCurrentModel" class="back-btn">返回</el-button>
              </div>

              <div v-for="item in modelLists" :key="item" class="model-list-item" @click="selectModel(item)">
                <div style="height: 30px; display: flex; align-items: center">{{ item?.name }}</div>
                <div style="min-height: 40px; white-space: wrap; word-break: break-all">
                  {{ item?.desc }}
                </div>
                <div style="display: flex; height: 30px; gap: 5px; align-items: center">
                  支持语言：

                  <div style="text-align: center" v-for="i in item?.languages" :key="i">{{ i.display }}</div>
                </div>
              </div>
            </div>
          </Transition>
          <div style="flex: 1"></div>
          <div style="height: 1px; border: 1px solid #91c6de"></div>
        </div>
        <div class="apikey-container">
          <div class="slider-top">
            <div class="linear-class" style="width: 140px; margin-bottom: 10px">选择API-Key</div>
          </div>
          <el-select style="font-size: 16px; margin-left: 10px; width: 200px" v-model="currentSelectApikey">
            <el-option v-for="item in apikeyList" :key="item" :label="item.keyName" :value="item.apiKey" />
          </el-select>
        </div>
        <div style="height: 1px; border: 1px solid #91c6de; margin-top: 15px"></div>

        <!-- 音调部分 -->
        <div class="slider-container" style="margin-bottom: 15px">
          <div class="slider-top linear-class" style="width: 140px; margin-bottom: 10px">
            <span style="font-weight: 600">音调</span>
            <span style="padding-left: 5px; font-size: 10px; color: #7f7f7f">值越大音调越高</span>
          </div>
          <el-slider
            :step="0.01"
            class="slider"
            :show-tooltip="false"
            :max="5"
            :min="-5"
            style="margin: 0 auto; width: 95%; padding-top: 22px"
            v-model="tone"
          ></el-slider>
          <div style="text-align: center; width: 100%; padding-top: 10px; padding-bottom: 10px">{{ formatPercent5(tone) }}</div>
        </div>

        <!-- 语速部分 -->
        <div style="height: 1px; border: 1px solid #91c6de"></div>

        <div class="slider-container" style="margin-bottom: 15px">
          <div class="slider-top linear-class" style="width: 150px; margin-bottom: 10px">
            <span style="font-weight: 600">语速</span>
            <span style="padding-left: 5px; font-size: 10px; color: #7f7f7f">语速值越大语速越快</span>
          </div>
          <el-slider
            class="slider"
            :show-tooltip="false"
            :max="2"
            :min="0"
            :step="0.01"
            style="margin: 0 auto; width: 95%; padding-top: 22px"
            v-model="speed"
          ></el-slider>
          <div style="text-align: center; width: 100%; padding-top: 10px">{{ formatPercent2(speed) }}</div>
        </div>

        <!-- 恢复默认设置按钮 -->
        <div class="setting-btn">
          <el-button class="reset-btn" @click="resetSetting">恢复默认设置</el-button>
          <el-button class="save-btn" @click="saveSettingBtn">保存</el-button>
        </div>

        <div style="flex: 2.38"></div>
      </div>

      <div v-else-if="showSoundDescSetting" class="desc-set-page">
        <HumanAduioDescSetting
          :data="currentSelectHistorySetting"
          @closeWindow="showSoundDescSetting = false"
          @backFillText="changeGenerateText"
          @restoreSettings="restoreGenerateSetting"
        ></HumanAduioDescSetting>
      </div>
      <div class="history" v-else>
        <div class="history-top">
          <el-checkbox
            v-if="isManage"
            v-model="checkAll"
            size="small"
            @change="handleCheckAllChange"
            style="margin-left: 8px; padding-top: 15px"
          ></el-checkbox>

          <div class="manage-btn" @click="changeManageStatus">{{ isManage ? '退出管理' : '管理' }}</div>
        </div>

        <el-collapse v-loading="isFireFoxAndIsLoading" style="width: 100%; flex: 9; overflow-y: auto" v-model="historyExpandList">
          <el-collapse-item class="history-list" v-for="(item, index) in historyLists" :key="item" :name="index">
            <template #title>
              <div class="history-item-collapse">
                <div style="width: 20px">
                  <el-checkbox
                    v-if="isManage"
                    class="stop-event"
                    v-model="checkModelDescStatus[index].status"
                    @change="handleCheckThisAllModelChange(item, index)"
                    size="small"
                    style="margin-left: 8px"
                  ></el-checkbox>
                </div>
                <div class="num-records">{{ `${item.nums}条记录` }}</div>
                <div class="history-desc">{{ item.desc }}</div>
              </div>
            </template>
            <el-checkbox-group v-model="checkHistoryList">
              <el-table border :data="item.descData" style="width: 100%; font-size: 12px" :show-header="false">
                <el-table-column prop="create_time" label="label" min-width=" 30%">
                  <template #default="{ row }">
                    <div :style="['width: 100%; height: 100%; display: flex']">
                      <div style="width: 25px; display: flex; align-items: center; padding-left: 3px">
                        <el-checkbox v-if="isManage" size="small" :label="row.desc_data_id" :value="row.desc_data_id"><br /></el-checkbox>
                      </div>
                      <div style="text-align: left; flex: 1">
                        {{ formatTimestamp(row.create_time) }}
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="" label="label" min-width="55%"
                  ><div style="width: 100; height: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap">{{ item.desc }}</div>
                </el-table-column>
                <el-table-column prop="" label="label" min-width="15%">
                  <template #default="{ row }">
                    <div style="height: 100%; width: 100%; display: flex; justify-content: space-around; align-items: center">
                      <el-icon
                        size="20"
                        class="table-name-icon"
                        style="cursor: pointer"
                        @click="(showSoundDescSetting = true), changeCurrentSelectHistory(row, item.desc)"
                        ><span style="font-size: 20px" class="iconfont icon-shiyongwendang-copy"></span>
                      </el-icon>
                      <a :href="row.uri" style="display: flex; align-items: center; align-content: center">
                        <el-icon size="20" class="table-name-icon" style="cursor: pointer; color: rgb(96, 98, 102)"
                          ><span style="font-size: 20px" class="iconfont icon-xiazai"></span
                        ></el-icon>
                      </a>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </el-checkbox-group>
          </el-collapse-item>
        </el-collapse>

        <div class="history-footer">
          <el-button v-show="isManage" class="delete-btn" @click="deleteHistoryList">
            删除
            <div style="width: 100%; height: 100%; font-size: 8px; vertical-align: bottom">({{ checkHistoryList?.length }})</div></el-button
          >
        </div>
      </div>
    </ACard>
    <audio style="display: none" ref="audioRef" controls></audio>
  </div>
</template>

<script setup>
import Audio from '@/components/Audio/Audio.vue';
import HumanAduioDescSetting from './HumanAduioDescSetting.vue';
import '@/styles/iconfont/iconfont.css';
import { computed, nextTick, onActivated, onBeforeMount, onMounted, reactive, ref, watch } from 'vue';
import LanguageSelector from './LanguageSelector.vue';
import { getapikey } from '@/views/VoiceToText/hook/useVoice';

import { useLocalStorage } from '@/utils/storage';
const storage = useLocalStorage();
import { useList } from '@/views/ModelUsageList/hook/useList';
const { getAudioInfoRes } = useList();
import CharacterSelector from './CharacterSelector.vue';
import {
  getModelListsRes,
  getModelLanguagesRes,
  getAudio,
  getModelRoleList,
  getHistoryDataRes,
  getdeleteHistoryRes,
  cancelGenerateAudio,
  isGenerating,
} from './hook/useTextToSpeech';
const showSoundDescSetting = ref(false); // 用于控制 SoundDescSetting 的显示
const inputDesription = ref('');
const formData = ref({});
const isSetting = ref(true);
import { useUserStore } from '@/store/modules/user';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRoute } from 'vue-router';
const userStore = useUserStore();
import { franc, francAll } from 'franc';
import { getRoleList } from '@/api/textToSpeech/textToSpeechApi';
import { generateUUID } from '@/utils/utils';
const userId = userStore.sysUser?.userID || '';
const route = useRoute();
const currentSound = ref();
const currentGeneratePercentage = ref(0);
const historyExpandList = ref([]);
const changeOption = (change) => {
  isSetting.value = change;
};

const currentSelectApikey = ref(null);
const { apikeyList, getApiKeyList } = getapikey();
const formatPercent5 = (item) => {
  return Math.round(100 + item * 20) + '%';
};
const formatPercent2 = (item) => {
  return Math.round(item * 100) + '%';
};
const formatTimestamp = (timestamp) => {
  // 将时间戳转换为毫秒

  const date = new Date(Number(timestamp) * 1000);

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');

  return `${yyyy}/${mm}/${dd} ${hh}:${min}`;
};
const checkHistoryList = ref([]);
const checkModelDescStatus = computed(() => {
  const Resstatus = historyLists.value.map((historyItem) => {
    const allDescId = historyItem.descData.flatMap((desc) => desc.desc_data_id);
    const status = allDescId.every((descId) => checkHistoryList.value.includes(descId));
    return { desc: historyItem.desc, status };
  });
  return Resstatus;
});
const handleCheckThisAllModelChange = (item, index) => {
  const existingNums = ref(0);
  const arrLength = item.nums;
  item.descData.forEach((desc) => {
    if (checkHistoryList.value.find((desc_data_id) => desc_data_id === desc.desc_data_id)) {
      existingNums.value += 1;
      //
    } else {
      checkHistoryList.value.push(desc.desc_data_id);
    }
  });
  if (existingNums.value === arrLength) {
    item.descData.forEach((desc) => {
      checkHistoryList.value = checkHistoryList.value.filter((desc_data_id) => desc_data_id !== desc.desc_data_id);
    });
  }
  if (!historyExpandList.value.includes(index)) {
    historyExpandList.value.push(index);
  }
};
const checkAll = ref(false);
const handleCheckAllChange = () => {
  if (checkAll.value) {
    // 全选
    checkHistoryList.value = historyLists.value.flatMap((item) => item.descData.flatMap((desc) => desc.desc_data_id));
  } else {
    // 取消全选
    checkHistoryList.value = [];
  }
};
const charaterRef = ref(null);
const languageRef = ref(null);
const maxinputlength = computed(() => {
  return languageRef.value?.selectedLanguage?.word_limit || 0;
});
const audioRef = ref(null);
const isManage = ref(false);
const changeManageStatus = () => {
  isManage.value = !isManage.value;
};
const isGenerateOrPlay = ref(false);

const canDetectionList = {
  zh: 'cmn',
  yue: 'cmn',
  en: 'eng',
  ja: 'jpn',
  ko: 'kor',
};
const jiangeTime = ref(0);
const getGenerateTime = (len) => {
  //
  if (len <= 30) {
    jiangeTime.value = 30;
    return;
  }
  jiangeTime.value = len * 1.2;
  return;
};
const newGenerateInterval = ref();
const generateInterval = ref();
const currentProgressStatus = ref('');
let controller;
let timerList = [];
let uniqueId;

const generateAudioFile = async () => {
  if (newGenerateInterval.value) {
    clearInterval(newGenerateInterval.value);
    newGenerateInterval.value = null;
  }
  if (inputDesription.value.trim().length < 1) {
    ElMessage.warning('请输入文本');
    return;
  }
  if (!charaterRef.value.currentCharacter) {
    ElMessage.warning('请选择角色');
    return;
  }
  if (!currentSelectApikey.value) {
    ElMessage.warning('当前APIKEY为空，请选择或创建APIKEY');
    return;
  }
  if (isGenerating.value) {
    ElMessage.warning('正在生成中，请稍后');
    return;
  }
  formData.value = {};
  formData.value.ai_audio_id = charaterRef.value.currentCharacter.id
    ? charaterRef.value.currentCharacter.id
    : charaterRef.value.currentCharacter.ai_audio_id;
  const roleName = charaterRef.value.currentCharacter.id ? charaterRef.value.currentCharacter.name : charaterRef.value.currentCharacter.ai_audio_name;

  formData.value.lang = languageRef.value.selectedLanguage.lang;
  formData.value.model_id = currentSelectModel.value.model_id;
  formData.value.user_id = userId;
  formData.value.desc = inputDesription.value;
  formData.value.tone = tone.value;
  formData.value.speed = speed.value;
  formData.value.style = charaterRef.value.currentCharacter.style;
  isGenerateOrPlay.value = true;
  const data = ref();
  isGenerating.value = true;
  currentSound.value = null;
  formData.value.apikey = currentSelectApikey.value;
  currentGeneratePercentage.value = 0;
  currentProgressStatus.value = '';
  getGenerateTime(inputDesription.value.length);

  let index = 1;

  generateInterval.value = setInterval(() => {
    if (isGenerating.value && currentGeneratePercentage.value >= 99) {
      if (index == 1) {
        newGenerateInterval.value = setInterval(() => {
          if (currentGeneratePercentage.value >= 99.9) {
            return;
          }
          currentGeneratePercentage.value = Number((currentGeneratePercentage.value + 0.1).toFixed(1));
        }, jiangeTime.value * 10);
        timerList.push(newGenerateInterval.value);
        index++;
      }
      return;
    }
    currentGeneratePercentage.value++;
  }, jiangeTime.value);
  timerList.push(generateInterval.value);

  controller = new AbortController();
  //设置唯一标识
  uniqueId = generateUUID(50);
  formData.value.task_id = uniqueId;

  data.value = await getAudio(formData.value, currentSelectModel.value.model, controller.signal);

  if (data?.value == 0 || !data.value) {
    currentProgressStatus.value = 'exception';
    timerList.forEach((item) => {
      clearInterval(item);
    });
    timerList = [];
    generateInterval.value = null;
    newGenerateInterval.value = null;
    isGenerating.value = false;
    isGenerateOrPlay.value = false;
    return;
  }
  currentGeneratePercentage.value = 100;
  currentProgressStatus.value = 'success';
  timerList.forEach((item) => {
    clearInterval(item);
  });
  timerList = [];
  generateInterval.value = null;
  newGenerateInterval.value = null;
  setTimeout(() => {
    isGenerateOrPlay.value = false;
  }, 500);
  data.value.name = `${roleName}   ${formatTimestamp(data.value.create_time)}`;
  currentSound.value = data.value;
  isGenerating.value = false;

  charaterRef.value.getRoleList();
  formData.value = {};
  formData.value.user_id = userId;
  formData.value.desc = '';
  historyLists.value = await getHistoryDataRes(formData.value);
};
const resetGenerate = () => {
  ElMessageBox.confirm('取消生成将会收取一半费用，是否确认取消？', '提醒', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    clearInterval(newGenerateInterval);
    isGenerating.value = false;
    isGenerateOrPlay.value = false;
    currentProgressStatus.value = 'exception';
    formData.value = {};
    formData.value.task_id = uniqueId;
    controller.abort();
    cancelGenerateAudio(formData.value);
  });
};
const restoreGenerateSetting = async (data) => {
  tone.value = data.tone;
  speed.value = data.speed;
  currentSelectModel.value = modelLists.value.find((item) => item.model_id === data.model_id);
  showSoundDescSetting.value = false;
  isSetting.value = true;
};

const modelLists = ref([]);
const currentSelectModel = ref();
//是否处于选择模型
const isSelectModel = ref(false);

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
//当前选择的历史记录
const currentSelectHistorySetting = ref();
//该表选择的历史纪录
const changeCurrentSelectHistory = (v, desc) => {
  v.desc = desc;
  currentSelectHistorySetting.value = v;
};
//回填文本
const changeGenerateText = (desc) => {
  inputDesription.value = desc;
};
const deleteHistoryList = async () => {
  formData.value = {};
  formData.value.user_id = userId;
  formData.value.desc_data_id = checkHistoryList.value;
  formData.value.desc = checkModelDescStatus.value.filter((item) => item.status).map((item) => item.desc);
  if (formData.value.desc_data_id.length < 1 && formData.value.desc.length < 1) {
    ElMessage.warning('暂无可删除记录');
    return;
  }
  await getdeleteHistoryRes(formData.value);
  //删除之后置空
  checkHistoryList.value = [];
  checkModelDescStatus.value = [];
  formData.value = {};
  formData.value.user_id = userId;
  formData.value.desc = '';
  historyLists.value = await getHistoryDataRes(formData.value);
};

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
  return getBrowserName() === 'Firefox' && isGenerateOrPlay?.value;
});
//初始化滑块数值
const tone = ref(0);
const speed = ref(1);
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
const resetSetting = () => {
  tone.value = 0;
  speed.value = 1;
  currentSelectModel.value = modelLists.value[0];
};
//重新根据条件获取character数据
const reacquireCharaterData = async ({ formData, callback }) => {
  // console.log(characters.value);
  characters.value = await getModelRoleList(formData);
  // console.log(characters.value);
  callback(characters.value);
};
const characters = ref(null);
const historyLists = ref();
const initData = async () => {
  formData.value = {};
  formData.value.user_id = userId;
  formData.value.desc = '';
  historyLists.value = await getHistoryDataRes(formData.value);
  // formData.value = {};
  // formData.value.user_id = userId;
  // formData.value.lang = '';
  // formData.value.sex = 0;
  // formData.value.age = '';
  // formData.value.name = '';
  // formData.value.style = '';
  // characters.value = await getModelRoleList(formData.value);
};
const saveSettingBtn = () => {
  if (sessionStorage.getItem('textToSpeechSetting')) {
    sessionStorage.removeItem('textToSpeechSetting');
  }
  const data = {
    tone: tone.value,
    speed: speed.value,
  };
  sessionStorage.setItem('textToSpeechSetting', JSON.stringify(data));
  ElMessage.success('保存成功');
};
onActivated(async () => {
  await getApiKeyList();
  apikeyList.value = apikeyList.value.filter((item) => {
    return item.abilities.includes('tts');
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
  getModeList();
  initData();
  const sessionData = JSON.parse(sessionStorage.getItem('textToSpeechSetting'));
  if (sessionData) {
    tone.value = sessionData.tone;
    speed.value = sessionData.speed;
    currentSelectModel.value = sessionData.model;
    inputDesription.value = sessionData.inputDesription;
    languageRef.value.selectedLanguage = sessionData.lang;
  }
});
// import { useUserStore } from '@/store/modules/user';
// const userStore = useUserStore();
watch(
  () => currentSelectApikey.value,
  (newValue) => {
    if (currentSelectApikey.value) {
      userStore.setApiKey(currentSelectApikey.value);
    }
  },
);
</script>

<style lang="scss" scoped>
.text-centered-bold {
  text-align: center; /* 使文本水平居中 */
  font-weight: bold; /* 使文本加粗 */
  justify-content: center;
  align-items: center;
  position: relative;
}
.container {
  max-width: 100%;
  display: flex;
  height: 100%;
  // background: rgb(237, 241, 244);
  padding: 10px;
  padding-top: 0px;
  color: #333;
  // border-radius: 10px;
  width: 100%;
}
.left-box {
  width: 60%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  .left-box-center {
    flex: 7.9;
    width: 100%;
    display: flex;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.15);
    border: none;
    .input {
      height: 100%;
      width: 100%;
      padding-top: 5px;
      :deep(.el-textarea__inner) {
        box-shadow: 0 0 0 0px var(--el-input-border-color, var(--el-border-color)) inset;
        resize: none;
        font-size: 16px;
        height: 100%;
      }
    }

    .generate {
      // zoom: 0.9;
      border-top: 1px solid #d6d7df;
      height: 10%;
      align-items: center;
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
        margin-right: 35px;
        .Remaining {
          text-align: center;
          align-content: center;
          color: #333;
          font-size: 12px;
          margin-right: 20px;
        }
      }
      .generate-button {
        width: 132px;
        height: 80%;
        max-height: 32px;
        background-color: #fff;
        color: #333;
        font-weight: bold;
        font-size: 14px;
        border: 1px solid #d2d6da;
      }
      .generate-button:hover {
        background-color: #edf1f4;
      }
    }
  }
  .left-box-top {
    height: 90px;
    display: flex; /* 设置为flex布局，使内部元素能在水平方向排列 */
    gap: 10px;
    // justify-content: space-around; /* 均匀分配元素之间的空间 */
  }

  .left-box-top > * {
    width: 33%; /* 让每个子元素（包括文本和两个ACard）大致占33%宽度 */
    box-sizing: border-box; /* 确保边框和内边距不影响元素宽度计算 */
  }

  /* 原有的.sound-list-left和.sound-list-right相关样式保留不变 */
  .sound-list-left {
    width: 100%;
    /* 以下是.sound-list-left内部的样式，保留原样 */
    .sound-list-item-last {
      border-bottom: 1px solid #dcdfe6;
    }

    .sound-list-item {
      width: 100%;
      height: 60px;
      border-top: 1px solid #dcdfe6;
      display: flex;
      justify-content: space-between;
      text-align: center;
      align-items: center;
      font-size: 16px;
      .sound-name {
        margin-left: 30px;
        text-align: center;
      }
    }

    .sound-list-item:hover {
      background-color: rgb(237, 241, 244);
    }
  }

  .sound-list-right {
    width: 100%;
    /* 以下是.sound-list-right内部的样式，保留原样 */
    .sound-list-item-last {
      border-bottom: 1px solid #dcdfe6;
    }

    .sound-list-item {
      width: 100%;
      height: 60px;
      border-top: 1px solid #dcdfe6;
      display: flex;
      justify-content: space-between;
      text-align: center;
      align-items: center;
      font-size: 16px;
      .sound-name {
        margin-left: 30px;
        text-align: center;
      }
    }

    .sound-list-item:hover {
      background-color: rgb(237, 241, 244);
    }
  }
  .left-box-bottom {
    width: 100%;
    height: 170px;
    display: flex;
    justify-content: center;
    margin: auto;
    border: none;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.15);
  }
}
.right-box {
  margin-left: 8px;
  width: 40%;
  height: 100%;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.15) !important;
  border: none;
  border-radius: 10px;
  .right-box-top {
    display: flex;
    padding-top: 5px;
    .setting-and-history {
      margin: 5px;
      color: #333;

      text-align: center;
      border-bottom: 1px solid #dcdfe6;
      width: 60px;

      height: 30px;
      cursor: pointer;
    }
    .setting-and-history-active {
      border-bottom: 1px solid rgb(89, 87, 87);
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
    margin-bottom: 15px;
    border: 1px solid #dcdfe6;
    border-radius: 5px;
    cursor: pointer;
    overflow-x: auto;
  }
  .model-list-item {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 0px 15px;
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
    font-size: 14px;
    width: 100%;
    position: absolute;
    background: #fff;
    z-index: 99;
    padding: 10px;
    margin-bottom: 20px;
    border-radius: 10px 10px 15px 15px;
    border: 1px solid black;
    height: 100%;
    overflow: auto;
    display: flex;
    flex-direction: column;
    gap: 5px;
    .select-model-title {
      font-size: 16px;
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
      .back-btn:hover {
        background-color: rgb(237, 241, 244);
        color: #333;
        border: 1px solid #dcdfe6;
      }
    }
  }
  .btn-box {
    padding-top: 200px;
    width: 100%;
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .setting-body {
    height: calc(100% - 45px);
    width: 100%;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    overflow-x: hidden;
    position: relative;
    .apikey-container {
      width: 100%;
      font-size: 16px;

      .slider-top {
        width: 100%;
        margin-top: 10px;
        margin-bottom: 15px;
        // padding-bottom: 5px;
        // border-bottom: 1px solid #d6d7df;
        font-weight: 600;
      }
    }
    .slider-container {
      // height: 20%;
      width: 100%;
      font-size: 16px;
      padding-top: 15px;

      color: #333;
      .slider {
        :deep(.el-slider__bar) {
          width: 95%;
          background-color: rgb(237, 241, 244);
        }
        :deep(.el-slider__button) {
          background-color: rgb(89, 87, 87);
          border: 2px solid rgb(89, 87, 87);
        }
      }
      .slider-top {
        width: 100%;
        padding-left: 20px;
        padding-bottom: 5px;

        // border-bottom: 1px solid #d6d7df;
      }
    }
    .setting-btn {
      width: 100%;
      display: flex;
      flex: 1;
      justify-content: end;
      align-items: center;
      padding-top: 15px;
      padding-right: 2.5%;
      .reset-btn {
        width: 180px;
        height: 32px;
        background-color: black;
        color: white;
      }
      .reset-btn:hover {
        background-color: rgb(237, 241, 244);
        color: #333;
        border: 1px solid black;
      }
      .save-btn {
        width: 180px;
        height: 32px;
        background-color: white;
        color: #333;
      }
      .save-btn:hover {
        background-color: rgb(237, 241, 244);
        border: 1px solid #d6d7df;
      }
    }
  }
}

.timer-setting {
  margin-left: 20px;
}
.desc-set-page {
  width: 100%;
  height: calc(100% - 45px);
  display: flex;
  flex-direction: column;
  align-items: center;
}
.history {
  width: 100%;
  height: calc(100% - 45px);
  display: flex;
  flex-direction: column;
}
.history-top {
  width: 100%;
  height: 55px;
  padding-bottom: 20px;
  align-items: center;
  align-content: center;
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
  .manage-btn:hover {
    background-color: rgb(237, 241, 244);
    color: #333;
    border: 1px solid #dcdfe6;
  }
  // border-bottom: 1px solid #dcdfe6;
}
.history-list {
  display: flex;
  width: 100%;
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
    width: calc(100% - 21px);
  }
  .num-records {
    width: 66px;
    height: 25px;
    text-align: center;
    border: 1px solid #dcdfe6;
    line-height: 25px;
    margin-left: 10px;
    border-radius: 5px;
  }
  .history-desc {
    width: 330px;
    height: 30px;
    line-height: 30px;
    margin-left: 20px;
    overflow: hidden;
  }
}
::v-deep .el-table tr {
  background-color: rgb(237, 241, 244);
}

::v-deep .el-table tbody tr:hover > td {
  background: white !important;
}
::v-deep .el-table tbody tr > td {
  border: 0.1px solid #e0e2e6 !important;
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
.history-footer {
  width: 100%;
  flex: 1.02;

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
.linear-class {
  background: linear-gradient(to right, #fff 0%, rgb(145, 198, 222, 0.3) 50%, #fff);
  font-size: 16px;
  width: 140px;
  padding: 5px 0px;
  color: #333;
  padding-left: 20px;
  font-weight: 600;
}
::v-deep .el-input__inner {
  font-size: 14px;
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
