<script setup lang="ts">
import { computed } from "vue";

const props = defineProps(["isDelDialogShow"]);
const emits = defineEmits(["update:isDelDialogShow", "handleDel"]);

const dialogVisible = computed({
  get: () => props.isDelDialogShow,
  set: val => {
    console.log("set dialogVisible", val);
    emits("update:isDelDialogShow", val);
  }
});

const handleDel = () => {
  emits("handleDel");
};
</script>

<template>
  <el-dialog v-model="dialogVisible" title="Tips" width="30%">
    <span>确定删除吗？</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleDel"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
