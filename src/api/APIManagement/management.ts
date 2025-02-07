import { APIRequest } from '@/utils/request';

export interface addKey {
  userId: string;
  tokenQuota: number;
  keyName: string;
  apiKey?: string;
}
export function addKey(data: addKey) {
  return APIRequest<any>({
    url: '/ai-apiKey/createKey',
    method: 'POST',
    data,
  });
}

export function editKey(data: addKey) {
  return APIRequest<any>({
    url: '/ai-apiKey/updateKey',
    method: 'POST',
    data,
  });
}

export function getKeyList(params:any) {
  return APIRequest<any>({
    url: '/ai-apiKey/getKey',
    method: 'GET',
    params,
  });
}

export function deleteKey(params: any) {
  return APIRequest<any>({
    url: '/ai-apiKey/deleteKey',
    method: 'POST',
    params,
  });
}

export interface keyReq {
  order: string;
  orderBy: string;
  apiKey: string;
}

// export function getKeyDetail(params: keyReq) {
//   return APIRequest<any>({
//     url: '/api-key-log/getlog',
//     method: 'GET',
//     params,
//   });
// }

export function getKeyDetail(params: keyReq) {
  return APIRequest<any>({
    url: '/ai-apiKey/history',
    method: 'GET',
    params,
  });
}
