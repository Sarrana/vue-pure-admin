<script setup lang="ts">
import { CANCELACION, FORMITEMTYPE, STATUS } from "@/constants/constant";
import { SearchFormItem } from "@/constants/types";
import type { FormInstance } from "element-plus";
import { computed, ref } from "vue";
import UploadImg from "@/components/CustomizedComm/UploadImg.vue";
import UploadMultiImg from "@/components/CustomizedComm/UploadMultiImg.vue";
import BigFileUploadMulti from "./BigFileUploadMulti.vue";
import { debounce } from "@pureadmin/utils";
import UploadImgRaw from "@/components/CustomizedComm/UploadImgRaw.vue";
import BaseEditor from "./BaseEditor.vue";

export interface FormConfigType {
  isInline?: boolean;
  canReset?: boolean; // 是否暂时取消按钮
  labelWidth?: number;
  isDisabled?: boolean;
  needReset?: boolean; // 点击取消时是否需要重置
}

interface PropsType {
  formConfig?: FormConfigType;
  params: object;
  formList: SearchFormItem[];
}

// const props = withDefaults(defineProps<PropsType>(), {
//   formConfig: () => {
//     return {
//       isInline: false,
//       canReset: false,
//       labelWidth: 100,
//       isDisabled: false,
//       needReset: true
//     };
//   }
// });

const props = defineProps({
  formConfig: {
    type: Object as PropType<FormConfigType>,
    default: () => {
      return {
        isInline: false,
        canReset: false, // 是否暂时取消按钮
        labelWidth: 110,
        isDisabled: false,
        needReset: true // 点击取消时是否需要重置
      };
    }
  },
  params: {
    type: Object,
    default: () => {}
  },
  formList: {
    type: Array as PropType<SearchFormItem[]>,
    default: () => []
  }
});

// const props = defineProps<PropsType>();

const ruleFormRef = ref<FormInstance>();

const initData = computed({
  get: () => props.params,
  set: val => {
    console.log(val);
  }
});

const emit = defineEmits(["handleSubmit", "handleReset"]);

const _onSubmit = async () => {
  console.log("_onSubmit", ruleFormRef.value);

  if (!ruleFormRef.value) return;
  await ruleFormRef.value.validate((valid, fields) => {
    if (valid) {
      console.log("submit! initData", valid, fields, initData);
      emit("handleSubmit", initData.value);
    } else {
      console.log("error submit!", fields);
    }
  });
};

const onSubmit = debounce(_onSubmit, 1000, true);

const onReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  if (props.formConfig.needReset) {
    formEl.resetFields();
  }
  console.log("onReset");
  emit("handleReset");
};
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :label-width="formConfig.labelWidth"
    :inline="formConfig.isInline"
    :model="initData"
    :disabled="formConfig.isDisabled"
  >
    <el-form-item
      v-for="(item, index) in props.formList"
      :key="index"
      :label="item.label ?? ''"
      :prop="item.prop ?? ''"
      :rules="item.rules ?? []"
    >
      <!-- 输入框 -->
      <el-input
        v-if="item.type === FORMITEMTYPE.INPUT"
        v-model="initData[item.name]"
        :placeholder="item.placeholder"
        :type="item.inputType"
        :clearable="item.clearable ?? true"
        :show-password="item.inputType === 'password' ? true : false"
        :style="{ width: item.width ?? '100%' }"
        :disabled="item.isDisabled ?? false"
      />
      <BaseEditor
        v-else-if="item.type === FORMITEMTYPE.EDITOR"
        v-model="initData[item.name]"
        :placeholder="item.placeholder"
        :disabled="item.isDisabled ?? false"
        :style="{ width: item.width ?? '100%' }"
      />
      <!-- 下拉列表 -->
      <el-select
        v-else-if="item.type === FORMITEMTYPE.SELECT"
        v-model="initData[item.name]"
        :placeholder="item.placeholder"
        :clearable="item.clearable ?? true"
        :style="{ width: item.width ?? '100%' }"
        :disabled="item.isDisabled ?? false"
      >
        <el-option
          v-for="selOption in item.selOptions"
          :key="selOption.value"
          :label="selOption.label"
          :value="selOption.value"
        />
      </el-select>
      <el-select
        v-else-if="item.type === FORMITEMTYPE.SELECTMULTI"
        v-model="initData[item.name]"
        :placeholder="item.placeholder"
        multiple
        filterable
        allow-create
        default-first-option
        :reserve-keyword="false"
        :clearable="item.clearable ?? true"
        :style="{ width: item.width ?? '100%' }"
        :disabled="item.isDisabled ?? false"
      />
      <el-tree-select
        v-else-if="item.type === FORMITEMTYPE.TREESELECT"
        v-model="initData[item.name]"
        :placeholder="item.placeholder"
        :clearable="item.clearable ?? true"
        :data="item.selOptions"
        :style="{ width: item.width ?? '100%' }"
        check-strictly
        :render-after-expand="false"
      />
      <!-- 日期范围选择器 -->
      <el-date-picker
        v-else-if="item.type === FORMITEMTYPE.RANGEPICKER"
        v-model="initData[item.name]"
        type="daterange"
        range-separator="-"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        :style="{ width: item.width ?? '100%' }"
      />
      <!-- 日期选择器 -->
      <el-date-picker
        v-else-if="item.type === FORMITEMTYPE.DATEPICKER"
        v-model="initData[item.name]"
        type="date"
        :style="{ width: item.width ?? '100%' }"
        :value-format="item.valueFormat"
      />
      <!-- 上传图片 -->
      <UploadImg
        v-else-if="item.type === FORMITEMTYPE.UPLOADIMG"
        v-model="initData[item.name]"
      />

      <!-- 上传图片 -->
      <UploadImgRaw
        v-else-if="item.type === FORMITEMTYPE.UPLOADIMGRAW"
        v-model="initData[item.name]"
      />

      <UploadMultiImg
        v-else-if="item.type === FORMITEMTYPE.UPLOADMULTI"
        v-model="initData[item.name]"
      />

      <!-- 上传视频 -->
      <BigFileUploadMulti
        v-else-if="item.type === FORMITEMTYPE.UPLOADVIDEO"
        v-model="initData[item.name]"
      />
      <!-- 多选标签 -->
      <!-- <el-select
        v-else-if="item.type === FORMITEMTYPE.SELECTTAGS"
        v-model="initData[item.name]"
        multiple
        filterable
        :placeholder="item.placeholder"
        style="width: 100%"
      >
        <el-option
          v-for="option in item.selOptions"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
      </el-select> -->
      <el-checkbox-group
        v-else-if="item.type === FORMITEMTYPE.SELECTTAGS"
        v-model="initData[item.name]"
      >
        <el-checkbox
          v-for="option in item.selOptions"
          :key="option.value"
          :label="option.value"
          :value="option.value"
          >{{ option.label }}</el-checkbox
        >
      </el-checkbox-group>
      <!-- switch 切换状态 -->
      <el-switch
        v-else-if="item.type === FORMITEMTYPE.SWITCH"
        v-model="initData[item.name]"
        :active-value="STATUS.TRUE"
        :inactive-value="STATUS.FALSE"
      />
      <!-- array 数组输入 -->
      <div v-else-if="item.type === FORMITEMTYPE.ARRAY">
        <div
          v-for="(tag, idx) in initData[item.name]"
          :key="idx"
          class="array-input-row"
        >
          <el-input
            ref="tagInputRef"
            v-model="initData[item.name][idx]"
            class="ml-1 w-20"
          />
          <el-button type="danger" @click="initData[item.name].splice(idx, 1)">
            消除
          </el-button>
        </div>
        <el-button type="success" @click="initData[item.name].push('')">
          添加
        </el-button>
      </div>
      <!-- radio -->
      <el-radio-group
        v-else-if="item.type === FORMITEMTYPE.RADIO"
        v-model="initData[item.name]"
        class="ml-4"
      >
        <el-radio
          v-for="option in item.selOptions"
          :key="option.value"
          :label="option.value"
          >{{ option.label }}</el-radio
        >
      </el-radio-group>
      <!-- tree 树形菜单 -->
      <el-tree
        v-else-if="item.type === FORMITEMTYPE.TREE"
        show-checkbox
        :data="initData[item.name]"
      />
      <!-- select tree 树形菜单 -->
      <el-tree-select
        v-else-if="item.type === FORMITEMTYPE.SELECTTREE"
        v-model="initData[item.name]"
        :data="item.selOptions"
        :render-after-expand="false"
      />
    </el-form-item>
    <el-form-item>
      <el-button v-if="formConfig.canReset" @click="onReset(ruleFormRef)">
        取消
      </el-button>
      <el-button type="primary" @click="onSubmit">确定</el-button>
      <!-- <el-button type="primary" v-btnAntiShake="onSubmit(ruleFormRef)"
        >确定</el-button
      > -->
    </el-form-item>
  </el-form>
</template>

<style scoped>
.array-input-row {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  margin-bottom: 0.5rem;
}
</style>
