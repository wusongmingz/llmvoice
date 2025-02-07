<template>
  <el-form ref="form" :model="searchComputed" status-icon label-width="auto" class="el-form" :rules="prop.rules" v-bind="config">
    <div v-for="item in filterList" :key="item.prop" :style="{ width: '100%', height: '70px', display: 'flex', paddingLeft: '80px' }">
      <el-form-item style="width: 77.5%" :label="item.label" :prop="item.prop">
        <el-input
          style="background-color: rgb(255, 255, 255)"
          v-if="item.type === 'input'"
          v-model="searchComputed[item.prop]"
          :placeholder="'请输入' + item.label"
          v-bind="item.option"
        />
      </el-form-item>
    </div>
    <div style="width: 100%; height: 100%; display: flex; padding-left: 80px">
      <div v-for="item in filterInputList" :key="item.prop" class="el-form-item" :style="{ display: 'flex', width: '22%', paddingRight: '20px' }">
        <el-form-item :label="item.label" :prop="item.prop">
          <div v-if="item.type === 'text'">{{ searchComputed[item.prop] }}</div>
          <el-select v-else-if="item.type === 'select'" v-model="searchComputed[item.prop]" :placeholder="'请选择' + item.label" v-bind="item.option">
            <el-option
              v-for="e in item?.selectOption?.options || []"
              :key="e[item?.selectOption?.value || 'value']"
              :label="e[item?.selectOption?.label || 'label']"
              :value="e[item?.selectOption?.value || 'value']"
            />
          </el-select>
          <el-radio-group v-else-if="item.type === 'radioGroup'" v-model="searchComputed[item.prop]" v-bind="item.option">
            <template v-if="item.option.type === 'button'">
              <el-radio-button
                v-for="e in item?.selectOption?.options || []"
                :key="e[item?.selectOption?.value || 'value']"
                :label="e[item?.selectOption?.value || 'value']"
                >{{ e[item?.selectOption?.label || 'label'] }}</el-radio-button
              >
            </template>
            <template v-else>
              <el-radio
                v-for="e in item?.selectOption?.options || []"
                :key="e[item?.selectOption?.value || 'value']"
                :label="e[item?.selectOption?.value || 'value']"
                >{{ e[item?.selectOption?.label || 'label'] }}</el-radio
              >
            </template>
          </el-radio-group>
          <el-date-picker
            v-else-if="item.type === 'datePicker'"
            v-model="searchComputed[item.prop]"
            :placeholder="'请选择' + item.label"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            v-bind="item.option"
          />
          <el-time-picker
            v-else-if="item.type === 'timePicker'"
            v-model="searchComputed[item.prop]"
            :placeholder="'请选择' + item.label"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            v-bind="item.option"
          />
          <el-time-select
            v-else-if="item.type === 'timeSelect'"
            v-model="searchComputed[item.prop]"
            :placeholder="'请选择' + item.label"
            v-bind="item.option"
          />
          <el-switch v-else-if="item.type === 'switch'" v-model="searchComputed[item.prop]" v-bind="item.option" />
          <el-rate v-else-if="item.type === 'rate'" v-model="searchComputed[item.prop]" />
          <el-input-number v-else-if="item.type === 'number'" v-model="searchComputed[item.prop]" v-bind="item.option" />
          <el-cascader
            v-else-if="item.type === 'cascader'"
            v-model="searchComputed[item.prop]"
            :placeholder="'请选择' + item.label"
            v-bind="item.option"
          />
          <el-slider v-else-if="item.type === 'slider'" v-model="searchComputed[item.prop]" v-bind="item.option" />
          <el-upload class="form-upload" v-else-if="item.type === 'upload'" v-model:file-list="searchComputed[item.prop]" v-bind="item.option">
            <el-button type="primary">选择文件</el-button>
          </el-upload>
          <el-tree-select
            v-else-if="item.type === 'treeSelect'"
            v-model="searchComputed[item.prop]"
            :placeholder="'请选择' + item.label"
            v-bind="item.option"
          />

          <el-checkbox
            border
            size="small"
            style="width: 90px"
            class="form-checkbox"
            v-else-if="item.type === 'checkbox'"
            :label="item.label2"
            v-model="searchComputed[item.prop]"
            v-bind="item.option"
            @change="() => changeStatus(item)"
          ></el-checkbox>
          <slot v-else :name="item.prop" :data="searchComputed"></slot>
        </el-form-item>
      </div>
    </div>
  </el-form>
</template>
<script setup lang="ts">
/**
 * @prop {IForm[]} list - 可选, table-colume的配置项, 会设置到所有内容列, 对象属性与 element plus 官网在 el-table-colume 标签上的属性一致
 *    @typedef {object} IForm
 *          @property {string} label - 必填, 表单名称
 *          @property {string} prop - 必填, 字段名称
 *          @property {'select' | 'switch' | 'input' | 'number' | 'cascader' | 'treeSelect' | 'datePicker' | 'timePicker' | 'timeSelect' | 'radioGroup' | 'rate' | 'slider' | 'upload' | 'slot'} type - 必填, 表单种类
 *          @property {number} column - 可选, 这一项在此行占比, 例如 1 占满此行, 2 为此行一半
 *          @property {any} option - 可选, element plus 官网在 对应类型表单 标签上的属性
 *          @property {object} selectOption - 可选, { options: Array<any>; label?: string; value?: string; } options: 选择框列表, label: 自定义options中显示字段  value: 自定义options中绑定值字段
 * @prop {any} data - 必填, 与父组件双向绑定
 * @prop {FormRules} rules - 可选, element plus 规定的表单校验类型一致
 * @prop {Partial<FormProps>} config - 可选, 支持 element plus 在 Form 上的属性
 * @prop {number} column - 可选, 每一项在此行占比, 例如 1 占满此行, 2 为此行一半
 */
import { computed, onMounted, ref, watch } from 'vue';
import { IForm } from './types/form';
import { inputEmits, type FormInstance, type FormProps, type FormRules } from 'element-plus';
const filterInputList = computed(() => {
  return prop.list.filter((item) => item.type !== 'input');
});
const filterList = computed(() => {
  return prop.list.filter((item) => item.type === 'input');
});
const firstCheckBox = ref(true);
const changeStatus = (item: any) => {
  // console.log('searchComputed：', searchComputed);

  item.status = !item.status; // 根据需要切换或修改属性
};
const prop = withDefaults(
  defineProps<{
    data: any;
    list: IForm[];
    rules?: FormRules;
    column?: number;
    config?: Partial<FormProps>;
  }>(),
  {
    column: 1,
    rules: () => ({}),
  },
);

const form = ref<FormInstance>();
function validate(callback: (valid: boolean) => void) {
  return form.value?.validate(callback);
}

function resetFields() {
  form.value?.resetFields();
}

function clearValidate() {
  form.value?.clearValidate();
}

defineExpose({
  resetFields,
  validate,
  clearValidate,
});
onMounted(() => {
  watch(
    () => searchComputed,
    (newVal, oldVal) => {
      // console.log(searchComputed);
    },
  );
});
const searchComputed = computed({
  get: () => {
    return prop.data;
  },
  set: () => {
    // 这里的计算属性 get 返回的是 prop.searchData 这个对象
    // 当修改 searchData 中的属性时, 不会修改 searchData 的引用, 因此不会触发 set
    // 但是这样做却能够实现修改 prop 中的属性, 利用这个绕过了 prop 单向数据流的 ts 语法检查
    // 这个问题是否需要优化？
  },
});
</script>

<style scoped>
.el-form {
  display: flex;
  flex-direction: column;
  /* border-radius: 50px; */
}
.form-checkbox {
  /* margin: 0 !important; */
}
.el-form-item {
  /* margin-right: 20px; */
}
/* .el-form-item:hover {
  border-color: #ff0000;
  
} */
/* .form-checkbox{

} */
/* :class="item.type ==='checkbox'? 'el-form-item':''"  */
</style>
