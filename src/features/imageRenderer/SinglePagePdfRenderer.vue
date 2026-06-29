<script setup lang="ts">
import { usePdfiumEngine } from "@embedpdf/engines/vue";
import { PdfErrorCode, TaskAbortedError, type PdfTask } from "@embedpdf/models";
import { ref, watch, onMounted, nextTick } from "vue";

const props = defineProps<{
  data: Uint8Array<ArrayBuffer>;
}>();

const { engine } = usePdfiumEngine();

const imageUrl = ref("");
let currentRenderingTask: PdfTask<Blob, unknown> | null = null;

const render = async (data: Uint8Array<ArrayBuffer>) => {
  const engineInstance = engine.value;
  if (!engineInstance) {
    return;
  }
  let document;
  try {
    if (currentRenderingTask) {
      currentRenderingTask.abort({ message: "cancelled", code: PdfErrorCode.Cancelled });
      currentRenderingTask = null;
    }
    document = await engineInstance
      .openDocumentBuffer({ id: Math.random().toString(), content: data.buffer })
      .toPromise();
    const page = document.pages[0];
    if (!page) {
      imageUrl.value = "";
      return;
    }
    currentRenderingTask = engineInstance.renderPage(document, page, { scaleFactor: 1.5 });
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
      await engineInstance.closeDocument(document).toPromise();
    }
  }
};

watch([() => props.data, engine], () => {
  render(props.data);
});

onMounted(() => {
  render(props.data);
});
</script>

<template>
  <img :src="imageUrl" />
</template>
