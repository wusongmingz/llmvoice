import { APIRequest } from '@/utils/request';

export interface keyTextConvertAduio {
  duration: number;
  desc: string;
  user_id: string;
  creativity: number;
}

export function getTextConvertAduio(data: keyTextConvertAduio, model: string, signal: any) {
  return APIRequest<any>({
    url: '/gateway/tta',
    method: 'POST',
    data,
    signal: signal,
    params: { model: model },
  });
}
export interface keySoundHistortList {
  user_id: string;
  desc: string;
}

export function getAiSoundHistoryList(data: keySoundHistortList) {
  return APIRequest<any>({
    url: '/gateway/tta_history_list',
    method: 'POST',
    data,
  });
}

export interface keyDeleteHistory {
  user_id: string;
  desc: string;
}

export function deleteSoundHistory(data: keyDeleteHistory) {
  return APIRequest<any>({
    url: '/gateway/tta_delete',
    method: 'POST',
    data,
  });
}
export interface getModelListsKey {
  model_type: string;
}
export interface getModelLanguagesKey {
  model_id: number;
}

export function getModelLists(params: getModelListsKey) {
  return APIRequest<any>({
    url: '/gateway/common/models',
    method: 'GET',
    params,
  });
}
export function getModelLanguages(params: getModelLanguagesKey) {
  return APIRequest<any>({
    url: '/gateway/common/langs',
    method: 'GET',
    params,
  });
}
