import { defineConfig } from 'vite';
import path from 'path';
import Vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import EslintPlugin from 'vite-plugin-eslint';
import topLevelAwait from 'vite-plugin-top-level-await';
import ElementPlus from 'unplugin-element-plus/vite';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { MonoseVueResolver } from 'monose-component-vue/provider';

export default defineConfig({
  build: {
    outDir: './server/public',
  },
  server: {
    open: true,
    host: '0.0.0.0',
    hmr: true,
    port: 9000,
    proxy: {
      '/api': {
        // target: 'http://10.8.15.111:8888/', // 本地环境
        // target: 'http://10.8.15.111:8888/', // 本地环境
        // target: 'http://47.93.187.200:8888/',
        target: 'http://47.93.187.200:8888',
        // target: 'http://117.147.213.213:8888/', //迁移后地址
        // target: 'http://47.93.187.200:8888/', // 测试环境
        // target: 'http://ajecloud.anjieservice.com/', // 生产环境
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  plugins: [
    Vue(),
    vueJsx({}),
    ElementPlus({}),
    AutoImport({
      resolvers: [ElementPlusResolver({ importStyle: false })],
    }),
    Components({
      resolvers: [MonoseVueResolver, ElementPlusResolver({ importStyle: false })],
    }),
    EslintPlugin({
      include: ['src/**/*.ts', 'src/**/*.js', 'src/**/*.vue', 'src/*.ts', 'src/*.js', 'src/*.vue'],
      exclude: ['src/styles/iconfont/iconfont.js'],
    }),
    topLevelAwait({
      // The export name of top-level await promise for each chunk module
      promiseExportName: '__tla',
      // The function to generate import names of top-level await promise in each chunk module
      promiseImportName: (i) => `__tla_${i}`,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@UI': path.resolve(__dirname, './src/components/AAUI'),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
  },
});
