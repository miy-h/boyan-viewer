import * as v from "valibot";

const GuideWordSchema = v.object({
  word: v.string(),
  page: v.number(),
});

const VolumeSchema = v.object({
  fileName: v.string(),
  guideWords: v.array(GuideWordSchema),
});

// `dictionary.json`
const DictionaryDataSchema = v.object({
  volumes: v.array(VolumeSchema),
});

export type DictionaryData = v.InferOutput<typeof DictionaryDataSchema>;
