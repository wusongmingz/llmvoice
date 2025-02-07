<template>
  <div class="header-content">
    <!-- 15% -->
    <!-- <div class="header-speech">SPEECH TO TEXT</div> -->
    <div style="flex: 3.5; display: flex; gap: 10px">
      <div class="header-speech">
        <Lottie :animationOptions="asrHeaderOptions" :styles="asrHeaderStyles"></Lottie>

        <!-- <img src="@/assets/image/home/asrgif.gif" alt="" style="width: 70px; position: absolute; top: 10px; left: 50px" /> -->
      </div>
      <!-- 50% -->
      <div class="box_input">
        <div class="box_input_span">
          <span style="white-space: nowrap; font-size: 16px; font-weight: bold">上传音频文件前请先选择输入音频的语言</span>
        </div>
        <div class="box_input_button">
          <div class="simple_tottom">
            <el-button
              :style="{
                backgroundColor: isInputLanguage === item?.display ? '#F5F6F7' : '',
                borderColor: isInputLanguage === item?.display ? '#333' : '#D4E0EA',
              }"
              style="font-size: 14px; height: 30px"
              v-for="(item, index) in BtnList.slice(0, 3)"
              :key="index"
              class="button lan-btn"
              @click="changeInputLanguage(item)"
              >{{ item?.display }}</el-button
            >

            <el-popover placement="bottom" style="border: 1px solid #ccc !important; padding: 0 !important" :width="260">
              <div :style="{ width: '100%', height: '100%' }">
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px">
                  <el-button
                    :style="{
                      backgroundColor: isInputLanguage === item?.display ? '#f5f6f7' : '',
                      borderColor: isInputLanguage === item?.display ? 'black' : '#D4E0EA',
                    }"
                    v-for="(item, index) in BtnList.slice(3, BtnList.length)"
                    :key="index"
                    class="button lan-btn"
                    style="height: 30px"
                    @click="changeInputLanguage(item)"
                  >
                    {{ item?.display }}
                  </el-button>
                </div>
              </div>
              <template #reference>
                <el-button v-if="isShowExtra" @click="toggleDropdown_more" class="button lan-btn more-btn">更多</el-button>
              </template>
            </el-popover>
          </div>
        </div>
      </div>
    </div>
    <div style="display: flex; flex: 3.3; gap: 10px">
      <div class="apikey-box">
        <div style="font-size: 16px; height: 40%; align-content: end; font-weight: 600"><span>选择API-Key</span></div>
        <div style="height: 60%; align-content: center">
          <el-select style="height: 30px" v-model="currentSelectApikey">
            <el-option v-for="item in apikeyList" :key="item" :label="item.keyName" :value="item.apiKey" />
          </el-select>
        </div>
      </div>
      <!-- 15% -->
      <div class="box_output">
        <div class="output_span">
          <span class="outputapan"
            >输出格式
            <div class="outputicon">
              <el-tooltip class="box-item" effect="light " placement="bottom">
                <template #content>简单:不做标识输出音频文件文本<br />详细:具有显示时间戳、身份的格式输出音频文件文本 </template>
                <el-icon class="my-icon-class" size="14">
                  <AIcon class="audio" icon="icon-icon" />
                </el-icon>
              </el-tooltip></div
          ></span>
        </div>
        <div class="output_button">
          <el-button
            :style="{
              backgroundColor: isoutputFormat === item ? '#f5f6f7' : '',
              borderColor: isoutputFormat === item ? 'black' : '#D4E0EA',
            }"
            class="button lan-btn"
            style="font-size: 15px; height: 30px"
            v-for="(item, index) in inptuformatBtn"
            :key="index"
            @click="changeOuputType(item)"
            >{{ item }}</el-button
          >
        </div>
      </div>
    </div>

    <!-- 20% -->
    <div class="model">
      <div class="model_span">
        <span style="font-size: 16px; font-weight: bold">选择模型</span>
      </div>
      <div id="app" style="display: flex; justify-content: space-between; width: 100%; height: 48%; padding: 0px 10px">
        <div class="model_div" @click="toggleDropdown">
          <span style="text-align: center; font-size: 14px"> {{ selectedItemLabel?.model }}</span>
        </div>
      </div>
      <Transition name="model">
        <div v-if="isDropdownVisible" class="dropdown">
          <div class="dropdown-header">
            <span style="font-size: 14px; font-weight: blob">{{ headerText }}</span>
            <el-button class="lan-btn" style="width: 75px !important; height: 30px; font-size: 14px; color: #333" @click="toggleDropdown"
              >返回</el-button
            >
          </div>
          <div class="dropdown-body">
            <div v-for="item in modelList" :key="item.id" class="box" style="border-radius: 5px" @click="selectItem(item)">
              <div style="height: 30px; display: flex; align-items: center">{{ item?.name }}</div>
              <div style="min-height: 40px; white-space: normal; word-wrap: break-word">
                {{ item?.desc }}
              </div>
              <div style="display: flex; height: 30px; gap: 5px; align-items: center">
                支持语言：
                <div style="text-align: center" v-for="i in item?.languages" :key="i">{{ i?.display }}</div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>
<script setup>
import { ref, onBeforeMount, watch, onActivated } from 'vue';
import { languageList, getModels, getapikey } from '../hook/useVoice';
import asrHeaderGif from '@/assets/asrheadergif.json';
import Lottie from '@/components/Lottie/Lottie.vue';

const currentSelectApikey = ref();
import router from '@/router';
import { ElMessage } from 'element-plus';
const BtnList = ref([]); //输入语音的选项列表
const modelList = ref(); //模型列表
const isInputLanguage = ref();
const inptuformatBtn = ref(['简单', '详细']);
const isoutputFormat = ref(inptuformatBtn.value[0]);

const isDropdownVisible_more = ref(false);
const toggleDropdown_more = () => {
  isDropdownVisible_more.value = !isDropdownVisible_more.value;
};
const isDropdownVisible = ref(false);
const headerText = ref('请选择模型');

const { apikeyList, getApiKeyList } = getapikey();

const { languageBtnlist, getLanguageList } = languageList(); // 获取语言列表
const { models, getallmodels } = getModels();
const selectedItemLabel = ref();
const isShowExtra = ref(false);
onBeforeMount(async () => {
  await getLanguageList();
  BtnList.value = languageBtnlist.value; // 在获取数据后赋值
  isShowExtra.value = languageBtnlist.value.length > 3 ? true : false;
  changeInputLanguage(BtnList.value[0]);
  await getallmodels('asr');
  modelList.value = models.value;
  await Promise.all(
    modelList.value.map(async (item) => {
      const languagesList = await getModelLanguagesRes(item.model_id);
      item.languages = languagesList; // 将语言列表添加到每个 item 中
    }),
  );
  selectedItemLabel.value = modelList?.value[0];
});

const selectItem = (item) => {
  selectedItemLabel.value = item; // 设置按钮显示的标签
  isDropdownVisible.value = false; // 收回下拉菜单
};
const sleep = (milliseconds) => {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
};
// 触发向父组件传递输入语言和输出格式的事件
const emit = defineEmits(['updateInputLanguage', 'updateOutputFormat']);

const changeInputLanguage = (item) => {
  // console.log(item.display);

  isInputLanguage.value = item?.display;
  setTimeout(() => {
    isDropdownVisible_more.value = false;
  }, 150);
  emit('updateInputLanguage', item);
};
const changeOuputType = (outputType) => {
  isoutputFormat.value = outputType;
  emit('updateOutputFormat', outputType);
};
const toggleDropdown = () => {
  isDropdownVisible.value = !isDropdownVisible.value;
};
defineExpose({
  selectedItemLabel,
  currentSelectApikey,
});
import { useUserStore } from '@/store/modules/user';
import { getModelLanguagesRes } from '@/views/TextToSpeech/hook/useTextToSpeech';
const userStore = useUserStore();

const asrHeaderOptions = {
  animationData: asrHeaderGif,
};
const asrHeaderStyles = {
  height: '70px',
};
watch(
  () => currentSelectApikey.value,
  (newValue) => {
    if (currentSelectApikey.value) {
      userStore.setApiKey(currentSelectApikey.value);
    }
  },
);

onActivated(async () => {
  await getApiKeyList();
  apikeyList.value = apikeyList.value.filter((item) => {
    return item.abilities.includes('asr');
  });
  if (apikeyList.value.length === 0) {
    ElMessage.warning('没有可用的APIKEY，请先添加！');
    router.push('/APIManagement');
    return;
  }
  if (!currentSelectApikey.value) {
    currentSelectApikey.value = apikeyList.value[0]?.apiKey;
  } else {
    if (
      !apikeyList.value.some((item) => {
        return item.apiKey === currentSelectApikey.value;
      })
    ) {
      currentSelectApikey.value = apikeyList.value[0]?.apiKey;
    }
  }
});
</script>

<style lang="scss" scoped>
.model_div {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 85%;
  // margin: 0 auto;

  border-radius: 5px;
  border: 1px solid #d4e0ea;
  background-color: rgb(255 255 255);
}
.model_div:hover {
  background-color: #f5f6f7;
  border-color: #333;
}
.lan-btn:hover {
  background: #f5f6f7;
  border-color: #e7e9ee;
}
.button {
  color: #333;
}

.box_output {
  display: flex;
  flex-wrap: wrap;
  flex: 5;
  justify-content: flex-start;
  flex-direction: column;
  background-color: white;
  border-radius: 10px;
  width: 15%;
  overflow: hidden;
  box-shadow: 0px 0px 5px rgb(0, 0, 0, 0.15);

  .output_span {
    margin-left: 10px;
    align-items: flex-end;
    display: flex;
    height: 40%;
    width: 100%;
    display: inline-flex;
    max-height: 40%;
    min-height: 40%;
    overflow: auto;
    .outputapan {
      font-size: 16px;
      font-weight: bold;
      overflow: hidden;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: flex-end;
      // position: relative;
    }
  }
  .output_button {
    display: flex;
    align-items: center;
    min-height: 58%;
    padding-left: 10px;
    max-height: 58%;
    height: 58%;
    width: 100%;
    display: inline-flex;
    column-gap: 5px;
    position: relative;
    overflow: auto;
    .output_button1 {
      border: 1px solid rgba(224, 144, 128, 0.5);
    }

    //border: 1px solid rgb(0, 0, 0);
  }
}

.header-content {
  display: flex;
  gap: 10px;
  color: #333333;

  height: 100%;
  width: 100%;
  padding: 0px;
  .header-speech {
    border-radius: 10px;
    width: 170px;
    justify-content: center;
    align-content: center;
    padding-left: 10px;
    position: relative;
    // background-image: url('/image/voicechanger.png');
    // background-size: 100% 100%;
    // background-position-y: 2px;
  }
}
.apikey-box {
  flex: 5;
  overflow: auto;
  display: flex;
  border-radius: 10px;
  flex-direction: column;
  // justify-content: space-around;
  background-color: #fff;
  box-shadow: 0px 0px 5px rgb(0, 0, 0, 0.15);

  padding: 0px 10px;
}
.box_input {
  display: flex;
  flex-direction: column;
  box-shadow: 0px 0px 5px rgb(0, 0, 0, 0.15);
  background-color: white;
  border-radius: 10px;
  margin-top: 0px;
  flex: 7;
  overflow: auto;
  //border: 1px solid rgba(0, 0, 0, 0.5);
  .box_input_span {
    display: flex;
    align-items: flex-end;
    font-size: 12px;
    width: 100%;
    height: 40%;
    min-height: 40%;
    max-height: 40%;
    padding-left: 10px;
  }

  .box_input_button {
    height: 58%;
    min-height: 58%;
    max-height: 58%;
    flex: 1;
    margin-left: 10px;
    max-height: 100%;
    flex-direction: row;
    display: flex;
    align-items: flex-end;
    width: fit-content;
    min-width: 96%;
    position: relative;
    .simple_tottom {
      height: 100%;
      min-height: 100%;
      max-height: 100%;
      flex-direction: row;
      display: inline-flex;
      align-items: center;
      display: flex;
      gap: 5px;
      width: 90%;
    }
  }
}

.model {
  flex: 3.2;
  background-color: rgb(255, 255, 255);
  display: flex;
  flex-wrap: wrap;
  width: 20%;
  border-radius: 10px;
  justify-content: center;
  box-shadow: 0px 0px 5px rgb(0, 0, 0, 0.15);
  position: relative;
  .model_span {
    margin-left: 10px;
    display: flex;
    align-items: flex-end;
    height: 40%;
    min-height: 40%;
    max-height: 40%;
    width: 100%;
    overflow: auto;
  }
  .model_button {
    height: 90%;
    width: 88%;
    margin: 0 auto;
  }
}

.dropdown {
  border: 1px solid #d2d6da;
  margin-left: -0.5%;
  border-radius: 10px;
  padding: 10px;
  position: absolute;
  background: white;
  width: 100%;
  top: 100%;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 2;
  height: calc(100vh - 265px);
  .dropdown-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .box {
    border: 1px solid #ddd;
    margin: 5px 0;
    padding: 5px;
    min-height: 110px;
    font-size: 14px;
    cursor: pointer; // 鼠标悬停时显示为手型

    &:hover {
      background-color: #f0f0f0; // 悬停时改变背景色
    }

    .bottom {
      display: block;
      font-size: 12px;
    }
  }
}

::v-depp .el-main {
  overflow: hidden !important;
}
::v-depp .el-header {
  overflow: hidden !important;
}

::v-deep .el-popper.is-light {
  padding: 0 !important;
  gap: 5px !important;
}

::v-deep .el-tabs--border-card {
  border: none !important;
  // box-sizing: none !important;
}
::v-deep .el-tabs__nav-scroll {
  border: none !important;
  // box-sizing: none !important;
}

::v-deep .el-button + .el-button {
  margin-left: 0px;
}

::v-deep .el-upload-dragger .el-upload__text em {
  color: #016fa0;
  font-style: normal;
}

::v-deep .el-tabs--border-card > .el-tabs__header {
  background-color: #fff;
  border-bottom: none;
}

::v-deep .el-slider {
  --el-slider-main-bg-color: #f00 !important;
}

::v-deep .el-message-box__header {
  background-color: #d7d7d7;
}

::v-deep .el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
  color: #333 !important;
  // background-color: var(--el-bg-color-overlay);
  border-right-color: white !important;
  border-left-color: white !important;
  //font-weight: bold !important;
  border-bottom: 2px solid #131b21 !important;
}

::v-deep .el-tabs--top.el-tabs--border-card > .el-tabs__header .el-tabs__item:last-child {
  font-weight: bold !important;
  color: #333 !important;
}

::v-deep .el-tabs--border-card > .el-tabs__header .el-tabs__item:first-child {
  font-weight: bold !important;
  color: #333 !important;
}

::v-deep
  .mainbox
  .text_area
  .audio_file
  .audio_file_main
  .audio_file_main_top
  .audio_top_right_area2_icon3
  .audio_top_right_area2_icon3_download[data-v-eda147ac] {
  margin-right: 56px;
  margin-bottom: 6px;
}

::v-deep.mainbox .text_area .audio_file .audio_file_main .audio_file_main_top .demo-tabs .demo-pane .text_area1[data-v-eda147ac] {
  display: flex;
  width: 98%;
  height: 100%;
  flex-wrap: wrap;
  align-content: center;
  justify-content: flex-start;
}
::v-deep .el-input__wrapper {
  height: 30px;
  border-radius: 5px;
  box-shadow: none;
  border: 1px solid #d4e0ea;
}
::v-deep .el-input__wrapper:hover {
  // border-color: none;
  box-shadow: none !important;
}
.my-icon-class {
  color: #333;
}

@media screen and (max-width: 600px) {
  .el-icon.my-icon-class {
    size: 8px;
    size: calc(8 * 0.01vw);
  }
}

@media screen and (min-width: 601px) and (max-width: 1000px) {
  .el-icon.my-icon-class {
    size: 10px;
    size: calc(10 * 0.01vw);
  }
}

@media screen and (min-width: 1001px) {
  .el-icon.my-icon-class {
    size: 13px;
    size: calc(13 * 0.01vw);
  }
}
.more-btn:focus {
  background: #f5f6f7;
  border-color: #333333;
}
.model-enter-active,
.model-leave-active {
  transition: all 0.2s;
  opacity: 1;
}

.model-enter-from,
.model-leave-to {
  opacity: 0;
  transform: translateY(-150px);
}
</style>
