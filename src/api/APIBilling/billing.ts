import { APIRequest } from '@/utils/request';

export interface keyReq {
  pageNum: number;
  pageSize: number;
  userId: string;
  date: string;
}

export function getKeyList(params: keyReq) {
  return APIRequest<any>({
    url: '/api-key-log/getAllLogByDate',
    method: 'GET',
    params,
  });
}

export interface monthReq {
  queryMonth: string;
  user_id: string;
}

export function getMonthList(params: monthReq) {
  return APIRequest<any>({
    url: '/ai-apiKey/getMap',
    method: 'GET',
    params,
  });
}

export interface listKeyReq {
  user_id: string;
  date: string;
}

export function getAllList(params: listKeyReq) {
  return APIRequest<any>({
    url: '/ai-apiKey/history_all',
    method: 'GET',
    params,
  });
}
