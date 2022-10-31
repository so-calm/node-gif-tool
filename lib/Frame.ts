import type { GifDecoder } from "./Decoder";
import { lib, FrameResult } from "./bindings";

export class FrameIterator {
  constructor(public d: GifDecoder) {
    if (!(d instanceof require("./Decoder").GifDecoder)) {
      throw new TypeError("Expected decoder to be of type 'GifDecoder'");
    }
  }

  public *[Symbol.iterator]() {
    const d = Object.getOwnPropertyDescriptor(this.d, "d")!.value as lib.Decoder;

    loop: while (true) {
      const f = Buffer.alloc(lib.frame_size());
      const result = lib.next_frame(d, f);

      switch (result) {
        case FrameResult.Ok:
          yield new Frame(f);
          break;

        case FrameResult.Empty:
          break loop;

        case FrameResult.Error:
          throw new Error("Failed to process next frame");

        default:
          throw new Error("Unknown FrameResult");
      }
    }
  }
}

export class Frame {
  public delay: number;
  public width: number;
  public height: number;

  constructor(f: lib.Frame) {
    if (!Buffer.isBuffer(f)) {
      throw new TypeError("Expected frame buffer to be of type 'Buffer'");
    }

    Object.defineProperty(this, "f", {
      configurable: false,
      enumerable: false,
      value: f,
      writable: false
    });

    this.delay = lib.frame_delay(f);
    this.width = lib.frame_width(f);
    this.height = lib.frame_height(f);
  }

  public buffer() {
    const f = Object.getOwnPropertyDescriptor(this, "f")!.value as lib.Frame;
    const size = lib.frame_buffer_size(f);
    const buffer = Buffer.alloc(size);
    lib.frame_buffer(f, buffer);
    return buffer;
  }
}
