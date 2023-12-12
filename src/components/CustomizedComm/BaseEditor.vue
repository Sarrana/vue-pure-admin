<template>
  <textarea
    v-bind="$attrs"
    :id="`editor-${uid}`"
    :key="`bs-editor-${uid}`"
    v-model="model"
  />
</template>

<script lang="ts" setup>
import axios from "axios";
import { onMounted } from "vue";
import { nanoid } from "nanoid";
import { uploadApi } from "@/api/upload";

import tinymce from "tinymce";

import "tinymce/skins/ui/oxide/skin.css";
import "tinymce/models/dom";
import "tinymce/icons/default";
import "tinymce/themes/silver";

import "tinymce/plugins/code";
import "tinymce/plugins/table";
import "tinymce/plugins/preview";
import "tinymce/plugins/autolink";
// import 'tinymce/plugins/fullscreen';
import "tinymce/plugins/link";
import "tinymce/plugins/image";
import "tinymce/plugins/media";
import "tinymce/plugins/wordcount";
import "tinymce/plugins/emoticons";
import "tinymce/plugins/emoticons/js/emojis";
import { formatToken, getToken } from "@/utils/auth";
import { computed } from "vue";

const uid = nanoid(8);

interface IProps {
  minHeight?: number;
  maxHeight?: number;
  modelValue?: string;
}

const props = withDefaults(defineProps<IProps>(), {
  minHeight: () => 200,
  maxHeight: () => 400
});

const emits = defineEmits(["update:modelValue"]);

const model = computed({
  get: () => props.modelValue,
  set: v => {
    emits("update:modelValue", v);
  }
});

const config = {
  headers: {
    "Content-Type": "multipart/form-data",
    Authorization: formatToken(getToken().accessToken)
  }
};

/**
 * todo: upload image handler
 */
async function handleUploadImage(blobInfo: any) {
  try {
    const payload = new FormData();
    payload.append("file", blobInfo.blob(), blobInfo.filename());

    const response = await axios.post(uploadApi.imageRaw, payload, config);
    const { data, code, message } = response?.data || {};
    if (code !== 200) {
      throw new Error(message);
    }
    return Promise.resolve(data?.absPath || "");
  } catch (error: any) {
    return Promise.reject(new Error("Image upload failed: " + error));
  }
}

onMounted(() => {
  tinymce.init({
    selector: `textarea#editor-${uid}`,
    min_height: props.minHeight,
    max_height: props.maxHeight,
    automatic_uploads: true,
    images_upload_credentials: true,
    promotion: false,
    menubar: "file edit view insert format table",
    plugins: "autolink link image preview code emoticons media table",
    // prettier-ignore
    toolbar: 'blocks | forecolor backcolor | bold italic underline strikethrough | link image blockquote codesample | align bullist numlist | code',
    setup: (editor: any) => {
      editor.on("input blur change keyup SetContent ", () => {
        emits("update:modelValue", editor.getContent());
      });
    },
    images_upload_handler: handleUploadImage as any
  });
});
</script>
