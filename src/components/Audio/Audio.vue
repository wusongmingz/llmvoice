<template>
  <div class="audio-class">
    <div style="margin-bottom: 10px; height: 25px">{{ data ? (data.order ? `音效${data.order}` : data.name) : '' }}</div>
    <audio style="display: none" v-if="data" ref="audioRef" controls :src="data?.uri" type="audio/wav" @timeupdate="updateProgress"></audio>
    <div class="audio-box">
      <!-- <el-icon size="45" class="name-icon" @click="searchBtn = true">
        <AIcon :icon="audioIsPaused ? 'icon-start-full' : 'icon-zanting'" @click="changeAudioStatus" style="cursor: pointer" />
      </el-icon> -->
      <span
        :class="['iconfont', audioIsPaused ? 'icon-start-full' : 'icon-zanting']"
        @click="changeAudioStatus"
        style="
          cursor: pointer;
          font-size: 50px;
          background: linear-gradient(to bottom right, #1190fb, #a3f2f9);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        "
      ></span>
      <!--警告-->
      <el-slider class="audio-slider" :step="0.1" v-model="currentProgress" :show-tooltip="false" @input="handleProgressChange"></el-slider>
      <a :href="props.data?.uri" @click="panduan" style="display: flex; align-items: center; align-content: center">
        <el-icon size="50" class="name-icon" @click="searchBtn = true">
          <span
            class="iconfont icon-xiazai"
            style="
              background: linear-gradient(to bottom right, #1190fb, #a3f2f9);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              font-size: 35px;
              margin-left: 20px;
              cursor: pointer;
            "
          ></span>
        </el-icon>
        <!--警告-->
      </a>
    </div>
    <div class="audio_time" style="font-size: 13px">
      <span class="audio_current">{{ audioStart }}</span>
      /
      <span class="audio_total">{{ formatedDuration }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue';
// import { downloadFileByUrl } from '@/utils/utils';
import { ElMessage } from 'element-plus';
const audioIsPaused = ref(true);
const audioRef = ref(null); // Initialize the ref with null
const currentProgress = ref(0);
const props = defineProps({
  data: {
    type: Object,
    default: null,
  },
});
const duration = ref(0); //音频的总时长
const audioStart = ref('00:00');
// const durationTime = ref('00:00');
const panduan = () => {
  if (!props.data?.uri) {
    ElMessage.warning('暂无可下载音频');
    return false;
  }
};
const changeAudioStatus = () => {
  if (!audioRef.value) {
    ElMessage.warning('暂无可播放音频');
    return;
  }
  if (audioRef.value.paused) {
    nextTick(() => {
      audioRef.value.play();
    });
    audioIsPaused.value = false;
  } else {
    nextTick(() => {
      audioRef.value.pause();
    });
    audioIsPaused.value = true;
  }
};
const formatedDuration = computed(() => {
  if (!props.data) {
    return '00:00';
  }
  return formatDuration(props.data.duration);
});
function formatDuration(duration) {
  // 确保秒数为整数
  if (duration < 1) {
    return '00:01';
  }
  const totalSeconds = Math.floor(duration); // 去掉小数部分
  // 计算分钟数
  const minutes = Math.floor(totalSeconds / 60);
  // 计算秒数
  const seconds = totalSeconds % 60;

  // 格式化为 "mm:ss" 格式，确保两位数
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}
// const downloadAudio = (uri) => {
//   if (!uri) {
//     return;
//   }
//   const a = document.createElement('a');
//   document.body.appendChild(a);
//   a.style.display = 'none';
//   a.href = uri;
//   a.click();
//   document.body.removeChild(a);
// };
function transTime(duration) {
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60);
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');
  return `${formattedMinutes}:${formattedSeconds}`;
}

function updateProgress() {
  if (audioRef.value) {
    // 确保获取到音频的 duration
    duration.value = audioRef.value.duration || 0;
    // if (duration.value < 1) {
    //   duration.value = 1;
    // }
    // 更新当前进度和时间
    const currentTime = audioRef.value.currentTime;
    // console.log('currentTime:', currentTime);

    const value = (currentTime / duration.value) * 100;
    // console.log(value);

    currentProgress.value = value;
    audioStart.value = transTime(currentTime);
  }
}

const handleProgressChange = (val) => {
  if (!val || !audioRef.value) return;
  const currentTime = duration.value * (val / 100);
  audioRef.value.currentTime = currentTime;
  audioRef.value.play();
  audioIsPaused.value = false;
};
const emit = defineEmits(['endOfPlay', 'play']);
watch(
  () => currentProgress,
  (newVal, oldVal) => {
    if (currentProgress.value === 100) {
      setTimeout(() => {
        currentProgress.value = 0;
        audioStart.value = '00:00';
      }, 100);
      audioIsPaused.value = true;
      emit('endOfPlay');
    }
  },
  { immediate: true, deep: true },
);
watch(
  () => props.data,
  (newVal, oldVal) => {
    if (props.data) {
      currentProgress.value = 0;
      audioIsPaused.value = true;
    } else {
      audioStart.value = '00:00';
      currentProgress.value = 0;
    }
  },
  { immediate: true, deep: true },
);
defineExpose({
  changeAudioStatus,
});
</script>

<style lang="scss" scoped>
.audio-box {
  display: flex;
  // height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
  .audio-slider {
    flex: 1;
    margin-left: 30px;
    transition: all 1s;

    :deep(.el-slider__bar) {
      // background-color: #409eff;
      background: linear-gradient(to right, #a3f2f9, #1190fb);
    }
    :deep(.el-slider__button) {
      border: 2px solid #409eff;
    }
  }
}
.audio_time {
  // margin-right: 80px;
  // float: right;
  text-align: end;
  padding-right: 50px;
}
.audio-class {
  height: 100%;
  width: 100%;
  display: flex;
  padding: 0px 15px;
  flex-direction: column;
  justify-content: center;
}
</style>
