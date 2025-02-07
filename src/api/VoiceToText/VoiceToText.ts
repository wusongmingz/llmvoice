import { APIRequest } from '@/utils/request';
import { languageList } from '@/views/VoiceToText/hook/useVoice';

export function oiceToText(data: any) {
  return APIRequest<any>({
    url: '/gateway/asr' + '?model=' + data.s,
    method: 'POST',
    // headers:{
    //   apiKey:data.apikey,
    // },
    data,
  });
}
export function deleteRecords(params: any) {
  return APIRequest<any>({
    url: '/gateway/asr/history',
    method: 'DELETE',
    params,
  });
}
export function getSppLanguage(params: any) {
  return APIRequest<any>({
    url: '/gateway/common/langs',
    method: 'GET',
    params,
  });
}

export function getmodels(params: any) {
  return APIRequest<any>({
    url: '/gateway/common/models',
    method: 'GET',
    params,
  });
}

export function getHistry() {
  return APIRequest<any>({
    url: '/gateway/asr/history',
    method: 'GET',
  });
}

export function getApiKey(params: any) {
  return APIRequest<any>({
    url: '/ai-apiKey/getKey',
    method: 'GET',
    params,
  });
}

// export function getAudio(params: any) {
//   return APIRequest<any>({
//     url: params.url,
//     method: 'GEt',

//   });
// };
