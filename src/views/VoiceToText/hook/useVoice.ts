import { oiceToText, getSppLanguage, getmodels, getHistry, getApiKey, deleteRecords } from '@/api/VoiceToText/VoiceToText';
import { clearEmptyFields } from '@/utils/utils';
import { display } from 'html2canvas/dist/types/css/property-descriptors/display';
import { ElMessage } from 'element-plus';
import { ref } from 'vue';
import { saveAs } from 'file-saver';
import { number } from 'echarts';
import { useUserStore } from '@/store/modules/user';
import axios from 'axios';
import { jsonp } from 'vue-jsonp';
import { de } from 'element-plus/es/locale';
import { duration } from 'html2canvas/dist/types/css/property-descriptors/duration';
export const useVoice = () => {
  const Texts = ref<string[]>();
  const Texts_with_time = ref<string[]>();
  const id = ref<number>();
  const uploadFileVoiceToText = async (s: string, audio: string, format: string, apikey: string, language: string, filename: string) => {
    try {
      const res = await oiceToText({
        s,
        audio,
        format,
        apikey,
        language,
        filename,
      });
      if (res.code === 0) {
        if (res.data) {
          Texts.value = res.data.text;
          Texts_with_time.value = res.data.text_with_time;
          id.value = res.data.id;
        } else {
          ElMessage.error('服务繁忙，请稍后');
        }
      } else {
        ElMessage.error(res.msg || '网络错误');
        throw new Error(res.msg || '网络错误');
      }
    } finally {
      //   tableLoading.value = false;
    }
  };
  return {
    uploadFileVoiceToText,
    Texts,
    Texts_with_time,
    id,
  };
};

export const languageList = () => {
  interface dataForm {
    display: string;
    lang: string;
  }

  const languageBtnlist = ref<dataForm[]>([]);
  const getLanguageList = async () => {
    try {
      const res = await getSppLanguage({
        model_id: 1,
      });
      if (res.code === 0) {
        if (res.data) {
          //console.log(res.data);
          languageBtnlist.value = res.data;
        } else {
          languageBtnlist.value = [];
        }
      } else {
        ElMessage.error(res.msg || '网络错误');
      }
    } finally {
      //   tableLoading.value = false;
    }
  };
  return {
    languageBtnlist,
    getLanguageList,
  };
};

export const getModels = () => {
  const models = ref<any>();
  const getallmodels = async (model: string) => {
    try {
      const res = await getmodels({
        model_type: model,
      });
      if (res.code === 0) {
        if (res.data) {
          //console.log(res.data);
          models.value = res.data;
        } else {
          models.value = '';
        }
      } else {
        ElMessage.error(res.msg || '网络错误');
      }
    } finally {
      //   tableLoading.value = false;
    }
  };
  return {
    models,
    getallmodels,
  };
};
export const deleteRecordsRes = async (params: any) => {
  try {
    const res = await deleteRecords(params);
    if (res.code === 0) {
      // ElMessage.success('删除成功');
      return 1;
    } else {
      ElMessage.error(res.msg || '网络错误');
      return 0;
    }
  } catch {
    //
    return 0;
  }
};
export const getHistyAudio = async () => {
  // interface dataForm {
  //   id: number;
  //   url: string;
  //   filename: string;
  //   create_time: number;
  // }

  // const historyAudios = ref<dataForm[]>([]);

  try {
    const res = await getHistry();
    if (res.code === 0 && res.data) {
      return res.data;
    }
    ElMessage.error(res.msg || '网络错误');
    return;
  } finally {
    //   tableLoading.value = false;
  }
};

export const getapikey = () => {
  interface dataForm {
    apiKey: string;
    keyName: string;
    abilities: Array<string>;
    tokenUsage: object;
  }
  const apikeyList = ref<dataForm[]>([]);
  const getApiKeyList = async () => {
    try {
      const userStore = useUserStore();
      const usersID = userStore.sysUser?.userID || '';
      const res = await getApiKey({
        userId: usersID,
      });
      if (res.code === 0) {
        if (res.data) {
          apikeyList.value = res.data;
        } else {
          apikeyList.value = [];
        }
      } else {
        ElMessage.error(res.msg || '网络错误');
      }
    } finally {
      //   tableLoading.value = false;
    }
  };
  return {
    apikeyList,
    getApiKeyList,
  };
};
export const getAudios = async (theUrl: any) => {
  const audiotemp = ref<HTMLAudioElement | null>(null); // 定义为null，确保类型安全
  const audioUrltemp = ref<string | undefined>(undefined); // 同样考虑类型安全
  const audioBlob = ref<Blob | undefined>(undefined); // 可能为undefined

  const loadAudio = async () => {
    try {
      const response = await fetch(theUrl[0].url);

      if (!response.ok) throw new Error('获取历史音频失败');

      const buffer = await response.arrayBuffer();
      const type = 'audio/*';
      const blob = new Blob([buffer], { type });

      audioBlob.value = blob;
      audioUrltemp.value = URL.createObjectURL(blob);

      // 创建音频对象，并且等待音频的元数据加载完成
      audiotemp.value = new Audio(audioUrltemp.value);
      // 等待音频的元数据加载完成
      return new Promise<void>((resolve, reject) => {
        if (audiotemp.value) {
          audiotemp.value.onloadedmetadata = () => {
            // 确保在元数据加载完成后处理音频
            resolve();
          };
          audiotemp.value.onerror = (error) => {
            reject(new Error('加载音频时出错'));
          };
        } else {
          reject(new Error('音频对象未初始化'));
        }
      });
    } catch (error: any) {
      ElMessage.error(`加载音频失败：${error.message}`);
    }
  };
  if (Number.isNaN(audiotemp.value?.duration)) {
    // audiotemp.value?.duration = 7;
  }
  await loadAudio();

  return {
    audiotemp,
    audioUrltemp,
    audioBlob,
  };
};
export const renderAudioGraph = (analyser: AnalyserNode, canvas: HTMLCanvasElement) => {
  //
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  analyser.getByteTimeDomainData(dataArray);
  const canvasCtx = canvas?.getContext('2d');
  const width = 300;
  const height = 200;
  if (!canvasCtx) return;
  canvasCtx.clearRect(0, 0, width, height);
  canvasCtx.fillStyle = 'white';
  canvasCtx.fillRect(0, 0, width, height);
  const barWidth = (width / bufferLength) * 20;
  let x = 0;

  canvasCtx.moveTo(x, height / 2);
  for (let i = 0; i < bufferLength; i += 10) {
    const barHeight = ((dataArray[i] / 256) * height) / 2 - height * 0.15;
    canvasCtx.fillStyle = '#3370FF';
    const adjustedBarHeight = Math.max(0, barHeight);
    canvasCtx.fillRect(x, height / 2 - adjustedBarHeight, barWidth, adjustedBarHeight);
    x += barWidth + 4;
  }
  x = 0;

  canvasCtx.translate(0, height);
  canvasCtx.scale(1, -1);

  canvasCtx.moveTo(x, height / 2);
  for (let i = 0; i < bufferLength; i += 10) {
    const barHeight = ((dataArray[i] / 256) * height) / 2 - height * 0.15;
    canvasCtx.fillStyle = '#3370FF';
    const adjustedBarHeight = Math.max(0, barHeight);
    canvasCtx.fillRect(x, height / 2 - adjustedBarHeight, barWidth, adjustedBarHeight);
    x += barWidth + 4;
  }
};
