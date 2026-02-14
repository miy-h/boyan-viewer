<script setup lang="ts">
import { PdfErrorCode, TaskAbortedError, type PdfEngine, type PdfTask } from "@embedpdf/models";
import { ref, watch, onMounted, nextTick } from "vue";

const props = defineProps<{
  engine: PdfEngine;
  data: Uint8Array<ArrayBuffer>;
}>();

const imageUrl = ref("");
let currentRenderingTask: PdfTask<Blob, unknown> | null = null;

const render = async (data: Uint8Array<ArrayBuffer>) => {
  const engine = props.engine;
  let document;
  try {
    if (currentRenderingTask) {
      currentRenderingTask.abort({ message: "cancelled", code: PdfErrorCode.Cancelled });
      currentRenderingTask = null;
    }
    document = await engine
      .openDocumentBuffer({ id: Math.random().toString(), content: data.buffer })
      .toPromise();
    const page = document.pages[0];
    if (!page) {
      imageUrl.value = "";
      return;
    }
    currentRenderingTask = engine.renderPage(document, page, { scaleFactor: 1.5 });
    const imageBlob = await currentRenderingTask.toPromise();
    currentRenderingTask = null;
    const imageBlobUrl = URL.createObjectURL(imageBlob);
    imageUrl.value = imageBlobUrl;
    await nextTick();
    URL.revokeObjectURL(imageBlobUrl);
  } catch (e) {
    if (!(e instanceof TaskAbortedError) || e.reason.code !== PdfErrorCode.Cancelled) {
      throw e;
    }
  } finally {
    if (document) {
      await engine.closeDocument(document).toPromise();
    }
  }
};

watch(() => props.data, render);
onMounted(() => {
  render(props.data);
});
</script>

<template>
  <img :src="imageUrl" />
</template>
