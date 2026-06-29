<script setup lang="ts">
import { computedAsync, useFileDialog } from "@vueuse/core";

import DictionaryViewer from "./features/dictionary/durendal/DictionaryViewer.vue";
import { parseFromFileList } from "./features/dictionary/durendal/parser.ts";

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
