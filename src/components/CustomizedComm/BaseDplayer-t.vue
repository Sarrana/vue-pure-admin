<script setup lang="ts">
import DPlayer from "dplayer";
import Hls from "hls.js";
import { onBeforeUnmount, onMounted, reactive, ref } from "vue";

interface PropsType {
  id: string;
  loop?: boolean;
  hotkey?: boolean;
  src?: string;
  cover?: string;
}

const _props = withDefaults(defineProps<PropsType>(), {
  id: "dplayer",
  loop: false,
  hotkey: true,
  src: "",
  cover: ""
});

const videoRef = ref();
const state = reactive({
  instance: null
});

// const dp = ref();
onMounted(() => {
  // dp.value = new DPlayer({
  //   container: document.getElementById(props.id),
  //   // theme: "#b7daff", //
  //   // loop: props.loop,
  //   // lang: "zh-cn",
  //   // hotkey: props.hotkey,
  //   mutex: true,
  //   video: {
  //     url: props.url,
  //     // defaultQuality: 0,
  //     // pic: props.cover
  //     type: "customHls",
  //     customType: {
  //       customHls: function (video, player) {
  //         const hls = new Hls();
  //         hls.loadSource(video.src);
  //         hls.attachMedia(video);
  //       }
  //     }
  //   }
  // });

  const player = {
    container: videoRef.value,
    video: {
      url: "https://long.fuhuida.ltd/watch9/9cb091811992e532b76ff17829a63cf1/9cb091811992e532b76ff17829a63cf1.m3u8", // props.src,
      type: "customHls",
      customType: {
        customHls: function (video, _player) {
          const hls = new Hls();
          hls.loadSource(video.src);
          hls.attachMedia(video);
        }
      }
    }
  };

  state.instance = new DPlayer(player);
});

onBeforeUnmount(() => {
  state.instance.destroy();
});
</script>

<template>
  <!-- <div v-if="props.url" :id="props.id" /> -->
  <div ref="videoRef" />
</template>
