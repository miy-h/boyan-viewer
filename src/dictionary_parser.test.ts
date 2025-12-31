import { describe, it, expect } from "vitest";
import {
  fileNameWithoutExtension,
  parseAiDicHeadWord,
  parseAiDicImageFile,
} from "./dictionary_parser";

describe("fileNameWithoutExtension", () => {
  it("should work", () => {
    expect(fileNameWithoutExtension("foo.pdf")).toEqual("foo");
  });
});

describe("parseAiDicImageFile", () => {
  it("should correctly parse the basic example", () => {
    const input = "01.pdf#001\n01.pdf#002\n01.pdf#885\ntest.pdf#001\ntest.pdf#283";
    const expected = { "01": 885, test: 283 };
    expect(parseAiDicImageFile(input)).toEqual(expected);
  });

  it("should return an empty object for an empty string", () => {
    const input = "";
    const expected = {};
    expect(parseAiDicImageFile(input)).toEqual(expected);
  });

  it("should handle trailing newlines and empty lines", () => {
    const input = "\nfile1.pdf#10\n\nfile2.pdf#20\n";
    const expected = { file1: 10, file2: 20 };
    expect(parseAiDicImageFile(input)).toEqual(expected);
  });

  it("should ignore malformed lines", () => {
    const input = "file1.pdf#10\ninvalidline\nfile2.pdf-20\nfile3.pdf#abc\n#anotherbadline";
    const expected = { file1: 10 };
    expect(parseAiDicImageFile(input)).toEqual(expected);
  });

  it("should handle filenames with dots", () => {
    const input = "my.document.v1.pdf#50";
    const expected = { "my.document.v1": 50 };
    expect(parseAiDicImageFile(input)).toEqual(expected);
  });

  it("should handle a single line of input without a trailing newline", () => {
    const input = "single.pdf#5";
    const expected = { single: 5 };
    expect(parseAiDicImageFile(input)).toEqual(expected);
  });
});

describe("parseAiDicHeadWord", () => {
  it("should parse valid `AiDicHeadWord` file", () => {
    const input = "\n\na.pdf=001\nb.pdf=001\nb.pdf=002\n\na\nb\n\nc";
    const pageCounts = { a: 3, b: 2 };
    const expected = [
      { word: "", fileName: "a", pageNumber: 1 },
      { word: "a", fileName: "a", pageNumber: 2 },
      { word: "b", fileName: "a", pageNumber: 3 },
      { word: "", fileName: "b", pageNumber: 1 },
      { word: "c", fileName: "b", pageNumber: 2 },
    ];
    expect(parseAiDicHeadWord(input, pageCounts)).toEqual(expected);
    expect(parseAiDicHeadWord(`${input}\n`, pageCounts)).toEqual(expected);
  });
});
