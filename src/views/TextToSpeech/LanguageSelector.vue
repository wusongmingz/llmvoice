<template>
  <div class="sound-list-right">
    <div class="text-title">请选择文本转语音的语言，保证选择的语言和输入的文本一致</div>
    <div class="lang-list">
      <el-button
        v-for="(language, index) in languages"
        :key="index"
        :class="['lang-btn', 'btn-hover', selectedLanguage?.lang == language?.lang ? 'selected-language' : '']"
        @mouseover="hoverLanguage(language)"
        @mouseleave="resetHover"
        @click="selectLanguage(language)"
      >
        {{ language?.display }}
      </el-button>
      <el-dropdown :disabled="!isShowMore" v-if="extraLanguages.length > 0">
        <el-button
          class="dropdown-btn btn-hover"
          :disabled="!isShowMore"
          :class="[
            extraLanguages.find((item) => {
              item?.lang == selectedLanguage?.lang;
            })
              ? 'selected-language'
              : '',
          ]"
          >更多</el-button
        >
        <template v-slot:dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="(extraLanguage, extraIndex) in extraLanguages" :key="extraIndex" @click="selectLanguage(extraLanguage)">
              {{ extraLanguage?.display }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
const props = defineProps({
  langs: {
    type: Array,
    default: () => [{}],
  },
});
const isShowMore = ref(true);
const languages = computed(() => props.langs.slice(0, 5));
const extraLanguages = computed(() => props.langs.slice(5));
const selectedLanguage = ref(null);
const hoveredLanguage = ref(null);

const selectLanguage = (language) => {
  selectedLanguage.value = language;
};
const hoverLanguage = (language) => {
  hoveredLanguage.value = language;
};
const resetHover = () => {
  hoveredLanguage.value = null;
};
watch(
  () => props.langs,
  (newVal, oldVal) => {
    if (props.langs) {
      if (selectedLanguage.value === null || selectLanguage.value === undefined) {
        selectLanguage(newVal[0]);
      }
      if (props.langs.length <= 4) {
        isShowMore.value = false;
      } else {
        isShowMore.value = true;
      }
    }
  },
  { immediate: true, deep: true },
);
defineExpose({
  selectedLanguage,
});
</script>

<style lang="scss" scoped>
.selected-language {
  background-color: #f5f6f7 !important;
  color: #333 !important;
  border: 1px solid black !important;
}

.sound-list-right {
  width: 100%;
  height: 100%;
  display: flex;
  padding: 9px 0px;
  // padding-top: 13px;
  flex-direction: column;
  overflow-x: auto;
  justify-content: space-between;
  // justify-content: space-between;
  // .overFlow::-webkit-scrollbar {
  //   display: none;
  // }
}
// .sound-list-right::-webkit-scrollbar {
//   display: none;
// }
.more-button {
  color: #333; /* “更多”按钮为黑色文本 */
}
.text-title {
  font-size: 15px;
  font-weight: bold;
  width: 100%;
  white-space: nowrap;
}
.lang-list {
  width: 100%;
  height: 30px;
  display: flex;
  gap: 5px;
}
.lang-btn {
  min-width: 80px;
  height: 30px;
  font-size: 14px;
  margin-left: 0px !important;
  border: 1px solid #d4e0ea;
}
.dropdown-btn {
  width: 70px;
  height: 30px;
  font-size: 14px;
}
.btn-hover:hover {
  background-color: #f5f6f7 !important;
  color: #333 !important;
  border: 1px solid black !important;
}
.btn-hover:focus {
  background-color: #f5f6f7 !important;
  color: #333 !important;
  // box-shadow: none !important;
  border: 1px solid black !important;
}
::v-deep .el-dropdown-menu__item:not(.is-disabled):focus {
  background-color: #f5f6f7;
  color: #333;
}
</style>
