<script setup lang="ts">
import * as Comlink from "comlink";
import { watch, onMounted, ref, nextTick, onBeforeUnmount } from "vue";
import TiffWorker from "./tiffWorker?worker";

const props = defineProps<{
  data: Uint8Array<ArrayBuffer>;
}>();

const imageUrl = ref("");

const worker = new TiffWorker();
const remote = Comlink.wrap<{
  renderTiff: (data: Uint8Array) => Promise<string>;
  revokeTiffUrl: (url: string) => Promise<void>;
}>(worker);

const render = async (data: Uint8Array) => {
  try {
    const imageBlobUrl = await remote.renderTiff(data);
    imageUrl.value = imageBlobUrl;
    await nextTick();
    await remote.revokeTiffUrl(imageBlobUrl);
  } catch (error) {
    console.error("TIFF render failed:", error);
  }
};

watch(() => props.data, render);
onMounted(() => {
  render(props.data);
});

onBeforeUnmount(() => {
  worker.terminate();
});
</script>

<template>
  <img :src="imageUrl" width="800" />
</template>
