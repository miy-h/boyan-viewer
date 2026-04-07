import type { GuideWord, ParsedDictionary } from "./dictionary_parser";

export function searchPageFromDictionary(dic: ParsedDictionary, word: string): GuideWord {
  const guideWords = ([] as GuideWord[]).concat(...dic.volumes.map((volume) => volume.guideWords));
  const index = guideWords.findIndex(
    (entry) => entry.word !== "" && entry.word.toLowerCase() >= word.toLowerCase(),
  );
  return guideWords.at(index >= 0 ? Math.max(0, index - 1) : -1)!;
}
