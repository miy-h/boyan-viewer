<script setup lang="ts">
import { computedAsync, useFileDialog } from "@vueuse/core";
import { parseFromFileList } from "./dictionary_parser";
import DictionaryViewer from "./components/DictionaryViewer.vue";

const { files, open } = useFileDialog({ directory: true });
const dic = computedAsync(() => (files.value ? parseFromFileList(files.value) : undefined));
</script>

<template>
  <button type="button" @click="() => open()" v-if="dic === undefined">
    Open dictionary directory
  </button>
  <DictionaryViewer :dic="dic" v-else />
</template>

<style scoped></style>
