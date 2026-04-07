<script setup lang="ts">
import { computedAsync, refDebounced } from "@vueuse/core";
import { computed, ref } from "vue";
import { extractImageFile, type ParsedDictionary } from "./parser";
import PdfRenderer from "../imageRenderer/PdfRenderer.vue";
import TiffRenderer from "../imageRenderer/TiffRenderer.vue";
import { searchPageFromDictionary } from "./dictionary";

interface Props {
  dic: ParsedDictionary;
}
const props = defineProps<Props>();

const searchWord = ref("");
const debouncedSearchWord = refDebounced(searchWord, 100);

const matchedGuideWord = computed(() =>
  searchPageFromDictionary(props.dic, debouncedSearchWord.value),
);

const image = computedAsync(() =>
  extractImageFile(
    props.dic.zipEntriesOfEachFile,
    matchedGuideWord.value.fileName,
    matchedGuideWord.value.pageNumber,
  ),
);
</script>

<template>
  <input type="text" v-model="searchWord" />
  <div v-if="image">
    <PdfRenderer v-if="image.type === 'application/pdf'" :data="image.data" />
    <TiffRenderer v-if="image.type === 'image/tiff'" :data="image.data" />
  </div>
</template>
