<script setup lang="ts">
import { FORMITEMTYPE } from "@/constants/constant";
import { SearchFormItem } from "@/constants/types";
import { cloneDeep } from "@pureadmin/utils";
import type { FormInstance } from "element-plus";
import { reactive, ref } from "vue";
import { hasAuth } from "@/router/utils";

export interface SearchFormProps {
  params?: {};
  formList: SearchFormItem[];
  // onSearch: (values: any) => void;
}

// const props = defineProps<SearchFormProps>();
// const props = withDefaults(defineProps<SearchFormProps>(), {});

const props = defineProps({
  params: {
    type: Object
  },
  formList: {
    type: Array<SearchFormItem>
  },
  canReset: {
    type: Boolean,
    default: true
  }
});

const ruleFormRef = ref<FormInstance>();

const initData = reactive(cloneDeep(props.params));

const emit = defineEmits(["handleSearch"]);

const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log("submit!", valid, fields);
      emit("handleSearch", initData);
    } else {
      console.log("error submit!", fields);
    }
  });
};

const onReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  console.log("onReset");
  emit("handleSearch", {});
};
</script>

<template>
  <el-form ref="ruleFormRef" :inline="true" :model="initData">
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
        :clearable="item.clearable ?? true"
        :style="{ width: item.width ?? '140px' }"
      />
      <!-- select tree 树形菜单 -->
      <el-tree-select
        v-else-if="item.type === FORMITEMTYPE.SELECTTREE"
        v-model="initData[item.name]"
        :data="item.selOptions"
        :render-after-expand="false"
      />
      <!-- 下拉列表 -->
      <el-select
        v-else-if="item.type === FORMITEMTYPE.SELECT"
        v-model="initData[item.name]"
        :placeholder="item.placeholder"
        :clearable="item.clearable ?? true"
        :style="{ width: item.width ?? '80px' }"
      >
        <el-option
          v-for="selOption in item.selOptions"
          :key="selOption.value"
          :label="selOption.label"
          :value="selOption.value"
        />
      </el-select>
      <!-- 多选标签 -->
      <el-select
        v-else-if="item.type === FORMITEMTYPE.SELECTTAGS"
        v-model="initData[item.name]"
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
      <!-- 时间范围选择器 -->
      <el-date-picker
        v-else-if="item.type === FORMITEMTYPE.RANGEPICKER"
        v-model="initData[item.name]"
        type="daterange"
        range-separator="-"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        :style="{ width: item.width ?? '240px' }"
        format="YYYY-MM-DD"
      />
    </el-form-item>
    <el-form-item>
      <!-- <el-button type="primary" @click="onSubmit(ruleFormRef)">查询</el-button>
      <el-button v-if="canReset" @click="onReset(ruleFormRef)">重置</el-button> -->
      <el-button
        v-if="hasAuth('btn_inquire')"
        type="primary"
        @click="onSubmit(ruleFormRef)"
        >查询</el-button
      >
      <el-button
        v-if="canReset && hasAuth('btn_reset')"
        @click="onReset(ruleFormRef)"
        >重置</el-button
      >
    </el-form-item>
  </el-form>
</template>
