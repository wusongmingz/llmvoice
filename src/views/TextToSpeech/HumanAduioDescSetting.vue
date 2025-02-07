<template>
  <div style="width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center">
    <div style="flex: 7; width: 100%; display: flex; flex-direction: column; align-items: center">
      <div class="desc-set-page-top">
        <!-- <el-icon size="25" style="cursor: pointer; margin-left: 15px; float: right">
        <AIcon icon="icon-shanchu1" @click="closeWindow"></AIcon>
      </el-icon> -->
        <span @click="closeWindow" style="font-size: 22px; user-select: none; cursor: pointer; margin-right: 5px; color: gray">×</span>
      </div>
      <div class="character">
        <div class="character-container">
          <img class="avatar" :src="data?.pic_url" />
          <div class="character-name">{{ data?.ai_audio_name }}</div>
        </div>
        <div class="time">
          {{ formatTimestamp(data.create_time) }}
        </div>
      </div>
      <div class="desc-text">
        {{ data.desc }}
      </div>
      <el-button class="btn" @click="backFill(data)">回填文本</el-button>
      <el-divider style="margin: 15px 0px" />
      <div class="history-setting">
        <div class="setting">设置</div>
        <div class="audio-and-creativity">
          <span style="margin-left: 10px">模型名称</span>
          <p style="width: 176px; text-align: center">{{ data.model_name }}</p>
        </div>
        <div class="audio-and-creativity">
          <span style="margin-left: 10px">音调</span>
          <p style="width: 176px; text-align: center">{{ formatPercent5(data.tone) }}</p>
        </div>
        <div class="audio-and-creativity">
          <span style="margin-left: 10px">语速</span>
          <p style="width: 176px; text-align: center">{{ formatPercent2(data.speed) }}</p>
        </div>
      </div>
      <div style="flex: 5.15; width: 100%; display: flex; align-items: end; justify-content: center">
        <el-button class="btn" @click="resetSetting(data)">还原设置</el-button>
      </div>
    </div>

    <div style="flex: 2.19; width: 100%"></div>
  </div>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Object,
    default: null,
  },
});
const formatPercent5 = (item) => {
  return Math.round(100 + item * 20) + '%';
};
const formatPercent2 = (item) => {
  return Math.round(item * 100) + '%';
};
const emit = defineEmits(['closeWindow', 'backFillText', 'restoreSettings']);
const closeWindow = () => {
  emit('closeWindow');
};
const formatTimestamp = (timestamp) => {
  // 将时间戳转换为毫秒

  const date = new Date(Number(timestamp) * 1000);

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');

  return `${yyyy}/${mm}/${dd} ${hh}:${min}`;
};
const backFill = (data) => {
  emit('backFillText', data.desc);
};
const resetSetting = (data) => {
  emit('restoreSettings', data);
};
</script>

<style lang="scss" scoped>
.desc-set-page-top {
  overflow: auto;
  width: 100%;
  height: 32px;
  min-height: 32px;
  border-radius: 10px 10px 0px 0px;
  background-color: rgb(237, 241, 244);
  display: flex;
  align-items: center;
  justify-content: right;
  padding-right: 10px;
}
.desc-text {
  width: 95%;
  height: 130px;
  padding: 5px 10px;
  line-height: 20px;
  margin: 5px auto;
  border-radius: 5px;
  border: 1px solid #dcdfe6;
  font-size: 15px;
  // overflow: hidden;
  // word-wrap: break-word;
  // padding: 10px 20px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 6;
  overflow: hidden;
  text-overflow: ellipsis;
}
.btn {
  width: 100px;
  height: 32px;
  background-color: black;
  color: white;
  font-size: 14px;
}
.btn:hover {
  border: 1px solid black;
  background-color: rgb(237, 241, 244);
  color: #333;
}
.history-setting {
  width: 100%;
  padding: 0px 10px;
  font-size: 14px;

  .setting {
    width: 140px;
    height: 35px;
    background: linear-gradient(to right, #fff 0%, rgb(145, 198, 222, 0.3) 50%, #fff);
    font-weight: 600;
    font-size: 15px;
    text-align: center;
    line-height: 35px;
    border-radius: 5px;
  }
  .audio-and-creativity {
    width: 100%;
    background-color: rgb(237, 241, 244);
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 5px;
    margin-top: 15px;
  }
}
.character {
  display: flex;
  width: 100%;
  align-items: center;
  padding-top: 20px;

  .character-container {
    // background-color: rgb(246, 245, 235);
    width: 140px;
    border-radius: 5px;
    display: flex;
    margin-left: 10px;
    align-items: center;
    padding-bottom: 5px;
    .avatar {
      width: 40px;
      height: 40px;
      margin-left: 5px;
    }
    .character-name {
      width: calc(100% - 30px);
      text-align: center;
    }
  }
  .time {
    line-height: 35px;
    padding-left: 10px;
    font-size: 14px;
  }
}
</style>
