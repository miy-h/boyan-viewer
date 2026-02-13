<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { getDocument, GlobalWorkerOptions, type RenderTask } from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.mjs?url";

GlobalWorkerOptions.workerSrc = pdfWorker;

const props = defineProps<{
  data: Uint8Array;
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);

let currentLoadingTask: { promise: Promise<any>; destroy: () => Promise<void> } | null = null;
let currentRenderTask: RenderTask | null = null;

const render = async () => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  if (currentRenderTask) {
    currentRenderTask.cancel();
    currentRenderTask = null;
  }

  if (currentLoadingTask) {
    await currentLoadingTask.destroy();
    currentLoadingTask = null;
  }

  const loadingTask = getDocument({ data: props.data });
  currentLoadingTask = loadingTask;

  try {
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1);

    const scale = 1.5;
    const viewport = page.getViewport({ scale });

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const context = canvas.getContext("2d");
    if (context) {
      const renderContext = {
        canvasContext: context,
        viewport: viewport,
        canvas,
      };
      currentRenderTask = page.render(renderContext);
      await currentRenderTask.promise;
    }
  } catch (e: any) {
    if (e.name !== "RenderingCancelledException") {
      console.error(e);
    }
  }
};

watch(() => props.data, render);
onMounted(render);
</script>

<template>
  <canvas ref="canvasRef"></canvas>
</template>
