<template>
  <div class="common-layout">
    <div class="header">
      <thehead ref="headRef" @updateInputLanguage="handleInputLanguageUpdate" @updateOutputFormat="handleOutputFormatUpdate"></thehead>
    </div>
    <div class="box_main1">
      <div class="box" style="flex: 3.5">
        <el-upload
          class="upload-demo upload-file"
          drag
          accept=".mp3, .wav, .webm"
          :before-upload="beforeUpload"
          :http-request="upload"
          :on-success="uploadSuccess"
          :on-error="uploadError"
          :show-file-list="false"
          multiple
        >
          <!-- <span class="iconfont icon-shangchuanwenjian" style="font-size: 60px; color: #535ed8"></span> -->
          <span
            class="iconfont icon-shangchuanwenjian"
            style="
              font-size: 60px;
              /* background: linear-gradient(to right, #1190fb 40%, #a3f2f9 60%); */
              background: linear-gradient(to bottom right, #1190fb, #a3f2f9);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            "
          ></span>

          <div class="el-upload__text">
            将音频文件拖放到此处或
            <em>浏览文件</em>
            <div class="el-upload__tip">*支持mp3,wav,webm格式的音频文件，文件大小不超过100MB</div>
            <!-- <div class="el-upload__tip">免费试用：限制为一个音频文件，文件大小不超过25MB</div> -->
          </div>
        </el-upload>
      </div>

      <div class="box">
        <div class="record-contain recording-img" id="recoder-click" @click="changeTorecording()">
          <span
            class="iconfont"
            :class="CurrentRecordingIcon"
            style="
              font-size: 70px;
              background: linear-gradient(to bottom right, #1190fb, #a3f2f9);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            "
          ></span>
          <!-- <el-icon size="70">
            <AIcon :icon="CurrentRecordingIcon"> </AIcon>
          </el-icon> -->
          <!-- <el-icon class="box_icon2" size="70">
            <AIcon @click="changeTorecording()" :icon="CurrentRecordingIcon" />
          </el-icon> -->
          <div class="box_recordertex">
            <div v-show="showDefaultRecordingIcon" class="box_div1">
              <span>使用麦克风录制音频</span>
              <!-- <div class="el-upload__tip" style="padding-top: 5px">免费试用：限制为一分钟</div> -->
            </div>
            <div v-show="shaowRecordingIcon" class="recording">
              <!-- <el-icon class="box_icon3" size="80">
                <AIcon class="box_icon3_recordingIcon" icon="icon-shengbo" />
              </el-icon> -->
              <!-- <span class="iconfont icon-shengbo" style="color: #d81e06; font-size: 20px"></span> -->
              <img src="@/assets/image/home/recoding.gif" alt="" style="margin-left: 15px" width="50px" height="30px" />
              <!-- <div style="width: 50px; height: 30px" id="recordingId" ref="recordingRef"></div> -->
              <el-text class="box_recording_status_text" type="primary" style="color: rgb(0, 0, 0)">正在录制...</el-text>
            </div>
            <!-- <canvas ref="canvasRef" style="height: 50px; width: 50px; background: none"></canvas> -->
            <div style="font-size: 14px; color: #606266; padding-top: 9px">录制时长最长为20分钟</div>
          </div>
        </div>
      </div>
      <div class="box_audios" name="tableData">
        <div class="audio-list-top">
          <el-icon size="25">
            <AIcon class="audio" icon="icon-yinpinwenjian" />
          </el-icon>
          <span>音频文件</span>
        </div>

        <!-- 50  250  50  150   -->
        <div class="audio_files">
          <el-table
            class="audio_files_table"
            :data="tableData"
            @row-click="changeTextOnClick"
            :show-header="false"
            fit
            highlight-current-row
            style="user-select: none"
            table-layout="fixed"
          >
            <el-table-column min-width="9%">
              <template #default="scope">
                <div class="recording_runtime_status">
                  <!-- <el-icon v-if="(isupload || shaowRecordingIcon) && scope.$index === 0" size="17">
                    <span class="iconfont icon-yunhangzhong" style="font-size: 17px; color: #000"></span>
                  </el-icon> -->
                  <img v-if="(isupload || shaowRecordingIcon) && scope.$index === 0" width="17px" src="@/assets/image/home/load.gif" />
                  <el-icon v-if="!shaowRecordingIcon && !isupload" size="17">
                    <span class="iconfont icon-a-bianzu32x" style="font-size: 17px; color: #409eff"></span>
                  </el-icon>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="filename" min-width="70%" label="filename" />
            <!-- <el-table-column prop="id" label="id" /> -->
            <el-table-column min-width="15%" style="display: flex; justify-content: start">
              <template #default="scope">
                <div
                  class="audio_files_buttons"
                  style="display: flex; gap: 5px; justify-content: start; align-items: center; margin-left: -10px"
                  :style="scope.$index != 0 ? 'padding-left:25px' : ''"
                >
                  <!-- <el-icon style="outline: none" @click="rerunFile" size="20" v-if="scope.$index === 0"> -->
                  <el-tooltip class="box-item" effect="light " content="使用当前选项重新运行此文件" placement="top-start">
                    <!-- <AIcon style="cursor: pointer" class="audio" icon="icon-zhongxinyunhang" /> -->
                    <span
                      @click="rerunFile"
                      class="iconfont icon-zhongxinyunhang"
                      style="cursor: pointer; font-size: 20px"
                      v-if="scope.$index === 0"
                    ></span>
                  </el-tooltip>
                  <!-- </el-icon> -->

                  <el-icon
                    style="outline: none"
                    @click="
                      () => {
                        if (loading) {
                          ElMessage.warning('正在处理中，请稍后');
                          return;
                        }
                        isvisable = !isvisable;
                        changeDeleteFile(scope);
                      }
                    "
                    size="20"
                  >
                    <el-tooltip class="box-item" effect="light " content="删除音频文件" placement="top-end">
                      <!-- <AIcon style="outline: none; cursor: pointer" class="audio" icon="icon-shanchu" /> -->
                      <span style="cursor: pointer; font-size: 20px; color: rgb(89, 87, 87)" class="iconfont icon-shanchu"></span>
                    </el-tooltip>
                  </el-icon>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="deleteDialog" v-show="isvisable" placement="bottom-end">
            <p style="display: flex">
              <el-icon size="20" class="popover_icon"> <AIcon style="cursor: pointer" icon="icon-gantanhao" /> </el-icon>是否确认删除？
            </p>
            <div class="popover_btn">
              <el-button size="small" class="popover_btn1" @click="hiddenPopver()">取消</el-button>
              <el-button size="small" class="popover_btn2" @click="deleteFirstFile()">确认</el-button>
            </div>
          </div>
        </div>
        <div class="audio_files_clean">
          <el-popover placement="bottom-end" :visible="isvisable2" :width="200">
            <p style="display: flex">
              <el-icon size="20" class="popover_icon"> <AIcon icon="icon-gantanhao" /> </el-icon>是否确认删除？
            </p>
            <div class="popover_btn">
              <el-button size="small" class="popover_btn1" @click="hiddenPopver2()">取消</el-button>
              <el-button size="small" class="popover_btn2" @click="deleteAllFiles()">确认</el-button>
            </div>
            <template #reference>
              <span
                class="all-delete"
                @click="
                  () => {
                    if (loading) {
                      ElMessage.warning('正在处理中，请稍后');
                      return;
                    }
                    isvisable2 = !isvisable2;
                  }
                "
              >
                全部删除
              </span>
            </template>
          </el-popover>
        </div>
      </div>
    </div>
    <div class="text_area" name="textAreaComponent">
      <div class="audio_file">
        <div class="audio_files_top">
          <div class="audio_files_top_left">
            <div class="audio_files_top_left_text">
              <el-text class="audio_files_top_left_text1">文件名 :</el-text>
              <el-text class="audio_files_top_left_text12">{{ formatString(CurrentFile) }}</el-text>
            </div>
            <div class="audio_files_top_left_text2">
              <div class="audio_files_top_left_text2_tips1">
                <el-text class="audio_files_top_left_text1">输入语言:</el-text>
                <el-text class="audio_files_top_left_text12">{{ displayLang }}</el-text>
              </div>
              <div class="audio_files_top_left_text2_tips1">
                <el-text class="audio_files_top_left_text1">输出格式:</el-text>
                <el-text class="audio_files_top_left_text12">{{ OutputFormat }}</el-text>
              </div>
              <div class="audio_files_top_left_text2_tips1">
                <el-text class="audio_files_top_left_text1">输入文件格式:</el-text>
                <el-text class="audio_files_top_left_text12">{{ InputFileFormat }}</el-text>
              </div>
              <div style="flex: 1"></div>
              <div class="audio_top_right_area2_icon3">
                <span class="iconfont icon-fuzhi" @click="copyText(tabPane)" style="color: #409eff; cursor: pointer; font-size: 26px"></span>
                <el-tooltip class="box-item" effect="light " content="导出文件" placement="top-end">
                  <span class="iconfont icon-daochu" @click="daochu" style="cursor: pointer; font-size: 25px; color: #409eff"></span>
                </el-tooltip>
              </div>
            </div>
          </div>
          <div class="audio_files_top_right">
            <div class="audio_top_right_area1">
              <el-slider
                :min="0"
                :disabled="isDisabled"
                v-model="audioUrrentTimeSeconds"
                :max="audiototalTime"
                :format-tooltip="sliderFormatTooltip"
                @input="updateAudioTime"
              ></el-slider>
            </div>
            <div class="audio_top_right_area2">
              <el-icon
                @click="changeplayingStatus()"
                :iconCurrentStatus="iconCurrentStatus"
                size="26"
                :style="{
                  pointerEvents: isDisabled ? 'none' : 'auto',
                }"
                style="margin-right: 10px; margin-left: -10px"
              >
                <AIcon class="audio" :icon="iconCurrentFormat" style="cursor: pointer" />
              </el-icon>
              <div class="audio_top_right_area2_text">
                <el-text class="audio_files_top_left_text1">{{ formatTime(audioUrrentTime) }}/</el-text>
                <el-text class="audio_files_top_left_text1">{{ formatTime(audiototalTime) }}</el-text>
              </div>
              <div style="flex: 1"></div>
              <div class="audio_top_right_area2_icon2">
                <a :href="audioUrl" :download="CurrentFile" :onclick="jiaoyan" style="border: none !important">
                  <el-tooltip effect="light " content="下载音频文件" placement="top-start">
                    <span class="iconfont icon-xiazai-copy" style="font-size: 26px; color: #409eff"></span>
                  </el-tooltip>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div shadow="hover" element-loading-background="rgba (0, 0, 0, 0)" class="audio_file_main">
          <div class="audio_file_main_top">
            <el-tabs v-model="activeName" type="border-card" @tab-click="changePane" class="demo-tabs">
              <el-tab-pane v-loading="loading" label="文本" name="first" style="color: #333" class="demo-pane">
                <div v-if="OutputFormat === '简单'" class="text_area1">
                  <span
                    v-for="text in texts_with_timecoppy"
                    :key="text.index"
                    class="text-item"
                    :style="{
                      backgroundColor:
                        audioUrrentTime > textsStartTime[text.index - 1]?.startTime && audioUrrentTime < textsStartTime[text.index - 1]?.endTime
                          ? 'pink'
                          : '',
                    }"
                  >
                    {{ loading ? '' : text.text }}
                  </span>
                </div>
                <div v-if="OutputFormat === '详细'" class="text_area2">
                  <p
                    v-for="text in texts_with_timecoppy"
                    :key="text.index"
                    class="text-item"
                    :style="{
                      backgroundColor:
                        audioUrrentTime > textsStartTime[text.index - 1]?.startTime && audioUrrentTime < textsStartTime[text.index - 1]?.endTime
                          ? 'pink'
                          : '',
                      width: 'fit-content',
                    }"
                  >
                    {{ loading ? '' : `${text?.startTime}--${text?.endTime}&nbsp;${text?.text} ` }}<br />
                  </p>
                  <!-- <div v-if="OutputFormat === '详细'" class="text_area1">
                      <div v-for="(text, index) in texts_with_time" :key="index" class="text-item">
                        <p v-if="isPlaying" id="text-output" class="textarea"></p>
                        <p v-if="!isPlaying" class="textarea">{{ text }}</p>
                      </div>-->
                </div>
              </el-tab-pane>
              <el-tab-pane label="JSON" name="second">
                <div class="text_area1">
                  <json-viewer
                    :value="loading ? '请等待音频转文字完成！' : texts_jason?.length > 0 && texts_jason ? texts_jason : '请先上传音频或录音！'"
                    :expand-depth="5"
                    boxed
                    sort
                    expanded
                  ></json-viewer>
                  <!-- <div v-for="(JSOn, index) in texts_jason" :key="index" class="text-item">
                        <p class="textarea">{{ JSOn }}</p>
                        <div class="separator"></div> -->
                  <!-- </div> -->
                </div>
              </el-tab-pane>
              <el-tab-pane v-loading="isSseLoading" label="流式" name="third" class="demo-pane">
                <div class="stream-out">{{ streamContent || ' ' }}</div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import '@/styles/iconfont/iconfont.css';
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { useVoice, getHistyAudio, getAudios, deleteRecordsRes, renderAudioGraph } from './hook/useVoice';
import { ElMessage, ElMessageBox } from 'element-plus';
import { saveAs } from 'file-saver';
import 'vue-json-viewer/style.css';
import JsonViewer from 'vue-json-viewer';
import thehead from './components/head.vue';

const isupload = ref(false);
const texts_with_timejson = ref();
const texts_jason = ref();
const isInputLanguage = ref();
const isoutputFormat = ref();
const rerunFilename = ref();
const rerunstatic = ref(false);
const audioBase64 = ref();
const recorderBase64 = ref();
const inputlang = ref();
const fileExtension = ref();
const headRef = ref(null);
const isvisable = ref(false);
const isvisable2 = ref(false);
const isTooshort = ref(false); // 是否太短
const isPlaying = ref(false); // 是否正在播放
const mediaRecorder = ref(null); // 媒体录制对象
const audioChunks = ref([]); // 音频数据块
const CurrentFile = ref('  '); // 显示当前的文件名
const InputLanguage = ref(''); // 输入语言的显示
const InputFileFormat = ref(); // 输入文件格式类型的显示
const OutputFormat = ref('简单'); // 输出格式的选则，简单，详细
const loading = ref(false);
const audioUrl = ref(); // 音频文件地址
const audio = ref(null);
const audioUrrentTime = ref(0); // 当前播放时间
const audiototalTime = ref(0); // 总时长
const audioUrrentTimeSeconds = ref(0);
const audiototalTimeSeconds = ref(0);
const activeName = ref('first'); // 默认打开的tab
const recordingTime = ref(0); // 录音时间
const audioHistory = ref();
const audioUrlHistroy = ref();
const audioHistoryBlob = ref();
const shaowRecordingIcon = ref(false); // 显示正在录音icon
const showDefaultRecordingIcon = ref(true); // 显示开始录音icon
const recordingIcon = ref(['icon-yuyinmaikefeng-tianchong', 'icon-luzhi_24']); // 录音icon
const CurrentRecordingIcon = ref(recordingIcon.value[0]); // 当前录音icon
let mediaStream;
const canvasRef = ref(null);
const icon = {
  iconStatus: ['stop', 'start'], // 播放icon
  iconformat: ['icon-kechengliebiaokaishibofang-copy', 'icon-zantingbofang'],
};
import { copyToClipboard } from '@/utils/commonUtil';
const displayLang = ref('');
const iconCurrentStatus = ref(icon.iconStatus[0]); //没有录音的状态
const iconCurrentFormat = ref(icon.iconformat[0]);
const tableData = ref([]);
const isuploading = ref(false);
const isRecordering = ref(false);
const isRenFiling = ref(false);
const { uploadFileVoiceToText, Texts, Texts_with_time, id } = useVoice(); //上传文件
const deleteId = ref();

const recordingRef = ref(null);

const streamContent = ref('');
const jiaoyan = () => {
  if (isFireFoxAndIsLoading.value && (isRecordering.value || isuploading.value || isRenFiling.value)) {
    ElMessage.warning('其他操作正在进行中，请稍后');
    return false;
  }
  if (!audioUrl.value) {
    ElMessage.error('暂无文件可下载');
    return false;
  }
};
const isDisabled = computed(() => {
  return isupload.value || shaowRecordingIcon.value;
});
const currentSelectModel = ref('');
// 文本显示区域
const pattern = /(\d+)\n(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})\n(.*?)(?=\n\d+|\n$)/gs; //匹配时间戳的正则表达式
const tabPane = ref(1);
const texts = ref([]);
const texts_with_time = ref([]); //有时间戳的文本
const texts_with_timecoppy = ref([]);
const textsStartTime = ref();
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
  return getBrowserName() === 'Firefox' && (isuploading?.value || isRecordering.value || isRenFiling.value);
});
const gotomathch = async (srtText) => {
  //正则匹配函数
  const matches = [];
  let match;

  while ((match = pattern.exec(srtText)) !== null) {
    const index = parseInt(match[1], 10);
    const startTime = match[2];
    const endTime = match[3];
    const text = match[4].trim();
    matches.push({ index, startTime, endTime, text });
  }
  texts_with_timecoppy.value = matches;

  const temp = matches.map((item) => ({
    startTime: item.startTime,
    endTime: item.endTime,
  }));
  const secondsToTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const timeToSeconds = (timeString) => {
    // 匹配时间戳的正则表达式
    const pattern = /(\d{2}):(\d{2}):(\d{2}),(\d{3})/;
    const match = pattern.exec(timeString);

    // 提取小时、分钟、秒和毫秒
    const hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const seconds = parseInt(match[3], 10);
    const milliseconds = parseInt(match[4], 10);

    // 计算总秒数
    const totalSeconds = hours * 3600 + minutes * 60 + seconds + milliseconds / 1000;
    return totalSeconds;
  };
  textsStartTime.value = temp.map((item) => ({ startTime: timeToSeconds(item.startTime), endTime: timeToSeconds(item.endTime) }));
  ///////含有转换后的时间戳
  texts_with_timecoppy.value.forEach((item) => {
    item.startTime = secondsToTime(timeToSeconds(item.startTime));
    item.endTime = secondsToTime(timeToSeconds(item.endTime));
  });
  texts_with_timejson.value = JSON.stringify(texts_with_timecoppy.value, null, 2);
  texts_jason.value = JSON.parse(texts_with_timejson.value);

  tableData.value.push({
    filename: CurrentFile.value,
    texts_with_timecoppy: texts_with_timecoppy.value,
    texts_jason: texts_jason.value,
  });
  index++;
  loading.value = false;
  ElMessage.success('运行成功');
};

//导出文本
const daochu = () => {
  if (texts.value?.length === 0 || texts_jason?.value.length === 0) {
    ElMessage.warning('数据为空');
    return;
  }
  const datetime = new Date().toLocaleString();

  if (tabPane.value === 1) {
    let blob = new Blob();
    if (OutputFormat.value === '简单') {
      blob = new Blob([Texts.value.replace(/。/g, '。\n')], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, datetime + '.txt');
    } else {
      blob = new Blob([Texts_with_time.value.replace(/。/g, '。\n')], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, datetime + '.srt');
    }
  } else {
    const blob = new Blob([texts_jason.value.map((item) => JSON.stringify(item)).join('\n')], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, datetime + '.txt');
  }
};

//是否显示删除框
const hiddenPopver = () => {
  isvisable.value = false;
};

const hiddenPopver2 = () => {
  isvisable2.value = false;
};

const sliderFormatTooltip = () => {
  const ctime = formatTime(audioUrrentTime.value);
  const atime = formatTime(audiototalTime.value);
  return `${ctime}/${atime}`;
};

const formatString = (str) => {
  const parts = str?.split('.');
  const fileExtension = parts?.pop();
  const fileName = parts?.join('.');

  if (str?.length > 40) {
    return `${fileName?.slice(0, 20)}...${fileExtension}`;
  }

  return str;
};

const changeCurrentFileName = (filename, index1) => {
  const regex = /_(\d+)\.([a-zA-Z0-9]+)$/;

  if (regex.test(filename)) {
    const match = filename.match(regex);
    if (match.includes('01') && index1 == 1) {
      index++;
      index1++;
    }
    const extension = match[2]; // 获取扩展名部分，例如 "webm"
    const newNumber = index1.toString().padStart(2, '0');
    const baseName = filename.substring(0, filename.lastIndexOf('_') + 1);
    CurrentFile.value = `${baseName}${newNumber}.${extension}`;
  } else {
    // 如果文件名没有数字后缀，直接用传入的 index 来生成新的文件名
    const parts = filename.split('.');
    const extension = parts[parts.length - 1]; // 获取扩展名
    const baseName = parts.slice(0, -1).join('.'); // 去掉扩展名的部分

    // 使用传入的 index 来生成新的文件名
    CurrentFile.value = `${baseName}_${index1.toString().padStart(2, '0')}.${extension}`;
  }
};
let index = 1;
const rerunFile = async () => {
  if (isRenFiling.value) {
    ElMessage.warning('请等待重新运行结束再执行');
    return;
  }
  if (loading.value) {
    ElMessage.warning('请等待当前文件上传完成');
    return;
  }
  if (!inputlang.value) {
    ElMessage.warning('请选择语言');
    return;
  }
  if (isuploading.value || isRecordering.value) {
    ElMessage.warning('请等待文件上传或录音结束');
    return;
  }
  if (!audio.value) {
    ElMessage.warning('暂无音频可运行');
    return;
  }
  if (!audio.value?.paused && audio.value) {
    pauseAudio();
    isPlaying.value = false;
    changeCurrentstatus();
  }
  //初始化音频进度
  await nextTick(() => {
    // 初始化音频进度
    audioUrrentTimeSeconds.value = 0;
    audio.value.currentTime = 0;
    audioUrrentTime.value = 0;
  });

  audiototalTimeSeconds.value = 0;

  if (!rerunstatic.value) {
    rerunstatic.value = true;
    chuangeiconCurrentFormat();
    loading.value = true;
    ElMessage('正在重新运行，请稍后');

    if (index === 1 && texts_jason.value?.length > 0) {
      tableData.value[0].texts_jason = texts_jason.value;
      tableData.value[0].texts_with_timecoppy = texts_with_timejson.value;
    }
    if (index === 1) {
      rerunFilename.value = tableData.value[0].filename;
      changeCurrentFileName(rerunFilename.value, index);
    } else {
      changeCurrentFileName(rerunFilename.value, index);
    }
    isRenFiling.value = true;
    try {
      setTimeout(() => {
        texts_jason.value = [];
        texts_with_timejson.value = [];
      }, 100);
      displayLang.value = InputLanguage.value;
      tableData.value.push({
        filename: CurrentFile.value,
      });
      if (recorderBase64.value) {
        sseAsr(recorderBase64.value, 'webm', headRef.value.currentSelectApikey, inputlang.value, rerunFilename.value);
        await uploadFileVoiceToText(
          currentSelectModel.value,
          recorderBase64.value,
          'webm',
          headRef.value.currentSelectApikey,
          inputlang.value,
          rerunFilename.value,
        );
        deleteId.value = id.value;
        loading.value = false;
        texts.value[0] = Texts.value;
        texts_with_time.value[0] = Texts_with_time.value;
        chuangeiconCurrentFormat();
        isRenFiling.value = false;
        tableData.value.pop();
        await gotomathch(Texts_with_time.value);
        const res = await getHistyAudio();
        audioUrl.value = res[0]?.url;
      } else if (audioBase64.value) {
        sseAsr(audioBase64.value, fileExtension.value, headRef.value.currentSelectApikey, inputlang.value, rerunFilename.value);
        await uploadFileVoiceToText(
          currentSelectModel.value,
          audioBase64.value,
          fileExtension.value,
          headRef.value.currentSelectApikey,
          inputlang.value,
          rerunFilename.value,
        );
        deleteId.value = id.value;
        loading.value = false;
        // console.log(loading.value);

        texts.value[0] = Texts.value;
        texts_with_time.value[0] = Texts_with_time.value;
        chuangeiconCurrentFormat();
        isRenFiling.value = false;
        tableData.value.pop();

        await gotomathch(Texts_with_time.value);
        const res = await getHistyAudio();
        audioUrl.value = res[0]?.url;
      } else {
        rerunFilename.value = tableData.value[0].filename;
        await uploadAudio(audioHistoryBlob.value);
      }
    } catch (e) {
      ElMessage.error('重新运行失败');
      isRenFiling.value = false;
      loading.value = false;
      return;
    }

    // loading.value = false;
    rerunstatic.value = false;
  } else {
    ElMessage.warning('正在运行中，请稍后');
  }
};

const changePane = (tab) => {
  if (tab.props.name == 'first') {
    tabPane.value = 1;
  } else if (tab.props.name == 'second') {
    tabPane.value = 2;
  } else {
    tabPane.value = 1;
  }
};
const changeCurrentstatus = () => {
  if (iconCurrentStatus.value === icon.iconStatus[0]) {
    iconCurrentStatus.value = icon.iconStatus[1];
    iconCurrentFormat.value = icon.iconformat[1];
  } else if (iconCurrentStatus.value === icon.iconStatus[1]) {
    iconCurrentStatus.value = icon.iconStatus[0];
    iconCurrentFormat.value = icon.iconformat[0];
  } else {
    iconCurrentStatus.value = icon.iconStatus[1];
    iconCurrentFormat.value = icon.iconformat[1];
  }
};

const changeTorecording = async () => {
  if (!InputLanguage.value) {
    ElMessage.warning('您在录音前请先选择音频的语言');
    return false;
  }
  texts_with_timecoppy.value = [];
  texts_jason.value = [];

  if (CurrentRecordingIcon.value === recordingIcon.value[0]) {
    if (loading.value) {
      ElMessage.warning('正在运行中，请稍后');
      return;
    }
    if (isuploading.value) {
      ElMessage.warning('请等待当前文件上传结束再开始录音');
      return;
    }
    if (isRenFiling.value) {
      ElMessage.warning('请等待当前文件重新运行结束再开始录音');
      return;
    }
    isRecordering.value = true;
    displayLang.value = InputLanguage.value;
    CurrentRecordingIcon.value = recordingIcon.value[1];
    shaowRecordingIcon.value = true; // 正在录音
    showDefaultRecordingIcon.value = false;
    iconCurrentStatus.value = icon.iconStatus[0];
    iconCurrentFormat.value = 'icon-kechengliebiaokaishibofang-copy-copy';
    startRecording();
  } else {
    isRecordering.value = false;
    CurrentRecordingIcon.value = recordingIcon.value[0];
    shaowRecordingIcon.value = false;
    showDefaultRecordingIcon.value = true;
    stopRecording();

    // iconCurrentFormat.value = 'icon-kechengliebiaokaishibofang-copy';
  }
};
const chuangeiconCurrentFormat = () => {
  if (iconCurrentFormat.value === 'icon-kechengliebiaokaishibofang-copy') {
    iconCurrentFormat.value = 'icon-kechengliebiaokaishibofang-copy-copy';
  } else {
    iconCurrentFormat.value = 'icon-kechengliebiaokaishibofang-copy';
  }
};

const handleInputLanguageUpdate = (item) => {
  isInputLanguage.value = item?.display;
  InputLanguage.value = item?.display;
  inputlang.value = item?.lang;
};

const handleOutputFormatUpdate = (outputFormat) => {
  isoutputFormat.value = outputFormat;
  OutputFormat.value = outputFormat;
};

const deleteFirstFile = async () => {
  if (loading.value) {
    ElMessage.warning('正在运行中，请稍后');
    return;
  }
  if (tableData.value.length > 0) {
    if (isPlaying.value) {
      pauseAudio();
      isPlaying.value = false;
      changeCurrentstatus();
    }
    if (tableData.value.length === 1) {
      const res = await deleteRecordsRes({ id: deleteId.value });
      if (res != 1) {
        isvisable.value = false;
        return;
      }
      audioUrrentTime.value = 0;
      audiototalTimeSeconds.value = 0;
      audio.value = null;
      audioUrl.value = null;
      InputFileFormat.value = '';
      audioUrrentTimeSeconds.value = 0;
      if (recorderBase64.value) {
        recorderBase64.value = '';
      }
      setTimeout(() => {
        audiototalTime.value = 0;
      }, 50);
      index = 1;
    }
    // audioUrrentTime.value = 0;
    // audioUrrentTimeSeconds.value=0
    // tableData.value.splice(0, 1);
    tableData.value = tableData.value.filter((item) => {
      return item.filename != CurrentDeleteFileName.value;
    });
    // index--;
    CurrentFile.value = tableData.value[0]?.filename;
    // tabledatainit();

    isvisable.value = false;
    if (tableData.value.length > 0) {
      texts_with_timecoppy.value = tableData.value[0]?.texts_with_timecoppy;
      texts_jason.value = tableData.value[0]?.texts_jason;
    } else {
      texts_with_timecoppy.value = [];
      texts_jason.value = [];
    }

    ElMessage.success('文件已删除');
  } else {
    ElMessage.warning('没有文件可以删除');
  }
};

const deleteAllFiles = async () => {
  if (tableData.value.length == 0) {
    ElMessage.warning('没有文件可以删除');
    return;
  }
  try {
    index = 1;
    CurrentFile.value = '';
    InputFileFormat.value = '';
    tableData.value = [];
    if (isPlaying.value) {
      pauseAudio();
      // audio.value = null;
      changeCurrentstatus();
    }
    audioUrrentTimeSeconds.value = 0;
    audioUrrentTime.value = 0;
    setTimeout(() => {
      audiototalTime.value = 0;
    }, 50);
    const res = await deleteRecordsRes({ id: deleteId.value });
    if (res != 1) {
      isvisable2.value = false;
      return;
    }
    audioHistory.value = null;
    audioUrlHistroy.value = '';
    audioBase64.value = '';
    recorderBase64.value = '';
    audio.value = null;
    isvisable.value = false;
    isvisable2.value = false;
    audioUrl.value = null;
    texts_with_timecoppy.value = [];
    texts_jason.value = [];
    ElMessage.success('全部文件已删除');
    // console.log(audioUrrentTimeSeconds.value);
  } catch (error) {
    // 用户点击取消，不做任何操作
  }
};

const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = function () {
      if (reader.readyState === FileReader.DONE) {
        resolve(reader.result);
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
let timeOut;
const startRecording = async () => {
  index = 0;
  if (!audio.value?.paused) {
    audio.value?.pause();
    isPlaying.value = false;
    changeCurrentstatus();
    chuangeiconCurrentFormat();
  }
  audioUrrentTimeSeconds.value = 0;
  audioUrrentTime.value = 0;
  // CurrentFile.value = new Date().toLocaleString() + '.webm';
  const currentDate = new Date();
  const formattedDate =
    currentDate.getFullYear() +
    ('0' + (currentDate.getMonth() + 1)).slice(-2) + // 月份
    ('0' + currentDate.getDate()).slice(-2) + // 日期
    '_' +
    ('0' + currentDate.getHours()).slice(-2) + // 小时
    ('0' + currentDate.getMinutes()).slice(-2) + // 分钟
    ('0' + currentDate.getSeconds()).slice(-2); // 秒

  CurrentFile.value = formattedDate + '_01.webm';
  rerunFilename.value = CurrentFile.value;
  InputFileFormat.value = '.webm'; /////传输文件的格式
  tableData.value = [];
  // 向tableData数组中添加一个新对象，该对象包含filename属性，值为CurrentFile的值
  tableData.value.unshift({
    filename: CurrentFile.value,
  });
  loading.value = true;
  iconCurrentStatus.value = icon.iconStatus[0];
  iconCurrentFormat.value = 'icon-kechengliebiaokaishibofang-copy-copy';
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    audioChunks.value = [];
    mediaRecorder.value = new MediaRecorder(stream);
    mediaStream = new MediaStream(stream);
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 4096;
    analyser.smoothingTimeConstant = 1;
    const source = audioContext.createMediaStreamSource(mediaStream);
    source.connect(analyser);
    const renderCurve = () => {
      if (!canvasRef.value) return;
      renderAudioGraph(analyser, canvasRef.value);
      window.requestAnimationFrame(renderCurve);
    };
    renderCurve();
    ElMessage.info('开始录制音频');
    // 启动录音
    InputLanguage.value = '麦克风录制';
    audioUrrentTimeSeconds.value = 0;
    audioUrrentTime.value = 0;
    audiototalTime.value = 0; // 总时长
    audiototalTimeSeconds.value = 0;
    recorderBase64.value = '';
    mediaRecorder.value.onstart = () => {
      timeOut = setTimeout(() => {
        // mediaRecorder.value.stop();
        document.getElementById('recoder-click').click();
        ElMessage.warning('已达到录制时长，如果要继续录制，请开启新的录制');
      }, 20 * 60 * 1000);
      return;
    };
    mediaRecorder.value.start();
    const startTime = new Date();
    mediaRecorder.value.ondataavailable = (event) => {
      audioChunks.value.push(event.data);
    };
    mediaRecorder.value.onstop = async () => {
      const endTime = new Date();
      const temptime = (endTime - startTime) / 1000;
      if (temptime < 1) {
        isTooshort.value = true;

        return;
      }
      clearTimeout(timeOut);
      recordingTime.value = temptime; // 录音时长
      const audioBlob = new Blob(audioChunks.value, { type: 'audio/webm' });
      // const file = new File([audioBlob], 'audio/webm', { type: 'audio/webm' });
      audioBase64.value = null;
      blobToBase64(audioBlob)
        .then((base64Data) => {
          recorderBase64.value = base64Data;
          if (recorderBase64.value.startsWith('data:audio/webm;base64,')) {
            recorderBase64.value = recorderBase64.value.replace('data:audio/webm;base64,', '');
          }
          try {
            const pppp = async () => {
              index++;
              sseAsr(recorderBase64.value, 'webm', headRef.value.currentSelectApikey, inputlang.value, CurrentFile.value);
              const uploadResult = await uploadFileVoiceToText(
                currentSelectModel.value,
                recorderBase64.value,
                'webm',
                headRef.value.currentSelectApikey,
                inputlang.value,
                CurrentFile.value,
              );
              deleteId.value = id.value;
              texts.value[0] = Texts.value;
              texts_with_time.value[0] = Texts_with_time.value;
              chuangeiconCurrentFormat();
              tableData.value = [];
              await gotomathch(Texts_with_time.value);
              return uploadResult;
            };
            const uploadResult2 = pppp();

            return uploadResult2;
          } catch (error) {
            return Promise.reject(error);
          }
        })
        .then((result) => {
          loading.value = false;
        })
        .catch((error) => {
          // console.error('语音转文本出现问题:', error);
          iconCurrentFormat.value = 'icon-kechengliebiaokaishibofang-copy';
          CurrentRecordingIcon.value = recordingIcon.value[0];
          isRecordering.value = false;
          tableData.value = [];
          loading.value = false;
          shaowRecordingIcon.value = false;
          showDefaultRecordingIcon.value = true;
        });
      audioUrl.value = URL.createObjectURL(audioBlob);

      audio.value = new Audio(audioUrl.value); // 创建 audio 元素
      audio.value.onloadedmetadata = () => {
        audiototalTime.value = recordingTime.value;
      };
    };
  } catch (error) {
    // ElMessage.error('录音失败');
    iconCurrentFormat.value = 'icon-kechengliebiaokaishibofang-copy';
    CurrentRecordingIcon.value = recordingIcon.value[0];
    isRecordering.value = false;
    tableData.value = [];
    loading.value = false;
    shaowRecordingIcon.value = false;
    showDefaultRecordingIcon.value = true;
    ElMessage.error('请允许使用麦克风');
  }
};

const stopRecording = () => {
  if (mediaRecorder.value) {
    mediaRecorder.value.stop();
    mediaRecorder.value.stream.getTracks().forEach((track) => track.stop()); // 停止媒体流
    setTimeout(() => {
      if (isTooshort.value) {
        ElMessage.warning('录音时间太短，请重新录音');
        tableData.value = [];
        loading.value = false;
        CurrentFile.value = '';
        InputFileFormat.value = '';
        isTooshort.value = false;
        iconCurrentFormat.value = 'icon-kechengliebiaokaishibofang-copy';
      } else {
        ElMessage.success('录音已结束');
      }
    }, 100);
  }
};

const changeplayingStatus = () => {
  //播放状态
  if (iconCurrentFormat.value == 'icon-kechengliebiaokaishibofang-copy-copy') {
    ElMessage.warning('请等待当前操作结束再播放');
    return;
  }
  if (audio.value) {
    if (isPlaying.value === false) {
      playAudio();
      isPlaying.value = true;
      changeCurrentstatus();
    } else {
      pauseAudio();
      isPlaying.value = false;
      changeCurrentstatus();
    }
  } else {
    ElMessage.warning('没有可播放的音频');
  }
};

const playAudio = () => {
  if (audio.value) {
    setTimeout(() => {
      audio.value.play();
    }, 50);
    const interval = setInterval(() => {
      if (!audio.value.ended && !audio.value.paused) {
        audioUrrentTimeSeconds.value = audio.value.currentTime;
        audioUrrentTime.value = audio.value.currentTime;
      }
    }, 10);
    audio.value.onpause = () => {
      clearInterval(interval);
    };
    audio.value.onended = () => {
      clearInterval(interval);
      pauseAudio();
      changeCurrentstatus();
      isPlaying.value = false;
      // 只在音频结束时重置进度
      audioUrrentTimeSeconds.value = 0;
      audioUrrentTime.value = 0;
    };
  } else {
    ElMessage.warning('没有可播放的音频');
  }
};

const pauseAudio = () => {
  if (audio.value) {
    audio.value.pause();
    //changeCurrentstatus();
  } else {
    ElMessage.warning('暂无音频');
  }
};

const beforeUpload = async (file) => {
  if (loading.value) {
    ElMessage.warning('请等待当前文件上传完成');
    return false;
  }
  if (isuploading.value) {
    ElMessage.warning('请等待当前文件上传完成');
    return false;
  }
  if (isupload.value) {
    ElMessage.warning('请等待当前文件上传完成');
    return false;
  }
  if (isRenFiling.value) {
    ElMessage.warning('请等待重新运行结束');
    return false;
  }
  if (isRecordering.value) {
    ElMessage.warning('请等待录音结束');
    return false;
  }
  if (!InputLanguage.value) {
    ElMessage.warning('您确上传音频文件前请先选择音频的语言');
    return false;
  }
  if (file.size === 0) {
    ElMessageBox.alert('上传的文件为空，请选择有效的文件。', '提示', {
      confirmButtonText: '确定',
      type: 'error',
    });
    return false;
  }

  const maxSizeMB = 100;
  if (file.size > maxSizeMB * 1024 * 1024) {
    ElMessage.error(`上传的文件大小不能超过 ${maxSizeMB}MB。`);
    return false;
  }
  isupload.value = true;
  chuangeiconCurrentFormat();
  tableData.value = []; // 清空
  const FilesName1 = file.name;
  tableData.value.push({
    filename: FilesName1,
  });
  CurrentFile.value = FilesName1;

  return true;
};

const upload = async (data) => {
  index = 1;
  audioUrrentTimeSeconds.value = 0;
  audioUrrentTime.value = 0;
  audiototalTime.value = 0;
  audiototalTimeSeconds.value = 0;
  if (!audio.value?.paused) {
    audio.value?.pause();
    isPlaying.value = false;
    changeCurrentstatus();
    chuangeiconCurrentFormat();
  }
  iconCurrentFormat.value = 'icon-kechengliebiaokaishibofang-copy-copy';
  iconCurrentStatus.value = icon.iconStatus[0];
  try {
    loading.value = true;
    recorderBase64.value = null;
    isuploading.value = true;
    texts_with_timecoppy.value = [];
    texts_jason.value = [];
    const reader = new FileReader();
    fileExtension.value = data.file.name.split('.').pop().toLowerCase();
    InputFileFormat.value = '.' + fileExtension.value;
    return new Promise((resolve, reject) => {
      reader.onload = (e) => {
        if (e.target) {
          const audioObj = new Audio(String(e.target.result));
          audio.value = audioObj;
          audioUrl.value = String(e.target.result);
          audioBase64.value = e.target.result.split(',')[1];
          audioObj.src = String(e.target.result);
          audioObj.onloadedmetadata = () => {
            audiototalTime.value = audioObj?.duration;
            resolve(true);
          };
          countAudioTime(audioObj);
        }
      };
      reader.onerror = (error) => {
        // console.error('FileReader error:', error);
        reject(false);
      };
      reader.readAsDataURL(data.file);
    }).then(async (result) => {
      if (result) {
        ElMessage.info('正在上传');
        try {
          if (audio.value.duration < 1) {
            isuploading.value = false;
            throw new Error('，请上传时长大于1秒的音频');
          }
          tableData.value = [];
          tableData.value.push({
            filename: data.file.name,
          });
          rerunFilename.value = data.file.name;
          changeCurrentFileName(rerunFilename.value, index);
          const baseName = rerunFilename.value.substring(0, rerunFilename.value.lastIndexOf('.'));
          const parts = rerunFilename.value.split('.');
          const houzhuiming = parts[parts.length - 1];
          CurrentFile.value = baseName + '_01' + '.' + houzhuiming;
          rerunFilename.value = CurrentFile.value;
          displayLang.value = InputLanguage.value;
          sseAsr(audioBase64.value, fileExtension.value, headRef.value.currentSelectApikey, inputlang.value, data.file.name);
          await uploadFileVoiceToText(
            currentSelectModel.value,
            audioBase64.value,
            fileExtension.value,
            headRef.value.currentSelectApikey,
            inputlang.value,
            data.file.name,
          );

          deleteId.value = id.value;
        } finally {
          //
        }
        tableData.value = [];
        texts.value[0] = Texts.value;
        texts_with_time.value[0] = Texts_with_time.value;
        await gotomathch(Texts_with_time.value);
        isuploading.value = false;
      }
      return result;
    });
  } catch {
    // loading.value = false;
  }
};
const uploadAudio = async (audioBlob) => {
  // index = 1;
  fileExtension.value = tableData.value[0].filename.split('.').pop().toLowerCase();
  InputFileFormat.value = '.' + fileExtension.value;
  try {
    // loading.value = true;
    blobToBase64(audioBlob).then(async (result) => {
      if (result) {
        // ElMessage.info('正在上传');
        try {
          audioBase64.value = result.replace('data:audio/*;base64,', '');
          // console.log(fileExtension);
          sseAsr(audioBase64.value, fileExtension.value, headRef.value.currentSelectApikey, inputlang.value, rerunFilename.value);
          await uploadFileVoiceToText(
            currentSelectModel.value,
            audioBase64.value,
            fileExtension.value,
            headRef.value.currentSelectApikey,
            inputlang.value,
            rerunFilename.value,
          );
          deleteId.value = id.value;
          isRenFiling.value = false;
        } catch {
          ElMessage('网络出了一点问题，稍等一下再试把');
        }
        texts.value[0] = Texts.value;
        texts_with_time.value[0] = Texts_with_time.value;
        chuangeiconCurrentFormat();
        tableData.value.pop();

        await gotomathch(Texts_with_time.value);
        const res = await getHistyAudio();
        audioUrl.value = res[0]?.url;
      }
      return result;
    });
  } finally {
    // loading.value = false;
  }
};

const uploadSuccess = (response, file) => {
  ElMessage.success(`${file.name} 上传成功`);
  loading.value = false;
  isupload.value = false;
  chuangeiconCurrentFormat();
};

const uploadError = (error, file) => {
  audio.value = null;
  audioUrl.value = null;
  tableData.value = []; // 清空
  ElMessage.error('音频上传失败');
  CurrentFile.value = '';
  // console.error('上传失败:', error);
  loading.value = false;
  isupload.value = false;
  audiototalTime.value = 0;
  isuploading.value = false;

  chuangeiconCurrentFormat();
};

const updateAudioTime = (value) => {
  if (audio.value) {
    audio.value.currentTime = value;
    audioUrrentTimeSeconds.value = value;
    audioUrrentTime.value = value;
  }
};

const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};
const initaudio = async () => {
  audioUrl.value = tableData.value[0].url;
  if (!tableData.value[0].url) {
    return;
  }
  const { audiotemp, audioUrltemp, audioBlob } = await getAudios(tableData.value);
  if (!audiotemp.value) {
    tableData.value = [];
    return;
  }
  audioHistory.value = audiotemp.value;
  audioUrlHistroy.value = audioUrltemp.value;
  audioHistoryBlob.value = audioBlob.value;
  //audioUrl.value = audioUrlHistroy.value[0];
  audio.value = audiotemp.value;
  audiototalTime.value = audiotemp.value?.duration;
  await countAudioTime(audiotemp.value);
  let i = 0;
  audio.value.currentTime = 0;
  //如果还是nan重新获取一次
  if (i == 0 && (isNaN(audiototalTime.value) || audiototalTime.value == Infinity)) {
    initaudio();
    i++;
  }
};
const countAudioTime = async (fnaudio) => {
  if (fnaudio) {
    if (isNaN(fnaudio.duration) || fnaudio.duration === Infinity) {
      while (isNaN(fnaudio.duration) || fnaudio.duration === Infinity) {
        await new Promise((resolve) => setTimeout(resolve, 50));
        // 设置随机播放时间，模拟调进度条
        fnaudio.currentTime = 10000000 * Math.random();
      }
      fnaudio.currentTime = 0;
      audiototalTime.value = fnaudio?.duration;
    }
  }
};
const setTableData = async () => {
  tableData.value = await getHistyAudio();
  audioUrl.value = tableData.value[0]?.url;
  deleteId.value = tableData.value[0]?.id;
  if (tableData.value.length > 0) {
    // downloadFile(historyAudios.value[0].url,historyAudios.value[0].filename) '
    initaudio();
  }
};
const changeTextOnClick = (row) => {
  if (row.texts_jason && row.texts_with_timecoppy) {
    texts_with_timecoppy.value = row.texts_with_timecoppy;
    texts_jason.value = row.texts_jason;
  }
};
const CurrentDeleteFileName = ref();
const changeDeleteFile = (item) => {
  CurrentDeleteFileName.value = item.row.filename;
};
const copyText = (tabPane) => {
  let content = '';
  if (tabPane == 1) {
    content = Texts.value?.replace(/。/g, '。\n');
    if (OutputFormat.value == '详细') {
      content = Texts_with_time.value;
    }
  } else {
    content = texts_jason.value?.map((item) => JSON.stringify(item)).join('\n');
  }
  if (!content) {
    ElMessage.warning('没有可复制的内容');
    return;
  }
  copyToClipboard({
    content,
    success() {
      ElMessage({
        message: '复制成功',
        type: 'success',
      });
    },
    error() {
      ElMessage({
        message: '复制失败',
        type: 'error',
      });
    },
  });
};
import recordingJson from '@/assets/recording.json';
import Lottie from '@/components/Lottie/Lottie.vue';
const recordingOptions = {
  animationData: recordingJson,
};
const recordingStyles = {
  width: '50px',
  height: '30px',
};
const isSseLoading = ref(false);
const sseAsr = (audio, format, apikey, language, fileName) => {
  const formData = ref({});
  formData.value.audio = audio;
  formData.value.format = format;
  formData.value.apikey = apikey;
  formData.value.language = language;
  formData.value.filename = fileName;
  streamContent.value = '';
  isSseLoading.value = true;
  fetch(`/api/gateway/asr/sse?model=${currentSelectModel.value}`, {
    body: JSON.stringify(formData.value),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: headRef.value.currentSelectApikey,
    },
  }).then((response) => {
    const reader = response.body.getReader();
    isSseLoading.value = false;
    function readNext() {
      return reader.read().then(({ done, value }) => {
        if (done) {
          return;
        }
        const text = new TextDecoder('utf-8').decode(value);
        const lines = text.split('\n');
        lines.forEach((line) => {
          if (line.trim()) {
            if (line === 'event: asr') {
              return;
            }
            if (line.startsWith('data:')) {
              line = line.substring(5);
            }
            if (line == 'end') {
              return;
            }
            try {
              const jsonObj = JSON.parse(line);
              if (Object.keys(jsonObj).length == 0) {
                return;
              }

              streamContent.value += jsonObj.text;
            } catch (error) {
              console.error('JSON parse error:', error);
            }
          }
        });
        readNext();
      });
    }
    readNext();
  });
};
watch(
  () => headRef.value?.selectedItemLabel,
  (newValue) => {
    if (newValue) {
      currentSelectModel.value = headRef.value?.selectedItemLabel?.model;
    }
  },
);
//onbeforeMount
onMounted(async () => {
  setTableData();

  currentSelectModel.value = headRef.value?.selectedItemLabel?.model;
});

defineOptions({
  name: 'VoiceToText',
});
</script>

<style lang="scss" scoped>
$background-color: rgb(255, 255, 255);
$text-color: rgb(92, 92, 210);
$padding: 20px;

// * {
//   zoom: 0.96;
// }

:root {
  font-size: 13px;
}
@media screen and (max-width: 1200px) {
  :root {
    font-size: 13px;
  }
}

@media screen and (max-width: 900px) {
  :root {
    font-size: 10px;
  }
}

@media screen and (max-width: 600px) {
  :root {
    font-size: 5px;
  }
}

::v-deep.el-loading-spinner .circular {
  margin-top: 130px !important;
}
.example-showcase .el-loading-mask {
  z-index: 9;
}

::v-depp .el-main {
  overflow: hidden !important;
}
::v-depp .el-header {
  overflow: hidden !important;
}

::v-deep .el-popper.is-light {
  padding: 0 !important;
  gap: 5px !important;
}

::v-deep .el-tabs--border-card {
  border: none !important;
  // box-sizing: none !important;
}
::v-deep .el-tabs__nav-scroll {
  border: none !important;
  // box-sizing: none !important;
}

::v-deep.el-table .cell {
  word-break: break-all;
  line-height: 20px !important;
  padding: 0 12px;
  white-space: nowrap !important;
  width: fit-content !important;
}
::v-deep .el-button + .el-button {
  margin-left: 0px;
}
::v-deep .el-upload-dragger .el-upload__text em {
  color: #016fa0;
  font-size: 16px;
}

::v-deep .el-tabs--border-card > .el-tabs__header {
  background-color: #fff;
  border-bottom: none;
}

::v-deep .el-slider {
  --el-slider-main-bg-color: #1190fb;
  .el-slider__bar {
    background: linear-gradient(to right, #a3f2f9, #1190fb);
  }
}
::v-deep.el-table .cell {
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}
::v-deep .el-message-box__header {
  background-color: #d7d7d7;
}
::v-deep .el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
  color: #333 !important;
  // background-color: var(--el-bg-color-overlay);
  border-right-color: white !important;
  border-left-color: white !important;
  //font-weight: bold !important;
  border-bottom: 2px solid #131b21 !important;
}

::v-deep .el-tabs--top.el-tabs--border-card > .el-tabs__header .el-tabs__item:last-child {
  font-weight: bold !important;
  color: #333 !important;
}

::v-deep .el-tabs--border-card > .el-tabs__header .el-tabs__item:first-child {
  font-weight: bold !important;
  color: #333 !important;
}

.popover_icon {
  color: #ff7d00;
  margin-right: 10px;
}
.popover_btn {
  display: flex;
  justify-content: end;
  gap: 5px;
  .popover_btn1 {
    background-color: #fff;
    color: #333333;
    font-size: 14px;
  }
  .popover_btn1:hover {
    background: #f0f3f9;
    border: 1px solid #d2d6da;
  }
  .popover_btn2 {
    background-color: #000000;
    border: 1px solid #d2d6da;
    color: #fff;
    font-size: 14px;
  }
  .popover_btn2:hover {
    border: 1px solid #000000;
    background: #f0f3f9;
    color: #333;
  }
}

.box_recordertex {
  display: flex;
  flex-direction: column;
  align-items: center;
  .recording {
    margin-top: -7px;
    display: flex;
  }
}

.model_div {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 88%;
  height: 85%;
  margin: 0 auto;
  border-radius: 5px;
  border: 1px solid rgba(252, 219, 221, 1);
  background-color: rgb(255 255 255);
}
.model_div:hover {
  background-color: #f0f1f3;
}
.button {
  width: calc(100vw * 80 / 1920);
  height: calc(100vw * 30 / 1920);
  font-size: calc(100vw * 13 / 1920);
  color: #333;
}
.common-layout {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  overflow: auto;

  height: 100%;
  // background-color: #f0f3f9;
  // background-image: url('../../../public//image/');
  padding: 10px;
  padding-top: 0px;
  // border-radius: 20px;
  .header {
    min-height: 90px;
  }
}

.text_area {
  flex: 5;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 0;
  border-radius: 10px;
  overflow: auto;
  background-color: rgb(255, 255, 255);
  .audio_file {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0px 10px 10px 10px;
    align-items: center;
    .audio_file_main {
      flex: 8;
      width: 100%;
      border: 2px solid #91c6de;
      padding: 0px 10px;
      border-radius: 10px;
      overflow-y: auto;
      .audio_file_main_top {
        width: 100%;
        height: 100%;
        .demo-tabs {
          display: block;
          width: 100%;
          height: 100%;
          .demo-pane {
            border: none;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            width: fit-content;
            width: 100%;
            height: 100%;
            .text_area1 {
              display: flex;
              width: 100%;
              height: 100%;
              overflow: auto !important;
              flex-wrap: wrap;
              align-content: flex-start;
            }
            .text_area2 {
              display: inline-block;
              height: 100%;
              width: auto;
            }
            .stream-out {
              display: flex;
              width: 100%;
              height: 100%;
              overflow: auto !important;
              flex-wrap: wrap;
              align-content: flex-start;
            }
          }
        }
      }
    }

    .audio_files_top {
      display: inline-flex;
      width: 100%;
      flex: 2;
      min-height: 90px;
      .audio_files_top_right {
        position: relative;
        display: block;
        height: 100%;
        width: 60%;
        min-width: 40%;

        .audio_top_right_area2_icon2 {
          padding-right: 4%;
          cursor: pointer;
        }
        .audio_top_right_area2 {
          display: inline-flex;
          width: 100%;
          height: 50%;
          align-items: center;
          .audio_top_right_area2_text {
            display: inline-flex;
            text-align: center;
            align-content: center;
            height: 100%;
            width: 20%;

            .audio_files_top_left_text1 {
              white-space: nowrap;
              overflow: hidden;
              text-align: center;
              margin-left: 1px;
              color: #333;
              font-size: 15px;
            }
            .audio_files_top_left_text12 {
              display: flex;
              white-space: nowrap;
              overflow: auto;
              text-align: center;
              margin-left: 1px;
              color: #333;
              font-size: 15px;
            }
          }
          .audio_top_right_area2_icon1 {
            width: 30px;
            align-items: center;
            align-content: center;
          }
        }
        .audio_top_right_area1 {
          padding-right: 4%;
          height: 50%;
          align-content: center;
          background-color: rgb(255, 255, 255);
          .audio_top_right_area1_progress {
            width: 100%;
          }
        }
      }
      .audio_files_top_left {
        display: block;
        height: 100%;
        width: 40%;
        position: relative;

        overflow: hidden;
        .audio_files_top_left_text {
          display: inline-flex;
          height: 50%;
          max-height: 50%;
          min-height: 50%;
          width: 98%;
          gap: 2px;
          padding-top: 0px;
          margin-top: 0px;
          overflow: hidden;
          .audio_files_top_left_text1 {
            white-space: nowrap;
            overflow: hidden;
            text-align: center;
            margin-left: 1px;
            color: #333;
            font-size: 15px;
          }
          .audio_files_top_left_text12 {
            display: flex;
            white-space: nowrap;
            overflow: auto;
            text-align: center;
            margin-left: 1px;
            color: #333;
            font-size: 15px;
          }

          .audio_files_top_left_text1 {
            padding-left: 8px;
            color: #333;
          }
        }
        .audio_top_right_area2_icon3 {
          // display: inline-flex;
          display: flex;
          padding: 10px;
          gap: 10px;
          padding-right: 50px;
        }
        .audio_files_top_left_text2 {
          display: inline-flex;
          height: 50%;
          width: 98%;
          min-height: 50%;
          gap: 15px;
          justify-content: flex-start;
          align-items: center;
          overflow: hidden;

          .audio_files_top_left_text2_tips1 {
            height: 100%;
            display: flex;
            align-content: center;
            overflow: hidden;

            .audio_files_top_left_text1 {
              white-space: nowrap;
              overflow: hidden;
              text-align: center;
              margin-left: 1px;
              color: #333;
              font-size: 15px;
            }
            .audio_files_top_left_text12 {
              display: flex;
              white-space: nowrap;
              overflow: auto;
              text-align: center;
              margin-left: 1px;
              color: #333;
              font-size: 15px;
            }
            .audio_files_top_left_text1 {
              padding-left: 8px;
              color: #333;
            }
          }
        }
      }
    }
  }
}

.box_output {
  display: flex;
  flex-wrap: wrap;
  background-color: white;
  border-radius: 10px;
  padding: 10px;
  height: 90%;
  width: 15%;
  overflow: hidden;
  //border: 1px solid #f75a5a;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 0;
  .output_span {
    //border: 1px solid #f75a5a;
    height: 30%;
    width: 100%;
    margin-top: 5%;
    padding-left: 3%;
    display: inline-flex;
  }
  .output_button {
    //border: 1px solid #f75a5a;
    height: 48%;
    width: 100%;
    display: inline-flex;
    margin-top: 1%;
    padding-left: 3%;
    column-gap: 20px;
    //margin-top: 10px;
    position: relative; /* 允许子元素相对于此容器定位 */
    overflow: hidden;
    .output_button1 {
      border: 1px solid rgba(224, 144, 128, 0.5);
    }

    //border: 1px solid rgb(0, 0, 0);
  }
}

.box_input {
  display: block;
  background-color: white;
  border-radius: 10px;
  margin-top: 0px;
  padding: 0px 10px 0px 10px;
  height: 90%;
  width: 45%;
  overflow: hidden;
  //border:1px solid rgba(224, 144, 128, 0.5);
  //overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  .box_input_span {
    font-size: 12px;
    // overflow: hidden;
    width: 100%;
    height: 30%;
    margin-left: 5px;
    margin-top: 1.5%;
    //padding-top:1%;
    //border:1px solid rgba(219, 86, 60, 0.5);
    //padding-top: 5px;
  }

  .box_input_button {
    height: 48%;
    flex-direction: row;
    display: inline-flex;
    align-items: center;
    gap: 20px;
    width: 100%;
    width: fit-content;
    margin-bottom: 0px;
    padding-top: 0px;
    margin-top: 0.5%;
    position: relative;

    //border:1px solid rgba(19, 16, 15, 0.5);
    .simple_tottom {
      height: 100%;
      flex-direction: row;
      display: inline-flex;
      align-items: center;
      display: flex;
      column-gap: 20px;
      width: 71.43%;
      width: fit-content;
      margin-bottom: 0px;
      padding-top: 0px;
    }
  }
}

.light-text {
  color: rgba(0, 0, 0, 0.5);
}

.el-upload__tip {
  text-align: center;
  align-items: center;
  font-size: 14px;
  padding-top: 7px;
}
.el-upload__text {
  font-size: 16px;
}

.box_main1 {
  display: flex;
  width: 100%;
  flex: 3;
  gap: 10px;

  .recording-img {
    background-image: url('/image/record.png');
    background-size: 100% 40%;
    background-position-y: bottom;
    background-repeat: no-repeat;
  }

  .box {
    display: flex;
    user-select: none;
    cursor: pointer;
    box-shadow: 0px 0px 5px rgb(0, 0, 0, 0.15);
    height: 100%;
    border-radius: 10px;
    justify-content: center;
    background: #fff;
    align-items: center;
    flex: 3.3;

    .upload-demo {
      width: 100%;
      height: 100%;
      :deep(.el-upload) {
        height: 100%;
      }
      :deep(.el-upload-dragger) {
        height: 100%;
        align-content: center;
        display: flex;
        gap: 20px;
        padding: 0px;
        padding-bottom: 5%;
        padding-top: 15%;
        flex-direction: column;
        font-size: 15px;
        z-index: 999;
        border: none;
        border-radius: 10px;
        background-image: url('/image/uploadfile.png');
        background-size: 100% 40%;
        background-position-y: bottom;
        background-repeat: no-repeat;
      }
    }
    .record-contain {
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 15%;
      gap: 20px;
      border-radius: 10px;
    }
    .box_div1 {
      text-align: center;
      font-size: 16px;
      color: #016fa0;
      margin-top: -4px;
    }
    .el-recorde-tip {
      display: flex;
      width: 100%;
      height: 20px;
      max-height: 20%;
      margin-bottom: 10px;
      //border: 1px solid #333;
      .mx-3 {
        width: 100%;
        height: 100%;
        color: rgba(0, 0, 0);
        text-align: center;
        align-items: center;
        font-size: 1vmax;
      }
    }
    &:hover {
      //background-color: lighten($background-color, 10%);
      //transform: scale(1.02);
      box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.2);
      transition: transform 0.3s, box-shadow 0.3s;
    }
  }
}
.content-container {
  width: 98%;
  height: 98%;
  //border: 1px solid rgb(11, 224, 7);
  padding: 16px;
  box-sizing: border-box;
}

.text-item {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.separator {
  width: 98%;
  height: 1px;
  background-color: black;
  margin: 0px;
  padding: 0px;
}

// table {
//   width: auto;
// }

// el-table-column {
//   flex: 1;
// }

.dropdown {
  border: 1px solid #ccc;
  padding: 10px;
  position: absolute;
  background: white;
  width: 18.35%;
  margin-left: 18px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 10;

  .dropdown-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .box {
    border: 1px solid #ddd;
    margin: 5px 0;
    padding: 5px;
    cursor: pointer; // 鼠标悬停时显示为手型

    &:hover {
      background-color: #f0f0f0; // 悬停时改变背景色
    }

    .bottom {
      text-align: center;
      display: block;
    }
  }
}

.box_audios {
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  overflow-x: hidden;
  height: 100%;
  flex: 3.2;
  background-color: rgb(255, 255, 255);
  border-radius: 10px;
  transition: box-shadow 0.3s ease;
  box-shadow: 0px 0px 5px rgb(0, 0, 0, 0.15);
  justify-content: center;
  align-items: center;
  &:hover {
    box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.2);
    transition: box-shadow 0.3s;
  }
  .audio-list-top {
    display: flex;
    width: 100%;
    padding: 10px;
    background: linear-gradient(to bottom right, rgb(145, 198, 222, 0.3), #fff);
  }

  .box_icon2 {
    display: flex;
    flex: 1;
    margin-top: 4px;
    padding: 5px;
    padding-left: 3px;
    height: 15%;
    width: 100%;
    justify-content: flex-start;
    align-items: flex-start;

    .box_icon2_text {
      padding-top: 0px;
      margin-top: 0px;
      margin-bottom: 12px;

      padding-left: 3px;
      color: #333;
      font-style: normal;

      align-items: flex-start;
    }
  }
  .audio_files {
    width: 100%;

    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    .audio_files_table {
      overflow: auto;
      display: flex;
      width: 100%;
      height: 100%;
      display: inline;
      border-bottom-color: red;
      .recording_runtime_status {
        width: 100%;
        // padding-top: 3px;
        min-height: 18px;
        display: flex;
        align-items: center;
        .recording_runtime_status_icon {
          height: 100%;
          width: 100%;
          justify-content: center;
          align-content: center;
          padding-top: 3px;
        }
      }
      .audio_files_buttons {
        height: 25px;
      }
    }
    :deep(.el-table__row) {
      // edf1f4
      border-color: #edf1f4 !important;
    }
  }
  .audio_files_clean {
    background: linear-gradient(to right, #fff 0%, rgb(145, 198, 222, 0.3) 50%, #fff 100%);

    padding: 10px;
    width: 100%;
    align-content: center;
    .all-delete {
      cursor: pointer;
      user-select: none;
    }
    .all-delete:hover {
      color: #409eff;
    }
  }
}

::v-deep .el-table__cell .cell {
  max-width: 100%;
}
::v-deep .el-tabs__content {
  height: calc(100% - 40px);
  overflow: auto;
}
.deleteDialog {
  position: absolute;
  z-index: 99;
  background-color: #fff;
  border: 1px solid #d6d7ef;
  padding: 8px;
  border-radius: 3px;
  padding-left: 15px;
  width: 200px;
}
::v-deep .el-table__body tr.current-row > td {
  background: #f5f6f7 !important;
}
::v-deep .el-tabs--border-card > .el-tabs__header .el-tabs__item {
  color: #333 !important;
  font-weight: bold !important;
}
</style>
