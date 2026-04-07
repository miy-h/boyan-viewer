import { computed, ref } from "vue";
import type { ParsedDictionary } from "./parser";
import { searchPageFromDictionary } from "./dictionary";

export function useCurrentPage(dic: ParsedDictionary) {
  const currentState = ref({
    fileName: dic.volumes[0]!.fileName,
    pageNumber: 1,
  });
  return {
    currentFileName: computed(() => currentState.value.fileName),
    currentPageNumber: computed(() => currentState.value.pageNumber),
    hasPreviousPage: computed(() => currentState.value.pageNumber > 1),
    hasNextPage: computed(
      () =>
        currentState.value.pageNumber <
        dic.volumes.find((volume) => volume.fileName === currentState.value.fileName)!.guideWords
          .length,
    ),
    moveToPreviousPage: () => {
      currentState.value = {
        ...currentState.value,
        pageNumber: currentState.value.pageNumber - 1,
      };
    },
    moveToNextPage: () => {
      currentState.value = {
        ...currentState.value,
        pageNumber: currentState.value.pageNumber + 1,
      };
    },
    switchVolume: (fileName: string) => {
      currentState.value = {
        fileName,
        pageNumber: 1,
      };
    },
    moveToWord: (word: string) => {
      const page = searchPageFromDictionary(dic, word);
      currentState.value = {
        fileName: page.fileName,
        pageNumber: page.pageNumber,
      };
    },
  };
}
