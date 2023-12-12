<script setup lang="ts">
/** UploadImg component
 * use: <UploadImg v-model="src" />
 * (src is your variable to set and get the uploaded url)
 */

import { uploadApi } from "@/api/upload";
import {
  ElMessage,
  genFileId,
  UploadFile,
  UploadFiles,
  UploadInstance,
  UploadProgressEvent,
  UploadProps,
  UploadRawFile,
  UploadUserFile
} from "element-plus";
import { computed, ref, toRaw } from "vue";
import { Plus, CloseBold } from "@element-plus/icons-vue";
import ImgComWtDecPre from "@/components/CustomizedComm/ImgComWtDecPre.vue";
import { formatToken, getToken } from "@/utils/auth";

const uploadRef = ref<UploadInstance>();

const props = defineProps(["modelValue"]);
const emits = defineEmits(["update:modelValue"]);

const src = computed({
  get: () => props.modelValue,
  set: val => {
    console.log("set imgUrl", val);
    emits("update:modelValue", val);
  }
});

const imgPreSrc = ref(toRaw(props.modelValue));
const isLoadingShow = ref(false);
const fileList = ref<UploadUserFile[]>([]);

if (props.modelValue) {
  console.log(1, props.modelValue, "list Img");
  fileList.value = props.modelValue;
}
console.log(fileList.value, "list Img");
const beforeUpload: UploadProps["beforeUpload"] = rawFile => {
  console.log("beforeUpload");
  if (!rawFile.type.startsWith("image/")) {
    ElMessage.error("请上传图片!");
    return false;
  } else if (rawFile.size / 1024 / 1024 > 10) {
    ElMessage.error("图片不能超过 10MB!");
    return false;
  }
  isLoadingShow.value = true;
  return true;
};

const handleUploadSuccess: UploadProps["onSuccess"] = (res, uploadFile) => {
  console.log("handleUploadSuccess", res, uploadFile);
  // src.value = URL.createObjectURL(uploadFile.raw!);
  if (res.success) {
    isLoadingShow.value = false;
    // fileList.value.push(`https://zhaodehong.xyz/` + res.data.relPath);
    fileList.value.push(res.data.absPath);
    const images = fileList.value.join(",");
    src.value = images;
    imgPreSrc.value = res.data.absPath;
    console.log("UploadSuccess", isLoadingShow.value, src.value);
  } else {
    ElMessage({ message: "上传失败，请稍后重试", type: "error" });
  }
};

const handleError: UploadProps["onError"] = (err, uploadFile, uploadFiles) => {
  console.log("error: ", err, uploadFile, uploadFiles);
};

const handleExceed: UploadProps["onExceed"] = files => {
  uploadRef.value!.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  uploadRef.value!.handleStart(file);
};

const handleChange: UploadProps["onChange"] = file => {
  console.log("----handleChange--", file);
  if (!file) return;
  submitUpload();
};

const handleProgress: UploadProps["onProgress"] = (
  evt: UploadProgressEvent,
  uploadFile: UploadFile,
  uploadFiles: UploadFiles
) => {
  // console.log("---handleProgress----", evt, uploadFile, uploadFiles);
  console.log(evt.loaded / evt.total);
};

const submitUpload = () => {
  console.log("submitUpload");

  uploadRef.value.submit();
};

const headers = {
  Authorization: formatToken(getToken().accessToken)
};

const handleRemove: UploadProps["onRemove"] = (
  uploadFile: UploadFile,
  uploadFiles
) => {
  let index = fileList.value.indexOf((uploadFile.response as any).data.relPath);
  if (index > -1) {
    fileList.value.splice(index, 1);
  }
  emits("update:modelValue", fileList.value);
  console.log(
    fileList.value,
    (uploadFile.response as any).data.relPath,
    "test remove"
  );
};

const removeFile = img => {
  let index = fileList.value.indexOf(img);
  if (index > -1) {
    fileList.value.splice(index, 1);
  }
  emits("update:modelValue", fileList.value);
  console.log(fileList.value, img, "test remove");
};
</script>

<template>
  <div v-for="(img, index) in fileList" :key="index" class="upload-img">
    <ImgComWtDecPre :src="img.url" />
    <el-icon @click="removeFile(img)"><CloseBold /></el-icon>
  </div>
  <el-upload
    ref="uploadRef"
    v-loading="isLoadingShow"
    class="upload-add"
    :action="uploadApi.image"
    :on-success="handleUploadSuccess"
    :before-upload="beforeUpload"
    :on-error="handleError"
    accept="image/*"
    list-type="picture-card"
    :on-remove="handleRemove"
    :on-progress="handleProgress"
    :on-exceed="handleExceed"
    :auto-upload="false"
    :on-change="handleChange"
    :headers="headers"
  >
    <el-icon><Plus /></el-icon>
  </el-upload>
</template>

<style scoped lang="scss">
.upload-img {
  display: flex;
  gap: 8px;

  ::v-deep(img) {
    max-width: 148px;
    max-height: 148px;
  }

  ::v-deep(.el-upload-list) {
    display: none;
  }
}

.upload-add {
  display: flex;
  gap: 8px;

  ::v-deep(img) {
    max-width: 148px;
    max-height: 148px;
  }

  ::v-deep(.el-upload-list__item) {
    display: none;
  }
}
</style>
