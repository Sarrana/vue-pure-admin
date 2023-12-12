<script setup lang="ts">
import defaultImg from "@/assets/CustomizedComm/logo-gray.png";
import CryptoData from "@/utils/crypto";
import { Picture as IconPicture } from "@element-plus/icons-vue";
import axios from "axios";
import { onMounted, ref, watch } from "vue";

const props = defineProps({
  src: {
    type: String
  },
  canPreview: {
    type: Boolean,
    default: true
  }
});

const url = ref(defaultImg);

// const url = ref("");
const showImg = ref(false);

const getShowSrc = src => {
  showImg.value = true;
  url.value = src;
  // const key = import.meta.env.VITE_RC4_KEY;
  // try {
  //   let SrcDomain = src;
  //   if (src.lastIndexOf("?") + 1 == src.length) {
  //     SrcDomain = SrcDomain.substring(0, src.length - 1);
  //   }
  //   let ext = SrcDomain.substring(SrcDomain.lastIndexOf(".") + 1);

  //   ext = ext === "jpg" ? "jpeg" : ext;
  //   if ("jpg,jpeg,png,gif,webp".indexOf(ext) == -1) return;

  //   axios.get(src, { responseType: "arraybuffer" }).then(res => {
  //     const byteArray = new Uint8Array(res.data);
  //     // decode with ARC4
  //     const decryptedBytes = CryptoData.Rc4Decrypt(byteArray, key);
  //     const base64String = bytesArrToBase64(decryptedBytes);
  //     url.value = `data:image/${ext};base64,${base64String}`;
  //     showImg.value = true;
  //   });
  // } catch (error) {
  //   console.log(error);
  // }
};

watch(
  () => props.src,
  newVal => {
    showImg.value = false;
    getShowSrc(newVal);
  }
);

onMounted(() => {
  getShowSrc(props.src);
});
</script>

<template>
  <div>
    <el-image
      v-if="showImg"
      :src="url"
      fit="contain"
      preview-teleported
      :preview-src-list="canPreview ? [url] : []"
    >
      <template #error>
        <div class="image-slot">
          <el-icon><IconPicture /></el-icon>
        </div>
      </template>
    </el-image>
    <span v-else><el-image :src="url" />转码中...</span>
  </div>
</template>

<style scoped lang="scss">
img {
  max-width: 100px;
  max-height: 100px;
  object-fit: contain;
}
</style>
