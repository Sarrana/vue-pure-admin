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
import { formatToken, getToken } from "@/utils/auth";
import ImgComWtDecPre from "@/components/CustomizedComm/ImgComWtDecPre.vue";
import { Picture as IconPicture } from "@element-plus/icons-vue";

interface IValidate {
  size?: number;
  width: number;
  height: number;
}

interface ISizeHint {
  ratio: unknown;
  width: number;
  height: number;
}

interface IProps {
  modelValue: string;
  accept?: string;
  sizeHint?: ISizeHint;
  validate?: IValidate;
}

const uploadRef = ref<UploadInstance>();

const emits = defineEmits(["update:modelValue"]);
const props = withDefaults(defineProps<IProps>(), {
  accept: "image/gif,image/webp,image/jpg,image/png,image/jpeg"
});

const src = computed({
  get: () => props.modelValue,
  set: val => {
    console.log("set imgUrl", val);
    emits("update:modelValue", val);
  }
});

// const imgPreSrc = computed({
//   get: () => props.modelValue,
//   set: val => {
//     console.log("set imgPreSrc", val);
//   }
// });

const imgPreSrc = ref(toRaw(props.modelValue));
const isLoadingShow = ref(false);

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
    src.value = res.data.relPath;
    imgPreSrc.value = res.data.absPath;
    console.log("UploadSuccess", isLoadingShow.value);
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
</script>

<template>
  <div v-loading="isLoadingShow" class="upload-img">
    <img v-if="imgPreSrc" :src="imgPreSrc" />
    <!-- <ImgComWtDecPre v-if="imgPreSrc" :src="imgPreSrc" /> -->
    <el-upload
      ref="uploadRef"
      :action="uploadApi.imageRaw"
      :on-success="handleUploadSuccess"
      :before-upload="beforeUpload"
      :on-error="handleError"
      :accept="accept"
      :limit="1"
      :on-change="handleChange"
      :on-exceed="handleExceed"
      :on-progress="handleProgress"
      :auto-upload="false"
      :headers="headers"
    >
      <template #trigger>
        <el-button type="primary" :disabled="isLoadingShow">{{
          src ? "替换" : "上传"
        }}</el-button>
      </template>
    </el-upload>
  </div>
</template>

<style scoped lang="scss">
.upload-img {
  display: flex;
  gap: 8px;

  ::v-deep(img) {
    max-width: 100px;
    max-height: 100px;
  }

  ::v-deep(.el-upload-list) {
    display: none;
  }
}
</style>
