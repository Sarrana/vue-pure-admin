<script setup lang="ts">
/** UploadBigFile chunk component
 * use: <BigFileUpload v-model="src" />
 * (src is your variable to set and get the uploaded url)
 */
import { uploadBigFile } from "@/api/upload";
import { UploadFilled } from "@element-plus/icons-vue";
import { ElMessage, genFileId, UploadProps, UploadRawFile } from "element-plus";
import SparkMD5 from "spark-md5";
import { computed, ref, toRaw, watch } from "vue";
import VideoCom from "@/components/CustomizedComm/VideoCom.vue";

const uploadRef = ref();

// const props = defineProps(["modelValue"]);
const props = defineProps({
  modelValue: {
    type: Array
  },
  accept: {
    type: String,
    default: "video/mp4"
  }
});
const emits = defineEmits(["update:modelValue"]);

// const videoUrl = computed({
//   get: () => props.modelValue,
//   set: val => {
//     console.log("set videoUrl", val);
//     emits("update:modelValue", val);
//   }
// });

// const videoPreSrc = computed({
//   get: () => toRaw(videoUrl.value),
//   set: val => {
//     console.log(val);
//   }
// });
const fileList = ref([]);

if (props.modelValue) {
  props.modelValue.forEach((item: any, index) => {
    console.log(item, "testing thumbnail");
    const fileObject = {
      duration: item.duration,
      memorySize: item.memorySize,
      videoPath: item.videoPath,
      name: item.name
    };
    fileList.value.push(fileObject);
  });
}

const videoPreSrc = ref(toRaw(props.modelValue));
console.log(videoPreSrc, "videoRev");
const percent = ref(0);
// const fileUrl = ref("");
const upload = ref(true);
const percentCount = ref(0);
const file = ref("");

const chunkList = ref([]);
const hash = ref("");
const showStatusTxt = ref("");
const videoDuration = ref("");

const handleChange = async _file => {
  if (!_file) return;
  percent.value = 0;
  percentCount.value = 0;
  // videoUrl.value = "";
  videoDuration.value = "";
  showStatusTxt.value = "";
  // 获取文件并转成 ArrayBuffer 对象
  const fileObj = _file.raw;
  file.value = fileObj.name;
  let buffer;
  try {
    buffer = await fileToBuffer(fileObj);
  } catch (e) {
    console.log(e);
  }

  // 将文件按固定大小（6M）进行切片，注意此处同时声明了多个常量
  const chunkSize = 6291456,
    _chunkList = [], // 保存所有切片的数组
    chunkListLength = Math.ceil(fileObj.size / chunkSize), // 计算总共多个切片
    suffix = /\.([0-9A-z]+)$/.exec(fileObj.name)[1]; // 文件后缀名

  // 根据文件内容生成 hash 值
  const spark = new SparkMD5.ArrayBuffer();
  spark.append(buffer);
  const _hash = spark.end();

  // 生成切片，这里后端要求传递的参数为字节数据块（chunk）和每个数据块的文件名（fileName）
  let curChunk = 0; // 切片时的初始位置
  for (let i = 0; i < chunkListLength; i++) {
    const item = {
      chunk: fileObj.slice(curChunk, curChunk + chunkSize),
      fileName: `${_hash}_${i}.${suffix}` // 文件名规则按照 hash_1.jpg 命名
    };
    curChunk += chunkSize;
    _chunkList.push(item);
  }
  chunkList.value = _chunkList; // sendRequest 要用到
  hash.value = _hash; // sendRequest 要用到
  sendRequest();
};

const bytesToMegabytes = (bytes: number): number => {
  const megabytes: number = bytes / (1024 * 1024);
  return Number(megabytes.toFixed(2));
};

// 发送请求
const sendRequest = () => {
  const requestList = []; // 请求集合
  chunkList.value.forEach((item, index) => {
    const fn = () => {
      const formData = new FormData();
      // formData.append("chunk", item.chunk);
      formData.append("fileName", file.value);
      formData.append("file", item.chunk);

      return uploadBigFile.chunk(formData).then((res: any) => {
        console.log("chunk res", res);

        if (res.data.code == 200) {
          showStatusTxt.value = "上传中...";
          // 成功
          if (percentCount.value === 0) {
            // 避免上传成功后会删除切片改变 chunkList 的长度影响到 percentCount 的值
            percentCount.value = 100 / chunkList.value.length;
          }
          if (percent.value >= 100) {
            percent.value = 100;
          } else {
            percent.value += percentCount.value; // 改变进度
          }
          if (percent.value >= 100) {
            percent.value = 100;
          }

          chunkList.value.splice(index, 1); // 一旦上传成功就删除这一个 chunk，方便断点续传
        }
      });
    };
    requestList.push(fn);
  });

  let i = 0; // 记录发送的请求个数
  // 文件切片全部发送完毕后，需要请求 '/merge' 接口，把文件的 hash 传递给服务器
  const complete = () => {
    const params = {
      source: "video",
      fileName: file.value
    };
    uploadBigFile.merge(params).then((res: any) => {
      if (res.code === 200) {
        // Clear the existing fileList
        fileList.value = [];
        const fileObject = {
          duration: res.data.duration,
          memorySize: bytesToMegabytes(res.data.size),
          videoPath: res.data.relPath,
          name: res.data.fileName
        };
        fileList.value.push(fileObject);
        // 请求发送成功
        // videoUrl.value = res.data.relPath;
        videoPreSrc.value = res.data.absPath;
        showStatusTxt.value = "上传成功";
        console.log(res);
      }
    });
  };
  const send = async () => {
    if (!upload.value) return;
    if (i >= requestList.length) {
      // 发送完毕
      complete();
      return;
    }
    await requestList[i]();
    i++;
    send();
  };
  send(); // 发送请求
};

// 按下暂停按钮
const handleClickBtn = () => {
  upload.value = !upload.value;
  // 如果不暂停则继续上传
  if (upload.value) sendRequest();
};

// 将 File 对象转为 ArrayBuffer
const fileToBuffer = file => {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = e => {
      resolve(e.target.result);
    };
    fr.readAsArrayBuffer(file);
    fr.onerror = () => {
      reject(new Error("转换文件格式发生错误"));
    };
  });
};

const handleError: UploadProps["onError"] = error => {
  ElMessage({ message: error.message, type: "error" });
};

const handleBeforeUpload: UploadProps["beforeUpload"] = rawFile => {
  console.log("beforeUpload");
  if (!rawFile.type.endsWith(".mp4")) {
    ElMessage.error("请上传mp4文件!");
    return false;
  }
  // else if (rawFile.size / 1024 / 1024 > 10) {
  //   ElMessage.error("文件大小不能超过 10MB!");
  //   return false;
  // }
  return true;
};

const handleExceed: UploadProps["onExceed"] = files => {
  uploadRef.value!.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  uploadRef.value!.handleStart(file);
};

watch(
  () => fileList.value,
  (newProperty, oldProperty) => {
    // Perform additional actions here, if needed
    console.log("item.name has changed:", newProperty, oldProperty);
    emits("update:modelValue", newProperty);
  },
  { deep: true }
);
</script>

<template>
  <div>
    <div class="uploadWrapper">
      <div v-for="(item, index) in fileList" :key="index" class="title">
        <el-input v-model="item.name" style="margin-bottom: 10px" />
        <VideoCom v-if="item.videoPath" :src="item.videoPath" />
      </div>
      <el-upload
        ref="uploadRef"
        action="#"
        :multiple="false"
        :auto-upload="false"
        :show-file-list="false"
        :before-upload="handleBeforeUpload"
        :on-change="handleChange"
        :on-error="handleError"
        :limit="1"
        :on-exceed="handleExceed"
        drag
        accept="video/mp4"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
    </div>

    <!-- 进度显示 -->
    <div class="progress-box">
      <span>上传进度：{{ percent.toFixed() }}%</span>
      <span style="color: #409eff">{{ showStatusTxt }}</span>
      <el-button type="primary" size="small" @click="handleClickBtn">{{
        upload ? "暂停" : "继续"
      }}</el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.progress-box {
  box-sizing: border-box;
  // width: 360px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  margin-top: 10px;
  font-size: 14px;
  background-color: #ecf1ff;
  border-radius: 4px;
}

.uploadWrapper {
  // width: 260px;
  ::v-deep(.el-upload) {
    .el-upload-dragger {
      padding: 10px;

      .el-icon {
        margin-bottom: 0;
        font-size: 24px;
      }
    }
  }

  ::v-deep(video) {
    max-width: 450px;
  }
}
</style>
