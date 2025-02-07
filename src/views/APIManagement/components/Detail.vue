<template>
  <div class="box1">
    <ADialog class="detail-class" v-model:isShow="checkAdialog" :option="{ width: '70%' }" hideAction>
      <template #header>
        <div class="a_header">
          API-Key&nbsp;<span>使用日志</span>
          <el-icon size="23" style="cursor: pointer" @click="getTableList"> <AIcon icon="icon-shuaxin" /> </el-icon>
          <span style="padding-left: 60px; font-size: 16px">{{ apikeyName }}</span>
          <div style="flex: 1"></div>
          <div style="width: 450px; display: flex; align-items: center; margin-right: 100px">
            <span style="font-size: 15px">日期范围</span>

            <el-date-picker
              v-model="timePick"
              style="height: 36px"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="default"
              value-format="x"
              v-bind="{ ...dateSelectDisabled }"
              @change="changeDate(searchData)"
            >
              <template #range-separator>
                <span style="font-size: 14px; margin-bottom: 1.5px">至</span>
              </template>
            </el-date-picker>
          </div>
        </div>
      </template>
      <!-- <ATable
      class="table-list"
      :tableConfig="tableConfig"
      :tableHead="tableHead"
      :tableData="tableData"
      :loading="tableLoading"
      :height="500"
      :total="totalData"
      v-model:pageSize="searchData.pageSize"
      v-model:currentPage="searchData.pageNum"
      @pageChange="getTableList"
    >
      <template #supplierName="{ data }">
        <div class="table-name">
          <div>{{ data.supplierName }}</div>
          <el-icon size="18" class="table-name-icon" @click="jumpRouter"> <AIcon icon="icon-dianjichakan" /> </el-icon>
        </div>
      </template>
    </ATable> -->
      <ATable class="table-list" :tableConfig="tableConfig" :tableHead="tableHead" :tableData="tableData" :loading="tableLoading" :height="650">
        <template #modelName="{ data }">
          <div class="table-name">
            <div>{{ data.modelName }}</div>
            <el-icon size="18" class="table-name-icon"> <AIcon icon="icon-dianjichakan" /> </el-icon>
          </div>
        </template>
        <!-- <template #supplierName="{ data }">
        <div class="table-name">
          <div>{{ data.supplierName }}</div>
          <el-icon size="18" class="table-name-icon" @click="jumpRouter"> <AIcon icon="icon-dianjichakan" /> </el-icon>
        </div>
      </template>
      <template #tokenAll="{ data }">
        <div class="table-name">
          <div>{{ data.tokenAll }}</div>
          <el-icon size="18" class="table-name-icon" > <AIcon icon="icon-dianjichakan" /> </el-icon>
        </div>
      </template> -->
      </ATable>
    </ADialog>
  </div>
</template>

<script setup lang="ts">
// import CircleCloseFilled from 'element-plus';
// const prop = defineProps<{
//   isShowDialog: boolean;
//   type: string;
// }>();
import { ref, watch } from 'vue';
import { useDateSelectDisabled } from '@/hook/useTimeTools';

import { useDetailListilList } from './hook/useDetailList';
import { useThemeStore } from '@/store/modules/theme';
import { useRouter } from 'vue-router';
const dateSelectDisabled = useDateSelectDisabled(7);

import { useLocalStorage } from '@/utils/storage';
const storage = useLocalStorage();
const router = useRouter();
const props = defineProps({
  apiKey: String,
});
const saveApikey = ref();
const apikeyName = ref('');
const dateValue = ref('');
watch(
  () => props.apiKey, // 监听的目标
  (newApiKey) => {
    // 当 apiKey 变化时调用的回调函数
    saveApikey.value = props.apiKey;
    // console.log(saveApikey.value, 'props.apiKey');
    searchData.value.apiKey = saveApikey.value;
    // console.log(searchData.value);

    getTableList();
  },
);
const checkAdialog = ref<boolean>(false);

watch(
  () => checkAdialog.value,
  (newv) => {
    if (!newv) {
      //重置
      const currentDate = new Date(new Date().setHours(0, 0, 0, 0));

      timePick.value = [currentDate.getTime(), currentDate.getTime()];
      searchData.value.beginTime = timePick.value[0];
      searchData.value.endTime = timePick.value[1] + 86400000;
      getTableList();
    }
  },
);
const { tableHead, tableData, tableActionList, tableLoading, totalData, tableConfig, getTableDetailList, timePick, changeDate } =
  useDetailListilList();
defineExpose({
  checkAdialog,
  apikeyName,
});
const searchData = ref({
  order: 'DESC',
  orderBy: 'create_time',
  apiKey: saveApikey.value,
  beginTime: timePick.value[0],
  endTime: timePick.value[1] + 86400000,
});

const getTableList = async () => {
  try {
    const response = await getTableDetailList(searchData.value);
    // console.log('接口返回的数据:', response);
    // 这里处理响应数据
  } catch (error) {
    console.error('请求接口时发生错误:', error);
  }
};

// watch(checkAdialog, (value) => {
//   if (value) {
//     getTableList(); //传入的userId todo
//   }
// });
//跳转使用指南
const jumpRouter = () => {
  router.push({ name: '/LargeModelsList' });
};
</script>

<style lang="scss" scoped>
.a_header {
  font-size: 20px;
  font-weight: bold;
  display: flex;
  align-items: center;
  span {
    font-weight: normal;
    margin-right: 10px;
  }
}
.table-list {
  color: #333;
  :deep(.el-table) {
    // --el-color-primary: var(--el-menu-active-bg-color);
    --el-table-row-hover-bg-color: var(--table-row-bg-hover);
    --el-table-current-row-bg-color: var(--table-row-bg-hover);
    --el-text-color-regular: #333333;
    --el-fill-color-lighter: var(--table-row-striped);
    // --el-table-current-row-bg-color
    :deep(:v-deep.el-table__footer-wrapper tbody td.el-table__cell) {
      background-color: #fff !important;
    }
  }
  // :deep(.el-table .cell) {
  //   display: flex;
  //   justify-content: space-around;
  //   align-items: center;
  // }

  :deep(.el-pager li.is-active) {
    background-color: var(--el-menu-hover-bg-color);
  }
  :deep(.el-pager li:hover) {
    background-color: var(--el-menu-hover-bg-color);
  }

  :deep(.el-select .el-input__inner) {
    background-color: #fff;
  }

  .table-name {
    display: flex;
    justify-content: space-between;
    .table-name-icon {
      cursor: pointer;
      color: #bcbcbc;
    }
  }
}
::v-deep.el-table__footer-wrapper tbody td.el-table__cell {
  background-color: #fff !important;
}
::v-deep.el-table th.el-table__cell > .cell.highlight {
  color: #333 !important;
}
::v-deep .el-popup-parent--hidden .el-popper-container-8447 .el-popper div .el-table-filter__bottom {
  // padding: 20px !important;
  background-color: black !important;
}
::v-deep .el-table-filter__bottom {
  background-color: black !important;
}
::v-deep .el-table__row :hover {
  // background-color: #eceff6 !important;
  // background-color: #285dda !important;
}

// ::v-deep .a-dialog .el-dialog__header {
//   padding: 10px 20px !important;
// }

.box1 {
  :deep(.el-dialog__body) {
    border-radius: 0px 0px 10px 10px !important;
  }
}
</style>
