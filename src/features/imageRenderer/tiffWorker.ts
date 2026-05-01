import * as Comlink from "comlink";
import UTIF from "utif2";

const renderTiff = async (data: Uint8Array<ArrayBuffer>): Promise<string> => {
  const ifds = UTIF.decode(data.buffer);
  const ifd = ifds[0];
  if (!ifd) {
    throw new Error("Could not decode TIFF");
  }

  UTIF.decodeImage(data.buffer, ifd);
  const rgba = UTIF.toRGBA8(ifd) as Uint8Array<ArrayBuffer>;

  const canvas = new OffscreenCanvas(ifd.width, ifd.height);
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not get 2d context for OffscreenCanvas");
  }

  const imageData = new ImageData(
    new Uint8ClampedArray(rgba.buffer),
    ifd.width,
    ifd.height,
  );
  ctx.putImageData(imageData, 0, 0);

  const blob = await canvas.convertToBlob();
  return URL.createObjectURL(blob);
};

const revokeTiffUrl = (url: string) => {
  URL.revokeObjectURL(url);
};

Comlink.expose({ renderTiff, revokeTiffUrl });
