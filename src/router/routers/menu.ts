import { RouteRecordRaw } from 'vue-router';

export const welcomeMenu: Array<RouteRecordRaw> = [
  {
    path: '/welcome',
    name: '/welcome',
    meta: {
      title: '菜单',
      icon: 'icon-modular',
      hidden: 0,
    },
    component: () => import('@/layout/Welcome/Welcome.vue'),
  },
];

const routes: Array<RouteRecordRaw> = [
  {
    path: '/home',
    name: '/home',
    meta: {
      title: '天元语音模型网关',
      icon: '',
      hidden: 0,
    },
    children: [],
    component: () => import('@/views/Home/index.vue'),
  },
  {
    path: '/VoiceToText',
    name: '/VoiceToText',
    meta: {
      title: '语音转文本',
      icon: 'icon-yuyinzhuanwenben-copy',
      hidden: 0,
      keepAlive: true,
    },
    children: [],
    component: () => import('@/views/VoiceToText/index.vue'),
  },
  {
    path: '/textToSpeech',
    name: '/textToSpeech',
    meta: {
      title: '文本转语音',
      icon: 'icon-speech_text-copy',
      hidden: 0,
      keepAlive: true,
    },
    children: [],
    component: () => import('@/views/TextToSpeech/index.vue'),
  },
  {
    path: '/aiSoundGeneration',
    name: '/aiSoundGeneration',
    meta: {
      title: 'AI音效生成',
      icon: 'icon-yinxiao-copy',
      hidden: 0,
      keepAlive: true,
    },
    children: [],
    component: () => import('@/views/AISoundGeneration/index.vue'),
  },
  {
    path: '/voiceList',
    name: '/voiceList',
    meta: {
      title: '语音列表',
      icon: 'icon-a-icon-alarmstrategy-copy-copy',
      hidden: 0,
      keepAlive: true,
    },
    children: [],
    component: () => import('@/views/ModelUsageList/index.vue'),
  },
  {
    path: '/APIManagement',
    name: '/APIManagement',
    meta: {
      title: 'API管理',
      icon: 'icon-APIguanli-copy',
      hidden: 0,
      keepAlive: true,
    },
    children: [],
    component: () => import('@/views/APIManagement/index.vue'),
  },
  {
    path: '/APIBilling',
    name: '/APIBilling',
    meta: {
      title: 'API计费',
      icon: 'icon-jifei',
      hidden: 0,
      keepAlive: true,
    },
    children: [],
    component: () => import('@/views/APIBilling/index.vue'),
  },
  {
    path: '/UsageGuide',
    name: '/UsageGuide',
    meta: {
      title: '使用指南',
      icon: 'icon-shiyongwendang-copy',
      hidden: 0,
      keepAlive: true,
    },
    children: [],
    component: () => import('@/views/UsageGuide/index.vue'),
  },
];

export default routes;
