import { FrameIterator } from "./Frame";
import { GifDecoderError } from "./Error";
import { alloc, isNullPtr, lib } from "./lib";

export class GifDecoder {
  public width: number;
  public height: number;
  public frames: FrameIterator;

  constructor(src: string) {
    if (typeof src !== "string") {
      throw new TypeError("Expected 'src' to be a string");
    }

    const d = lib.create_decoder(src, alloc);
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
