import { APIRequest } from '@/utils/request';

export interface keyGetRoleTList {
  age?: string;
  lang?: string;
  sex?: number;
  style?: string;
  user_id: string;
}

export function getRoleList(data: keyGetRoleTList) {
  return APIRequest<any>({
    url: '/gateway/model_role_list',
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
export interface keygenerateAudio {
  desc: string;
  lang: string;
  model_id: number;
  ai_audio_id: number;
  speed: number;
  tone: number;
  user_id: string;
  style: Array<string>;
}
export function getGenerateAudio(data: keygenerateAudio, params: { model: string }, signal: any) {
  return APIRequest<any>({
    url: '/gateway/tts',
    method: 'POST',
    data,
    signal: signal,
    params,
  });
}

export interface keyDeleteHistory {
  user_id: string;
  desc_data_id: Array<any>;
  desc: Array<any>;
}

export function deleteHistory(data: keyDeleteHistory) {
  return APIRequest<any>({
    url: '/gateway/tts_delete',
    method: 'POST',
    data,
  });
}
export interface keygetSelectOption {
  type: string;
}

export function getSelectOption(params: keygetSelectOption) {
  return APIRequest<any>({
    url: '/ai-audio/listoption',
    method: 'GET',
    params,
  });
}
export interface keyGethistoryList {
  user_id: string;
  desc?: string;
}

export function getHistoryList(data: keyGethistoryList) {
  return APIRequest<any>({
    url: '/gateway/tts_history_list',
    method: 'POST',
    data,
  });
}
export function getDefaultAduio(params: { user_id: string }) {
  return APIRequest<any>({
    url: '/ai-audio/selectedlistgetdefaultaudio',
    method: 'GET',
    params,
  });
}
export function cancelGenerate(data: { taskId: string }) {
  return APIRequest<any>({
    url: '/model/task',
    method: 'POST',
    data,
  });
}
