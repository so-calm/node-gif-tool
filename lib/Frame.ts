import type { GifDecoder } from "./Decoder";

import { alloc, FrameResult, isNullPtr, lib } from "./lib";
import { GifFrameError } from "./Error";

function importDecoder() {
  return require("./Decoder") as typeof import("./Decoder");
}

export class FrameIterator {
  constructor(public d: GifDecoder) {
    if (!(d instanceof importDecoder().GifDecoder)) {
      throw new TypeError("Expected decoder to be of type 'GifDecoder'");
    }
  }

  public *[Symbol.iterator]() {
    const d = Object.getOwnPropertyDescriptor(this.d, "d")!
      .value as lib.Decoder;
    loop: while (true) {
      const fptr = lib.next_frame(d, alloc);
      if (isNullPtr(fptr)) {
        throw new GifFrameError("Failed to process frame");
      }

      const f = Buffer.from(fptr.buffer);
      switch (f[0]) {
        case FrameResult.Ok:
          yield new Frame(f.subarray(1));
          break;

        case FrameResult.Empty:
          break loop;

        default:
          throw new GifFrameError("Unknown FrameResult");
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
    return lib.frame_buffer(f, alloc);
  }
}
