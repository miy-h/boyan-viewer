import type { CollatorFunction } from "./collator";
import type { GuideWord, ParsedDictionary } from "./parser";

export function searchPageFromDictionary(
  dic: ParsedDictionary,
  word: string,
  collator: CollatorFunction,
): GuideWord {
  const guideWords = ([] as GuideWord[]).concat(...dic.volumes.map((volume) => volume.guideWords));
  const index = guideWords.findIndex(
    (entry) => entry.word !== "" && collator(entry.word, word) >= 0,
  );
  return guideWords.at(index >= 0 ? Math.max(0, index - 1) : -1)!;
}
