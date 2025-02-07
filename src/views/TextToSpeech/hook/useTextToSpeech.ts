import {
  getRoleList,
  keyGetRoleTList,
  getModelLists,
  deleteHistory,
  getModelLanguages,
  getGenerateAudio,
  getSelectOption,
  getHistoryList,
  getDefaultAduio,
  cancelGenerate,
} from '@/api/textToSpeech/textToSpeechApi';
import { ElMessage, ElMessageBox } from 'element-plus';
import { ref } from 'vue';
export const isGenerating = ref(false);
export const getModelRoleList = async (data: keyGetRoleTList) => {
  try {
    const res = await getRoleList(data);
    if (res.code === 0) {
      return res.data;
    }
  } finally {
    //
  }
};
export const getModelListsRes = async () => {
  try {
    const res = await getModelLists({ model_type: 'tts' });
    if (res.code === 0 || res.code === 200) {
      return res.data;
    }
  } finally {
    //
  }
};
export const getModelLanguagesRes = async (modelId: number) => {
  try {
    const res = await getModelLanguages({ model_id: modelId });
    if (res.code === 0 || res.code === 200) {
      return res.data;
    }
  } finally {
    //
  }
};
export const getAudio = async (formdata: any, model_name: string, signal: any) => {
  try {
    const res = await getGenerateAudio(formdata, { model: model_name }, signal);
    if (res.code === 0 || res.code === 200) {
      return res.data;
    }
    ElMessage.error(`生成失败,${res.msg}`);
    return 0;
  } catch {
    if (isGenerating.value) {
      ElMessageBox.confirm('非常抱歉，您的音频文件生成时间过长，已经超时，请减少文本内容重新生成', '提醒', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning',
      });
    }

    return 0;
  }
};
export const getdeleteHistoryRes = async (formdata: any) => {
  try {
    const res = await deleteHistory(formdata);

    if (res.code === 0 || res.code === 200) {
      ElMessage.success('删除成功');
      return res.data;
    }
    ElMessage.error('删除失败');
  } finally {
    //
  }
};
export const getSelectOptionRes = async (formdata: any) => {
  try {
    const res = await getSelectOption(formdata);
    if (res.code === 0 || res.code === 200) {
      return res.data;
    }
  } finally {
    //
  }
};
export const getHistoryDataRes = async (formdata: any) => {
  try {
    const res = await getHistoryList(formdata);
    if (res.code === 0 && res.data) {
      res.data.sort((a: any, b: any) => {
        // 获取每个 Datum 中 descData 数组的最大 create_time
        const maxCreateTimeA = Math.max(...a.descData.map((item: any) => item.create_time));
        const maxCreateTimeB = Math.max(...b.descData.map((item: any) => item.create_time));

        // 根据最大 create_time 进行降序排序
        return maxCreateTimeB - maxCreateTimeA;
      });
      return res.data;
    }
  } finally {
    //
  }
};
export const getDefaultAudioRes = async (data: any) => {
  try {
    const res = await getDefaultAduio(data);
    if (res.code === 0) {
      return res.data.audio_id;
    }
  } catch {
    //
  }
};
export const cancelGenerateAudio = async (data: any) => {
  try {
    const res = await cancelGenerate(data);
    if (res.code === 0) {
      if (res.success) {
        ElMessage.success('取消成功');
      } else {
        ElMessage.error(res.msg);
      }
      return;
    }
    ElMessage.error('取消失败');
    return;
  } catch {
    ElMessage.error('取消失败');
  }
};
