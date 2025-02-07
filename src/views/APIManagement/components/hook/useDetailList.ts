import { ITableHead, ITableAction, ITableConfig } from '@/components/AAUI';
import { ref, computed, VNode, h } from 'vue';
// import { PeakingPlanAction, dealShow } from '../types';
import { getKeyDetail, keyReq } from '@/api/APIManagement/management';

import { ElMessage, TableColumnCtx } from 'element-plus';
import { clearEmptyFields } from '@/utils/utils';
import dayjs from 'dayjs';
export const dealShow = (item: any) => {
  const save = item.create_time;
  const show = item.tokens;
  // console.log(show);

  return {
    ...item,
    tokenAll: item.tokenIn + item.tokenOut,
    createTime: dayjs(save).format('YYYY-MM-DD HH:mm'), // 修改格式化字符串
  };
};

export const useDetailListilList = () => {
  interface APIDeatil {
    id: number;
    createTime: string;
    modelName: string;
    appName: string;
    tokenAll: number;
    price: number;
    tokenSpeed: number;
    supplierName: string;
    [key: string]: string | number;
  }

  const filterHandler = (value: string, row: APIDeatil, column: TableColumnCtx<APIDeatil>) => {
    const property: string = column['property'];
    return row[property] === value;
  };
  const filterListOption = ref<any>([]);
  // table part
  const tableHead: any = computed(() => {
    return [
      { label: '时间', prop: 'createTime', align: 'left', minWidth: '180px', sortable: true },
      {
        label: '功能',
        prop: 'ability',
        align: 'left',
        minWidth: '120px',
      },
      {
        label: '模型 ',
        prop: 'model_name',
        align: 'left',
        minWidth: '120px',
        filters: filterListOption,
        //  [
        //   { text: 'chatglm3 turbo', value: 'chatglm3 turbo' },
        //   { text: '豆包', value: '豆包' },
        //   { text: '文心一言', value: '文心一言' },
        // ],
        filterMethod: filterHandler,
        className: 'table-list-filter',
      },
      { label: 'Tokens', prop: 'tokens', align: 'left', minWidth: '120px' },
      { label: '单价(元/千Tokens)', prop: 'price_unit', align: 'left', minWidth: '130px' },
      { label: '供应商', prop: 'supplier', align: 'left', minWidth: '120px' },
    ];
  });

  interface SummaryMethodProps<T = any> {
    columns: TableColumnCtx<T>[];
    data: T[];
  }
  const currentDate = new Date(new Date().setHours(0, 0, 0, 0));
  const timePick = ref([currentDate.getTime(), currentDate.getTime()]);
  const changeDate = (param: any) => {
    param.beginTime = timePick.value[0];

    param.endTime = timePick.value[1] + 86400000;
    getTableDetailList(param);
  };
  const getSummaries = (param: SummaryMethodProps) => {
    const { columns, data } = param;
    const sums: (string | VNode)[] = [];
    columns.forEach((column, index) => {
      if (index === 0) {
        sums[index] = h('div', { style: { textDecoration: '', fontWeight: 'bold' } }, ['合计']);
        return;
      }
      if (index === 1 || index === 2 || index === 5 || index === 6) {
        return;
      }
      // if (index === 2) {
      //   const values = data.map((item) => Number(item[column.property]));
      //   if (!values.every((value) => Number.isNaN(value))) {
      //     sums[index] = `${values.reduce((prev, curr) => {
      //       const value = Number(curr);
      //       if (!Number.isNaN(value)) {
      //         return prev + curr;
      //       } else {
      //         return prev;
      //       }
      //     }, 0)}`;
      //   } else {
      //     sums[index] = '';
      //   }
      // }
      if (index === 3) {
        // 将data中的每一项的column.property属性转换为数字，存入values数组中
        const values = data.map((item) => Number(item[column.property]));
        // console.log(values, 1);

        // 如果values数组中的所有值都不是NaN
        if (!values.every((value) => Number.isNaN(value))) {
          // 将values数组中的所有值相加，存入sums[index]中
          sums[index] = h('div', { style: { textDecoration: '', fontWeight: 'bold' } }, [
            `${values.reduce((prev, curr) => {
              const value = Number(curr);
              // 如果当前值不是NaN，则将其加到prev中
              if (!Number.isNaN(value)) {
                return prev + curr;
              } else {
                // 否则，返回prev
                return prev;
              }
            }, 0)}`,
          ]);
        } else {
          // 否则，将sums[index]置为空字符串
          sums[index] = '';
        }
        // 如果sums[index]不为空字符串
        // if (sums[index] != '') {
        //   // 将sums[index]除以data的长度，保留一位小数，转换为字符串
        //   sums[index] = (Number(sums[index]) / data.length).toFixed(1) + '';
        // }
      }
    });

    return sums;
  };
  const tableConfig: ITableConfig = {
    defaultSort: { prop: 'time', order: 'descending' },
    showSummary: true,
    // height: '530',
    summaryMethod: <any>getSummaries,
  };

  const totalData = ref(0);
  const tableData = ref<APIDeatil[]>([]);
  const tableLoading = ref<boolean>(false);
  const tableActionList: ITableAction[] = [
    { label: '查看', prop: 'show', icon: 'icon-chakan' },
    { label: '编辑', prop: 'edit', icon: 'icon-bianji' },
    { label: '删除', prop: 'remove', icon: 'icon-shanchu' },
  ];

  const getTableDetailList = async (params: keyReq) => {
    try {
      tableLoading.value = true;
      // console.log(clearEmptyFields(params), 'params');

      const res = await getKeyDetail(clearEmptyFields(params));
      filterListOption.value = [];
      if (res.code === 0 && res.data) {
        if (res.data.length > 0) {
          tableData.value = res.data.map((item: any) => {
            // if (item.created_time) {
            //   item.created_at = new Date(item.created_time).toISOString();
            // }
            if (!filterListOption.value.find((t: any) => t.value == item.model_name)) {
              filterListOption.value.push({ text: item.model_name, value: item.model_name });
            }
            return dealShow(item);
          });
          // console.log(tableData.value);
          totalData.value = res.data.total || 0;
        } else {
          tableData.value = [];
          totalData.value = 0;
        }
      } else {
        tableData.value = [];
        totalData.value = 0;
        // ElMessage.error(res.msg || '无数据');
      }
    } finally {
      tableLoading.value = false;
    }
  };

  //   const deletePlanSync = (planId: number) => {
  //     return new Promise((resolve, reject) => {
  //       deletePlan(planId).then((res) => {
  //         if (res.code === 0 && res.data) {
  //           ElMessage.success('作废成功');
  //           resolve(res);
  //         } else {
  //           ElMessage.error(res.msg || '作废失败');
  //           reject(res);
  //         }
  //       });
  //     });
  //   };

  return {
    tableHead,
    totalData,
    tableData,
    tableActionList,
    tableLoading,
    tableConfig,
    getTableDetailList,
    // deletePlanSync,
    timePick,
    changeDate,
  };
};
