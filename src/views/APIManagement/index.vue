<template>
  <div style="width: 100%; height: 100%; display: flex">
    <!-- <button @click="requestApiData">request</button> -->
    <div class="custom-table">
      <ACard class="card">
        <div class="card-header">
          <div class="card-header-info">
            <div style="font-weight: 900; color: #333">API-Keys</div>
            <button class="card-header-info-btn" @click="actionHandle('create')">创建API-Key</button>
          </div>
        </div>
        <div class="card-text">通过天元语音模型网关接入大模型，并管理你的密钥</div>
        <div>
          <ATable class="edit-table" :tableConfig="tableConfig" :tableHead="tableHead" :tableData="someTableData" :loading="tableLoading">
            <template #keyName="{ data }">
              <div>
                <div class="table-name">{{ data.keyName }}</div>
                <!-- <div class="table-name-Tokens">{{ data.tokenUsed }} Tokens</div> -->
              </div>
            </template>

            <template #tokenQuota="{ data }">
              <div class="table-tokenQuota">
                <div calss="table-name-Tokens" style="min-width: 90px">{{ data.tokenUsage.asr + data.tokenUsage.tts + data.tokenUsage.tta }}</div>
                <el-popover placement="top-start" :width="180" trigger="hover" popper-class="poooooover" teleported>
                  <div class="popoverpp">
                    <span style="grid-row: 1; display: grid; grid-template-columns: 1fr auto">
                      语音转文本&ensp;
                      <span>{{ data.tokenUsage.asr }}</span>
                    </span>
                    <span style="grid-row: 2; display: grid; grid-template-columns: 1fr auto">
                      文本转语音&ensp;
                      <span>{{ data.tokenUsage.tts }}</span>
                    </span>
                    <span style="grid-row: 3; display: grid; grid-template-columns: 1fr auto">
                      AI音效&ensp;
                      <span>{{ data.tokenUsage.tta }}</span>
                    </span>
                  </div>
                  <template #reference>
                    <el-icon size="15" class="icon-xilixili"> <AIcon icon="icon-xiangxixinxi" /> </el-icon>
                  </template>
                </el-popover>
              </div>
            </template>
            <template #apiKey="{ data }">
              <div>{{ data.apiKey.substr(0, 5) }}...{{ data.apiKey.substr(-4) }}</div>
            </template>
            <template #aiSoundEffect="{ data }">
              <el-switch v-model="data.aiSoundEffect" active-color="#13ce66" inactive-color="#ff4949" @change="handleSoundEffectChange(data)" />
            </template>
            <template #do="{ data }">
              <div class="icon">
                <div class="icon-div" @click="actionHandle(tableActionList[0].prop, data)">
                  <el-icon size="20" class="icon-color"> <AIcon :icon="tableActionList[0].icon" /> </el-icon>
                  {{ tableActionList[0].label }}
                </div>
                <div class="icon-div" @click="actionHandle(tableActionList[1].prop, data)">
                  <el-icon size="20" class="icon-color"> <AIcon :icon="tableActionList[1].icon" /> </el-icon>
                  {{ tableActionList[1].label }}
                </div>
                <el-popover :visible="data.visible" placement="top" :width="250" v-removeAriaHidden>
                  <p style="display: flex">
                    <el-icon size="20" class="popover_icon"> <AIcon icon="icon-gantanhao" /> </el-icon>是否确认删除？
                  </p>
                  <div class="popover_btn">
                    <el-button size="small" class="popover_btn1" @click="hiddenPopver(data)">取消</el-button>
                    <el-button size="small" class="popover_btn2" @click="deletePopver(data)">确认</el-button>
                  </div>
                  <template #reference>
                    <div class="icon-div" @click="actionHandle(tableActionList[2].prop, data)" v-click-outside="() => (data.visible = false)">
                      <el-icon size="20" class="icon-color"> <AIcon :icon="tableActionList[2].icon" /> </el-icon>
                      {{ tableActionList[2].label }}
                    </div>
                  </template>
                </el-popover>
              </div>
            </template>
          </ATable>
        </div>
      </ACard>
    </div>
    <!-- 创建弹窗 -->
    <div class="createDIv">
      <ADialog :title="adialogTitle" v-model:isShow="isShowEditDialog" :option="{ width: '600px', center: true }" hideAction>
        <div v-if="!isCreated" style="min-height: 100%">
          <div style="padding-top: 40px">
            <AForm ref="editFormRef" class="form" v-loading="editFormLoading" :list="editFormList" :data="editFormData" :rules="editFormRules" />
          </div>

          <div class="from-footer">
            <el-button class="from-footer-btn" @click="updateList">{{ adialogBtn }}</el-button>
          </div>
        </div>
        <div v-if="isShowKey" class="key_show" style="min-height: 100%">
          <div style="margin-top: 40px; width: 100%; padding-left: 40px">您的新密钥：</div>
          <div class="key_show_info">
            <el-input
              :autosize="{ minRows: 1 }"
              type="textarea"
              :rows="2"
              v-model="saveKey"
              placeholder="dede"
              class="key_show_info_input"
            ></el-input>

            <el-icon size="20" style="cursor: pointer" @click="copyRecord(saveKey)"><AIcon icon="icon-fuzhi"></AIcon></el-icon>
          </div>
          <div class="key_show_info_text">
            请立即复制并记在安全的地方。您将无法再次看到它。<span
              >您可以将其与OpenAI兼容的应用程序或<span class="key_show_info_text_owner" @click="jumpRouter">您自己的代码</span>一起使用</span
            >
          </div>
          <!-- <el-checkbox v-model="yourCheckboxModel" @change="handleCheckboxChange">开启AI音效</el-checkbox> -->
        </div>
      </ADialog>
    </div>

    <Detail ref="childRef" :apiKey="apiKey"></Detail>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: '/APIManagement',
});

import { useList } from './hook/useList';
import { useEdit } from './hook/useEdit';
import { FormRules, FormInstance, ElIcon, ElMessage, ElMessageBox, ClickOutside as vClickOutside } from 'element-plus';
import { onMounted, ref, watchEffect, nextTick, onActivated } from 'vue';
import Detail from './components/Detail.vue';
import { useRouter } from 'vue-router';
import { copyToClipboard } from '@/utils/commonUtil';
import { useUserStore } from '@/store/modules/user';
import { addKey } from '@/api/APIManagement/management';
import { watch } from 'vue';
import { ITableHead, ITableAction, ITableConfig } from '@/components/AAUI';

const isShowKey = ref(false);
const router = useRouter();
const userStore = useUserStore();
const userId = userStore.sysUser?.userID || '';
const { tableHead, tableData, tableActionList, tableLoading, getTableList } = useList();

const {
  editFormRef,
  editFormList,
  editFormData,
  editFormLoading,
  editFormRules,
  addHandleSync,
  editHandleSync,
  deleteHandleSync,
  isShowEditDialog,
  isCreated,
  key_textarea,
} = useEdit();

const adialogTitle = ref<string>('创建密钥');
const adialogBtn = ref<string>('创建');
const apiKey = ref('');
const childRef = ref();
const tableConfig: ITableConfig = {
  // defaultSort: { prop: 'time', order: 'descending' },
  // showSummary: true,
  height: '580px',
  width: '1000px',
  border: false,
  // summaryMethod: <any>getSummaries,
};

// 音效选择变化处理
const handleSoundEffectChange = (data) => {
  console.log('AI音效选择变化:', data.aiSoundEffect);
};

// 弹出动作
const actionHandle = (action: string, data?: any) => {
  if (action === 'create') {
    isShowEditDialog.value = true;
    editFormData.value = {};
    adialogTitle.value = '创建密钥';
    adialogBtn.value = '创建';
  } else if (action === 'edit') {
    isShowEditDialog.value = true;
    adialogTitle.value = '编辑密钥';
    adialogBtn.value = '提交';
    editFormData.value = JSON.parse(JSON.stringify(data));
    // console.log('修改', editFormData.value);
    // console.log('data', data);
  } else if (action === 'remove') {
    data.visible = true;
  } else {
    if (childRef.value) {
      apiKey.value = data.apiKey;
      // console.log(apiKey.value, 10);
      childRef.value.apikeyName = data.keyName;
      childRef.value.checkAdialog = true;
    }
  }
};

// 删除动作
const hiddenPopver = (data: any) => {
  data.visible = false;
};
const deletePopver = async (data: any) => {
  try {
    await deleteHandleSync(data.apiKey);
    await getTableList(userId);
    data.visible = false;
  } catch (error) {
    console.error('删除操作失败:', error);
  }
};

// 复制功能
const copyRecord = (item: string) => {
  const content = item;
  copyToClipboard({
    content,
    success() {
      ElMessage({
        message: '复制成功',
        type: 'success',
      });
    },
    error() {
      ElMessage({
        message: '复制失败',
        type: 'error',
      });
    },
  });
};

// 接口调用
const saveKey = ref();
let timer: ReturnType<typeof setTimeout> | null = null;

const updateList = () => {
  if (timer) {
    clearTimeout(timer);
  }

  timer = setTimeout(() => {
    editFormRef.value?.validate(async (valid: boolean) => {
      if (valid) {
        if (adialogBtn.value == '创建') {
          // console.log('创建api', editFormData.value.keyName);
          if (!editFormData.value.keyName) {
            ElMessage.error('请输入密钥名称');
          } else {
            saveKey.value = await addHandleSync();

            await getTableList(userId);
            isCreated.value = true;
            isShowKey.value = true;
          }
        } else {
          await editHandleSync();
          await getTableList(userId);
          isShowEditDialog.value = false;
        }
      }
    });

    timer = null;
  }, 300);
};

// 跳转使用指南
const jumpRouter = () => {
  router.push({ name: '/UsageGuide' });
};

watchEffect(() => {
  if (!isShowEditDialog.value) {
    isCreated.value = false;
    isShowKey.value = false;
    key_textarea.value = '';
  }
});
const someTableData = ref<any[]>([]);
const count = Number(50); //每次加载的数量
const nowIndex = ref(1); //初始index
function loadMoreData() {
  setTimeout(() => {
    const start = nowIndex.value * count;
    const end = Math.min((nowIndex.value + 1) * count, tableData.value.length);
    const data = tableData.value.slice(start, end);
    someTableData.value.push(...data);
    nowIndex.value++;
  }, 0);
}
onActivated(async () => {
  await getTableList(userId);

  someTableData.value = tableData.value.slice(0, count);
  const scrollContainer = document.querySelector('.edit-table .el-scrollbar__wrap');
  scrollContainer?.addEventListener('scroll', function () {
    const scrollTop = scrollContainer.scrollTop; // 已经滚动的距离
    const scrollHeight = scrollContainer.scrollHeight; // 内容总高度
    const clientHeight = scrollContainer.clientHeight; // 可视区域的高度

    if (scrollHeight - scrollTop - clientHeight < 50) {
      loadMoreData();
    }
  });
});

watch(
  () => tableData.value,
  (newVal) => {
    someTableData.value = newVal;
    // console.log(newVal);
  },
);

window.onload = function () {
  document.addEventListener('touchstart', function (event) {
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  });
  document.addEventListener('gesturestart', function (event) {
    event.preventDefault();
  });
};
</script>

<style lang="scss" scoped>
.poooooover {
  border: 1px solid var(--el-border-color-light);
  //background-color: #c80f0f !important;
  right: 0;
}
.popoverpp {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-template-rows: repeat(3, auto);
  column-gap: 10px;
}

// ::v-deep .a-dialog .el-dialog__header {
//   background-color: #edf1f4 !important;
// }
// ::v-deep.show-padding[data-v-a7333a4a] .el-card__body {
//     padding: 20px;
//     overflow: auto;
// }

.card {
  // zoom: 0.98;
  height: 100%;
  width: 100%;
  background: rgb(0, 0, 0, 0);
  padding: 80px 80px 20px 100px;
  border: none;
  border-radius: 0px;
  .card-header {
    height: 60px;

    font-size: 20px;
    font-weight: 700;
    border-bottom: 2px solid;
    border-image: linear-gradient(to right, #81d3f8, #c280ff) 1;
    .card-header-info {
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .card-header-info-btn {
        height: 40px;
        font-size: 20px;
        width: 200px;
        border: none;
        cursor: pointer;
        // background: #409eff;
        background: linear-gradient(to bottom right, #40a0ffee, #81d3f8);
        box-shadow: 0px 0px 3.5px rgb(0, 0, 0, 0.1);
        color: #fff;
        border-radius: 10px;
        font-weight: bold;
      }
    }
  }
  .card-text {
    font-size: 14px;
    color: #555555;
    margin-top: 20px;
    margin-bottom: 10px;
    padding-bottom: 10px;
  }
}
::v-deep .createDIv .a-dialog .el-dialog__header {
  background-color: rgb(237, 241, 244) !important; /* 修改头部背景颜色 */
  border-top-left-radius: 10px !important; /* 只设置左上角圆角 */
  border-top-right-radius: 10px !important; /* 只设置右上角圆角 */
}
::v-deep .el-dialog .el-dialog--center .a-dialog {
  border-radius: 10px !important;
}
.custom-table {
  min-width: 100%;
}

.edit-table {
  // zoom: 0.99;
  // min-width: calc(100vw - 470px);
  border-radius: 10px;
  :deep(.el-table) {
    white-space: nowrap !important; // 禁止内容换行
    // min-width: fit-content !important; // 自动适应内容宽度
    // min-width: calc(100vw - 470px);

    // height: calc(100vh - 390px) !important; // 动态适应窗口高度
    table-layout: auto; // 自动调整列宽
    --el-table-row-hover-bg-color: none;
    --el-table-current-row-bg-color: none;
    --el-text-color-regular: #333333;
    --el-fill-color-lighter: none;
  }
  :deep(
      .el-table
        .el-table__inner-wrapper
        .el-table__body-wrapper
        .el-scrollbar
        .el-scrollbar__wrap
        .el-scrollbar__view
        .el-table__body
        tbody
        .el-table__row
    ) {
    height: 40px !important;
  }

  .table-name {
    font-size: 14px;
    color: #333333;
  }

  .table-tokenQuota {
    display: flex;
    align-content: center;
    // justify-content: flex-start;

    .icon-xilixili {
      margin-top: 5px;
    }
  }

  .table-name-Tokens {
    font-size: 11px;
    color: #7f7f7f;
  }

  .icon {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    .icon-div {
      width: 65px;
      height: 30px;
      margin-right: 20px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      cursor: pointer;

      &:hover {
        border-radius: 10px;
        background: #deeef5;
      }

      .icon-color {
        color: var(--el-menu-active-bg-color);
      }
    }
  }
}

.form {
  // display: block;
  // height: 240px;
  // gap: 2px; // 设置每个元素之间的间距
  :deep(.el-input__wrapper) {
    background-color: #f5f6f7; // 保留原有样式
  }
  :deep(.el-input__wrapper:hover) {
    box-shadow: 0 0 0 1px #d2d6da !important;
  }
  // ::v-deep .el-form-item {
  //   display: flex;
  //   flex-direction: column;
  // }
}

.from-footer {
  display: flex;
  justify-content: end;
  align-items: center;
  padding: 15px 15px;
  border-top: 1px solid #d7d7d7;
  .from-footer-btn {
    height: 32px;
    font-size: 14px;
    width: 100px;
    background: #000000;
    // background: #000000;
    justify-content: center;
    color: #fff;

    font-weight: bold;
  }
}
::v-deep .el-button:hover {
  border-color: #fff !important;
}
.key_show {
  display: flex;
  align-items: center;
  flex-direction: column;
  color: #333333;
  .key_show_info {
    display: flex;
    justify-content: center;
    align-items: end;
    width: 90%;
    margin-bottom: 10px;
    font-size: 14px;
    .key_show_info_input {
      margin: 10px 10px 0px 10px;
    }
  }
  .key_show_info_text {
    font-weight: bold;
    text-indent: 2em;
    padding-bottom: 15px;
    margin: 10px 43px 15px 40px;
    span {
      font-weight: normal;
    }
    .key_show_info_text_owner {
      cursor: pointer;
      color: #1482c5;
    }
  }
}
.popover_icon {
  color: #ff7d00;
  margin-right: 10px;
}
.popover_btn {
  display: flex;
  justify-content: end;
  .popover_btn1 {
    background-color: var(--layout-bg-color);
    color: #1d2129;
    font-size: 14px;
  }
  .popover_btn2 {
    background-color: var(--el-menu-active-bg-color);
    color: #fff;
    font-size: 14px;
  }
}

::v-deep.from-footer .from-footer-btn[data-v-d0859e20] {
  height: 32px;
  font-size: 14px;
  width: 100px;
  // background: red !important;
  background: #000000;
  color: #fff;
  border-radius: 5px;
  font-weight: bold;
}

::v-deep.el-table__footer-wrapper tbody td.el-table__cell {
  background-color: #fff !important;
}
::v-deep .el-checkbox {
  width: 100px !important;
  height: 30px !important;
  // margin-right: 50px;
  // background-color: #1482c5;
}
// ::v-deep .el-table__header-wrapper {
//   width: 1220px !important;
// }
// ::v-deep .el-table__body-wrapper {
//   width: 1220px !important;
// }
// ::v-deep .table-box {
//   width: 300;
// }
::v-deep .el-table__inner-wrapper {
  height: 100% !important;
}
::v-deep .el-form-item__content {
  display: block !important;
  // padding-left: 0px !important;
}
::v-deep .el-dialog__body {
  padding: 0px !important;
  // min-height: 400px !important;

  // height: 900px !important;
}
::v-deep .el-input__suffix {
  display: none;
}

::v-deep .el-dialog__header {
  padding: 10px 10px;
}
::v-deep .el-dialog__headerbtn {
  margin-top: -10px;
}
::v-deep .el-form-item {
  margin-right: 0px !important;
}
// ::v-deep .el-form-item__content :hover {
//   box-shadow: 0 0 0 1px #d2d6da !important;
// }
::v-deep .edit-table div {
  border-radius: 10px;
}
</style>
