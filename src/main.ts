import { createApp, Directive } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './styles';
import './components/AAUI';
import ElementPlus from 'element-plus';
import VXETable from 'vxe-table';
import JsonViewer from 'vue-json-viewer';
import { Directive } from 'vue';

// Import JsonViewer as a Vue.js plugin

document.title = import.meta.env.VITE_TITLE;

import Casdoor from 'casdoor-vue-sdk';
const config = {
  serverUrl: import.meta.env.VITE_SERVERURL,
  clientId: import.meta.env.VITE_CLIENTID,
  organizationName: import.meta.env.VITE_ORGANIZATION,
  appName: import.meta.env.VITE_APPNAME,
  redirectPath: '/home',
};

//md 预览
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';

//md 复制
import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index';
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css';

// highlightjs
import hljs from 'highlight.js';
import { mount } from 'sortablejs';

VMdPreview.use(githubTheme, {
  Hljs: hljs,
});
VMdPreview.use(createCopyCodePlugin());

const app = createApp(App);
const removeAriaHidden: Directive = {
  mounted(el: HTMLElement, binding: any) {
    const ariaEls = document.querySelectorAll('[aria-hidden]');
    ariaEls.forEach((el) => el.removeAttribute('aria-hidden'));
  },
};
app
  .use(VMdPreview)
  .use(Casdoor, config)
  .use(store)
  .use(router)
  .use(ElementPlus)
  .use(VXETable)
  .use(JsonViewer)
  .directive('removeAriaHidden', removeAriaHidden)
  .mount('#app');
