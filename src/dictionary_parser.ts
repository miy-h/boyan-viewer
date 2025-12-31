export function fileNameWithoutExtension(fileName: string) {
  return fileName.replace(/(.+)\.[^.]+/, (_, $1) => $1);
}

function trimRootDirectory(path: string) {
  return path.replace(/[^/]+\//, "/");
}

/**
 * Parse `AiDicImage` file and returns page number of each volume
 */
export function parseAiDicImageFile(input: string): Record<string, number> {
  const pageCounts: Record<string, number> = Object.create(null);

  for (const line of input.split("\n")) {
    if (line.trim() === "") {
      continue;
    }

    const result = line.match(/(.+)+#(\d+)/);
    if (!result) {
      continue;
    }
    const fileName = fileNameWithoutExtension(result[1]!);
    const pageNumber = parseInt(result[2]!);
    if (fileName !== "" && !isNaN(pageNumber)) {
      pageCounts[fileName] = Math.max(pageCounts[fileName] ?? 0, pageNumber);
    }
  }

  return pageCounts;
}

interface GuideWord {
  word: string;
  fileName: string;
  /** 1-indexed */
  pageNumber: number;
}

/**
 * parse `AiDicHeadWord` file
 * @param input content of `AiDicHeadWord` file
 * @param pageCountPerFile return value of `parseAiDicImageFile`
 */
export function parseAiDicHeadWord(
  input: string,
  pageCountPerFile: Record<string, number>,
): GuideWord[] {
  const lines = input.split("\n");
  const headerPart = lines.slice(0, Math.floor(lines.length / 2));
  const words = lines.slice(Math.floor(lines.length / 2));
  const fileNames = new Set(
    headerPart
      .map((line) => line.split("=")[0])
      .filter((f) => f !== undefined)
      .filter((f) => f !== ""),
  );
  let currentIndex = 0;
  const guideWords: GuideWord[] = [];
  for (const fileName of fileNames) {
    const base = fileNameWithoutExtension(fileName);
    const pageCount = pageCountPerFile[base];
    if (pageCount === undefined) {
      throw new Error(`Unknown file name ${fileName}`);
    }
    for (const [index, word] of words.slice(currentIndex, currentIndex + pageCount).entries()) {
      guideWords.push({
        word,
        fileName: base,
        pageNumber: index + 1,
      });
    }
    currentIndex += pageCount;
  }
  return guideWords;
}

export interface ParsedDictionary {
  guideWords: GuideWord[];
  imagePageCounts: Record<string, number>;
  imageZipFiles: Record<string, File>;
}

export async function parseFromFileList(files: FileList): Promise<ParsedDictionary> {
  let aiDicImageFile: File | undefined;
  let aiDicHeadWordFile: File | undefined;
  const zipFiles: Record<string, File> = Object.create(null);

  for (const file of Array.from(files)) {
    // This is not a standard property, so we need to cast to any
    const path = trimRootDirectory(file.webkitRelativePath);

    // The path can be either "basedir/AiDicImage" or "AiDicImage"
    // if the selected directory is the dictionary root.
    if (path === "/AiDicImage") {
      aiDicImageFile = file;
    } else if (path === "/AiDicHeadWord") {
      aiDicHeadWordFile = file;
    } else if (path.startsWith("/mImg/") && path.endsWith(".zip")) {
      zipFiles[fileNameWithoutExtension(file.name)] = file;
    }
  }

  if (!aiDicImageFile) {
    throw new Error("AiDicImage file not found in the selected directory.");
  }
  if (!aiDicHeadWordFile) {
    throw new Error("AiDicHeadWord file not found in the selected directory.");
  }

  const aiDicImageContent = await aiDicImageFile.text();
  const pageCounts = parseAiDicImageFile(aiDicImageContent);

  const aiDicHeadWordContent = await aiDicHeadWordFile.text();
  const guideWords = parseAiDicHeadWord(aiDicHeadWordContent, pageCounts);

  return {
    guideWords,
    imagePageCounts: pageCounts,
    imageZipFiles: zipFiles,
  };
}
