import { GifEncoderError } from "./Error";
import { alloc, isNullPtr, lib } from "./lib";

export enum Repeat {
  Infinite = 0
}

export class GifEncoder {
  public width: number;
  public height: number;
  public end: boolean = false;

  constructor(w: number, h: number) {
    if (!Number.isSafeInteger(w) || w < 1 || w > 65535) {
      throw new TypeError("Expected width to be an unsigned 16-bit integer");
    }

    if (!Number.isSafeInteger(h) || h < 1 || h > 65535) {
      throw new TypeError("Expected width to be an unsigned 16-bit integer");
    }

    const e = lib.create_encoder(w, h, alloc);
    if (isNullPtr(e)) {
      throw new GifEncoderError("Failed to init encoder");
    }

    Object.defineProperty(this, "e", {
      configurable: false,
      enumerable: false,
      value: e,
      writable: false
    });

    this.width = w;
    this.height = h;
  }

  public setRepeat(repeat: number) {
    if (typeof repeat !== "number" || repeat < 0) {
      throw new TypeError("Expected 'repeat' to be an unsigned integer");
    }

    if (this.end) throw new GifEncoderError("GifEncoder.setRepeat call on EOS");

    const e = Object.getOwnPropertyDescriptor(this, "e")!.value as lib.Encoder;
    if (!lib.set_repeat(e, repeat)) {
      throw new GifEncoderError("Failed to set repeat");
    }
    return this;
  }

  public writeFrame(buffer: Buffer) {
    if (this.end) {
      throw new GifEncoderError("GifEncoder.writeFrame call on EOS");
    }

    const e = Object.getOwnPropertyDescriptor(this, "e")!.value as lib.Encoder;
    if (!lib.write_frame(e, buffer, buffer.length)) {
      throw new GifEncoderError("Failed to write frame");
    }
    return this;
  }

  public buffer() {
    const e = Object.getOwnPropertyDescriptor(this, "e")!.value as lib.Encoder;

    if (!this.end) {
      lib.encoder_finish(e);
      this.end = true;
    }

    const b = lib.encoder_buffer(e, alloc);
    if (isNullPtr(b)) {
      throw new GifEncoderError("Failed to allocate buffer memory");
    }

    return b;
  }

  public setDelay(delay: number) {
    if (this.end) {
      throw new GifEncoderError("GifEncoder.writeFrame call on EOS");
    }

    if (!Number.isSafeInteger(delay) || delay < 1 || delay > 4294967295) {
      throw new TypeError("Expected 'delay' to be an unsigned 32=bit integer");
    }

    const e = Object.getOwnPropertyDescriptor(this, "e")!.value as lib.Encoder;
    lib.set_delay(e, delay);
    return this;
  }
}
