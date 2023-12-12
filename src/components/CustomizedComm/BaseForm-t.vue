<script setup lang="ts">
import { FORMITEMTYPE } from "@/constants/constant";
import { FormConfigType, SearchFormItem } from "@/constants/types";
import type { FormInstance } from "element-plus";
import { computed, ref } from "vue";
import UploadImg from "@/components/CustomizedComm/UploadImg.vue";
import BigFileUpload from "./BigFileUpload.vue";

const enum CANCELACION {
  RESET,
  CALLBACK,
  CLOSE
}

/* interface FormConfigType {
  isInline?: boolean; // 是否为行内表单
  confirmBtnTxt?: string;
  cancelBtnTxt?: string; // 取消按钮文字，如果没有则不显示取消按钮
  labelWidth?: number; // label宽度
  isDisabled?: boolean; // 表单是否禁用
  cancelAction?: CANCELACION; // 点击取消时是否需要重置
} */

interface PropsType {
  formConfig?: FormConfigType;
  params: object;
  formList: SearchFormItem[];
}

const props = withDefaults(defineProps<PropsType>(), {
  formConfig: () => {
    return {
      // 默认按弹窗表单默认值配置
      isInline: false,
      confirmBtnTxt: "确定",
      cancelBtnTxt: "", // "取消", 默认不显示取消按钮
      labelWidth: 100,
      isDisabled: false,
      cancelAction: CANCELACION.RESET // 默认点击取消按钮为重置表单
    };
  }
});

const ruleFormRef = ref<FormInstance>();

const formData = computed({
  get: () => props.params,
  set: val => {
    console.log(val);
  }
});

const emit = defineEmits(["handleSubmit", "handleCancel"]);

const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log("-----onSubmit-------", formData.value);
      emit("handleSubmit", formData.value);
    } else {
      console.log("error submit!", fields);
    }
  });
};

const onCancel = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  if (props.formConfig.cancelAction === CANCELACION.RESET) {
    formEl.resetFields();
  } else {
    emit("handleCancel");
  }
};
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :label-width="formConfig.labelWidth"
    :inline="formConfig.isInline"
    :model="formData"
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
        v-model="formData[item.name]"
        :placeholder="item.placeholder"
        :type="item.inputType"
        :clearable="item.clearable ?? true"
        :show-password="item.inputType === 'password' ? true : false"
        :style="{ width: item.width ?? '100%' }"
      />
      <!-- 下拉列表 -->
      <el-select
        v-else-if="item.type === FORMITEMTYPE.SELECT"
        v-model="formData[item.name]"
        :placeholder="item.placeholder"
        :clearable="item.clearable ?? true"
        :style="{ width: item.width ?? '100%' }"
      >
        <el-option
          v-for="selOption in item.selOptions"
          :key="selOption.value"
          :label="selOption.label"
          :value="selOption.value"
          :style="{ width: item.width ?? '100%' }"
        />
      </el-select>
      <!-- 时间范围选择器 -->
      <el-date-picker
        v-else-if="item.type === FORMITEMTYPE.RANGEPICKER"
        v-model="formData[item.name]"
        type="daterange"
        range-separator="-"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        :style="{ width: item.width ?? '100%' }"
      />
      <!-- 上传图片 -->
      <UploadImg
        v-else-if="item.type === FORMITEMTYPE.UPLOADIMG"
        v-model="formData[item.name]"
      />
      <!-- 上传视频 -->
      <BigFileUpload
        v-else-if="item.type === FORMITEMTYPE.UPLOADVIDEO"
        v-model="formData[item.name]"
      />
      <!-- 多选标签 -->
      <el-select
        v-else-if="item.type === FORMITEMTYPE.SELECTTAGS"
        v-model="formData[item.name]"
        multiple
        filterable
        :placeholder="item.placeholder"
        :style="{ width: item.width ?? '100%' }"
      >
        <el-option
          v-for="option in item.selOptions"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
      </el-select>
      <!-- switch -->
      <el-switch
        v-else-if="item.type === FORMITEMTYPE.SWITCH"
        v-model="formData[item.name]"
      />
    </el-form-item>
    <el-form-item>
      <el-button v-if="formConfig.cancelBtnTxt" @click="onCancel(ruleFormRef)"
        >{{ formConfig.cancelBtnTxt }}
      </el-button>
      <el-button type="primary" @click="onSubmit(ruleFormRef)">确定</el-button>
    </el-form-item>
  </el-form>
</template>
