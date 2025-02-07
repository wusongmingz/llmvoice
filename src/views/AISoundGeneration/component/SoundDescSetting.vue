<template>
  <div style="width: 100%; overflow: auto; height: 100%; display: flex; flex-direction: column; align-items: center">
    <div class="desc-set-page-top">
      <!-- <el-icon size="25" style="cursor: pointer; margin-left: 15px; float: right">
        <AIcon icon="icon-shanchu1" @click="closeWindow"></AIcon>
      </el-icon> -->
      <span @click="closeWindow" style="font-size: 25px; user-select: none; cursor: pointer; margin-right: 5px; color: gray">×</span>
    </div>
    <div style="flex: 7.8;width:100%; align-items: center; display: flex; flex-direction: column">
      <div class="desc-text">{{ data.desc }}</div>
      <el-button class="btn" @click="emit('backFillText', data.desc)">回填文本</el-button>
      <div style="margin: 0px 10px; margin-bottom: 8px; width: calc(100% - 20px); height: 1px; border: 1px solid rgb(145, 198, 222)"></div>

      <div class="history-setting">
        <div class="setting">设置</div>
        <div class="audio-and-creativity">
          <span style="margin-left: 10px">音效时长</span>
          <p style="width: 176px; text-align: center">{{ data.uris[0].duration }}秒</p>
        </div>
        <!-- <div class="audio-and-creativity">
        <span style="margin-left: 10px">创意性</span>
        <p style="width: 176px; text-align: center">{{ data.creativity * 2 }}%</p>
      </div> -->
      </div>
    </div>

    <div style="flex: 2">
      <el-button class="btn" style="margin-top: 30px" @click="emit('restoreSettings', data)">还原设置</el-button>
    </div>
  </div>
</template>

<script setup>
import { watch } from 'vue';

const props = defineProps({
  data: {
    type: Object,
    default: null,
  },
});
const emit = defineEmits(['closeWindow', 'backFillText', 'restoreSettings']);
const closeWindow = () => {
  emit('closeWindow');
};
</script>

<style lang="scss" scoped>
.desc-set-page-top {
  width: 100%;
  height: 32px;
  border-radius: 10px 10px 0px 0px;
  background-color: rgb(237, 241, 244);
  display: flex;
  align-items: center;
  justify-content: right;
  padding-right: 10px;
  min-height: 32px;
}
.desc-text {
  height: 90px;
  min-height: 60px;
  margin: 10px 10px;
  width:calc(100% - 20px);
  border-radius: 5px;
  border: 1px solid #dcdfe6;
  overflow: hidden;
  font-size: 14px;
  padding: 5px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
  overflow: hidden;
  margin-bottom: 16px;
}
.btn {
  width: 100px;
  height: 30px;
  background-color: black;
  color: white;
  margin-bottom: 5px;
  font-size: 13px;
}
.btn:hover {
  border: 1px solid black;
  background-color: rgb(237, 241, 244);
  color: #333;
}
.history-setting {
  width: 100%;
  padding: 0px 10px;
  font-size: 13px;
  .setting {
    width: 140px;
    height: 35px;
    background: linear-gradient(to right, #fff 0%, rgb(145, 198, 222, 0.3) 50%, #fff);

    text-align: center;
    line-height: 35px;
    border-radius: 5px;
    font-size: 16px;
    font-weight: 600;
    margin-left: 5px;
  }
  .audio-and-creativity {
    width: 100%;
    background-color: rgb(237, 241, 244);
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 5px;
    margin-top: 20px;
  }
}
</style>
