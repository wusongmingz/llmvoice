import { IForm } from '@/components/AAUI';
import { computed, ref, watch } from 'vue';
import { ElMessage, FormRules } from 'element-plus';
import { addKey, editKey, deleteKey, getKeyList } from '@/api/APIManagement/management';
import { useUserStore } from '@/store/modules/user';

const userStore = useUserStore();
const userId = userStore.sysUser?.userID || '';

export const useEdit = () => {
  const editFormRef = ref();
  const isShowEditDialog = ref<boolean>(false);
  const editFormLoading = ref<boolean>(false);

  watch(isShowEditDialog, () => {
    editFormRef.value && editFormRef.value.resetFields();
  });
  const editFormList = computed(() => [
    {
      label: '*密钥名称',
      prop: 'keyName',
      type: 'input',
      option: { placeholder: '例如:"语言密钥"' },
    },
    {
      label: '选择功能',
      label2: '语音转文本',
      prop: 'asr',
      type: 'checkbox', // 改为checkbox类型
      status: false,

      option: { placeholder: '' },
    },
    {
      label: ' ',
      label2: '文本转语音',
      prop: 'tts',
      status: false,
      type: 'checkbox', // 改为checkbox类型
      option: { placeholder: '' },
    },
    {
      label: ' ',
      label2: 'AI音效',
      prop: 'tta',
      status: false,
      type: 'checkbox', // 改为checkbox类型
      option: { placeholder: '' },
    },
  ]);

  const key_textarea = ref<string>('aaaaaa');
  const isCreated = ref<boolean>(false);
  const editFormData = ref<any>({
    keyName: '',
    tokenQuota: '',
  });

  const editFormRules: FormRules = {
    keyName: [{ message: '请输入密钥名称' }],
    tokenQuota: [{ required: false }],
  };

  const addHandleSync = async () => {
    const keyName = editFormData.value.keyName;
    const abilities = Object.entries(editFormData.value)
      .filter(([key, value]) => value === true)
      .map(([key]) => key);
    try {
      const res = await addKey({ keyName: keyName, abilities: abilities });
      if (res.code === 0) {
        ElMessage.success('创建成功');
        // console.log(res.data.apiKey);
        const apiKey = res.data.apiKey;
        return apiKey;
      }
    } catch {
      //
      ElMessage.error('创建失败');
    }
  };

  const editHandleSync = async () => {
    const apiKey = editFormData.value.apiKey;
    const keyName = editFormData.value.keyName;
    const abilities = Object.entries(editFormData.value)
      .filter(([key, value]) => value === true)
      .map(([key]) => key);
    try {
      const res = await editKey({ keyName: keyName, abilities: abilities, apiKey: apiKey });
      if (res.code === 0) {
        ElMessage.success('修改成功');
      }
    } catch {
      //
      ElMessage.error('修改失败');
    }
    // return new Promise((resolve, reject) => {
    //   editKey({
    //     userId: userId,
    //     tokenQuota: editFormData.value.tokenQuota,
    //     keyName: editFormData.value.keyName,
    //     apiKey: editFormData.value.apiKey,
    //   }).then((res) => {
    //     if (res.code === 0 && res.success) {
    //       ElMessage.success('提交成功');
    //       resolve(res);
    //     } else {
    //       ElMessage.error(res.msg || '提交失败');
    //       reject(res);
    //     }
    //   });
    // });
  };

  const deleteHandleSync = async (apiKey: string) => {
    try {
      const res = await deleteKey({ apiKey });
      if (res.code === 0) {
        ElMessage.success('删除成功');
        return res.data;
      }
    } catch {
      //
      ElMessage.error('删除失败');
    }
  };

  return {
    editFormRef,
    editFormList,
    editFormData,
    editFormRules,
    isShowEditDialog,
    editFormLoading,
    addHandleSync,
    editHandleSync,
    deleteHandleSync,
    isCreated,
    key_textarea,
  };
};
