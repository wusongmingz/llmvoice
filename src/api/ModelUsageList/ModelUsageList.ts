import { APIRequest, IFileResponse, energyRequest } from '@/utils/request';

interface RequestData {
  page: number;
  size: number;
  order_by: string;
  query_type: string;
  name: string;
  user_id: string;
}

export function getUserList(data: RequestData) {
  return APIRequest<any>({
    url: '/ai-audio/list',
    method: 'POST',
    data,
  });
}
interface keyDeleteAudio {
  id: string;
  user_id: string;
}

export function deleteAudio(params: keyDeleteAudio) {
  return APIRequest<any>({
    url: '/ai-audio/delete',
    method: 'GET',
    params,
  });
}
interface keyDeleteOrAddAudio {
  op: number;
  audio_id: string;
  user_id: string;
}

export function deleteOrAddAudio(data: keyDeleteOrAddAudio) {
  return APIRequest<any>({
    url: '/ai-audio/opselectedlist',
    method: 'POST',
    data,
  });
}
export interface keyEditAudio {
  age?: string;
  audio_urls?: string[];
  desc?: string;
  id: number;
  kind?: string[];
  name?: string;
  pic_url?: string;
  sex?: string;
  speed_of_speech?: number;
  style?: string[];
  tone?: number;
  user_id: string;
}
export function editAudio(data: keyEditAudio) {
  return APIRequest<any>({
    url: '/ai-audio/selfedit',
    method: 'POST',
    data,
  });
}
interface keyUploadAudio {
  audio: File;
}
export function uploadAudio(data: keyUploadAudio) {
  return APIRequest<any>({
    url: '/ai-audio/upload',
    method: 'POST',
    headers: { 'Content-Type': 'multipart/form-data' },
    data,
  });
}

export interface Collection {
  op: number;
  audio_id: number;
  user_id: 'string';
}

export function getCollection(data: Collection) {
  return APIRequest<any>({
    url: '/ai-audio/opcollection',
    method: 'POST',
    data,
  });
}
export interface keyGetAudioInfo {
  id: number;
  user_id: 'string';
}

export function getAudioInfo(params: keyGetAudioInfo) {
  return APIRequest<any>({
    url: '/ai-audio/detail',
    method: 'GET',
    params,
  });
}
export interface keysetAudioDefault {
  audio_id: number;
  user_id: 'string';
}

export function setAudioDefault(data: keyGetAudioInfo) {
  return APIRequest<any>({
    url: '/ai-audio/selectedlistsetdefaultaudio',
    method: 'POST',
    data,
  });
}
export function getAvatarList() {
  return APIRequest<any>({
    url: '/avatar/list',
    method: 'POST',
  });
}

export interface keycreateSound {
  age: string;
  audio_urls?: string[];
  audio_names?: string[];
  desc?: string;
  kind?: string[];
  name: string;
  pic_url: string;
  sex: number;
  speed_of_speech?: number;
  style?: string[];
  tone?: number;
  user_id: string;
}

export function createSound(data: keycreateSound) {
  return APIRequest<any>({
    url: '/ai-audio/create',
    method: 'POST',
    data,
  });
}
