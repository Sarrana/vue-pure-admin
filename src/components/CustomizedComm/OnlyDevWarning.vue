<script setup lang="ts">
import { WarningFilled } from "@element-plus/icons-vue";

const props = withDefaults(
  defineProps<{
    txt?: string;
  }>(),
  {
    txt: "非开发人员请勿配置！"
  }
);
</script>

<template>
  <div class="text-red-400 font-800 text-3xl flex items-center gap-1 mb-3">
    <el-icon><WarningFilled /></el-icon>
    <span class="">{{ txt }}</span>
  </div>
</template>
