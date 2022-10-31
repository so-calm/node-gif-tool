import { FrameIterator } from "./Frame";
import { lib } from "./bindings";

export class GifDecoder {
  public width: number;
  public height: number;
  public frames: FrameIterator;

  constructor(src: string) {
    if (typeof src !== "string") {
      throw new TypeError("Expected 'src' to be a string");
    }

    const d = Buffer.alloc(lib.decoder_size());
    if (!lib.decoder_from_src(src, d)) {
      throw new Error("Failed to decode image");
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
