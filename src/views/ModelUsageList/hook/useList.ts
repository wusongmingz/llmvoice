import { ref } from 'vue';
import {
  getUserList,
  deleteAudio,
  editAudio,
  deleteOrAddAudio,
  uploadAudio,
  getAudioInfo,
  setAudioDefault,
  getAvatarList,
  keyEditAudio,
  createSound,
  getCollection,
  Collection,
} from '@/api/ModelUsageList/ModelUsageList';
import { ElMessage } from 'element-plus';
interface RequestData {
  page: number;
  size: number;
  order_by: string;
  query_type: string;
  user_id: string;
}
export const useList = () => {
  const getTableList = async (data: RequestData) => {
    const res = await getUserList(data);
    if (res.code === 0) {
      const dataList = res.data.audios;
      return dataList;
    } else {
      ElMessage.error(res.msg || '网络错误');
    }
  };
  const getUploadAudioRes = async (audio: File) => {
    try {
      const res = await uploadAudio({ audio: audio });
      if (res.code === 0) {
        return res.data.url;
      } else {
        ElMessage.error('上传失败');
        return;
      }
    } catch (error) {
      // console.log(error);
      ElMessage.error('上传失败');
      return;
      //
    }
  };

  const getDeleteAudioRes = async (data: any) => {
    const res = await deleteAudio(data);
    if (res.code === 0) {
      ElMessage.success('删除成功');
      return;
    }
    ElMessage.error('删除失败');
  };
  const getEditAudioRes = async (data: keyEditAudio) => {
    const res = await editAudio(data);
    if (res.code === 0) {
      ElMessage.success('修改成功');
      return;
    }
    ElMessage.error('修改失败');
  };
  const getAudioInfoRes = async (data: any) => {
    const res = await getAudioInfo(data);
    if (res.code === 0) {
      return res.data;
    }
  };
  const getsetAudioDefaultRes = async (data: any) => {
    const res = await setAudioDefault(data);
    if (res.code === 0) {
      ElMessage.success('设置成功');
      return res.data;
    }
    ElMessage.error(`${res.msg || '网络错误'}`);
    return;
  };
  const getAvararListRes = async () => {
    try {
      const res = await getAvatarList();
      if (res.code === 0) {
        return res.data.avatars;
      }
    } catch {
      //
    }
  };
  const getCreateSoundRes = async (data: any) => {
    try {
      const res = await createSound(data);
      if (res.code === 0) {
        ElMessage.success('创建成功');
        return res.data;
      }
      ElMessage.error('创建失败');
      return;
    } catch {
      //
    }
  };
  const getCollectionList = async (data: any) => {
    const res = await getCollection(data);
    if (res.code === 0) {
      if (data.op === 1) {
        ElMessage.success('收藏成功');
      } else {
        ElMessage.success('取消收藏成功');
      }
      return;
    }
    ElMessage.error('收藏失败');
  };
  const getCollectionLists = async (data: any) => {
    const res = await getCollection(data);
    if (res.code === 0) {
      ElMessage.success('取消收藏');
      return;
    }
    ElMessage.error('执行失败');
  };

  const getdeleteOrAddAudioRes = async (data: any) => {
    try {
      const res = await deleteOrAddAudio(data);
      if (res.code === 0) {
        if (data.op === 1) {
          ElMessage.success('添加成功');
          return;
        }
        ElMessage.success('删除成功');
        return;
      }
      if (data.op === 1) {
        ElMessage.error('添加失败');
        return;
      }
      ElMessage.error('删除失败');
      return;
    } catch {
      //
    }
  };
  return {
    getTableList,
    getDeleteAudioRes,
    getEditAudioRes,
    getdeleteOrAddAudioRes,
    getUploadAudioRes,
    getAudioInfoRes,
    getsetAudioDefaultRes,
    getAvararListRes,
    getCreateSoundRes,
    getCollectionList,
    getCollectionLists,
  };
};
