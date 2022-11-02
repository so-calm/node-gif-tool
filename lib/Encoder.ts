import { lib } from "./bindings";
import { GifEncoderError } from "./Error";

export const Repeat = { Infinite: 0 };

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

    const e = Buffer.alloc(lib.encoder_size());
    if (!lib.create_encoder(w, h, e)) {
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

    const size = lib.encoder_buffer_size(e);
    const buffer = Buffer.alloc(size);
    lib.encoder_buffer(e, buffer);
    return buffer;
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
