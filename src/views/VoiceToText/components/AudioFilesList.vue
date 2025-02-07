<template>
  <div class="box_audios" name="tableData">
    <div class="box_2">
      <el-icon style="width: 98%; height: 15%; min-height: 15%; display: flex; justify-content: flex-start" size="25">
        <AIcon class="audio" icon="icon-yinpinwenjian" />
        <el-text class="box_icon2_text">音频文件</el-text>
      </el-icon>
      <!-- 50  250  50  150   -->
      <div class="audio_files">
        <el-table class="audio_files_table" :data="tableData" stripe :show-header="false" fit table-layout="fixed">
          <el-table-column width="50" align="left">
            <template #default="scope">
              <div class="recording_runtime_status" style="display: flex; justify-content: center; align-items: center">
                <el-icon v-if="(isupload || shaowRecordingIcon) && scope.$index === 0" class="recording_runtime_status_icon" size="17">
                  <AIcon class="audio" icon="icon-yunhangzhong" />
                </el-icon>
                <el-icon v-if="!shaowRecordingIcon && !isupload" class="recording_runtime_status_icon" size="17">
                  <AIcon class="audio" icon="icon-a-bianzu32x" />
                </el-icon>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="filename"
            :formatter="formatStringTable"
            align="left"
            width="300"
            label="filename"
            style="white-space: nowrap; font-size: 0.5vmax"
          />
          <!-- <el-table-column prop="id" label="id" /> -->
          <el-table-column style="display: flex" align="right">
            <template #default="scope">
              <div
                class="audio_files_buttons"
                v-if="scope.$index === 0"
                style="display: flex; gap: 5px; justify-content: center; align-items: center"
              >
                <el-icon style="outline: none" @click="rerunFile" size="20">
                  <el-tooltip class="box-item" effect="light " content="使用当前选项重新运行此文件" placement="top-start">
                    <AIcon style="outline: none" class="audio" icon="icon-zhongxinyunhang" />
                  </el-tooltip>
                </el-icon>
                <el-popover placement="bottom-end" :visible="isvisable" :width="200">
                  <p style="display: flex">
                    <el-icon size="20" class="popover_icon"> <AIcon icon="icon-gantanhao" /> </el-icon>是否确认删除？
                  </p>
                  <div class="popover_btn">
                    <el-button size="small" class="popover_btn1" @click="hiddenPopver()">取消</el-button>
                    <el-button size="small" class="popover_btn2" @click="deleteFirstFile()">确认</el-button>
                  </div>
                  <template #reference>
                    <el-icon style="outline: none" @click="isvisable = !isvisable" size="20">
                      <el-tooltip class="box-item" effect="light " content="删除音频文件" placement="top-end">
                        <AIcon style="outline: none" class="audio" icon="icon-shanchu" />
                      </el-tooltip>
                    </el-icon>
                  </template>
                </el-popover>
              </div>
            </template>
          </el-table-column>
        </el-table>
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
            <el-link :type="FilesClean" :underline="false" @click="isvisable2 = !isvisable2" @focus="toDanger" @blur="toDefault" target="_blank"
              >全部删除</el-link
            >
          </template>
        </el-popover>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onBeforeMount } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useVoice, getHistyAudio, getapikey, getAudios } from './hook/useVoice';
import { saveAs } from 'file-saver';
import { Loading, Delete, DocumentCopy, Check, Edit, Delete as ElDelete, DocumentCopy as ElDocumentCopy } from '@element-plus/icons-vue';

export default {
  name: 'AudioFilesList',
  setup() {
    const isupload = ref(false);
    const texts_with_timejson = ref();
    const texts_jason = ref();
    const isInputLanguage = ref();
    const isoutputFormat = ref();
    const rerunFilename = ref();
    const apikeyDataList = ref([]);
    const audioBase64 = ref();
    const recorderBase64 = ref();
    const inputlang = ref();
    const fileExtension = ref();
    const isvisable = ref(false);
    const isvisable2 = ref(false);
    const isTooshort = ref(false); // 是否太短
    const isPlaying = ref(false); // 是否正在播放
    const mediaRecorder = ref(null); // 媒体录制对象
    const audioChunks = ref([]); // 音频数据块
    const FilesClean = ref('default'); // 全部删除link type
    const CurrentFile = ref('  '); // 显示当前的文件名
    const InputLanguage = ref(''); // 输入语言的显示
    const InputFileFormat = ref(); // 输入文件格式类型的显示
    const OutputFormat = ref('简单'); // 输出格式的选则，简单，详细
    const loading = ref(false);
    const audioUrl = ref(); // 音频文件地址
    const audio = ref([null]);
    const audioUrrentTime = ref(0); // 当前播放时间
    const audiototalTime = ref(0); // 总时长
    const audioUrrentTimeSeconds = ref(0);
    const audiototalTimeSeconds = ref(0);
    const activeName = ref('first'); // 默认打开的tab
    const recordingTime = ref(0); // 录音时间
    const audioHistory = ref([]);
    const audioUrlHistroy = ref([]);
    const shaowRecordingIcon = ref(false); // 显示正在录音icon
    const showDefaultRecordingIcon = ref(true); // 显示开始录音icon
    const recordingIcon = ref(['icon-yuyinmaikefeng-tianchong', 'icon-luzhi_24']); // 录音icon
    const CurrentRecordingIcon = ref(recordingIcon.value[0]); // 当前录音icon
    const tableIcon1 = ref(['icon-moren', 'icon-yunhtableangzhong']); // table的录音状态icon
    const currentTableIcon1 = ref(tableIcon1.value[0]); // 当前正在录音的icon

    const { uploadFileVoiceToText, Texts, Texts_with_time } = useVoice();
    const { historyAudios, getallhistry } = getHistyAudio();
    const { apikeyList, getApiKeyList } = getapikey();
    const { audiotemp, audioUrltemp, getoneAydio } = getAudios();

    // Computed properties
    const disabledicon = computed(() => ({
      pointerEvents: shaowRecordingIcon.value ? 'none' : 'auto',
    }));
    const isDisabled = computed(() => {
      return isupload.value || shaowRecordingIcon.value;
    });
    const initaudio = async () => {
      audioUrl.value = tableData.value[0].url;
      await getoneAydio(tableData.value, tableData.value.length);
      audioHistory.value = audiotemp.value;
      audioUrlHistroy.value = audioUrltemp.value;
      //audioUrl.value = audioUrlHistroy.value[0];
      audio.value = audioHistory.value[0];
    };

    const tabledatainit = () => {
      if (audioHistory.value.length > 0) {
        audioHistory.value = audioHistory.value.shift();
        audioUrlHistroy.value = audioUrlHistroy.value.shift();
        audioUrl.value = audioUrlHistroy.value[0];
        audio.value = audioHistory.value[0];
      }
    };

    const gotomathch = async (srtText) => {
      const pattern = /(\d+)\n(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})\n(.*?)(?=\n\d+|\n$)/gs;
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
        const pattern = /(\d{2}):(\d{2}):(\d{2}),(\d{3})/;
        const match = pattern.exec(timeString);
        const hours = parseInt(match[1], 10);
        const minutes = parseInt(match[2], 10);
        const seconds = parseInt(match[3], 10);
        const milliseconds = parseInt(match[4], 10);
        const totalSeconds = hours * 3600 + minutes * 60 + seconds + milliseconds / 1000;
        return totalSeconds;
      };
      textsStartTime.value = temp.map((item) => ({ startTime: timeToSeconds(item.startTime), endTime: timeToSeconds(item.endTime) }));
      texts_with_timecoppy.value.forEach((item) => {
        item.startTime = secondsToTime(timeToSeconds(item.startTime));
        item.endTime = secondsToTime(timeToSeconds(item.endTime));
      });
      texts_with_timejson.value = JSON.stringify(texts_with_timecoppy.value, null, 2);
      texts_jason.value = JSON.parse(texts_with_timejson.value);
      // console.log(texts_with_timejson.value);
      // console.log(texts_jason.value);
    };

    const daochu = () => {
      if (tabPane.value === 1) {
        const datetime = new Date().toLocaleString();
        const blob = new Blob([texts.value.join('\n')], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, datetime + '.txt');
      } else {
        const datetime = new Date().toLocaleString();
        const blob = new Blob([texts_jason.value.join('\n')], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, datetime + '.txt');
      }
      if (texts.value.length > 0) {
        if (tabPane.value === 1 && OutputFormat.value === '简单') {
          const datetime = new Date().toLocaleString();
          const blob = new Blob([texts.value.join('\n')], { type: 'text/plain;charset=utf-8' });
          saveAs(blob, datetime + '.txt');
        }
      }
    };

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
      const parts = str.split('.');
      const fileExtension = parts.pop();
      const fileName = parts.join('.');
      if (str.length > 40) {
        return `${fileName.slice(0, 20)}...${fileExtension}`;
      }
      return str;
    };

    const formatStringTable = (row) => {
      const parts = row.filename.split('.');
      const fileExtension = parts.pop();
      const fileName = parts.join('.');
      if (row.filename.length > 40) {
        return `${fileName.slice(0, 20)}...${fileExtension}`;
      }
      return row.filename;
    };

    let index = 1;
    const rerunFile = async () => {
      loading.value = true;
      ElMessage('正在重新运行，请稍后');
      if (index === 1) {
        rerunFilename.value = CurrentFile.value;
      }
      if (recorderBase64.value) {
        await uploadFileVoiceToText(recorderBase64.value, 'webm', apikeyDataList.value[0].apiKey, inputlang.value);
        texts.value[0] = Texts.value;
        texts_with_time.value[0] = Texts_with_time.value;
        await gotomathch(Texts_with_time.value);
      } else if (audioBase64.value) {
        uploadFileVoiceToText(audioBase64.value, fileExtension.value, apikeyDataList.value[0].apiKey, inputlang.value);
        texts.value[0] = Texts.value;
        texts_with_time.value[0] = Texts_with_time.value;
        await gotomathch(Texts_with_time.value);
      } else {
        // uploadAudio();
      }
      CurrentFile.value = `${rerunFilename.value}(${index})`;
      index++;
      tableData.value.push({
        filename: CurrentFile.value,
      });
      ElMessage.success('重新运行成功');
      loading.value = false;
    };

    const toDefault = () => {
      FilesClean.value = 'default';
    };

    const toDanger = () => {
      FilesClean.value = 'danger';
    };

    const deleteFirstFile = () => {
      if (tableData.value.length > 0) {
        if (tableData.value.length === 1) {
          if (recorderBase64.value) {
            recorderBase64.value = '';
          }
          index = 1;
        }
        tableData.value.splice(0, 1);
        audioUrrentTime.value = 0;
        audiototalTime.value = 0;
        audioUrrentTimeSeconds.value = 0;
        audiototalTimeSeconds.value = 0;
        CurrentFile.value = '';
        InputFileFormat.value = '';
        tabledatainit();
        if (isPlaying.value) {
          pauseAudio();
          changeCurrentstatus();
        }
        isvisable.value = false;
        ElMessage.error('文件已删除');
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
        audio.value = null;
        audioUrrentTime.value = 0;
        audiototalTime.value = 0;
        audioUrrentTimeSeconds.value = 0;
        audioHistory.value = [];
        audioUrlHistroy.value = [];
        audioBase64.value = '';
        recorderBase64.value = '';
        if (isPlaying.value) {
          pauseAudio();
          changeCurrentstatus();
        }
        isvisable.value = false;
        isvisable2.value = false;
        ElMessage.error('全部文件已删除');
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

    const startRecording = async () => {
      ElMessage.info('开始录制音频');
      audioUrrentTimeSeconds.value = 0;
      audioUrrentTime.value = 0;
      CurrentFile.value = new Date().toLocaleString() + '.webm';
      InputFileFormat.value = '.webm';
      tableData.value = [];
      tableData.value.unshift({
        filename: CurrentFile.value,
      });
      loading.value = true;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioChunks.value = [];
        mediaRecorder.value = new MediaRecorder(stream);
        // 启动录音
        InputLanguage.value = '麦克风录制';
        audioUrrentTimeSeconds.value = 0;
        audioUrrentTime.value = 0;
        audiototalTime.value = 0;
        audiototalTimeSeconds.value = 0;
        recorderBase64.value = '';
        const start = await mediaRecorder.value.start();
        const startTime = new Date();
        mediaRecorder.value.ondataavailable = (event) => {
          audioChunks.value.push(event.data);
        };
        mediaRecorder.value.onstop = async () => {
          const endTime = new Date();
          const temptime = (endTime - startTime) / 1000 - 0.12;
          if (temptime < 1) {
            isTooshort.value = true;
            return;
          }
          recordingTime.value = temptime;
          const audioBlob = new Blob(audioChunks.value, { type: 'audio/webm' });
          blobToBase64(audioBlob)
            .then((base64Data) => {
              recorderBase64.value = base64Data;
              if (recorderBase64.value.startsWith('data:audio/webm;base64,')) {
                recorderBase64.value = recorderBase64.value.replace('data:audio/webm;base64,', '');
              }
              try {
                const pppp = async () => {
                  const uploadResult = await uploadFileVoiceToText(recorderBase64.value, 'webm', apikeyDataList.value[0].apiKey, inputlang.value);
                  texts.value[0] = Texts.value;
                  texts_with_time.value[0] = Texts_with_time.value;
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
              console.error('语音转文本出现问题:', error);
            });
          audioUrl.value = URL.createObjectURL(audioBlob);
          audio.value = new Audio(audioUrl.value);
          audio.value.onloadedmetadata = () => {
            audiototalTime.value = recordingTime.value;
          };
        };
      } catch (error) {
        ElMessage.error('录音失败');
        alert('请允许使用麦克风');
        loading.value = false;
      }
    };

    const stopRecording = () => {
      if (mediaRecorder.value) {
        mediaRecorder.value.stop();
        mediaRecorder.value.stream.getTracks().forEach((track) => track.stop());
        if (isTooshort.value) {
          ElMessage.warning('录音时间太短，请重新录音');
          tableData.value = [];
          loading.value = false;
          CurrentFile.value = '';
          InputFileFormat.value = '';
          isTooshort.value = false;
        } else {
          ElMessage.success('录音已结束');
        }
      }
    };

    const changeplayingStatus = () => {
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
        audio.value.play();
        const interval = setInterval(() => {
          audioUrrentTimeSeconds.value = audio.value.currentTime;
          audioUrrentTime.value = audio.value.currentTime;
          if (audio.value.ended) {
            clearInterval(interval);
            pauseAudio();
            changeCurrentstatus();
            isPlaying.value = false;
            audioUrrentTimeSeconds.value = 0;
            audioUrrentTime.value = 0;
          }
        }, 10);
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
      if (!InputLanguage.value) {
        try {
          await ElMessageBox.confirm('您确上传音频文件前请先选择音频的语言', '提示', {
            confirmButtonText: '确定',
            type: 'warning',
          });
          return false;
        } catch (error) {
          return false;
        }
      }
      const validTypes = ['audio/m4a', 'audio/wav', 'audio/mp3', 'application/octet-stream', 'audio/mpeg'];
      if (!validTypes.includes(file.type)) {
        ElMessage.error('请上传 MP3、WAV 或 M4A 格式的文件。');
        return false;
      }
      const maxSizeMB = 50;
      if (file.size > maxSizeMB * 1024 * 1024) {
        ElMessage.error(`上传的文件大小不能超过 ${maxSizeMB}MB。`);
        return false;
      }
      isupload.value = true;
      chuangeiconCurrentFormat();
      tableData.value = [];
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
      try {
        loading.value = true;
        const reader = new FileReader();
        fileExtension.value = data.file.name.split('.').pop().toLowerCase();
        InputFileFormat.value = '.' + fileExtension.value;
        return new Promise((resolve, reject) => {
          reader.onload = (e) => {
            if (e.target) {
              const audioObj = new Audio(String(e.target.result));
              audio.value = audioObj;
              audioBase64.value = e.target.result;
              if (audioBase64.value.startsWith('data:audio/wav;base64,')) {
                audioBase64.value = audioBase64.value.replace('data:audio/wav;base64,', '');
              } else if (audioBase64.value.startsWith('data:audio/mpeg;base64,')) {
                audioBase64.value = audioBase64.value.replace('data:audio/mpeg;base64,', '');
              }
              audioObj.src = String(e.target.result);
              audioObj.onloadedmetadata = () => {
                audiototalTime.value = audioObj.duration;
                CurrentFile.value = data.file.name;
                resolve(true);
              };
            }
          };
          reader.onerror = (error) => {
            console.error('FileReader error:', error);
            reject(false);
          };
          reader.readAsDataURL(data.file);
        }).then(async (result) => {
          if (result) {
            ElMessage.info('正在上传');
            try {
              await uploadFileVoiceToText(audioBase64.value, fileExtension.value, apikeyDataList.value[0].apiKey, inputlang.value);
            } catch {
              ElMessage('网络出了一点问题，稍等一下再试把');
            }
            texts.value[0] = Texts.value;
            texts_with_time.value[0] = Texts_with_time.value;
            await gotomathch(Texts_with_time.value);
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
      audioUrl.value = '';
      tableData.value = [];
      ElMessage.error('文件上传失败');
      console.error('上传失败:', error);
      loading.value = false;
      isupload.value = false;
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

    // 返回所有定义的变量和函数

    return {
      isupload,
      rerunFilename,
      apikeyDataList,
      audioBase64,
      recorderBase64,
      inputlang,
      fileExtension,
      isvisable,
      isvisable2,
      tableData,
      disabledicon,
      isDisabled,
      initaudio,
      tabledatainit,
      gotomathch,
      daochu,
      hiddenPopver,
      hiddenPopver2,
      sliderFormatTooltip,
      formatString,
      formatStringTable,
      rerunFile,
      toDefault,
      toDanger,
      deleteFirstFile,
      deleteAllFiles,
      blobToBase64,
      startRecording,
      stopRecording,
      changeplayingStatus,
      playAudio,
      pauseAudio,
      beforeUpload,
      upload,
      uploadSuccess,
      uploadError,
      updateAudioTime,
      formatTime,
    };
  },
};
</script>

<style lang="scss" scoped>
.box_audios {
  display: block;
  overflow-y: scroll;
  overflow-x: hidden;
  width: 33.3%;
  height: 100%;
  padding: 3px;
  background-color: rgb(255, 255, 255);
  border-radius: 10px;
  transition: box-shadow 0.3s ease;
  justify-content: center;
  align-items: center;

  .box_2 {
    display: block;
    height: 100%;
    width: 100%;
    padding: 0 0 3px 0;

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
      height: 70%;
      display: flex;
      flex: 1;
      justify-content: center;
      align-items: center;
      border-radius: 10px;
      .audio_files_table {
        display: flex;
        width: 100%;
        height: 100%;
        display: inline;
        border-bottom-color: red;
        .recording_runtime_status {
          height: 25px;
          width: 100%;
          padding-top: 3px;
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
          margin-left: 60px;
          margin-left: 60px;
        }
      }
    }
    .audio_files_clean {
      width: 100%;
      height: 15%;
      margin-left: 10px;
      align-content: flex-start;
      padding-top: 10px;
    }
  }
}

.popover_icon {
  color: #ff7d00;
  margin-right: 10px;
}
.popover_btn {
  display: flex;
  justify-content: end;
  .popover_btn1 {
    background-color: var(--layout-bg-color);
    color: #1d2129;
    font-size: 13px;
  }
  .popover_btn2 {
    background-color: var(--el-menu-active-bg-color);
    color: #fff;
    font-size: 13px;
  }
}
</style>
