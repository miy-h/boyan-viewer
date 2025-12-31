<script setup lang="ts">
import { computed, ref } from "vue";
import type { ParsedDictionary } from "../dictionary_parser";

interface Props {
  dic: ParsedDictionary;
}
const { dic } = defineProps<Props>();

const searchWord = ref("");
const page = computed(() => {
  console.log(dic.guideWords);
  const index = dic.guideWords.findIndex(
    (entry) => entry.word !== "" && entry.word.toLowerCase() >= searchWord.value.toLowerCase(),
  );
  return dic.guideWords.at(index >= 0 ? Math.max(0, index - 1) : -1)!;
});
</script>

<template>
  <div>total page count: {{ dic.guideWords.length }}</div>
  <input type="text" v-model="searchWord" />
  <div>{{ JSON.stringify(page) }}</div>
</template>
