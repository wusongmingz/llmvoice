import {
  getTextConvertAduio,
  getAiSoundHistoryList,
  deleteSoundHistory,
  getModelLists,
  getModelLanguages,
} from '@/api/aiSoundGenerate/useSoundGenerate';
import { cancelGenerate } from '@/api/textToSpeech/textToSpeechApi';
import { ElMessage } from 'element-plus';
//

export const useSound = () => {
  const getGenerateAduio = async (formdata: any, model: string, signal: any) => {
    try {
      const res = await getTextConvertAduio(formdata, model, signal);
      if ((res.code === 0 || res.code === 200) && res.data) {
        return res;
      }
      ElMessage.error(`生成失败,${res.msg}`);
      return null;
    } catch {
      //
      return null;
    }
  };
  const getSoundHistoryList = async (formData: any) => {
    try {
      const res = await getAiSoundHistoryList(formData);
      if (res.code === 0 || res.code === 200) {
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
  const deleteHistoryListRes = async (formData: any) => {
    try {
      const res = await deleteSoundHistory(formData);
      if (res.code === 0 || res.code === 200) {
        ElMessage({
          message: '删除成功',
          type: 'success',
        });
        return res.data;
      }
      ElMessage.error(`删除失败,状态码${res.code}`);
    } finally {
      //
    }
  };
  const getModelListsRes = async () => {
    try {
      const res = await getModelLists({ model_type: 'tta' });
      if (res.code === 0 || res.code === 200) {
        return res.data;
      }
    } finally {
      //
    }
  };
  const getModelLanguagesRes = async (modelId: number) => {
    try {
      const res = await getModelLanguages({ model_id: modelId });
      if (res.code === 0 || res.code === 200) {
        return res.data;
      }
    } finally {
      //
    }
  };
  const downloadAudio = (uri: string) => {
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style.display = 'none';
    a.href = uri;
    a.click();
    document.body.removeChild(a);
  };
  const cancelGenerateAudio = async (data: any) => {
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

  return {
    getGenerateAduio,
    cancelGenerateAudio,
    getSoundHistoryList,
    deleteHistoryListRes,
    getModelListsRes,
    downloadAudio,
    getModelLanguagesRes,
  };
};
