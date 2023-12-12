<script setup lang="ts">
import { tableData } from "./data";
import { transformI18n } from "@/plugins/i18n";

const columns: TableColumnList = [
  {
    // label: "日期",
    label: transformI18n("test.date"),
    prop: "date"
  },
  {
    label: "姓名",
    prop: "name"
  },
  {
    label: "地址",
    prop: "address"
  }
];
</script>

<template>
  <pure-table :data="tableData" :columns="columns" />
</template>
