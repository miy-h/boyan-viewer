<script setup lang="ts">
import UTIF from "utif2";
import { watch, onMounted, ref, nextTick } from "vue";

const props = defineProps<{
  data: Uint8Array<ArrayBuffer>;
}>();

const imageUrl = ref("");

const canvas = new OffscreenCanvas(0, 0);
const canvasContext = canvas.getContext("2d");

const render = async (data: Uint8Array<ArrayBuffer>) => {
  const idf = UTIF.decode(data.buffer)[0];
  if (!idf || !canvasContext) {
    return;
  }
  UTIF.decodeImage(data.buffer, idf);
  canvas.width = idf.width;
  canvas.height = idf.height;
  const rgba = UTIF.toRGBA8(idf) as Uint8Array<ArrayBuffer>;
  canvasContext.putImageData(
    new ImageData(new Uint8ClampedArray(rgba.buffer), idf.width, idf.height),
    0,
    0,
  );
  const imageBlobUrl = URL.createObjectURL(await canvas.convertToBlob());
  imageUrl.value = imageBlobUrl;
  await nextTick();
  URL.revokeObjectURL(imageBlobUrl);
};

watch(() => props.data, render);
onMounted(() => {
  render(props.data);
});
</script>

<template>
  <img :src="imageUrl" width="800" />
</template>
