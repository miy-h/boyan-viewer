<script setup lang="ts">
import { computed, ref } from "vue";
import { extractImageFile, type ParsedDictionary } from "../dictionary_parser";
import { computedAsync, refDebounced } from "@vueuse/core";
import PdfRenderer from "./PdfRenderer.vue";

interface Props {
  dic: ParsedDictionary;
}
const props = defineProps<Props>();

const searchWord = ref("");
const debouncedSearchWord = refDebounced(searchWord, 100);

const matchedGuideWord = computed(() => {
  const index = props.dic.guideWords.findIndex(
    (entry) =>
      entry.word !== "" && entry.word.toLowerCase() >= debouncedSearchWord.value.toLowerCase(),
  );
  return props.dic.guideWords.at(index >= 0 ? Math.max(0, index - 1) : -1)!;
});

const image = computedAsync(() =>
  extractImageFile(
    props.dic.zipEntriesOfEachFile,
    matchedGuideWord.value.fileName,
    matchedGuideWord.value.pageNumber,
  ),
);
</script>

<template>
  <div>total page count: {{ props.dic.guideWords.length }}</div>
  <input type="text" v-model="searchWord" />
  <div v-if="image">
    <PdfRenderer v-if="image.type === 'application/pdf'" :data="image.data" />
    <div v-else>Image type: {{ image.type }}</div>
  </div>
</template>
