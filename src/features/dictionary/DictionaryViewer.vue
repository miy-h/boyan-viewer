<script setup lang="ts">
import { computedAsync, refDebounced } from "@vueuse/core";
import { ref, watchEffect } from "vue";
import { extractImageFile, type ParsedDictionary } from "./parser";
import PdfRenderer from "../imageRenderer/PdfRenderer.vue";
import TiffRenderer from "../imageRenderer/TiffRenderer.vue";
import { useCurrentPage } from "./useCurrentPage";

interface Props {
  dic: ParsedDictionary;
}
const props = defineProps<Props>();

const searchWord = ref("");
const debouncedSearchWord = refDebounced(searchWord, 100);

const {
  currentFileName,
  currentPageNumber,
  maxPageNumberForCurrentFile,
  moveToWord,
  hasPreviousPage,
  hasNextPage,
  moveToPreviousPage,
  moveToNextPage,
} = useCurrentPage(props.dic);

watchEffect(() => {
  moveToWord(debouncedSearchWord.value);
});

const image = computedAsync(() =>
  extractImageFile(props.dic.zipEntriesOfEachFile, currentFileName.value, currentPageNumber.value),
);
</script>

<template>
  <input type="text" placeholder="search word" v-model="searchWord" />
  <div>
    <label>
      volume (file name):
      <select v-model="currentFileName">
        <option
          v-for="fileName in props.dic.volumes.map((volume) => volume.fileName)"
          :value="fileName"
        >
          {{ fileName }}
        </option>
      </select>
    </label>
  </div>
  <div>
    page:
    <input
      type="number"
      v-model.number="currentPageNumber"
      :max="maxPageNumberForCurrentFile"
      min="1"
    />
    / {{ maxPageNumberForCurrentFile }}
    <button type="button" :disabled="!hasPreviousPage" @click="moveToPreviousPage">prev</button>
    <button type="button" :disabled="!hasNextPage" @click="moveToNextPage">next</button>
  </div>
  <div v-if="image">
    <PdfRenderer v-if="image.type === 'application/pdf'" :data="image.data" />
    <TiffRenderer v-if="image.type === 'image/tiff'" :data="image.data" />
  </div>
</template>
