import { computed, ref } from "vue";
import type { ParsedDictionary } from "./parser";
import { searchPageFromDictionary } from "./dictionary";
import { clamp } from "../../utils";

export function useCurrentPage(dic: ParsedDictionary) {
  const currentState = ref({
    fileName: dic.volumes[0]!.fileName,
    pageNumber: 1,
  });
  const currentFile = computed(
    () => dic.volumes.find((volume) => volume.fileName === currentState.value.fileName)!,
  );
  const setPageNumber = (pageNumber: number) => {
    if (isNaN(pageNumber)) {
      return;
    }
    currentState.value = {
      ...currentState.value,
      pageNumber: clamp(pageNumber, 1, currentFile.value.guideWords.length),
    };
  };
  return {
    currentFileName: computed({
      get: () => currentState.value.fileName,
      set: (fileName: string) => {
        currentState.value = {
          fileName,
          pageNumber: 1,
        };
      },
    }),
    currentPageNumber: computed({
      get: () => currentState.value.pageNumber,
      set: setPageNumber,
    }),
    hasPreviousPage: computed(() => currentState.value.pageNumber > 1),
    maxPageNumberForCurrentFile: computed(() => currentFile.value.guideWords.length),
    hasNextPage: computed(
      () => currentState.value.pageNumber < currentFile.value.guideWords.length,
    ),
    moveToPreviousPage: () => {
      setPageNumber(currentState.value.pageNumber - 1);
    },
    moveToNextPage: () => {
      setPageNumber(currentState.value.pageNumber + 1);
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
