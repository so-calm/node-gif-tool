import { FrameIterator } from "./Frame";
import { GifDecoderError } from "./Error";
import { alloc, isNullPtr, lib } from "./lib";

export class GifDecoder {
  public width: number;
  public height: number;
  public frames: FrameIterator;

  constructor(src: string | Buffer) {
    if (typeof src !== "string" && !Buffer.isBuffer(src)) {
      throw new TypeError("Expected 'src' to be a string or Buffer instance");
    }

    const d =
      typeof src === "string"
        ? lib.decoder_from_file(src, alloc)
        : lib.decoder_from_ptr(src, src.length, alloc);
    if (isNullPtr(d)) {
      throw new GifDecoderError("Failed to decode image");
    }

    Object.defineProperty(this, "d", {
      configurable: false,
      enumerable: false,
      value: d,
      writable: false
    });
    this.width = lib.file_width(d);
    this.height = lib.file_height(d);
    this.frames = new FrameIterator(this);
  }
}
